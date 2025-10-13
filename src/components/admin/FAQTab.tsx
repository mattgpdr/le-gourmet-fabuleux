import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Plus, Save } from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  display_order: number;
  is_active: boolean;
}

const FAQTab = () => {
  const [faqItems, setFaqItems] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    is_active: true,
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchFAQ();
  }, []);

  const fetchFAQ = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("faq_items")
      .select("*")
      .order("display_order");
    
    if (data) {
      setFaqItems(data);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingId) {
      const { error } = await supabase
        .from("faq_items")
        .update(formData)
        .eq("id", editingId);

      if (error) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de mettre à jour la question",
        });
      } else {
        toast({
          title: "Question mise à jour",
          description: "La question FAQ a été modifiée avec succès",
        });
        setEditingId(null);
        setFormData({ question: "", answer: "", is_active: true });
        fetchFAQ();
      }
    } else {
      const maxOrder = Math.max(...faqItems.map(f => f.display_order), 0);
      const { error } = await supabase
        .from("faq_items")
        .insert({ ...formData, display_order: maxOrder + 1 });

      if (error) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible d'ajouter la question",
        });
      } else {
        toast({
          title: "Question ajoutée",
          description: "La question FAQ a été créée avec succès",
        });
        setFormData({ question: "", answer: "", is_active: true });
        fetchFAQ();
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette question ?")) return;

    const { error } = await supabase
      .from("faq_items")
      .delete()
      .eq("id", id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer la question",
      });
    } else {
      toast({
        title: "Question supprimée",
        description: "La question a été supprimée avec succès",
      });
      fetchFAQ();
    }
  };

  const startEdit = (item: FAQItem) => {
    setEditingId(item.id);
    setFormData({
      question: item.question,
      answer: item.answer,
      is_active: item.is_active,
    });
  };

  if (loading) {
    return <div className="text-center py-8">Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-serif font-bold">Gestion de la FAQ</h2>

      {/* Formulaire */}
      <Card>
        <CardHeader>
          <CardTitle>{editingId ? "Modifier" : "Ajouter"} une question</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="question">Question</Label>
              <Input
                id="question"
                value={formData.question}
                onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                required
                placeholder="Ex: Quels sont vos horaires ?"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="answer">Réponse</Label>
              <Textarea
                id="answer"
                value={formData.answer}
                onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                required
                rows={4}
                placeholder="Réponse détaillée..."
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, is_active: checked })
                }
              />
              <Label htmlFor="is_active">Question active</Label>
            </div>

            <div className="flex gap-2">
              <Button type="submit">
                <Save className="mr-2 h-4 w-4" />
                {editingId ? "Mettre à jour" : "Ajouter"}
              </Button>
              {editingId && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEditingId(null);
                    setFormData({ question: "", answer: "", is_active: true });
                  }}
                >
                  Annuler
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Liste des questions */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Questions existantes</h3>
        {faqItems.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{item.question}</CardTitle>
                  <CardDescription>
                    {item.is_active ? "Active" : "Inactive"} • Position {item.display_order}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => startEdit(item)}
                  >
                    Modifier
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(item.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{item.answer}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FAQTab;
