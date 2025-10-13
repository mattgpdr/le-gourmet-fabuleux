import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { z } from "zod";

interface Review {
  id: string;
  author_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

const ReviewsSection = () => {
  const { ref, isVisible } = useScrollAnimation();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [authorName, setAuthorName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    const { data } = await supabase
      .from("reviews")
      .select("*")
      .eq("is_confirmed", true)
      .order("created_at", { ascending: false })
      .limit(6);

    if (data) setReviews(data);
  };

  const reviewSchema = z.object({
    authorName: z.string().trim().min(2, "Le nom doit contenir au moins 2 caractères").max(100, "Le nom ne peut pas dépasser 100 caractères"),
    comment: z.string().trim().min(10, "L'avis doit contenir au moins 10 caractères").max(1000, "L'avis ne peut pas dépasser 1000 caractères"),
    rating: z.number().int().min(1).max(5)
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const validationResult = reviewSchema.safeParse({
        authorName,
        comment,
        rating
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

    const { error } = await supabase.from("reviews").insert({
      author_name: authorName.trim(),
      rating,
      comment: comment.trim(),
    });

    if (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Merci !",
        description: "Votre avis a été soumis et sera publié après validation",
      });
      setAuthorName("");
      setComment("");
      setRating(5);
    }

    setSubmitting(false);
  };

  return (
    <section id="avis" ref={ref} className={`py-20 px-4 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-4xl md:text-5xl font-serif font-bold text-center mb-4 text-primary">
          Avis de nos clients
        </h2>
        <p className="text-center text-muted-foreground mb-16 text-lg">
          Découvrez ce que nos clients pensent de nous
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {reviews.map((review) => (
            <Card 
              key={review.id}
              className="hover:shadow-elegant transition-all duration-300"
            >
              <CardContent className="p-6">
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < review.rating
                          ? "fill-secondary text-secondary"
                          : "text-muted"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4 italic">
                  "{review.comment}"
                </p>
                <p className="font-semibold text-foreground">
                  — {review.author_name}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="max-w-2xl mx-auto shadow-elegant">
          <CardContent className="p-8">
            <h3 className="text-2xl font-serif font-semibold mb-6 text-center">
              Laissez votre avis
            </h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Votre nom</label>
                <Input
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="Jean Dupont"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Note</label>
                <div className="flex gap-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setRating(i + 1)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        className={`h-8 w-8 ${
                          i < rating
                            ? "fill-secondary text-secondary"
                            : "text-muted"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Votre avis</label>
                <Textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Partagez votre expérience..."
                  rows={4}
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={submitting}
              >
                {submitting ? "Envoi en cours..." : "Publier mon avis"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default ReviewsSection;
