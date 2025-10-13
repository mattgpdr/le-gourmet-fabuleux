import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import GalleryCarousel from "@/components/GalleryCarousel";
import MenuPreviewSection from "@/components/MenuPreviewSection";
import MenuSection from "@/components/MenuSection";
import OpeningHoursSection from "@/components/OpeningHoursSection";
import ReservationSection from "@/components/ReservationSection";
import ReviewsSection from "@/components/ReviewsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-20">
        <Hero />
        <GalleryCarousel />
        <MenuPreviewSection />
        <MenuSection />
        <OpeningHoursSection />
        <ReservationSection />
        <ReviewsSection />
        <ContactSection />
        <Footer />
        <ChatWidget />
      </main>
    </div>
  );
};

export default Index;
