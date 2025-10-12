import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface Reservation {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  reservation_date: string;
  reservation_time: string;
  number_of_guests: number;
  message: string | null;
  created_at: string;
}

const ReservationsTab = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    const { data, error } = await supabase
      .from("reservations")
      .select("*")
      .order("reservation_date", { ascending: true })
      .order("reservation_time", { ascending: true });

    if (error) {
      console.error("Error fetching reservations:", error);
    } else if (data) {
      setReservations(data);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette réservation ?")) return;

    const { error } = await supabase.from("reservations").delete().eq("id", id);

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la réservation",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Réservation supprimée",
        description: "La réservation a été supprimée avec succès",
      });
      fetchReservations();
    }
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-serif font-bold">Réservations ({reservations.length})</h2>
      </div>

      {reservations.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            Aucune réservation pour le moment
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {reservations.map((reservation) => (
            <Card key={reservation.id}>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>{reservation.customer_name}</span>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(reservation.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Date et heure</p>
                    <p className="font-medium">
                      {format(new Date(reservation.reservation_date), "d MMMM yyyy", { locale: fr })} à {reservation.reservation_time}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Nombre de personnes</p>
                    <p className="font-medium">{reservation.number_of_guests} personne{reservation.number_of_guests > 1 ? "s" : ""}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{reservation.customer_email}</p>
                  </div>
                  {reservation.customer_phone && (
                    <div>
                      <p className="text-sm text-muted-foreground">Téléphone</p>
                      <p className="font-medium">{reservation.customer_phone}</p>
                    </div>
                  )}
                  {reservation.message && (
                    <div className="md:col-span-2">
                      <p className="text-sm text-muted-foreground">Message</p>
                      <p className="font-medium">{reservation.message}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReservationsTab;
