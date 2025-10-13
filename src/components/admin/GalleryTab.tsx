import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Trash2, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";

interface GalleryImage {
  id: string;
  image_url: string;
  alt_text: string | null;
  category: string;
  display_order: number;
  is_visible: boolean;
}

const GalleryTab = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    const { data, error } = await supabase
      .from("gallery_images")
      .select("*")
      .order("display_order");

    if (error) {
      console.error("Error fetching images:", error);
    } else if (data) {
      setImages(data);
    }
    setLoading(false);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('gallery')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('gallery')
        .getPublicUrl(fileName);

      const { error: dbError } = await supabase
        .from('gallery_images')
        .insert({
          image_url: publicUrl,
          alt_text: file.name,
          category: 'plats',
          display_order: images.length,
        });

      if (dbError) throw dbError;

      toast({
        title: "Image ajoutée",
        description: "L'image a été ajoutée à la galerie",
      });

      fetchImages();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleToggleVisibility = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from("gallery_images")
      .update({ is_visible: !currentStatus })
      .eq("id", id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour la visibilité",
      });
    } else {
      fetchImages();
    }
  };

  const handleDelete = async (id: string, imageUrl: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette image ?")) return;

    try {
      const urlParts = imageUrl.split('/');
      const filePath = urlParts[urlParts.length - 1];

      await supabase.storage.from('gallery').remove([filePath]);

      const { error } = await supabase
        .from('gallery_images')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Image supprimée",
      });

      fetchImages();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-serif font-bold">Galerie</h2>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">
            {images.filter(img => img.is_visible).length} / {images.length} visible(s)
          </span>
          <Button onClick={() => document.getElementById("upload-input")?.click()} disabled={uploading}>
            <Upload className="mr-2 h-4 w-4" />
            {uploading ? "Envoi..." : "Ajouter"}
          </Button>
          <input
            id="upload-input"
            type="file"
            accept="image/*"
            onChange={handleUpload}
            className="hidden"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image) => (
          <div key={image.id} className="relative group">
            <img
              src={image.image_url}
              alt={image.alt_text || "Gallery"}
              className="w-full h-48 object-cover rounded-lg"
            />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex flex-col items-center justify-center gap-2">
              <div className="flex items-center gap-2 bg-background/90 px-3 py-1 rounded-full">
                <Checkbox
                  checked={image.is_visible}
                  onCheckedChange={() => handleToggleVisibility(image.id, image.is_visible)}
                />
                <span className="text-xs">{image.is_visible ? "Visible" : "Masqué"}</span>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(image.id, image.image_url)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Supprimer
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GalleryTab;
