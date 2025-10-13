import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category_id: string;
}

interface Category {
  id: string;
  name: string;
  display_order: number;
}

const MenuSection = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMenuData();
  }, []);

  const fetchMenuData = async () => {
    try {
      const [categoriesRes, itemsRes] = await Promise.all([
        supabase.from("menu_categories").select("*").order("display_order"),
        supabase.from("menu_items").select("*").order("display_order"),
      ]);

      if (categoriesRes.data) setCategories(categoriesRes.data);
      if (itemsRes.data) setMenuItems(itemsRes.data);
    } catch (error) {
      console.error("Error fetching menu:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section id="menu" className="py-20 px-4">
        <div className="container mx-auto">
          <Skeleton className="h-12 w-64 mx-auto mb-16" />
          <div className="grid gap-8">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-48 w-full" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="menu" className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto max-w-5xl">
        <h2 className="text-4xl md:text-5xl font-serif font-bold text-center mb-4 text-primary">
          Nos Menus
        </h2>
        <p className="text-center text-muted-foreground mb-6 text-lg max-w-2xl mx-auto">
          Découvrez notre sélection de plats raffinés, élaborés avec des produits frais et de saison. 
          Chaque création est le fruit d'un savoir-faire unique et d'une passion pour la gastronomie française.
        </p>
        <div className="text-center mb-16">
          <a href="/menu">
            <button className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:scale-105 transition-transform shadow-elegant">
              Notre menu complet
            </button>
          </a>
        </div>

        <div className="space-y-16">
          {categories.map((category) => {
            const items = menuItems.filter((item) => item.category_id === category.id);
            
            if (items.length === 0) return null;

            return (
              <div key={category.id}>
                <h3 className="text-3xl font-serif font-semibold text-primary mb-8 text-center">
                  {category.name}
                </h3>
                <div className="grid gap-6">
                  {items.map((item) => (
                    <Card 
                      key={item.id} 
                      className="overflow-hidden hover:shadow-elegant transition-all duration-300 hover:-translate-y-1"
                      style={{ background: "var(--gradient-card)" }}
                    >
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex-1">
                            <h4 className="text-xl font-serif font-semibold mb-2 text-foreground">
                              {item.name}
                            </h4>
                            {item.description && (
                              <p className="text-muted-foreground">
                                {item.description}
                              </p>
                            )}
                          </div>
                          <div className="text-2xl font-semibold text-primary whitespace-nowrap">
                            {item.price.toFixed(2)}€
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default MenuSection;
