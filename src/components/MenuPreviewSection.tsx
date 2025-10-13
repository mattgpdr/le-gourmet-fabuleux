import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
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
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6 animate-fade-in">
          <ChefHat className="h-8 w-8 text-primary" />
        </div>
        
        <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-primary">
          Notre Carte
        </h2>
        
        <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
          Découvrez notre cuisine française raffinée, élaborée avec des produits frais et de saison. 
          Une carte généreuse qui célèbre les saveurs authentiques et les traditions gastronomiques parisiennes.
        </p>
        
        <Link to="/menu">
          <Button 
            size="lg" 
            className="hover-scale group shadow-elegant"
          >
            Voir le menu
            <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default MenuPreviewSection;
