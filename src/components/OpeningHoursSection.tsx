import { Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const OpeningHoursSection = () => {
  const { ref, isVisible } = useScrollAnimation();
  const getCurrentStatus = () => {
    const now = new Date();
    const day = now.getDay();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const currentTime = hours * 60 + minutes;

    // Définir les horaires (en minutes depuis minuit)
    const schedule: { [key: number]: { start: number; end: number } } = {
      0: { start: 9 * 60, end: 22 * 60 }, // Dimanche
      1: { start: 7 * 60, end: 23 * 60 }, // Lundi
      2: { start: 7 * 60, end: 23 * 60 }, // Mardi
      3: { start: 7 * 60, end: 23 * 60 }, // Mercredi
      4: { start: 7 * 60, end: 23 * 60 }, // Jeudi
      5: { start: 7 * 60, end: 23 * 60 }, // Vendredi
      6: { start: 8 * 60, end: 23 * 60 }, // Samedi
    };

    const todaySchedule = schedule[day];
    const isOpen = currentTime >= todaySchedule.start && currentTime < todaySchedule.end;

    if (isOpen) {
      const closingHour = Math.floor(todaySchedule.end / 60);
      return {
        isOpen: true,
        message: `Ouvert jusqu'à ${closingHour}:00`,
      };
    } else {
      const tomorrow = (day + 1) % 7;
      const tomorrowSchedule = schedule[tomorrow];
      const openingHour = Math.floor(tomorrowSchedule.start / 60);
      const openingMinute = tomorrowSchedule.start % 60;
      return {
        isOpen: false,
        message: `Fermé - Ouvre demain à ${openingHour}:${openingMinute.toString().padStart(2, '0')}`,
      };
    }
  };

  const status = getCurrentStatus();

  const hours = [
    { day: "Lundi - Vendredi", time: "07:00 - 23:00" },
    { day: "Samedi", time: "08:00 - 23:00" },
    { day: "Dimanche", time: "09:00 - 22:00" },
  ];

  return (
    <section id="horaires" ref={ref} className={`py-16 bg-muted/30 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <Clock className="h-16 w-16 mx-auto mb-4 text-primary" />
            <h2 className="text-4xl font-serif font-bold mb-4">
              Heures d'ouverture
            </h2>
            <Badge 
              variant={status.isOpen ? "default" : "secondary"}
              className="text-lg px-6 py-2"
            >
              {status.message}
            </Badge>
          </div>

          <Card className="p-8">
            <div className="space-y-4">
              {hours.map((schedule, index) => (
                <div 
                  key={index} 
                  className="flex justify-between items-center py-3 border-b last:border-b-0"
                >
                  <span className="font-semibold text-lg">{schedule.day}</span>
                  <span className="text-lg text-primary font-medium">{schedule.time}</span>
                </div>
              ))}
            </div>
          </Card>

          <p className="text-center text-muted-foreground mt-6">
            Service continu toute la journée
          </p>
        </div>
      </div>
    </section>
  );
};

export default OpeningHoursSection;
