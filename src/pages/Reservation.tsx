import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { z } from "zod";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Reservation = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [date, setDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [numberOfGuests, setNumberOfGuests] = useState(2);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const availableTimes = [
    "12:00", "12:30", "13:00", "13:30",
    "19:00", "19:30", "20:00", "20:30", "21:00", "21:30"
  ];

  const reservationSchema = z.object({
    customerName: z.string().trim().min(2, "Le nom doit contenir au moins 2 caractères").max(100, "Le nom ne peut pas dépasser 100 caractères"),
    customerEmail: z.string().trim().email("Email invalide").max(255, "L'email ne peut pas dépasser 255 caractères"),
    customerPhone: z.string().trim().max(20, "Le téléphone ne peut pas dépasser 20 caractères").optional().or(z.literal("")),
    numberOfGuests: z.number().int().min(1, "Minimum 1 personne").max(20, "Maximum 20 personnes"),
    message: z.string().trim().max(1000, "Le message ne peut pas dépasser 1000 caractères").optional().or(z.literal(""))
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!date || !selectedTime) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner une date et une heure",
        variant: "destructive",
      });
      return;
    }

    try {
      const validationResult = reservationSchema.safeParse({
        customerName,
        customerEmail,
        customerPhone,
        numberOfGuests,
        message
      });

      if (!validationResult.success) {
        const errors = validationResult.error.errors.map(err => err.message).join(", ");
        toast({
          title: "Erreur de validation",
          description: errors,
          variant: "destructive",
        });
        return;
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Veuillez vérifier vos informations",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);

    const { error } = await supabase.from("reservations").insert({
      customer_name: customerName,
      customer_email: customerEmail,
      customer_phone: customerPhone || null,
      reservation_date: format(date, "yyyy-MM-dd"),
      reservation_time: selectedTime,
      number_of_guests: numberOfGuests,
      message: message || null,
    });

    if (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la réservation",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Réservation confirmée !",
        description: "Nous avons bien reçu votre réservation",
      });
      navigate("/");
    }

    setSubmitting(false);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-muted/30 pt-24 pb-12">
        <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-center mb-4 text-primary">
            Réserver une table
          </h1>
          <p className="text-center text-muted-foreground mb-12 text-lg">
            Choisissez votre date et heure pour une expérience inoubliable
          </p>

          <form onSubmit={handleSubmit}>
            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Sélectionner une date</CardTitle>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    disabled={(date) => date < new Date()}
                    className="rounded-md border mx-auto"
                    locale={fr}
                  />
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Horaire</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-2">
                      {availableTimes.map((time) => (
                        <Button
                          key={time}
                          type="button"
                          variant={selectedTime === time ? "default" : "outline"}
                          onClick={() => setSelectedTime(time)}
                          className="w-full"
                        >
                          {time}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Vos informations</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Nom complet *</label>
                      <Input
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Jean Dupont"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Email *</label>
                      <Input
                        type="email"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        placeholder="jean.dupont@email.com"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Téléphone</label>
                      <Input
                        type="tel"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="06 12 34 56 78"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Nombre de personnes</label>
                      <Input
                        type="number"
                        min="1"
                        max="20"
                        value={numberOfGuests}
                        onChange={(e) => setNumberOfGuests(parseInt(e.target.value))}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Message (optionnel)</label>
                      <Textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Allergies, régime spécial, occasion..."
                        rows={3}
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={submitting || !date || !selectedTime}
                    >
                      {submitting ? "Réservation en cours..." : "Confirmer la réservation"}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Reservation;
