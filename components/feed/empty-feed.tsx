import { Card, CardContent } from "@/components/ui/card";
import { FileX } from "lucide-react";

export function EmptyFeed() {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-8 text-center">
        <FileX className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Content Found</h3>
        <p className="text-muted-foreground">
          There are no posts matching your criteria. Try adjusting your filters or create a new post.
        </p>
      </CardContent>
    </Card>
  );
}