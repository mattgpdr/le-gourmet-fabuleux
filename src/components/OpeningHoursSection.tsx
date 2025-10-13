import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { supabase } from "@/integrations/supabase/client";

interface OpeningHour {
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_closed: boolean;
}

const OpeningHoursSection = () => {
  const { ref, isVisible } = useScrollAnimation();
  const [openingHours, setOpeningHours] = useState<OpeningHour[]>([]);

  useEffect(() => {
    fetchOpeningHours();
  }, []);

  const fetchOpeningHours = async () => {
    const { data } = await supabase
      .from("opening_hours")
      .select("*")
      .order("day_of_week");

    if (data && data.length > 0) {
      setOpeningHours(data);
    }
  };

  const timeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const getCurrentStatus = () => {
    if (openingHours.length === 0) return { isOpen: false, message: "Chargement..." };

    const now = new Date();
    const day = now.getDay();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const currentTime = hours * 60 + minutes;

    const todayHours = openingHours.find(h => h.day_of_week === day);
    
    if (!todayHours || todayHours.is_closed) {
      return { isOpen: false, message: "Fermé aujourd'hui" };
    }

    const startTime = timeToMinutes(todayHours.start_time);
    const endTime = timeToMinutes(todayHours.end_time);
    const isOpen = currentTime >= startTime && currentTime < endTime;

    if (isOpen) {
      const closingHour = Math.floor(endTime / 60);
      const closingMinute = endTime % 60;
      return {
        isOpen: true,
        message: `Ouvert jusqu'à ${closingHour}:${closingMinute.toString().padStart(2, '0')}`,
      };
    } else {
      return {
        isOpen: false,
        message: "Fermé",
      };
    }
  };

  const status = getCurrentStatus();

  const dayNames = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];

  const groupedHours = () => {
    if (openingHours.length === 0) return [];

    const groups: { days: string; time: string }[] = [];
    let currentGroup: number[] = [];
    let currentTime = "";

    openingHours.forEach((hour, index) => {
      const timeString = hour.is_closed 
        ? "Fermé" 
        : `${hour.start_time.slice(0, 5)} - ${hour.end_time.slice(0, 5)}`;

      if (timeString === currentTime) {
        currentGroup.push(hour.day_of_week);
      } else {
        if (currentGroup.length > 0) {
          const dayRange = currentGroup.length > 1 && currentGroup[currentGroup.length - 1] - currentGroup[0] === currentGroup.length - 1
            ? `${dayNames[currentGroup[0]]} - ${dayNames[currentGroup[currentGroup.length - 1]]}`
            : currentGroup.map(d => dayNames[d]).join(", ");
          groups.push({ days: dayRange, time: currentTime });
        }
        currentGroup = [hour.day_of_week];
        currentTime = timeString;
      }

      if (index === openingHours.length - 1 && currentGroup.length > 0) {
        const dayRange = currentGroup.length > 1 && currentGroup[currentGroup.length - 1] - currentGroup[0] === currentGroup.length - 1
          ? `${dayNames[currentGroup[0]]} - ${dayNames[currentGroup[currentGroup.length - 1]]}`
          : currentGroup.map(d => dayNames[d]).join(", ");
        groups.push({ days: dayRange, time: currentTime });
      }
    });

    return groups.length > 0 ? groups : [
      { days: "Lundi - Vendredi", time: "07:00 - 23:00" },
      { days: "Samedi", time: "08:00 - 23:00" },
      { days: "Dimanche", time: "09:00 - 22:00" },
    ];
  };

  const hours = groupedHours();

  return (
    <section id="horaires" ref={ref} className={`py-12 md:py-16 bg-muted/30 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-6 md:mb-8">
            <Clock className="h-12 w-12 md:h-16 md:w-16 mx-auto mb-3 md:mb-4 text-primary" />
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-3 md:mb-4">
              Heures d'ouverture
            </h2>
            <Badge 
              variant={status.isOpen ? "default" : "secondary"}
              className="text-sm md:text-lg px-4 md:px-6 py-1.5 md:py-2"
            >
              {status.message}
            </Badge>
          </div>

          <Card className="p-4 md:p-8">
            <div className="space-y-3 md:space-y-4">
              {hours.map((schedule, index) => (
                <div 
                  key={index} 
                  className="flex justify-between items-center py-2 md:py-3 border-b last:border-b-0 gap-4"
                >
                  <span className="font-semibold text-sm md:text-base lg:text-lg">{schedule.days}</span>
                  <span className="text-sm md:text-base lg:text-lg text-primary font-medium text-right">{schedule.time}</span>
                </div>
              ))}
            </div>
          </Card>

          <p className="text-center text-xs md:text-sm text-muted-foreground mt-4 md:mt-6">
            Service continu toute la journée
          </p>
        </div>
      </div>
    </section>
  );
};

export default OpeningHoursSection;
