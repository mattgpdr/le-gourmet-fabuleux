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
    footer_name: "Le Gourmet Fabuleux",
    footer_description: "Une expérience gastronomique unique au cœur de Paris",
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    const { data } = await supabase
      .from("site_settings")
      .select("*")
      .in("key", ["phone", "email", "address", "instagram_url", "facebook_url", "footer_name", "footer_description"]);

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
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          <div className="text-center md:text-left">
            <h3 className="text-lg md:text-xl font-serif font-bold mb-3 md:mb-4">{settings.footer_name}</h3>
            <p className="text-sm md:text-base text-muted-foreground">
              {settings.footer_description}
            </p>
          </div>

          <div className="text-center md:text-left">
            <h4 className="font-semibold mb-3 md:mb-4">Contact</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <a href={`tel:${settings.phone}`} className="hover:text-primary break-all">
                  {settings.phone}
                </a>
              </div>
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <a href={`mailto:${settings.email}`} className="hover:text-primary break-all">
                  {settings.email}
                </a>
              </div>
              <div className="flex items-start gap-2 justify-center md:justify-start">
                <MapPin className="h-4 w-4 mt-1 flex-shrink-0" />
                <span className="text-left">{settings.address}</span>
              </div>
            </div>
          </div>

          <div className="text-center md:text-left">
            <h4 className="font-semibold mb-3 md:mb-4">Suivez-nous</h4>
            <div className="flex gap-4 justify-center md:justify-start">
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

        <div className="border-t mt-6 md:mt-8 pt-6 md:pt-8 text-center text-xs md:text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Le Gourmet Fabuleux. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;