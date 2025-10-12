import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const GallerySection = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const galleries = {
    plats: [
      { url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800", alt: "Salade fraîche" },
      { url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800", alt: "Pizza artisanale" },
      { url: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800", alt: "Soupe du jour" },
      { url: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800", alt: "Plat gastronomique" },
    ],
    terrasse: [
      { url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800", alt: "Terrasse extérieure" },
      { url: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800", alt: "Vue terrasse" },
      { url: "https://images.unsplash.com/photo-1554679665-f5537f187268?w=800", alt: "Jardin d'été" },
    ],
    salle: [
      { url: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800", alt: "Salle principale" },
      { url: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800", alt: "Ambiance du restaurant" },
      { url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800", alt: "Espace intérieur" },
      { url: "https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?w=800", alt: "Décoration" },
    ],
  };

  return (
    <>
      <section id="galerie" className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-serif font-bold text-center mb-12">
            Galerie
          </h2>

          <Tabs defaultValue="plats" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8">
              <TabsTrigger value="plats">Notre Carte</TabsTrigger>
              <TabsTrigger value="terrasse">Notre Terrasse</TabsTrigger>
              <TabsTrigger value="salle">Notre Salle</TabsTrigger>
            </TabsList>

            {Object.entries(galleries).map(([key, images]) => (
              <TabsContent key={key} value={key}>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {images.map((image, index) => (
                    <div
                      key={index}
                      className="relative aspect-square overflow-hidden rounded-lg cursor-pointer group"
                      onClick={() => setSelectedImage(image.url)}
                    >
                      <img
                        src={image.url}
                        alt={image.alt}
                        className="w-full h-full object-cover transition-transform group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white font-medium">Agrandir</span>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl">
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Image agrandie"
              className="w-full h-auto rounded-lg"
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GallerySection;
