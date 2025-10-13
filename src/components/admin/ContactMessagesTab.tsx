import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Mail, MailOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

const ContactMessagesTab = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (data) {
      setMessages(data);
    }
    setLoading(false);
  };

  const handleToggleRead = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from("contact_messages")
      .update({ is_read: !currentStatus })
      .eq("id", id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le statut",
      });
    } else {
      fetchMessages();
      toast({
        title: "Statut mis à jour",
        description: "Le message a été marqué comme " + (!currentStatus ? "lu" : "non lu"),
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce message ?")) return;

    const { error } = await supabase
      .from("contact_messages")
      .delete()
      .eq("id", id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer le message",
      });
    } else {
      fetchMessages();
      toast({
        title: "Message supprimé",
        description: "Le message a été supprimé avec succès",
      });
    }
  };

  if (loading) {
    return <div className="text-center py-8">Chargement...</div>;
  }

  const unreadMessages = messages.filter(m => !m.is_read);
  const readMessages = messages.filter(m => m.is_read);

  const renderMessages = (messageList: ContactMessage[]) => {
    if (messageList.length === 0) {
      return (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            Aucun message
          </CardContent>
        </Card>
      );
    }

    return messageList.map((message) => (
      <Card key={message.id} className={!message.is_read ? "border-primary" : ""}>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Checkbox
                  checked={message.is_read}
                  onCheckedChange={() => handleToggleRead(message.id, message.is_read)}
                />
                {message.is_read ? (
                  <MailOpen className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Mail className="h-4 w-4 text-primary" />
                )}
                <CardTitle className="text-lg">{message.subject}</CardTitle>
              </div>
              <CardDescription>
                De: {message.name} ({message.email})
                {message.phone && ` - ${message.phone}`}
                <br />
                Le {new Date(message.created_at).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDelete(message.id)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm whitespace-pre-wrap">{message.message}</p>
        </CardContent>
      </Card>
    ));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-serif font-bold">Messages de contact</h2>
        <span className="text-sm text-muted-foreground">
          {unreadMessages.length} non lu(s)
        </span>
      </div>

      <Tabs defaultValue="unread" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="unread">
            Non lus ({unreadMessages.length})
          </TabsTrigger>
          <TabsTrigger value="read">
            Lus ({readMessages.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="unread" className="space-y-4">
          {renderMessages(unreadMessages)}
        </TabsContent>

        <TabsContent value="read" className="space-y-4">
          {renderMessages(readMessages)}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContactMessagesTab;
