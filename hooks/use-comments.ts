"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { useAuthContext } from "@/components/auth/auth-provider";
import type { Comment } from "@/lib/types";

export function useComments(feedItemId: string) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuthContext();
  const { toast } = useToast();

  const fetchComments = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("comments")
        .select(`
          *,
          author:profiles(id, full_name, avatar_url)
        `)
        .eq("feed_item_id", feedItemId)
        .eq("status", "active")
        .order("created_at", { ascending: true });

      if (error) throw error;

      // Organize comments into a tree structure
      const commentMap = new Map<string, Comment>();
      const rootComments: Comment[] = [];

      data?.forEach((comment) => {
        commentMap.set(comment.id, { ...comment, replies: [] });
      });

      data?.forEach((comment) => {
        if (comment.parent_id) {
          const parentComment = commentMap.get(comment.parent_id);
          if (parentComment) {
            parentComment.replies?.push(commentMap.get(comment.id)!);
          }
        } else {
          rootComments.push(commentMap.get(comment.id)!);
        }
      });

      setComments(rootComments);
    } catch (err) {
      console.error("Error fetching comments:", err);
      toast({
        title: "Error",
        description: "Failed to load comments",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createComment = async (content: string, parentId?: string) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be signed in to comment",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from("comments")
        .insert({
          feed_item_id: feedItemId,
          author_id: user.id,
          content,
          parent_id: parentId,
        })
        .select(`
          *,
          author:profiles(id, full_name, avatar_url)
        `)
        .single();

      if (error) throw error;

      if (!parentId) {
        setComments(prev => [...prev, { ...data, replies: [] }]);
      } else {
        await fetchComments(); // Refresh all comments to update the tree structure
      }

      toast({
        title: "Success",
        description: "Comment posted successfully",
      });
    } catch (err) {
      console.error("Error creating comment:", err);
      toast({
        title: "Error",
        description: "Failed to post comment",
        variant: "destructive",
      });
    }
  };

  const deleteComment = async (commentId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("comments")
        .update({ status: "deleted" })
        .eq("id", commentId)
        .eq("author_id", user.id);

      if (error) throw error;

      await fetchComments();

      toast({
        title: "Success",
        description: "Comment deleted successfully",
      });
    } catch (err) {
      console.error("Error deleting comment:", err);
      toast({
        title: "Error",
        description: "Failed to delete comment",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchComments();

    // Subscribe to real-time updates
    const channel = supabase
      .channel(`comments:${feedItemId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "comments",
          filter: `feed_item_id=eq.${feedItemId}`,
        },
        () => {
          fetchComments();
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [feedItemId]);

  return {
    comments,
    isLoading,
    createComment,
    deleteComment,
  };
}