import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Upload, Save } from "lucide-react";

const SiteSettingsTab = () => {
  const [settings, setSettings] = useState({
    hero_image_url: "",
    logo_url: "",
    instagram_url: "",
    facebook_url: "",
    phone: "",
    email: "",
    address: "",
    map_query: "",
    hero_title: "",
    hero_description: "",
    footer_name: "",
    footer_description: "",
    contact_directions: "",
  });
  const [uploading, setUploading] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    const { data } = await supabase
      .from("site_settings")
      .select("*");
    
    if (data) {
      const settingsMap = data.reduce((acc, item) => {
        acc[item.key] = item.value;
        return acc;
      }, {} as Record<string, string>);
      
      setSettings(prev => ({ ...prev, ...settingsMap }));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(key);

    try {
      // Vérifier la session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        toast({
          variant: "destructive",
          title: "Session expirée",
          description: "Veuillez vous reconnecter",
        });
        setUploading(null);
        return;
      }

      const fileExt = file.name.split(".").pop();
      const fileName = `${key}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("gallery")
        .upload(fileName, file);

      if (uploadError) {
        console.error("Upload error:", uploadError);
        toast({
          variant: "destructive",
          title: "Erreur de téléchargement",
          description: uploadError.message || "Impossible de télécharger l'image",
        });
        setUploading(null);
        return;
      }

      const { data: { publicUrl } } = supabase.storage
        .from("gallery")
        .getPublicUrl(fileName);

      const { error: updateError } = await supabase
        .from("site_settings")
        .upsert(
          { key, value: publicUrl, updated_at: new Date().toISOString() },
          { onConflict: 'key' }
        );

      if (updateError) {
        console.error("Update error:", updateError);
        toast({
          variant: "destructive",
          title: "Erreur de mise à jour",
          description: updateError.message || "Impossible de mettre à jour les paramètres",
        });
      } else {
        setSettings(prev => ({ ...prev, [key]: publicUrl }));
        toast({
          title: "Image mise à jour",
          description: "L'image a été changée avec succès. Les couleurs du site vont se mettre à jour.",
        });
        
        // Trigger a page reload to update colors if it's the logo
        if (key === "logo_url") {
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        }
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      toast({
        variant: "destructive",
        title: "Erreur inattendue",
        description: "Une erreur s'est produite. Veuillez réessayer.",
      });
    } finally {
      setUploading(null);
    }
  };

  const handleSaveSetting = async (key: string, value: string) => {
    const { error } = await supabase
      .from("site_settings")
      .upsert(
        { key, value, updated_at: new Date().toISOString() },
        { onConflict: 'key' }
      );

    if (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour les paramètres",
      });
    } else {
      toast({
        title: "Paramètre sauvegardé",
        description: "Les modifications ont été enregistrées",
      });
    }
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
          {settings.hero_image_url && (
            <div className="relative aspect-video w-full max-w-2xl overflow-hidden rounded-lg border">
              <img
                src={settings.hero_image_url}
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
                onChange={(e) => handleImageUpload(e, "hero_image_url")}
                disabled={uploading === "hero_image_url"}
                className="flex-1"
              />
              <Button disabled={uploading === "hero_image_url"} size="icon" variant="outline">
                <Upload className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Logo du site</CardTitle>
          <CardDescription>
            Ce logo apparaît dans le chat et autres éléments du site
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {settings.logo_url && (
            <div className="relative w-32 h-32 overflow-hidden rounded-lg border p-4 bg-muted">
              <img
                src={settings.logo_url}
                alt="Logo"
                className="w-full h-full object-contain"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="logo-upload">Changer le logo</Label>
            <div className="flex items-center gap-2">
              <Input
                id="logo-upload"
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, "logo_url")}
                disabled={uploading === "logo_url"}
                className="flex-1"
              />
              <Button disabled={uploading === "logo_url"} size="icon" variant="outline">
                <Upload className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Réseaux sociaux</CardTitle>
          <CardDescription>
            Liens vers vos pages Instagram et Facebook
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="instagram">Instagram</Label>
            <div className="flex items-center gap-2">
              <Input
                id="instagram"
                value={settings.instagram_url}
                onChange={(e) => setSettings(prev => ({ ...prev, instagram_url: e.target.value }))}
                placeholder="https://instagram.com/votre-restaurant"
              />
              <Button 
                onClick={() => handleSaveSetting("instagram_url", settings.instagram_url)}
                size="icon"
                variant="outline"
              >
                <Save className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="facebook">Facebook</Label>
            <div className="flex items-center gap-2">
              <Input
                id="facebook"
                value={settings.facebook_url}
                onChange={(e) => setSettings(prev => ({ ...prev, facebook_url: e.target.value }))}
                placeholder="https://facebook.com/votre-restaurant"
              />
              <Button 
                onClick={() => handleSaveSetting("facebook_url", settings.facebook_url)}
                size="icon"
                variant="outline"
              >
                <Save className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Informations de contact</CardTitle>
          <CardDescription>
            Téléphone, email et adresse affichés sur le site
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Téléphone</Label>
            <div className="flex items-center gap-2">
              <Input
                id="phone"
                value={settings.phone}
                onChange={(e) => setSettings(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="01 23 45 67 89"
              />
              <Button 
                onClick={() => handleSaveSetting("phone", settings.phone)}
                size="icon"
                variant="outline"
              >
                <Save className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="flex items-center gap-2">
              <Input
                id="email"
                type="email"
                value={settings.email}
                onChange={(e) => setSettings(prev => ({ ...prev, email: e.target.value }))}
                placeholder="contact@restaurant.fr"
              />
              <Button 
                onClick={() => handleSaveSetting("email", settings.email)}
                size="icon"
                variant="outline"
              >
                <Save className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Adresse</Label>
            <div className="flex items-center gap-2">
              <Textarea
                id="address"
                value={settings.address}
                onChange={(e) => setSettings(prev => ({ ...prev, address: e.target.value }))}
                placeholder="123 Avenue des Champs-Élysées, 75008 Paris, France"
                rows={2}
              />
              <Button 
                onClick={() => handleSaveSetting("address", settings.address)}
                size="icon"
                variant="outline"
              >
                <Save className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="map_query">Localisation Google Maps</Label>
            <div className="flex items-center gap-2">
              <Input
                id="map_query"
                value={settings.map_query}
                onChange={(e) => setSettings(prev => ({ ...prev, map_query: e.target.value }))}
                placeholder="Le Gourmet Fabuleux Paris"
              />
              <Button 
                onClick={() => handleSaveSetting("map_query", settings.map_query)}
                size="icon"
                variant="outline"
              >
                <Save className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Entrez le nom du restaurant ou l'adresse pour la recherche Google Maps
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Textes du site</CardTitle>
          <CardDescription>
            Personnalisez les textes affichés sur le site
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="hero_title">Titre de la page d'accueil</Label>
            <div className="flex items-center gap-2">
              <Input
                id="hero_title"
                value={settings.hero_title}
                onChange={(e) => setSettings(prev => ({ ...prev, hero_title: e.target.value }))}
                placeholder="Le Gourmet Parisien"
              />
              <Button 
                onClick={() => handleSaveSetting("hero_title", settings.hero_title)}
                size="icon"
                variant="outline"
              >
                <Save className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="hero_description">Description de la page d'accueil</Label>
            <div className="flex items-center gap-2">
              <Textarea
                id="hero_description"
                value={settings.hero_description}
                onChange={(e) => setSettings(prev => ({ ...prev, hero_description: e.target.value }))}
                placeholder="Une expérience culinaire authentique au cœur de Paris"
                rows={2}
              />
              <Button 
                onClick={() => handleSaveSetting("hero_description", settings.hero_description)}
                size="icon"
                variant="outline"
              >
                <Save className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="footer_name">Nom du restaurant (Footer)</Label>
            <div className="flex items-center gap-2">
              <Input
                id="footer_name"
                value={settings.footer_name}
                onChange={(e) => setSettings(prev => ({ ...prev, footer_name: e.target.value }))}
                placeholder="Le Gourmet Fabuleux"
              />
              <Button 
                onClick={() => handleSaveSetting("footer_name", settings.footer_name)}
                size="icon"
                variant="outline"
              >
                <Save className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="footer_description">Description (Footer)</Label>
            <div className="flex items-center gap-2">
              <Textarea
                id="footer_description"
                value={settings.footer_description}
                onChange={(e) => setSettings(prev => ({ ...prev, footer_description: e.target.value }))}
                placeholder="Une expérience gastronomique unique au cœur de Paris"
                rows={2}
              />
              <Button 
                onClick={() => handleSaveSetting("footer_description", settings.footer_description)}
                size="icon"
                variant="outline"
              >
                <Save className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact_directions">Texte "Comment nous trouver"</Label>
            <div className="flex items-center gap-2">
              <Textarea
                id="contact_directions"
                value={settings.contact_directions}
                onChange={(e) => setSettings(prev => ({ ...prev, contact_directions: e.target.value }))}
                placeholder="Notre restaurant est facilement accessible en métro..."
                rows={3}
              />
              <Button 
                onClick={() => handleSaveSetting("contact_directions", settings.contact_directions)}
                size="icon"
                variant="outline"
              >
                <Save className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SiteSettingsTab;
