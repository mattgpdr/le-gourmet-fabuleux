import { useState, useEffect } from "react";
import { MessageCircle, X, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "./ui/scroll-area";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  display_order: number;
}

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [faqItems, setFaqItems] = useState<FAQItem[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetchFAQ();
  }, []);

  const fetchFAQ = async () => {
    const { data } = await supabase
      .from("faq_items")
      .select("*")
      .eq("is_active", true)
      .order("display_order");
    
    if (data) {
      setFaqItems(data);
    }
  };

  return (
    <>
      {/* Logo/Bouton fixe en bas à droite */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-elegant z-50"
        size="icon"
        aria-label="Ouvrir le chat FAQ"
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <MessageCircle className="h-6 w-6" />
        )}
      </Button>

      {/* Mini fenêtre de chat */}
      {isOpen && (
        <Card className="fixed bottom-28 right-6 w-80 md:w-96 shadow-elegant z-50 animate-scale-in">
          <div className="bg-primary text-primary-foreground p-4 rounded-t-lg">
            <h3 className="font-serif text-lg font-bold">
              Questions fréquentes
            </h3>
            <p className="text-sm opacity-90">
              Comment pouvons-nous vous aider ?
            </p>
          </div>
          
          <ScrollArea className="h-96 p-4">
            <div className="space-y-3">
              {faqItems.map((item) => (
                <div
                  key={item.id}
                  className="border rounded-lg overflow-hidden transition-all"
                >
                  <button
                    onClick={() =>
                      setExpandedId(expandedId === item.id ? null : item.id)
                    }
                    className="w-full p-3 flex items-center justify-between hover:bg-muted/50 transition-colors text-left"
                  >
                    <span className="font-medium text-sm">{item.question}</span>
                    {expandedId === item.id ? (
                      <ChevronUp className="h-4 w-4 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="h-4 w-4 flex-shrink-0" />
                    )}
                  </button>
                  
                  {expandedId === item.id && (
                    <div className="p-3 pt-0 text-sm text-muted-foreground animate-accordion-down">
                      {item.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </Card>
      )}
    </>
  );
};

export default ChatWidget;
