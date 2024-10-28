"use client";

// Previous imports remain the same...

export function FeedContent({ content }: FeedContentProps) {
  // Previous code remains the same...

  return (
    <Card>
      {/* Previous CardHeader and content sections remain the same... */}
      <CardContent>
        <div className="space-y-4">
          {/* Previous content sections remain the same... */}
          
          <div className="border-t pt-4">
            <CommentList feedItemId={content.id} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}