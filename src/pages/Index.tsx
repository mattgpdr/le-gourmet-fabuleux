import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import MenuSection from "@/components/MenuSection";
import ReviewsSection from "@/components/ReviewsSection";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-20">
        <Hero />
        <MenuSection />
        <ReviewsSection />
        
        <footer className="bg-card border-t py-8">
          <div className="container mx-auto px-4 text-center text-muted-foreground">
            <p className="font-serif text-lg mb-2">Le Gourmet Parisien</p>
            <p className="text-sm">© 2025 - Tous droits réservés</p>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Index;
