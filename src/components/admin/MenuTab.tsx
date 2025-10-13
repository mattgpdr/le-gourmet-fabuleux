import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Upload } from "lucide-react";

interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  detailed_description?: string | null;
  image_url?: string | null;
  price: number;
  category_id: string;
}

interface Category {
  id: string;
  name: string;
}

const MenuTab = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    detailed_description: "",
    price: "",
    category_id: "",
    image_url: "",
  });
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [categoriesRes, itemsRes] = await Promise.all([
      supabase.from("menu_categories").select("*").order("display_order"),
      supabase.from("menu_items").select("*").order("display_order"),
    ]);

    if (categoriesRes.data) setCategories(categoriesRes.data);
    if (itemsRes.data) setMenuItems(itemsRes.data);
  };

  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    const fileExt = file.name.split(".").pop();
    const fileName = `menu-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("gallery")
      .upload(fileName, file);

    if (uploadError) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de télécharger l'image",
      });
      setUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from("gallery")
      .getPublicUrl(fileName);

    setFormData(prev => ({ ...prev, image_url: publicUrl }));
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const itemData = {
      name: formData.name,
      description: formData.description,
      detailed_description: formData.detailed_description || null,
      image_url: formData.image_url || null,
      price: parseFloat(formData.price),
      category_id: formData.category_id,
    };

    if (editingId) {
      const { error } = await supabase
        .from("menu_items")
        .update(itemData)
        .eq("id", editingId);

      if (error) {
        toast({
          title: "Erreur",
          description: "Impossible de modifier l'élément",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Succès",
          description: "Élément modifié avec succès",
        });
      }
    } else {
      const { error } = await supabase.from("menu_items").insert(itemData);

      if (error) {
        toast({
          title: "Erreur",
          description: "Impossible d'ajouter l'élément",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Succès",
          description: "Élément ajouté avec succès",
        });
      }
    }

    setFormData({
      name: "",
      description: "",
      detailed_description: "",
      price: "",
      category_id: "",
      image_url: "",
    });
    setEditingId(null);
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet élément ?")) return;

    const { error } = await supabase.from("menu_items").delete().eq("id", id);

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'élément",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Succès",
        description: "Élément supprimé avec succès",
      });
      fetchData();
    }
  };

  const startEdit = (item: MenuItem) => {
    setEditingId(item.id);
    setFormData({
      name: item.name,
      description: item.description || "",
      detailed_description: item.detailed_description || "",
      price: item.price.toString(),
      category_id: item.category_id,
      image_url: item.image_url || "",
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-serif font-bold">Gestion du menu</h2>

      <Card>
        <CardHeader>
          <CardTitle>{editingId ? "Modifier" : "Ajouter"} un plat</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Nom du plat *</Label>
              <Input
                placeholder="Ex: Boeuf Bourguignon"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div>
              <Label>Description courte</Label>
              <Input
                placeholder="Une brève description du plat"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div>
              <Label>Description détaillée</Label>
              <Textarea
                className="min-h-[100px]"
                placeholder="Description complète avec ingrédients, accompagnements, etc."
                value={formData.detailed_description}
                onChange={(e) => setFormData({ ...formData, detailed_description: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="menu-image">Image du plat</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="menu-image"
                  type="file"
                  accept="image/*"
                  onChange={handleUploadImage}
                  disabled={uploading}
                />
                <Button type="button" disabled={uploading} size="icon" variant="outline">
                  <Upload className="h-4 w-4" />
                </Button>
              </div>
              {formData.image_url && (
                <div className="mt-2">
                  <img
                    src={formData.image_url}
                    alt="Preview"
                    className="h-32 w-32 object-cover rounded border"
                  />
                </div>
              )}
            </div>

            <div>
              <Label>Prix (€) *</Label>
              <Input
                type="number"
                step="0.01"
                placeholder="25.00"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
              />
            </div>

            <div>
              <Label>Catégorie *</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={formData.category_id}
                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                required
              >
                <option value="">Sélectionner une catégorie</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-2">
              <Button type="submit" className="flex-1">
                <Plus className="h-4 w-4 mr-2" />
                {editingId ? "Mettre à jour" : "Ajouter"}
              </Button>
              {editingId && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEditingId(null);
                    setFormData({
                      name: "",
                      description: "",
                      detailed_description: "",
                      price: "",
                      category_id: "",
                      image_url: "",
                    });
                  }}
                >
                  Annuler
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {categories.map((category) => {
          const items = menuItems.filter((item) => item.category_id === category.id);
          if (items.length === 0) return null;

          return (
            <Card key={category.id}>
              <CardHeader>
                <CardTitle>{category.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start justify-between p-3 border rounded-lg hover:bg-muted/50"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{item.name}</h4>
                          <span className="text-primary font-semibold">
                            {item.price.toFixed(2)}€
                          </span>
                        </div>
                        {item.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {item.description}
                          </p>
                        )}
                        {item.image_url && (
                          <img
                            src={item.image_url}
                            alt={item.name}
                            className="h-16 w-16 object-cover rounded mt-2"
                          />
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => startEdit(item)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default MenuTab;