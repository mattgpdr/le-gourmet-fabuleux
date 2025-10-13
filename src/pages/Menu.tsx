import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MenuItemDialog from "@/components/MenuItemDialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  detailed_description: string | null;
  price: number;
  category_id: string;
  image_url: string | null;
}

interface Category {
  id: string;
  name: string;
  display_order: number;
}

const Menu = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    fetchMenuData();
  }, []);

  const fetchMenuData = async () => {
    try {
      const [categoriesRes, itemsRes] = await Promise.all([
        supabase.from("menu_categories").select("*").order("display_order"),
        supabase.from("menu_items").select("*").eq("available", true),
      ]);

      if (categoriesRes.data) setCategories(categoriesRes.data);
      if (itemsRes.data) setMenuItems(itemsRes.data);
    } catch (error) {
      console.error("Error fetching menu:", error);
    } finally {
      setLoading(false);
    }
  };

  const scrollToReservation = () => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <Link to="/">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour à l'accueil
              </Button>
            </Link>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-center mb-4">
              Notre Menu
            </h1>
            <p className="text-center text-muted-foreground max-w-2xl mx-auto">
              Découvrez notre sélection de plats raffinés, préparés avec passion
              par notre chef et son équipe.
            </p>
          </div>

          {/* Menu Items by Category */}
          {loading ? (
            <div className="space-y-8">
              {[1, 2, 3].map((i) => (
                <div key={i}>
                  <Skeleton className="h-8 w-48 mb-4" />
                  <div className="grid md:grid-cols-2 gap-4">
                    {[1, 2].map((j) => (
                      <Skeleton key={j} className="h-32" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-12">
              {categories.map((category) => {
                const items = menuItems.filter(
                  (item) => item.category_id === category.id
                );
                
                if (items.length === 0) return null;

                return (
                  <div key={category.id}>
                    <h2 className="font-serif text-3xl font-bold mb-6 text-primary">
                      {category.name}
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6">
                      {items.map((item) => (
                        <Card 
                          key={item.id} 
                          className="hover-scale cursor-pointer transition-all hover:shadow-lg"
                          onClick={() => setSelectedItem(item)}
                        >
                          <CardHeader>
                            <div className="flex justify-between items-start">
                              <CardTitle className="text-xl">{item.name}</CardTitle>
                              <span className="text-primary font-bold text-lg">
                                {item.price.toFixed(2)} €
                              </span>
                            </div>
                            {item.description && (
                              <CardDescription>{item.description}</CardDescription>
                            )}
                          </CardHeader>
                        </Card>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* CTA Réserver */}
          <div className="text-center mt-16">
            <Link to="/reservation">
              <Button size="lg" className="text-lg px-8">
                Réserver une table
              </Button>
            </Link>
          </div>
        </div>
      </main>
      
      <Footer />
      
      <MenuItemDialog 
        item={selectedItem}
        open={!!selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </div>
  );
};

export default Menu;
