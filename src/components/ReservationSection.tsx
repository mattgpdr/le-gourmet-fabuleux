import { Calendar, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const ReservationSection = () => {
  const { ref, isVisible } = useScrollAnimation();
  return (
    <section id="reservation" ref={ref} className={`py-12 md:py-16 bg-muted/30 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <Calendar className="h-12 w-12 md:h-16 md:w-16 mx-auto mb-3 md:mb-4 text-primary" />
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4 md:mb-6">
            Faire une réservation
          </h2>
          <p className="text-sm md:text-base lg:text-lg text-muted-foreground mb-6 md:mb-8 px-2">
            Nous nous réjouissons de vous accueillir bientôt. Réservez votre table facilement 
            par téléphone ou en ligne.
          </p>

          <div className="grid md:grid-cols-2 gap-4 md:gap-6">
            <Card className="p-6 md:p-8">
              <Phone className="h-10 w-10 md:h-12 md:w-12 mx-auto mb-3 md:mb-4 text-primary" />
              <h3 className="text-xl md:text-2xl font-serif font-bold mb-3 md:mb-4">
                Réserver par téléphone
              </h3>
              <p className="text-sm md:text-base text-muted-foreground mb-4 md:mb-6">
                Appelez-nous directement pour réserver votre table
              </p>
              <Button size="lg" variant="default" className="w-full text-sm md:text-base" asChild>
                <a href="tel:+33123456789">
                  <Phone className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                  01 23 45 67 89
                </a>
              </Button>
            </Card>

            <Card className="p-6 md:p-8">
              <Calendar className="h-10 w-10 md:h-12 md:w-12 mx-auto mb-3 md:mb-4 text-primary" />
              <h3 className="text-xl md:text-2xl font-serif font-bold mb-3 md:mb-4">
                Réserver en ligne
              </h3>
              <p className="text-sm md:text-base text-muted-foreground mb-4 md:mb-6">
                Utilisez notre système de réservation en ligne pratique
              </p>
              <Button size="lg" variant="default" className="w-full text-sm md:text-base" asChild>
                <a href="/reservation">
                  <Calendar className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                  Réserver maintenant
                </a>
              </Button>
            </Card>
          </div>

          <p className="text-xs md:text-sm text-muted-foreground mt-6 md:mt-8 px-2">
            Pour les groupes de plus de 10 personnes ou les événements privés, 
            merci de nous contacter directement par téléphone.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ReservationSection;
