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
    <section id="services" className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-serif font-bold text-center mb-12">
          Nos services
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {services.map((service, index) => (
            <div key={index} className="text-center p-4 rounded-lg hover:bg-muted/50 transition-colors">
              <service.icon className="h-12 w-12 mx-auto mb-3 text-primary" />
              <h3 className="font-semibold mb-1">{service.title}</h3>
              <p className="text-sm text-muted-foreground">{service.description}</p>
            </div>
          ))}
        </div>

        <div className="max-w-2xl mx-auto text-center">
          <h3 className="text-2xl font-serif font-bold mb-6">
            Moyens de paiement acceptés
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            {paymentMethods.map((method, index) => (
              <div key={index} className="px-4 py-2 bg-muted rounded-lg text-sm font-medium">
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
