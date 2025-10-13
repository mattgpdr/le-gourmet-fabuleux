import { Wifi, ParkingSquare, Wine, Users, Utensils, Dog, Cigarette, Heart } from "lucide-react";

const ServicesSection = () => {
  const services = [
    { icon: Utensils, title: "À emporter", description: "Commandez vos plats préférés" },
    { icon: Users, title: "Événements privés", description: "Organisez vos réceptions" },
    { icon: Wine, title: "Service traiteur", description: "Pour tous vos événements" },
    { icon: Wifi, title: "Wi-Fi gratuit", description: "Connexion illimitée" },
    { icon: ParkingSquare, title: "Parking", description: "Places disponibles à proximité" },
    { icon: Dog, title: "Animaux acceptés", description: "Vos compagnons sont les bienvenus" },
    { icon: Heart, title: "Accessibilité PMR", description: "Accès pour tous" },
    { icon: Cigarette, title: "Espace fumeurs", description: "Zone dédiée en terrasse" },
  ];

  const paymentMethods = [
    "Espèces",
    "Carte bancaire",
    "Paiement sans contact",
    "VISA",
    "MasterCard",
    "Ticket restaurant",
  ];

  return (
    <section id="services" className="py-12 md:py-16 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-center mb-8 md:mb-12">
          Nos services
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12 md:mb-16">
          {services.map((service, index) => (
            <div key={index} className="text-center p-3 md:p-4 rounded-lg hover:bg-muted/50 transition-colors">
              <service.icon className="h-10 w-10 md:h-12 md:w-12 mx-auto mb-2 md:mb-3 text-primary" />
              <h3 className="text-sm md:text-base font-semibold mb-1">{service.title}</h3>
              <p className="text-xs md:text-sm text-muted-foreground hidden sm:block">{service.description}</p>
            </div>
          ))}
        </div>

        <div className="max-w-2xl mx-auto text-center">
          <h3 className="text-xl md:text-2xl font-serif font-bold mb-4 md:mb-6">
            Moyens de paiement acceptés
          </h3>
          <div className="flex flex-wrap justify-center gap-2 md:gap-4">
            {paymentMethods.map((method, index) => (
              <div key={index} className="px-3 md:px-4 py-1.5 md:py-2 bg-muted rounded-lg text-xs md:text-sm font-medium">
                {method}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
