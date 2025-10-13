import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import heroImageDefault from "@/assets/hero-restaurant.jpg";

const Hero = () => {
  const { ref, isVisible } = useScrollAnimation();
  const [scrollY, setScrollY] = useState(0);
  const [heroImage, setHeroImage] = useState(heroImageDefault);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    fetchHeroImage();
  }, []);

  const fetchHeroImage = async () => {
    const { data } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "hero_image_url")
      .single();
    
    if (data?.value && data.value.startsWith("http")) {
      setHeroImage(data.value);
    }
  };

  const opacity = Math.max(0, 1 - scrollY / 500);
  const blur = Math.min(10, scrollY / 50);

  return (
    <section 
      ref={ref} 
      className={`relative h-[70vh] flex items-center justify-center overflow-hidden transition-all duration-700 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-300"
        style={{ 
          backgroundImage: `url(${heroImage})`,
          opacity,
          filter: `blur(${blur}px)`
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-background" />
      </div>
      
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 animate-fade-in">
          Le Gourmet Parisien
        </h1>
        <p className="text-xl md:text-2xl text-white/90 mb-8 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          Une expérience culinaire authentique au cœur de Paris
        </p>
        <div className="flex gap-4 justify-center animate-fade-in" style={{ animationDelay: "0.4s" }}>
          <a 
            href="#menu" 
            className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:scale-105 transition-transform shadow-elegant"
          >
            Découvrir le menu
          </a>
          <a 
            href="#avis" 
            className="px-8 py-3 bg-white/10 backdrop-blur-sm text-white border border-white/20 rounded-lg font-medium hover:bg-white/20 transition-colors"
          >
            Nos avis
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
