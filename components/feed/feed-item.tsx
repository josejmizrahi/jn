"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import { FeedItem as FeedItemType } from "@/lib/types";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/components/ui/use-toast";

interface FeedItemProps {
  item: FeedItemType;
}

export function FeedItem({ item }: FeedItemProps) {
  const [liked, setLiked] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleLike = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to like posts",
        variant: "destructive",
      });
      return;
    }

    try {
      if (liked) {
        await supabase
          .from("engagements")
          .delete()
          .match({ user_id: user.id, feed_item_id: item.id, type: "like" });
      } else {
        await supabase.from("engagements").insert({
          user_id: user.id,
          feed_item_id: item.id,
          type: "like",
        });
      }
      setLiked(!liked);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update like status",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src={item.author?.avatar_url || ""} />
              <AvatarFallback>
                {item.author?.full_name?.split(" ").map((n) => n[0]).join("") ||
                  "??"}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-semibold">{item.author?.full_name}</div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>
                  {formatDistanceToNow(new Date(item.created_at), {
                    addSuffix: true,
                  })}
                </span>
                <span>•</span>
                <Badge variant="outline" className="capitalize">
                  {item.type}
                </Badge>
                {item.category && (
                  <>
                    <span>•</span>
                    <Badge variant="secondary" className="capitalize">
                      {item.category}
                    </Badge>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
            <p className="text-muted-foreground">{item.content}</p>
          </div>

          {item.media_urls && item.media_urls.length > 0 && (
            <div className="relative aspect-video rounded-lg overflow-hidden">
              <img
                src={item.media_urls[0]}
                alt={item.title}
                className="object-cover w-full h-full"
              />
            </div>
          )}

          <div className="flex items-center gap-4 pt-4 border-t">
            <Button
              variant="ghost"
              size="sm"
              className={`gap-2 ${liked ? "text-primary" : ""}`}
              onClick={handleLike}
            >
              <Heart className="h-4 w-4" fill={liked ? "currentColor" : "none"} />
              Like
            </Button>
            <Button variant="ghost" size="sm" className="gap-2">
              <MessageCircle className="h-4 w-4" />
              Comment
            </Button>
            <Button variant="ghost" size="sm" className="gap-2">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}