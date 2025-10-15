import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ChefHat, Facebook, Instagram, Menu, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import ThemeToggle from "./ThemeToggle";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [logoUrl, setLogoUrl] = useState<string>("");
  const [navbarTitle, setNavbarTitle] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    const { data } = await supabase
      .from("site_settings")
      .select("*")
      .in("key", ["logo_url", "navbar_title"]);
    
    if (data) {
      const settingsMap = data.reduce((acc, item) => {
        acc[item.key] = item.value;
        return acc;
      }, {} as Record<string, string>);
      
      if (settingsMap.logo_url) {
        setLogoUrl(settingsMap.logo_url);
      }
      if (settingsMap.navbar_title) {
        setNavbarTitle(settingsMap.navbar_title);
      }
    }
  };

  const handleReservationClick = () => {
    if (location.pathname === "/") {
      const element = document.getElementById("reservation");
      element?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/");
      setTimeout(() => {
        const element = document.getElementById("reservation");
        element?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    }
  };

  const handleContactClick = () => {
    if (location.pathname === "/") {
      const element = document.getElementById("contact");
      element?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/");
      setTimeout(() => {
        const element = document.getElementById("contact");
        element?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    }
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    if (location.pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" onClick={handleLogoClick} className="flex items-center gap-2 group">
            {logoUrl ? (
              <img 
                src={logoUrl} 
                alt="Logo" 
                className="h-10 w-10 md:h-12 md:w-12 object-contain transition-transform group-hover:scale-110"
              />
            ) : (
              <ChefHat className="h-10 w-10 md:h-12 md:w-12 text-primary transition-transform group-hover:scale-110" />
            )}
            <span className="text-lg md:text-2xl font-serif font-bold text-primary truncate max-w-[150px] sm:max-w-none">
              {navbarTitle}
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6">
            <Link to="/menu" className="text-foreground hover:text-primary transition-colors">
              Notre menu
            </Link>
            <button
              onClick={handleReservationClick}
              className="text-foreground hover:text-primary transition-colors"
            >
              Réserver
            </button>
            <button
              onClick={handleContactClick}
              className="text-foreground hover:text-primary transition-colors"
            >
              Localisation
            </button>
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

          {/* Mobile Navigation */}
          <div className="flex lg:hidden items-center gap-2">
            <ThemeToggle />
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Menu">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] sm:w-[350px]">
                <nav className="flex flex-col gap-6 mt-8">
                  <Link 
                    to="/menu" 
                    className="text-lg font-medium text-foreground hover:text-primary transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Notre menu
                  </Link>
                  <button
                    onClick={() => {
                      handleReservationClick();
                      setMobileMenuOpen(false);
                    }}
                    className="text-lg font-medium text-foreground hover:text-primary transition-colors text-left"
                  >
                    Réserver
                  </button>
                  <button
                    onClick={() => {
                      handleContactClick();
                      setMobileMenuOpen(false);
                    }}
                    className="text-lg font-medium text-foreground hover:text-primary transition-colors text-left"
                  >
                    Localisation
                  </button>
                  
                  <div className="border-t pt-6 mt-4">
                    <p className="text-sm text-muted-foreground mb-4">Suivez-nous</p>
                    <div className="flex items-center gap-4">
                      <a 
                        href="https://facebook.com" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-foreground hover:text-primary transition-colors"
                        aria-label="Facebook"
                      >
                        <Facebook className="h-6 w-6" />
                      </a>
                      <a 
                        href="https://instagram.com" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-foreground hover:text-primary transition-colors"
                        aria-label="Instagram"
                      >
                        <Instagram className="h-6 w-6" />
                      </a>
                    </div>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
