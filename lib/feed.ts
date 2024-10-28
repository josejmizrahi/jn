export interface FeedItem {
  id: string;
  created_at: string;
  updated_at: string;
  author_id: string;
  type: string;
  title: string;
  description: string;
  metadata: Record<string, any>;
  media_urls?: string[];
  author?: {
    id: string;
    full_name: string;
    avatar_url: string;
  };
  engagement?: {
    likes: number;
    comments: number;
    shares: number;
  };
}