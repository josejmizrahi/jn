"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthContext } from "@/components/auth/auth-provider";

interface CreateCommentProps {
  onSubmit: (content: string) => Promise<void>;
  onCancel?: () => void;
  placeholder?: string;
}

export function CreateComment({
  onSubmit,
  onCancel,
  placeholder = "Write a comment..."
}: CreateCommentProps) {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuthContext();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      await onSubmit(content);
      setContent("");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <p className="text-sm text-muted-foreground text-center">
        Please sign in to comment
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-4">
        <Avatar className="h-8 w-8">
          <AvatarImage src={user.user_metadata.avatar_url} />
          <AvatarFallback>
            {user.user_metadata.full_name?.split(" ").map((n: string) => n[0]).join("")}
          </AvatarFallback>
        </Avatar>
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={placeholder}
          className="flex-1"
          rows={1}
        />
      </div>
      {content.trim() && (
        <div className="flex justify-end gap-2">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Posting..." : "Post Comment"}
          </Button>
        </div>
      )}
    </form>
  );
}