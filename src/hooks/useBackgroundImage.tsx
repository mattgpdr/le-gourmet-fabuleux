import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useBackgroundImage = () => {
  const [backgroundImageUrl, setBackgroundImageUrl] = useState<string>("");

  useEffect(() => {
    const fetchBackgroundImage = async () => {
      const { data } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "background_image_url")
        .single();

      if (data?.value) {
        setBackgroundImageUrl(data.value);
      }
    };

    fetchBackgroundImage();

    // Subscribe to changes
    const channel = supabase
      .channel("background_image_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "site_settings",
          filter: "key=eq.background_image_url",
        },
        (payload) => {
          if (payload.new && "value" in payload.new) {
            setBackgroundImageUrl(payload.new.value as string);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return backgroundImageUrl;
};
