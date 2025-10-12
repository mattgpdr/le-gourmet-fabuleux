import { useState } from "react";
import { MapPin, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const ContactSection = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    // Simulation d'envoi
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast({
      title: "Message envoyé !",
      description: "Nous vous répondrons dans les plus brefs délais.",
    });

    setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    setSubmitting(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <section id="contact" className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-serif font-bold text-center mb-12">
          Nous contacter
        </h2>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <div>
            <h3 className="text-2xl font-serif font-bold mb-6">
              Envoyez-nous un message
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  name="name"
                  placeholder="Votre nom"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Input
                  name="email"
                  type="email"
                  placeholder="Votre adresse e-mail"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Input
                  name="phone"
                  type="tel"
                  placeholder="Votre numéro de téléphone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Input
                  name="subject"
                  placeholder="Objet"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Textarea
                  name="message"
                  placeholder="Votre message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  maxLength={500}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  {formData.message.length} / 500
                </p>
              </div>
              <Button type="submit" disabled={submitting} className="w-full">
                {submitting ? "Envoi en cours..." : "Envoyer"}
              </Button>
            </form>
          </div>

          <div className="space-y-6">
            <h3 className="text-2xl font-serif font-bold mb-6">
              Informations de contact
            </h3>

            <Card className="p-6">
              <div className="flex items-start gap-4 mb-6">
                <Phone className="h-6 w-6 text-primary mt-1" />
                <div>
                  <h4 className="font-semibold mb-2">Téléphone</h4>
                  <a 
                    href="tel:+33123456789" 
                    className="text-primary hover:underline"
                  >
                    01 23 45 67 89
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 mb-6">
                <Mail className="h-6 w-6 text-primary mt-1" />
                <div>
                  <h4 className="font-semibold mb-2">E-mail</h4>
                  <a 
                    href="mailto:contact@legourmetparisien.fr" 
                    className="text-primary hover:underline"
                  >
                    contact@legourmetparisien.fr
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <MapPin className="h-6 w-6 text-primary mt-1" />
                <div>
                  <h4 className="font-semibold mb-2">Adresse</h4>
                  <p className="text-muted-foreground mb-2">
                    123 Avenue des Champs-Élysées<br />
                    75008 Paris<br />
                    France
                  </p>
                  <Button variant="outline" size="sm" asChild>
                    <a 
                      href="https://www.google.com/maps/search/?api=1&query=Champs-Élysées+Paris"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Voir sur la carte
                    </a>
                  </Button>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-muted/50">
              <h4 className="font-semibold mb-2">Comment nous trouver</h4>
              <p className="text-sm text-muted-foreground">
                Notre restaurant est facilement accessible en métro (ligne 1, station Franklin D. Roosevelt) 
                ou en bus. Plusieurs parkings sont disponibles à proximité.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
