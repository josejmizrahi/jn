"use client";

import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Share2 } from "lucide-react";

interface EngagementProps {
  engagement: {
    likes: number;
    comments: number;
    shares: number;
  };
  liked: boolean;
  onLike: () => void;
}

export function FeedItemEngagement({ engagement, liked, onLike }: EngagementProps) {
  return (
    <div className="flex items-center justify-between pt-4 border-t">
      <div className="flex gap-4">
        <Button
          variant="ghost"
          size="sm"
          className={`gap-2 ${liked ? "text-primary" : ""}`}
          onClick={onLike}
        >
          <Heart className="h-4 w-4" fill={liked ? "currentColor" : "none"} />
          {engagement.likes}
        </Button>
        <Button variant="ghost" size="sm" className="gap-2">
          <MessageCircle className="h-4 w-4" />
          {engagement.comments}
        </Button>
        <Button variant="ghost" size="sm" className="gap-2">
          <Share2 className="h-4 w-4" />
          {engagement.shares}
        </Button>
      </div>
    </div>
  );
}