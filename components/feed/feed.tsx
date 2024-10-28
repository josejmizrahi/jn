"use client";

import { useEffect, useState } from "react";
import { FeedItem as FeedItemType } from "@/lib/types";
import { FeedFilters } from "./feed-filters";
import { FeedItem } from "./feed-item";
import { CreatePostDialog } from "./create-post-dialog";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

export function Feed() {
  const [items, setItems] = useState<FeedItemType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [contentType, setContentType] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const { toast } = useToast();

  useEffect(() => {
    fetchFeedItems();

    // Subscribe to new posts
    const channel = supabase
      .channel("feed_changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "feed_items",
        },
        (payload) => {
          setItems((current) => [payload.new as FeedItemType, ...current]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchFeedItems = async () => {
    try {
      const { data, error } = await supabase
        .from("feed_items")
        .select(`
          *,
          author:profiles(id, full_name, avatar_url)
        `)
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setItems(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load feed items",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredItems = items.filter((item) => {
    if (contentType !== "all" && item.type !== contentType) {
      return false;
    }
    
    const searchContent = `${item.title} ${item.content}`.toLowerCase();
    return searchContent.includes(searchQuery.toLowerCase());
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case "recent":
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      default:
        return 0;
    }
  });

  return (
    <div className="space-y-6">
      <FeedFilters
        searchQuery={searchQuery}
        contentType={contentType}
        sortBy={sortBy}
        onSearchChange={setSearchQuery}
        onContentTypeChange={setContentType}
        onSortChange={setSortBy}
      />

      <CreatePostDialog />

      <div className="space-y-6">
        {isLoading ? (
          <div>Loading...</div>
        ) : sortedItems.length === 0 ? (
          <div className="text-center text-muted-foreground">
            No posts found. Be the first to create one!
          </div>
        ) : (
          sortedItems.map((item) => (
            <FeedItem key={item.id} item={item} />
          ))
        )}
      </div>
    </div>
  );
}