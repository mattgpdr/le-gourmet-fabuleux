import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import ImageLightbox from "./ImageLightbox";

interface GalleryImage {
  id: string;
  image_url: string;
  alt_text: string | null;
}

const GalleryCarousel = () => {
  const { ref, isVisible } = useScrollAnimation();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    const { data } = await supabase
      .from("gallery_images")
      .select("*")
      .eq("is_visible", true)
      .order("display_order");

    if (data && data.length > 0) {
      setImages(data);
    } else {
      // Images par défaut si pas d'images en DB
      setImages([
        { id: "1", image_url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800", alt_text: "Salade fraîche" },
        { id: "2", image_url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800", alt_text: "Pizza artisanale" },
        { id: "3", image_url: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800", alt_text: "Soupe du jour" },
        { id: "4", image_url: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800", alt_text: "Plat gastronomique" },
        { id: "5", image_url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800", alt_text: "Terrasse extérieure" },
        { id: "6", image_url: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800", alt_text: "Salle principale" },
      ]);
    }
  };

  return (
    <section 
      id="galerie" 
      ref={ref} 
      className={`py-16 bg-background transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
    >
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-serif font-bold text-center mb-12">
          Galerie
        </h2>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          plugins={[
            Autoplay({
              delay: 3000,
            }),
          ]}
          className="w-full max-w-6xl mx-auto"
        >
          <CarouselContent>
            {images.map((image) => (
              <CarouselItem key={image.id} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-2">
                  <div 
                    className="relative aspect-square overflow-hidden rounded-lg group cursor-pointer"
                    onClick={() => setSelectedImage(image)}
                  >
                    <img
                      src={image.image_url}
                      alt={image.alt_text || "Gallery image"}
                      className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <span className="text-white font-medium">Agrandir</span>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2" />
          <CarouselNext className="right-2" />
        </Carousel>

        <ImageLightbox
          imageUrl={selectedImage?.image_url || ""}
          alt={selectedImage?.alt_text || ""}
          open={!!selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      </div>
    </section>
  );
};

export default GalleryCarousel;
