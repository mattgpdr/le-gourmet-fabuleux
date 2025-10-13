import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChefHat } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const MenuPreviewSection = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section 
      ref={ref}
      className={`py-20 px-4 bg-gradient-to-b from-background to-muted/20 transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
    >
      <div className="container mx-auto max-w-4xl text-center">
        <Card className="border-2 hover:border-primary/50 transition-all duration-500 hover:shadow-elegant group">
          <CardContent className="p-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6 transition-all duration-300 group-hover:bg-primary/20 group-hover:scale-110">
              <ChefHat className="h-8 w-8 text-primary transition-transform duration-300 group-hover:rotate-12" />
            </div>
            
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-primary transition-all duration-300 group-hover:scale-105">
              Notre Carte
            </h2>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              Découvrez notre cuisine française raffinée, élaborée avec des produits frais et de saison. 
              Une carte généreuse qui célèbre les saveurs authentiques et les traditions gastronomiques parisiennes.
            </p>
            
            <Link to="/menu">
              <Button 
                size="lg" 
                className="hover-scale shadow-elegant transition-all duration-300 hover:shadow-glow"
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
