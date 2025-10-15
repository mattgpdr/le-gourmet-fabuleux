import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useBackgroundImage = () => {
  const [backgroundImageUrl, setBackgroundImageUrl] = useState<string>("");
  const [backgroundOpacity, setBackgroundOpacity] = useState<number>(90);

  useEffect(() => {
    const fetchBackgroundSettings = async () => {
      const { data } = await supabase
        .from("site_settings")
        .select("key, value")
        .in("key", ["background_image_url", "background_opacity"]);

      if (data) {
        const imageUrl = data.find(s => s.key === "background_image_url")?.value || "";
        const opacity = data.find(s => s.key === "background_opacity")?.value || "90";
        
        setBackgroundImageUrl(imageUrl);
        setBackgroundOpacity(parseInt(opacity));
      }
    };

    fetchBackgroundSettings();

    // Subscribe to changes
    const channel = supabase
      .channel("background_settings_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "site_settings",
          filter: "key=in.(background_image_url,background_opacity)",
        },
        (payload) => {
          if (payload.new && "value" in payload.new && "key" in payload.new) {
            const newRecord = payload.new as { key: string; value: string };
            if (newRecord.key === "background_image_url") {
              setBackgroundImageUrl(newRecord.value);
            } else if (newRecord.key === "background_opacity") {
              setBackgroundOpacity(parseInt(newRecord.value));
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { backgroundImageUrl, backgroundOpacity };
};
