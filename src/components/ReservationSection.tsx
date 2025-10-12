import { Calendar, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const ReservationSection = () => {
  return (
    <section id="reservation" className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <Calendar className="h-16 w-16 mx-auto mb-4 text-primary" />
          <h2 className="text-4xl font-serif font-bold mb-6">
            Faire une réservation
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Nous nous réjouissons de vous accueillir bientôt. Réservez votre table facilement 
            par téléphone ou en ligne.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-8">
              <Phone className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="text-2xl font-serif font-bold mb-4">
                Réserver par téléphone
              </h3>
              <p className="text-muted-foreground mb-6">
                Appelez-nous directement pour réserver votre table
              </p>
              <Button size="lg" variant="default" className="w-full" asChild>
                <a href="tel:+33123456789">
                  <Phone className="mr-2 h-5 w-5" />
                  01 23 45 67 89
                </a>
              </Button>
            </Card>

            <Card className="p-8">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="text-2xl font-serif font-bold mb-4">
                Réserver en ligne
              </h3>
              <p className="text-muted-foreground mb-6">
                Utilisez notre système de réservation en ligne pratique
              </p>
              <Button size="lg" variant="default" className="w-full">
                <Calendar className="mr-2 h-5 w-5" />
                Réserver maintenant
              </Button>
            </Card>
          </div>

          <p className="text-sm text-muted-foreground mt-8">
            Pour les groupes de plus de 10 personnes ou les événements privés, 
            merci de nous contacter directement par téléphone.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ReservationSection;
