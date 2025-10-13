import { useEffect, useState } from "react";
import { Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Footer = () => {
  const [settings, setSettings] = useState({
    phone: "01 23 45 67 89",
    email: "contact@legourmetparisien.fr",
    address: "123 Avenue des Champs-Élysées, 75008 Paris, France",
    instagram_url: "https://instagram.com",
    facebook_url: "https://facebook.com",
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    const { data } = await supabase
      .from("site_settings")
      .select("*")
      .in("key", ["phone", "email", "address", "instagram_url", "facebook_url"]);

    if (data) {
      const settingsMap = data.reduce((acc, item) => {
        acc[item.key] = item.value;
        return acc;
      }, {} as Record<string, string>);
      
      setSettings(prev => ({ ...prev, ...settingsMap }));
    }
  };

  return (
    <footer className="bg-muted/50 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-serif font-bold mb-4">Le Gourmet Fabuleux</h3>
            <p className="text-muted-foreground">
              Une expérience gastronomique unique au cœur de Paris
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <a href={`tel:${settings.phone}`} className="hover:text-primary">
                  {settings.phone}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <a href={`mailto:${settings.email}`} className="hover:text-primary">
                  {settings.email}
                </a>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-1" />
                <span>{settings.address}</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Suivez-nous</h4>
            <div className="flex gap-4">
              <a
                href={settings.facebook_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Facebook className="h-6 w-6" />
              </a>
              <a
                href={settings.instagram_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Instagram className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Le Gourmet Fabuleux. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;