import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Clock, BookOpen, Tag, MessageCircle, MessageSquare } from "lucide-react";

interface MetadataProps {
  type: string;
  metadata: Record<string, any>;
}

export function FeedItemMetadata({ type, metadata }: MetadataProps) {
  switch (type) {
    case "event":
      return (
        <>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {metadata.location}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {metadata.attendees} attending
            </span>
          </div>
        </>
      );

    case "torah-study":
      return (
        <>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {metadata.duration}
            </span>
          </div>
          <Badge variant="outline">{metadata.level}</Badge>
        </>
      );

    case "marketplace":
      return (
        <div className="flex items-center gap-2">
          <Tag className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {metadata.price}
          </span>
        </div>
      );

    case "discussion":
      return (
        <>
          <Badge variant="outline">{metadata.category}</Badge>
          <div className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {metadata.responses} responses
            </span>
          </div>
        </>
      );

    default:
      return null;
  }
}

export function getTypeIcon(type: string) {
  switch (type) {
    case "event":
      return <Calendar className="h-4 w-4" />;
    case "torah-study":
      return <BookOpen className="h-4 w-4" />;
    case "marketplace":
      return <Tag className="h-4 w-4" />;
    case "discussion":
      return <MessageSquare className="h-4 w-4" />;
    default:
      return null;
  }
}