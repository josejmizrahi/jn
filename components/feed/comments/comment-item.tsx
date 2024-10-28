"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CreateComment } from "./create-comment";
import { useComments } from "@/hooks/use-comments";
import { MessageCircle, MoreVertical, Flag, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthContext } from "@/components/auth/auth-provider";
import type { Comment } from "@/lib/types";

interface CommentItemProps {
  comment: Comment;
  feedItemId: string;
}

export function CommentItem({ comment, feedItemId }: CommentItemProps) {
  const [isReplying, setIsReplying] = useState(false);
  const { createComment, deleteComment } = useComments(feedItemId);
  const { user } = useAuthContext();

  const handleReply = async (content: string) => {
    await createComment(content, comment.id);
    setIsReplying(false);
  };

  const isAuthor = user?.id === comment.author_id;

  return (
    <div className="space-y-2">
      <div className="flex items-start gap-4">
        <Avatar className="h-8 w-8">
          <AvatarImage src={comment.author.avatar_url || ""} />
          <AvatarFallback>
            {comment.author.full_name?.split(" ").map((n) => n[0]).join("")}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-semibold text-sm">
                {comment.author.full_name}
              </span>
              <span className="text-xs text-muted-foreground ml-2">
                {formatDistanceToNow(new Date(comment.created_at))} ago
              </span>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {isAuthor && (
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={() => deleteComment(comment.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem>
                  <Flag className="h-4 w-4 mr-2" />
                  Report
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <p className="text-sm">{comment.content}</p>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-0 text-muted-foreground"
              onClick={() => setIsReplying(!isReplying)}
            >
              <MessageCircle className="h-4 w-4 mr-1" />
              Reply
            </Button>
          </div>
        </div>
      </div>

      {isReplying && (
        <div className="pl-12">
          <CreateComment
            onSubmit={handleReply}
            onCancel={() => setIsReplying(false)}
            placeholder="Write a reply..."
          />
        </div>
      )}

      {comment.replies?.length > 0 && (
        <div className="pl-12 space-y-4">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              feedItemId={feedItemId}
            />
          ))}
        </div>
      )}
    </div>
  );
}