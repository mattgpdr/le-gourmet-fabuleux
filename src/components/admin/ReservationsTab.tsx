import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, CheckCircle2, Circle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  is_viewed: boolean;
  is_processed: boolean;
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

  const handleToggleProcessed = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from("reservations")
      .update({ 
        is_processed: !currentStatus,
        is_viewed: true 
      })
      .eq("id", id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le statut",
      });
    } else {
      fetchReservations();
      toast({
        title: "Statut mis à jour",
        description: "La réservation a été marquée comme " + (!currentStatus ? "traitée" : "non traitée"),
      });
    }
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

  const newReservations = reservations.filter(r => !r.is_processed);
  const processedReservations = reservations.filter(r => r.is_processed);

  const renderReservation = (reservation: Reservation) => (
    <Card 
      key={reservation.id} 
      className={!reservation.is_processed ? "border-primary bg-primary/5" : "opacity-75"}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 flex-1">
            <div 
              className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => handleToggleProcessed(reservation.id, reservation.is_processed)}
            >
              {reservation.is_processed ? (
                <CheckCircle2 className="h-5 w-5 text-primary" />
              ) : (
                <Circle className="h-5 w-5 text-muted-foreground" />
              )}
              <span className="text-xs font-medium">
                {reservation.is_processed ? "Traitée" : "Non traitée"}
              </span>
            </div>
            <CardTitle className={reservation.is_processed ? "line-through opacity-60" : ""}>
              {reservation.customer_name}
            </CardTitle>
          </div>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleDelete(reservation.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
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
  );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-serif font-bold">Réservations</h2>

      <Tabs defaultValue="new" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="new" className="flex items-center gap-2">
            <Circle className="h-4 w-4" />
            Nouveaux ({newReservations.length})
          </TabsTrigger>
          <TabsTrigger value="processed" className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            Traitées ({processedReservations.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="new" className="mt-6">
          {newReservations.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                Aucune nouvelle réservation
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {newReservations.map(renderReservation)}
            </div>
          )}
        </TabsContent>

        <TabsContent value="processed" className="mt-6">
          {processedReservations.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                Aucune réservation traitée
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {processedReservations.map(renderReservation)}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReservationsTab;
