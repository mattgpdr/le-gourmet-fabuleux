import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChefHat } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const MenuPreviewSection = () => {
  const { ref, isVisible } = useScrollAnimation();
  const [logoUrl, setLogoUrl] = useState<string>("");

  useEffect(() => {
    fetchLogo();
  }, []);

  const fetchLogo = async () => {
    const { data } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "logo_url")
      .single();
    
    if (data?.value) {
      setLogoUrl(data.value);
    }
  };

  return (
    <section 
      id="menu-preview"
      ref={ref}
      className={`py-8 md:py-12 px-4 bg-gradient-to-b from-background to-muted/20 transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
    >
      <div className="container mx-auto max-w-4xl text-center">
        <Card className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-elegant group">
          <CardContent className="p-6 md:p-8">
            <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-full bg-primary/10 mb-3 md:mb-4 transition-all duration-300 group-hover:bg-primary/20 group-hover:scale-110">
              {logoUrl ? (
                <img 
                  src={logoUrl} 
                  alt="Logo" 
                  className="h-8 w-8 md:h-10 md:w-10 object-contain transition-transform duration-300 group-hover:rotate-12"
                />
              ) : (
                <ChefHat className="h-8 w-8 md:h-10 md:w-10 text-primary transition-transform duration-300 group-hover:rotate-12" />
              )}
            </div>
            
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif font-bold mb-3 md:mb-4 text-primary transition-all duration-300 group-hover:scale-105">
              Notre Carte
            </h2>
            
            <p className="text-sm md:text-base text-muted-foreground mb-4 md:mb-6 max-w-2xl mx-auto leading-relaxed px-2">
              Découvrez notre cuisine française raffinée, élaborée avec des produits frais et de saison. 
              Une carte généreuse qui célèbre les saveurs authentiques et les traditions gastronomiques parisiennes.
            </p>
            
            <Link to="/menu">
              <Button 
                size="lg" 
                className="hover-scale shadow-elegant transition-all duration-300 hover:shadow-glow w-full sm:w-auto"
              >
                Voir le menu
                <span className="ml-2 inline-block transition-transform duration-300 group-hover:translate-x-2">→</span>
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default MenuPreviewSection;
