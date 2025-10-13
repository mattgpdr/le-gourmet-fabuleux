import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Save, Plus, Trash2 } from "lucide-react";

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

  const handleSaveTimes = async (hour: OpeningHour) => {
    const { error } = await supabase
      .from("opening_hours")
      .update({ 
        start_time: hour.start_time,
        end_time: hour.end_time 
      })
      .eq("id", hour.id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de sauvegarder les horaires",
      });
    } else {
      toast({
        title: "Horaires sauvegardés",
        description: "Les horaires ont été mis à jour",
      });
      fetchHours();
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from("opening_hours")
      .delete()
      .eq("id", id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer cet horaire",
      });
    } else {
      toast({
        title: "Horaire supprimé",
        description: "L'horaire a été supprimé avec succès",
      });
      fetchHours();
    }
  };

  const handleAdd = async (dayOfWeek: number) => {
    const { error } = await supabase
      .from("opening_hours")
      .insert({
        day_of_week: dayOfWeek,
        start_time: "12:00:00",
        end_time: "14:00:00",
        is_closed: false,
      });

    if (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'ajouter un horaire",
      });
    } else {
      toast({
        title: "Horaire ajouté",
        description: "Un nouvel horaire a été ajouté",
      });
      fetchHours();
    }
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  // Group hours by day of week
  const hoursByDay = hours.reduce((acc, hour) => {
    if (!acc[hour.day_of_week]) {
      acc[hour.day_of_week] = [];
    }
    acc[hour.day_of_week].push(hour);
    return acc;
  }, {} as Record<number, OpeningHour[]>);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-serif font-bold">Horaires d'ouverture</h2>

      <Card>
        <CardHeader>
          <CardTitle>Gérer les horaires</CardTitle>
          <CardDescription>
            Configurez les heures d'ouverture pour chaque jour de la semaine. Vous pouvez ajouter plusieurs plages horaires par jour (ex: service midi et soir).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {[0, 1, 2, 3, 4, 5, 6].map((dayOfWeek) => (
              <div key={dayOfWeek} className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-lg font-semibold">{dayNames[dayOfWeek]}</Label>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleAdd(dayOfWeek)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter une plage horaire
                  </Button>
                </div>

                <div className="space-y-2">
                  {hoursByDay[dayOfWeek]?.map((hour) => (
                    <div key={hour.id} className="flex items-center gap-4 p-4 border rounded-lg bg-muted/30">
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
                                newHours[index].start_time = e.target.value + ":00";
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
                                newHours[index].end_time = e.target.value + ":00";
                                setHours(newHours);
                              }}
                              className="w-32"
                            />
                          </div>

                          <Button
                            size="sm"
                            onClick={() => handleSaveTimes(hour)}
                          >
                            <Save className="h-4 w-4 mr-2" />
                            Sauvegarder
                          </Button>
                        </>
                      )}

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(hour.id)}
                        className="ml-auto"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ))}

                  {(!hoursByDay[dayOfWeek] || hoursByDay[dayOfWeek].length === 0) && (
                    <div className="text-sm text-muted-foreground p-4 border rounded-lg border-dashed">
                      Aucune plage horaire définie. Cliquez sur "Ajouter une plage horaire" pour en créer une.
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OpeningHoursTab;
