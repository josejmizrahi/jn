"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { useAuthContext } from "@/components/auth/auth-provider";

export type FeedItem = {
  id: string;
  created_at: string;
  author_id: string;
  type: string;
  title: string;
  content: string;
  metadata: any;
  image_url: string | null;
  author: {
    full_name: string;
    avatar_url: string;
  };
  engagement: {
    likes: number;
    comments: number;
  };
};

export function useFeed() {
  const [items, setItems] = useState<FeedItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthContext();
  const { toast } = useToast();

  const fetchFeed = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data: feedItems, error: feedError } = await supabase
        .from("feed_items")
        .select(`
          *,
          author:profiles(id, full_name, avatar_url),
          engagement:engagements(type, user_id)
        `)
        .order("created_at", { ascending: false });

      if (feedError) throw feedError;

      const processedItems = feedItems.map((item) => ({
        ...item,
        engagement: {
          likes: item.engagement?.filter((e: any) => e.type === "like").length || 0,
          comments: item.engagement?.filter((e: any) => e.type === "comment").length || 0,
        },
      }));

      setItems(processedItems);
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error",
        description: "Failed to load feed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createPost = async (data: {
    type: string;
    title: string;
    content: string;
    metadata?: any;
    image_url?: string;
  }) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be signed in to post",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: newPost, error } = await supabase
        .from("feed_items")
        .insert({
          ...data,
          author_id: user.id,
        })
        .select(`
          *,
          author:profiles(id, full_name, avatar_url)
        `)
        .single();

      if (error) throw error;

      setItems((prev) => [
        {
          ...newPost,
          engagement: { likes: 0, comments: 0 },
        },
        ...prev,
      ]);

      toast({
        title: "Success",
        description: "Post created successfully",
      });

      return newPost;
    } catch (err: any) {
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      });
      throw err;
    }
  };

  const toggleLike = async (itemId: string) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be signed in to like posts",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: existingLike } = await supabase
        .from("engagements")
        .select()
        .eq("feed_item_id", itemId)
        .eq("user_id", user.id)
        .eq("type", "like")
        .single();

      if (existingLike) {
        await supabase
          .from("engagements")
          .delete()
          .eq("id", existingLike.id);

        setItems((prev) =>
          prev.map((item) =>
            item.id === itemId
              ? {
                  ...item,
                  engagement: {
                    ...item.engagement,
                    likes: item.engagement.likes - 1,
                  },
                }
              : item
          )
        );
      } else {
        await supabase.from("engagements").insert({
          feed_item_id: itemId,
          user_id: user.id,
          type: "like",
        });

        setItems((prev) =>
          prev.map((item) =>
            item.id === itemId
              ? {
                  ...item,
                  engagement: {
                    ...item.engagement,
                    likes: item.engagement.likes + 1,
                  },
                }
              : item
          )
        );
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: "Failed to update like. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchFeed();

    // Subscribe to real-time updates
    const channel = supabase
      .channel("feed_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "feed_items",
        },
        () => {
          fetchFeed();
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  return {
    items,
    isLoading,
    error,
    createPost,
    toggleLike,
    refresh: fetchFeed,
  };
}