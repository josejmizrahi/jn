import { Feed } from "@/components/feed/feed";

export default function FeedPage() {
  return (
    <div className="container py-12">
      <div className="space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold">Community Feed</h1>
          <p className="text-xl text-muted-foreground">
            Stay updated with the latest posts, events, and discussions
          </p>
        </div>
        <Feed />
      </div>
    </div>
  );
}