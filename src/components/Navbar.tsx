import { Link } from "react-router-dom";
import { ChefHat, Facebook, Instagram } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
  const scrollToReservation = () => {
    const element = document.getElementById("reservation");
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <ChefHat className="h-8 w-8 text-primary transition-transform group-hover:scale-110" />
            <span className="text-2xl font-serif font-bold text-primary">
              Le Gourmet Parisien
            </span>
          </Link>
          
          <div className="flex items-center gap-6">
            <Link to="/menu" className="text-foreground hover:text-primary transition-colors hidden md:block">
              Notre menu
            </Link>
            <button
              onClick={scrollToReservation}
              className="text-foreground hover:text-primary transition-colors hidden md:block"
            >
              Réserver
            </button>
            <a href="#contact" className="text-foreground hover:text-primary transition-colors hidden md:block">
              Localisation
            </a>
            <ThemeToggle />
            <div className="flex items-center gap-3">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-foreground hover:text-primary transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-foreground hover:text-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
