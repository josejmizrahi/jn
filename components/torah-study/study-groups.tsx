"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Calendar, MessageSquare } from "lucide-react";

const GROUPS = [
  {
    id: 1,
    name: "Daily Daf Yomi",
    description: "Join our daily Talmud study group following the Daf Yomi cycle",
    members: 45,
    meetingTime: "Daily at 7:00 AM",
    topics: ["Talmud", "Daf Yomi"],
    lastActive: "2 hours ago",
  },
  {
    id: 2,
    name: "Parasha Discussion",
    description: "Weekly discussion group focusing on the upcoming Torah portion",
    members: 128,
    meetingTime: "Thursdays at 8:00 PM",
    topics: ["Torah", "Parasha"],
    lastActive: "1 day ago",
  },
  {
    id: 3,
    name: "Mussar Study Circle",
    description: "Character development through Jewish ethical teachings",
    members: 32,
    meetingTime: "Sundays at 10:00 AM",
    topics: ["Mussar", "Ethics"],
    lastActive: "3 days ago",
  },
];

export function StudyGroups() {
  return (
    <div className="space-y-6">
      {GROUPS.map((group) => (
        <Card key={group.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{group.name}</CardTitle>
                <CardDescription>{group.description}</CardDescription>
              </div>
              <Button>Join Group</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {group.members} members
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {group.meetingTime}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Last active {group.lastActive}
                </span>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {group.topics.map((topic) => (
                <Badge key={topic} variant="secondary">
                  {topic}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}