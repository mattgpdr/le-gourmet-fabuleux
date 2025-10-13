import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Save } from "lucide-react";

interface OpeningHour {
  id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_closed: boolean;
}

const OpeningHoursTab = () => {
  const [hours, setHours] = useState<OpeningHour[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const dayNames = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];

  useEffect(() => {
    fetchHours();
  }, []);

  const fetchHours = async () => {
    const { data, error } = await supabase
      .from("opening_hours")
      .select("*")
      .order("day_of_week");

    if (error) {
      console.error("Error fetching hours:", error);
    } else if (data) {
      setHours(data);
    }
    setLoading(false);
  };

  const handleUpdate = async (id: string, field: string, value: any) => {
    const { error } = await supabase
      .from("opening_hours")
      .update({ [field]: value })
      .eq("id", id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour les horaires",
      });
    } else {
      toast({
        title: "Horaires mis à jour",
        description: "Les modifications ont été enregistrées",
      });
      fetchHours();
    }
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-serif font-bold">Horaires d'ouverture</h2>

      <Card>
        <CardHeader>
          <CardTitle>Gérer les horaires</CardTitle>
          <CardDescription>
            Configurez les heures d'ouverture pour chaque jour de la semaine
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {hours.map((hour) => (
              <div key={hour.id} className="flex items-center gap-4 p-4 border rounded-lg">
                <div className="w-32">
                  <Label className="font-semibold">{dayNames[hour.day_of_week]}</Label>
                </div>

                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={hour.is_closed}
                    onCheckedChange={(checked) => 
                      handleUpdate(hour.id, "is_closed", checked as boolean)
                    }
                  />
                  <Label className="text-sm">Fermé</Label>
                </div>

                {!hour.is_closed && (
                  <>
                    <div className="flex items-center gap-2">
                      <Label className="text-sm">De</Label>
                      <Input
                        type="time"
                        value={hour.start_time.slice(0, 5)}
                        onChange={(e) => {
                          const newHours = [...hours];
                          const index = newHours.findIndex(h => h.id === hour.id);
                          newHours[index].start_time = e.target.value;
                          setHours(newHours);
                        }}
                        className="w-32"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <Label className="text-sm">À</Label>
                      <Input
                        type="time"
                        value={hour.end_time.slice(0, 5)}
                        onChange={(e) => {
                          const newHours = [...hours];
                          const index = newHours.findIndex(h => h.id === hour.id);
                          newHours[index].end_time = e.target.value;
                          setHours(newHours);
                        }}
                        className="w-32"
                      />
                    </div>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        handleUpdate(hour.id, "start_time", hour.start_time);
                        handleUpdate(hour.id, "end_time", hour.end_time);
                      }}
                    >
                      <Save className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OpeningHoursTab;
