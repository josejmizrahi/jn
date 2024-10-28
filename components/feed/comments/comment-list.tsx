"use client";

import { useState } from "react";
import { useComments } from "@/hooks/use-comments";
import { CreateComment } from "./create-comment";
import { CommentItem } from "./comment-item";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

interface CommentListProps {
  feedItemId: string;
}

export function CommentList({ feedItemId }: CommentListProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { comments, isLoading, createComment } = useComments(feedItemId);

  if (!isExpanded) {
    return (
      <Button
        variant="ghost"
        className="w-full justify-center"
        onClick={() => setIsExpanded(true)}
      >
        <MessageCircle className="h-4 w-4 mr-2" />
        View Comments ({comments.length})
      </Button>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-4">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <CreateComment onSubmit={(content) => createComment(content)} />
      
      <div className="space-y-6">
        {comments.map((comment) => (
          <CommentItem 
            key={comment.id} 
            comment={comment}
            feedItemId={feedItemId}
          />
        ))}
        
        {comments.length === 0 && (
          <p className="text-center text-sm text-muted-foreground">
            No comments yet. Be the first to comment!
          </p>
        )}
      </div>
    </div>
  );
}