import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Review {
  id: string;
  author_name: string;
  rating: number;
  comment: string;
  is_confirmed: boolean;
  created_at: string;
}

const ReviewsTab = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching reviews:", error);
    } else if (data) {
      setReviews(data);
    }
    setLoading(false);
  };

  const handleToggleConfirm = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from("reviews")
      .update({ is_confirmed: !currentStatus })
      .eq("id", id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour l'avis",
      });
    } else {
      fetchReviews();
      toast({
        title: "Avis mis à jour",
        description: "Le statut de l'avis a été modifié",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet avis ?")) return;

    const { error } = await supabase.from("reviews").delete().eq("id", id);

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'avis",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Avis supprimé",
        description: "L'avis a été supprimé avec succès",
      });
      fetchReviews();
    }
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-serif font-bold">Avis clients ({reviews.length})</h2>
      </div>

      {reviews.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            Aucun avis pour le moment
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {reviews.map((review) => (
            <Card key={review.id} className={review.is_confirmed ? "border-green-500" : ""}>
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg">{review.author_name}</CardTitle>
                    {review.is_confirmed && (
                      <Badge variant="default" className="text-xs">Confirmé</Badge>
                    )}
                  </div>
                  <div className="flex gap-1 mt-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < review.rating
                            ? "fill-primary text-primary"
                            : "text-muted-foreground"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    {new Date(review.created_at).toLocaleDateString("fr-FR")}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={review.is_confirmed ? "outline" : "default"}
                    size="sm"
                    onClick={() => handleToggleConfirm(review.id, review.is_confirmed)}
                  >
                    {review.is_confirmed ? "Annuler" : "Confirmer"}
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(review.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground italic">"{review.comment}"</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewsTab;
