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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
      <main className="pt-20 md:pt-24 pb-12 md:pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-6 md:mb-8">
            <Link to="/">
              <Button variant="ghost" size="sm" className="mb-3 md:mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour à l'accueil
              </Button>
            </Link>
            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-3 md:mb-4">
              Notre Menu
            </h1>
            <p className="text-sm md:text-base text-center text-muted-foreground max-w-2xl mx-auto px-2">
              Découvrez notre sélection de plats raffinés, préparés avec passion
              par notre chef et son équipe.
            </p>
          </div>

          {/* Menu Items by Category with Tabs */}
          {loading ? (
            <div className="space-y-8">
              {[1, 2, 3].map((i) => (
                <div key={i}>
                  <Skeleton className="h-8 w-48 mb-4" />
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3].map((j) => (
                      <Skeleton key={j} className="h-64" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Tabs defaultValue={categories[0]?.id} className="w-full">
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8">
                {categories.map((category) => (
                  <TabsTrigger key={category.id} value={category.id}>
                    {category.name}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {categories.map((category) => {
                const items = menuItems.filter(
                  (item) => item.category_id === category.id
                );
                
                if (items.length === 0) return null;

                return (
                  <TabsContent key={category.id} value={category.id} className="mt-6">
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {items.map((item) => (
                        <Card 
                          key={item.id} 
                          className="overflow-hidden hover-scale cursor-pointer transition-all hover:shadow-lg active:scale-95 group"
                          onClick={() => setSelectedItem(item)}
                        >
                          {item.image_url && (
                            <div className="relative aspect-[4/3] overflow-hidden">
                              <img
                                src={item.image_url}
                                alt={item.name}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                              />
                              <div className="absolute top-3 right-3 bg-background/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-md">
                                <span className="text-primary font-bold text-lg">
                                  {item.price.toFixed(2)} €
                                </span>
                              </div>
                            </div>
                          )}
                          <CardHeader className="p-4">
                            <div className="flex justify-between items-start gap-2">
                              <CardTitle className="text-lg leading-tight">{item.name}</CardTitle>
                              {!item.image_url && (
                                <span className="text-primary font-bold text-lg flex-shrink-0">
                                  {item.price.toFixed(2)} €
                                </span>
                              )}
                            </div>
                            {item.description && (
                              <CardDescription className="text-sm mt-2 line-clamp-2">
                                {item.description}
                              </CardDescription>
                            )}
                          </CardHeader>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                );
              })}
            </Tabs>
          )}

          {/* CTA Réserver */}
          <div className="text-center mt-12 md:mt-16">
            <Link to="/reservation">
              <Button size="lg" className="text-base md:text-lg px-6 md:px-8 w-full sm:w-auto">
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
