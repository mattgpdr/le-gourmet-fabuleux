import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import heroImageDefault from "@/assets/hero-restaurant.jpg";

const Hero = () => {
  const { ref, isVisible } = useScrollAnimation();
  const [scrollY, setScrollY] = useState(0);
  const [heroImage, setHeroImage] = useState(heroImageDefault);
  const [heroTitle, setHeroTitle] = useState("Le Gourmet Parisien");
  const [heroDescription, setHeroDescription] = useState("Une expérience culinaire authentique au cœur de Paris");

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
      .select("*")
      .in("key", ["hero_image_url", "hero_title", "hero_description"]);
    
    if (data) {
      const settingsMap = data.reduce((acc, item) => {
        acc[item.key] = item.value;
        return acc;
      }, {} as Record<string, string>);
      
      if (settingsMap.hero_image_url?.startsWith("http")) {
        setHeroImage(settingsMap.hero_image_url);
      }
      if (settingsMap.hero_title) {
        setHeroTitle(settingsMap.hero_title);
      }
      if (settingsMap.hero_description) {
        setHeroDescription(settingsMap.hero_description);
      }
    }
  };

  const opacity = Math.max(0, 1 - scrollY / 500);
  const blur = Math.min(10, scrollY / 50);

  return (
    <section 
      ref={ref} 
      className={`relative min-h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden transition-all duration-500 ${
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
        <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-white mb-4 md:mb-6 animate-fade-in leading-tight">
          {heroTitle}
        </h1>
        <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 mb-6 md:mb-8 animate-fade-in px-2" style={{ animationDelay: "0.2s" }}>
          {heroDescription}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center animate-fade-in max-w-md mx-auto sm:max-w-none" style={{ animationDelay: "0.4s" }}>
          <button 
            onClick={() => {
              const element = document.getElementById("menu-preview");
              element?.scrollIntoView({ behavior: "smooth" });
            }}
            className="px-6 sm:px-8 py-2.5 sm:py-3 bg-primary text-white rounded-lg font-medium hover:scale-105 transition-transform shadow-elegant text-sm sm:text-base"
          >
            Découvrir le menu
          </button>
          <button 
            onClick={() => {
              const element = document.getElementById("avis");
              element?.scrollIntoView({ behavior: "smooth" });
            }}
            className="px-6 sm:px-8 py-2.5 sm:py-3 bg-white/10 backdrop-blur-sm text-white border border-white/20 rounded-lg font-medium hover:bg-white/20 transition-colors text-sm sm:text-base"
          >
            Nos avis
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
