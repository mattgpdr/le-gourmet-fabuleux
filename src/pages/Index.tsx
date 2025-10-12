import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import AboutSection from "@/components/AboutSection";
import MenuSection from "@/components/MenuSection";
import ServicesSection from "@/components/ServicesSection";
import OpeningHoursSection from "@/components/OpeningHoursSection";
import GalleryCarousel from "@/components/GalleryCarousel";
import ReservationSection from "@/components/ReservationSection";
import ReviewsSection from "@/components/ReviewsSection";
import ContactSection from "@/components/ContactSection";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-20">
        <Hero />
        <AboutSection />
        <OpeningHoursSection />
        <MenuSection />
        <GalleryCarousel />
        <ServicesSection />
        <ReservationSection />
        <ReviewsSection />
        <ContactSection />
        
        <footer className="bg-card border-t py-12">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div>
                <h3 className="font-serif text-xl font-bold mb-4">Le Gourmet Parisien</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Une expérience culinaire authentique au cœur de Paris
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Horaires</h4>
                <p className="text-sm text-muted-foreground">Lun-Ven: 07:00 - 23:00</p>
                <p className="text-sm text-muted-foreground">Sam: 08:00 - 23:00</p>
                <p className="text-sm text-muted-foreground">Dim: 09:00 - 22:00</p>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Contact</h4>
                <p className="text-sm text-muted-foreground">123 Avenue des Champs-Élysées</p>
                <p className="text-sm text-muted-foreground">75008 Paris, France</p>
                <p className="text-sm text-muted-foreground mt-2">Tél: 01 23 45 67 89</p>
              </div>
            </div>
            <div className="text-center pt-8 border-t text-muted-foreground">
              <div className="flex items-center justify-center gap-4">
                <p className="text-sm">© 2025 Le Gourmet Parisien - Tous droits réservés</p>
                <Link 
                  to="/admin" 
                  className="text-xs text-muted-foreground/50 hover:text-muted-foreground transition-colors"
                >
                  Admin
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Index;
