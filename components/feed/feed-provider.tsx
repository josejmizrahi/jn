"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import type { FeedItem } from "@/lib/feed";

interface FeedContextType {
  items: FeedItem[];
  isLoading: boolean;
  error: Error | null;
  fetchFeed: () => Promise<void>;
  createItem: (item: Partial<FeedItem>) => Promise<void>;
  toggleLike: (itemId: string, isLiked: boolean) => Promise<void>;
}

const FeedContext = createContext<FeedContextType>({
  items: [],
  isLoading: false,
  error: null,
  fetchFeed: async () => {},
  createItem: async () => {},
  toggleLike: async () => {},
});

export function FeedProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<FeedItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const fetchFeed = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from("feed_items")
        .select(`
          *,
          author:profiles(id, full_name, avatar_url),
          engagements(type, user_id)
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      // Process the data to include engagement counts
      const processedData = data?.map(item => ({
        ...item,
        engagement: {
          likes: item.engagements?.filter(e => e.type === 'like').length || 0,
          comments: 0, // We'll implement this later
          shares: item.engagements?.filter(e => e.type === 'share').length || 0,
        }
      }));

      setItems(processedData || []);
    } catch (err) {
      console.error("Error fetching feed:", err);
      setError(err as Error);
      toast({
        title: "Error",
        description: "Failed to load feed items",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const createItem = async (item: Partial<FeedItem>) => {
    try {
      const { data, error: createError } = await supabase
        .from("feed_items")
        .insert([item])
        .select(`
          *,
          author:profiles(id, full_name, avatar_url),
          engagements(type, user_id)
        `)
        .single();

      if (createError) throw createError;

      // Add the new item to the state
      setItems(prev => [
        {
          ...data,
          engagement: {
            likes: 0,
            comments: 0,
            shares: 0,
          }
        },
        ...prev
      ]);

      return data;
    } catch (err) {
      console.error("Error creating item:", err);
      throw err;
    }
  };

  const toggleLike = async (itemId: string, isLiked: boolean) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      if (isLiked) {
        await supabase
          .from("engagements")
          .delete()
          .match({ feed_item_id: itemId, user_id: user.id, type: "like" });
      } else {
        await supabase
          .from("engagements")
          .insert({ feed_item_id: itemId, user_id: user.id, type: "like" });
      }

      // Update the local state
      setItems(prev => prev.map(item => {
        if (item.id === itemId) {
          return {
            ...item,
            engagement: {
              ...item.engagement,
              likes: item.engagement.likes + (isLiked ? -1 : 1),
            }
          };
        }
        return item;
      }));
    } catch (err) {
      console.error("Error toggling like:", err);
      toast({
        title: "Error",
        description: "Failed to update like",
        variant: "destructive",
      });
      throw err;
    }
  };

  return (
    <FeedContext.Provider
      value={{
        items,
        isLoading,
        error,
        fetchFeed,
        createItem,
        toggleLike,
      }}
    >
      {children}
    </FeedContext.Provider>
  );
}

export const useFeedContext = () => useContext(FeedContext);