import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LogOut, Menu, Users, ImageIcon, MessageSquare, ArrowLeft, Mail, Settings, HelpCircle, Clock } from "lucide-react";
import MenuTab from "@/components/admin/MenuTab";
import ReservationsTab from "@/components/admin/ReservationsTab";
import GalleryTab from "@/components/admin/GalleryTab";
import ReviewsTab from "@/components/admin/ReviewsTab";
import ContactMessagesTab from "@/components/admin/ContactMessagesTab";
import SiteSettingsTab from "@/components/admin/SiteSettingsTab";
import FAQTab from "@/components/admin/FAQTab";
import OpeningHoursTab from "@/components/admin/OpeningHoursTab";

const Admin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [unviewedReservations, setUnviewedReservations] = useState(0);
  const [newReviews, setNewReviews] = useState(0);
  const [activeTab, setActiveTab] = useState("menu");
  const [notifications, setNotifications] = useState<{
    messages: boolean;
    reservations: boolean;
    reviews: boolean;
  }>({
    messages: false,
    reservations: false,
    reviews: false,
  });

  useEffect(() => {
    checkAuth();
    fetchNotifications();
    
    // Load notifications from localStorage
    const savedNotifications = localStorage.getItem('admin_notifications');
    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications));
    }

    // Set up realtime subscriptions
    const messagesChannel = supabase
      .channel('contact_messages_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'contact_messages'
        },
        () => {
          fetchNotifications();
          setNotifications(prev => {
            const updated = { ...prev, messages: true };
            localStorage.setItem('admin_notifications', JSON.stringify(updated));
            return updated;
          });
        }
      )
      .subscribe();

    const reservationsChannel = supabase
      .channel('reservations_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'reservations'
        },
        () => {
          fetchNotifications();
          setNotifications(prev => {
            const updated = { ...prev, reservations: true };
            localStorage.setItem('admin_notifications', JSON.stringify(updated));
            return updated;
          });
        }
      )
      .subscribe();

    const reviewsChannel = supabase
      .channel('reviews_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'reviews'
        },
        () => {
          fetchNotifications();
          setNotifications(prev => {
            const updated = { ...prev, reviews: true };
            localStorage.setItem('admin_notifications', JSON.stringify(updated));
            return updated;
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(messagesChannel);
      supabase.removeChannel(reservationsChannel);
      supabase.removeChannel(reviewsChannel);
    };
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate("/auth");
      return;
    }

    // Use server-side function to securely verify admin status
    const { data: hasAdminRole, error } = await supabase.rpc("is_admin");

    if (error || !hasAdminRole) {
      navigate("/");
      return;
    }

    setIsAdmin(true);
    setLoading(false);
  };

  const fetchNotifications = async () => {
    const { data: messages } = await supabase
      .from("contact_messages")
      .select("id", { count: "exact" })
      .eq("is_read", false);
    
    const { data: reservations } = await supabase
      .from("reservations")
      .select("id", { count: "exact" })
      .eq("is_viewed", false);
    
    const { data: reviews } = await supabase
      .from("reviews")
      .select("id", { count: "exact" })
      .eq("is_confirmed", false);
    
    setUnreadMessages(messages?.length || 0);
    setUnviewedReservations(reservations?.length || 0);
    setNewReviews(reviews?.length || 0);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    // Clear notification for the clicked tab
    if (value === "messages" || value === "reservations" || value === "reviews") {
      setNotifications(prev => {
        const updated = { ...prev, [value]: false };
        localStorage.setItem('admin_notifications', JSON.stringify(updated));
        return updated;
      });
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Chargement...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
              <ArrowLeft className="h-5 w-5" />
              <span className="text-xl font-serif font-bold">Administration</span>
            </Link>
            <Button onClick={handleLogout} variant="outline" size="sm">
              <LogOut className="h-4 w-4 mr-2" />
              Déconnexion
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 pt-24 pb-12">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 max-w-6xl mx-auto mb-8">
            <TabsTrigger value="menu">
              <Menu className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Menu</span>
            </TabsTrigger>
            <TabsTrigger value="reservations" className="relative">
              <Users className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Réservations</span>
              {(unviewedReservations > 0 || notifications.reservations) && (
                <>
                  {notifications.reservations && (
                    <span className="absolute -top-1 -right-1 h-3 w-3 bg-destructive rounded-full animate-pulse" />
                  )}
                  {unviewedReservations > 0 && (
                    <Badge className="ml-2 h-5 w-5 p-0 flex items-center justify-center" variant="destructive">
                      {unviewedReservations}
                    </Badge>
                  )}
                </>
              )}
            </TabsTrigger>
            <TabsTrigger value="gallery">
              <ImageIcon className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Galerie</span>
            </TabsTrigger>
            <TabsTrigger value="reviews" className="relative">
              <MessageSquare className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Avis</span>
              {(newReviews > 0 || notifications.reviews) && (
                <>
                  {notifications.reviews && (
                    <span className="absolute -top-1 -right-1 h-3 w-3 bg-destructive rounded-full animate-pulse" />
                  )}
                  {newReviews > 0 && (
                    <Badge className="ml-2 h-5 w-5 p-0 flex items-center justify-center" variant="destructive">
                      {newReviews}
                    </Badge>
                  )}
                </>
              )}
            </TabsTrigger>
            <TabsTrigger value="messages" className="relative">
              <Mail className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Messages</span>
              {(unreadMessages > 0 || notifications.messages) && (
                <>
                  {notifications.messages && (
                    <span className="absolute -top-1 -right-1 h-3 w-3 bg-destructive rounded-full animate-pulse" />
                  )}
                  {unreadMessages > 0 && (
                    <Badge className="ml-2 h-5 w-5 p-0 flex items-center justify-center" variant="destructive">
                      {unreadMessages}
                    </Badge>
                  )}
                </>
              )}
            </TabsTrigger>
            <TabsTrigger value="hours">
              <Clock className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Horaires</span>
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Paramètres</span>
            </TabsTrigger>
            <TabsTrigger value="faq">
              <HelpCircle className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">FAQ</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="menu">
            <MenuTab />
          </TabsContent>

          <TabsContent value="reservations">
            <ReservationsTab />
          </TabsContent>

          <TabsContent value="gallery">
            <GalleryTab />
          </TabsContent>

          <TabsContent value="reviews">
            <ReviewsTab />
          </TabsContent>

          <TabsContent value="messages">
            <ContactMessagesTab />
          </TabsContent>

          <TabsContent value="hours">
            <OpeningHoursTab />
          </TabsContent>

          <TabsContent value="settings">
            <SiteSettingsTab />
          </TabsContent>

          <TabsContent value="faq">
            <FAQTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
