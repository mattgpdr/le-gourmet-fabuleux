import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface RGB {
  r: number;
  g: number;
  b: number;
}

const rgbToHsl = (r: number, g: number, b: number): { h: number; s: number; l: number } => {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
};

const isBlackOrWhite = (r: number, g: number, b: number): boolean => {
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
  // Consider colors very dark (< 30) or very light (> 225) as black/white
  return luminance < 30 || luminance > 225;
};

const extractDominantColor = async (imageUrl: string): Promise<RGB | null> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      
      if (!ctx) {
        resolve(null);
        return;
      }

      // Use smaller canvas for faster processing
      const size = 100;
      canvas.width = size;
      canvas.height = size;
      
      ctx.drawImage(img, 0, 0, size, size);
      
      const imageData = ctx.getImageData(0, 0, size, size);
      const data = imageData.data;
      
      // Count color occurrences (simplified bucketing)
      const colorMap: { [key: string]: { count: number; rgb: RGB } } = {};
      
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];
        
        // Skip transparent pixels
        if (a < 128) continue;
        
        // Skip black and white colors
        if (isBlackOrWhite(r, g, b)) continue;
        
        // Bucket colors to reduce variations
        const bucketSize = 30;
        const rBucket = Math.floor(r / bucketSize) * bucketSize;
        const gBucket = Math.floor(g / bucketSize) * bucketSize;
        const bBucket = Math.floor(b / bucketSize) * bucketSize;
        
        const key = `${rBucket}-${gBucket}-${bBucket}`;
        
        if (!colorMap[key]) {
          colorMap[key] = {
            count: 0,
            rgb: { r: rBucket, g: gBucket, b: bBucket },
          };
        }
        
        colorMap[key].count++;
      }
      
      // Find most common color
      let dominantColor: RGB | null = null;
      let maxCount = 0;
      
      for (const key in colorMap) {
        if (colorMap[key].count > maxCount) {
          maxCount = colorMap[key].count;
          dominantColor = colorMap[key].rgb;
        }
      }
      
      resolve(dominantColor);
    };
    
    img.onerror = () => resolve(null);
    img.src = imageUrl;
  });
};

export const useLogoColor = () => {
  useEffect(() => {
    const updatePrimaryColor = async () => {
      try {
        const { data } = await supabase
          .from("site_settings")
          .select("value")
          .eq("key", "logo_url")
          .single();
        
        if (!data?.value) return;
        
        const dominantColor = await extractDominantColor(data.value);
        
        if (dominantColor) {
          const hsl = rgbToHsl(dominantColor.r, dominantColor.g, dominantColor.b);
          
          // Update CSS variables
          document.documentElement.style.setProperty(
            "--primary",
            `${hsl.h} ${hsl.s}% ${hsl.l}%`
          );
          
          // Always use black text for primary buttons
          document.documentElement.style.setProperty(
            "--primary-foreground",
            `0 0% 0%`
          );
          
          console.log(`Primary color updated to: hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`);
        } else {
          // No logo or no dominant color - set to white
          document.documentElement.style.setProperty(
            "--primary",
            `0 0% 100%`
          );
          document.documentElement.style.setProperty(
            "--primary-foreground",
            `0 0% 0%`
          );
        }
      } catch (error) {
        console.error("Error updating primary color:", error);
      }
    };
    
    updatePrimaryColor();
    
    // Listen for logo changes
    const channel = supabase
      .channel("logo_changes")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "site_settings",
          filter: "key=eq.logo_url",
        },
        () => {
          updatePrimaryColor();
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
};
