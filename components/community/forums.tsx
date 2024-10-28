"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Users, Clock } from "lucide-react";

const FORUMS = [
  {
    id: 1,
    title: "General Discussion",
    description: "Open discussions about Jewish life, culture, and current events",
    topics: 156,
    posts: 1243,
    lastActive: "5 minutes ago",
    categories: ["General", "Culture"],
  },
  {
    id: 2,
    title: "Ask the Rabbi",
    description: "Questions and answers about Jewish law and practice",
    topics: 89,
    posts: 567,
    lastActive: "1 hour ago",
    categories: ["Halacha", "Q&A"],
  },
  {
    id: 3,
    title: "Community Events",
    description: "Discussions about upcoming events and gatherings",
    topics: 45,
    posts: 234,
    lastActive: "2 hours ago",
    categories: ["Events", "Social"],
  },
];

export function Forums() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Discussion Forums</h2>
        <Button>Create New Topic</Button>
      </div>

      {FORUMS.map((forum) => (
        <Card key={forum.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{forum.title}</CardTitle>
                <CardDescription>{forum.description}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4 mb-4">
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {forum.topics} topics
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {forum.posts} posts
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Last active {forum.lastActive}
                </span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {forum.categories.map((category) => (
                <Badge key={category} variant="secondary">
                  {category}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}