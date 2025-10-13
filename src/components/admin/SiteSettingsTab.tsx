import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Upload } from "lucide-react";

const SiteSettingsTab = () => {
  const [heroImageUrl, setHeroImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    const { data } = await supabase
      .from("site_settings")
      .select("*")
      .eq("key", "hero_image_url")
      .single();
    
    if (data) {
      setHeroImageUrl(data.value);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    const fileExt = file.name.split(".").pop();
    const fileName = `hero-${Date.now()}.${fileExt}`;

    const { error: uploadError, data } = await supabase.storage
      .from("gallery")
      .upload(fileName, file);

    if (uploadError) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de télécharger l'image",
      });
      setUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from("gallery")
      .getPublicUrl(fileName);

    const { error: updateError } = await supabase
      .from("site_settings")
      .update({ value: publicUrl, updated_at: new Date().toISOString() })
      .eq("key", "hero_image_url");

    if (updateError) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour les paramètres",
      });
    } else {
      setHeroImageUrl(publicUrl);
      toast({
        title: "Image mise à jour",
        description: "L'image de présentation a été changée avec succès",
      });
    }

    setUploading(false);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-serif font-bold">Paramètres du site</h2>

      <Card>
        <CardHeader>
          <CardTitle>Image de présentation</CardTitle>
          <CardDescription>
            Cette image apparaît en haut de la page d'accueil
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {heroImageUrl && (
            <div className="relative aspect-video w-full max-w-2xl overflow-hidden rounded-lg border">
              <img
                src={heroImageUrl}
                alt="Hero"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="hero-upload">Changer l'image</Label>
            <div className="flex items-center gap-2">
              <Input
                id="hero-upload"
                type="file"
                accept="image/*"
                onChange={handleUpload}
                disabled={uploading}
                className="flex-1"
              />
              <Button disabled={uploading} size="icon" variant="outline">
                <Upload className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Formats acceptés: JPG, PNG, WEBP. Taille recommandée: 1920x1080px
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SiteSettingsTab;
