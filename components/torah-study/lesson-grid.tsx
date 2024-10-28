"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Clock, Users } from "lucide-react";

const LESSONS = [
  {
    id: 1,
    title: "Introduction to Torah",
    description: "Learn the basics of Torah study and its importance in Jewish life",
    level: "Beginner",
    duration: "45 mins",
    participants: 128,
    image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800&auto=format&fit=crop&q=60",
  },
  {
    id: 2,
    title: "Weekly Parasha Study",
    description: "In-depth analysis of the weekly Torah portion",
    level: "Intermediate",
    duration: "60 mins",
    participants: 256,
    image: "https://images.unsplash.com/photo-1583946099379-f9c9cb8bc030?w=800&auto=format&fit=crop&q=60",
  },
  {
    id: 3,
    title: "Talmud Basics",
    description: "Introduction to Talmudic reasoning and discussion",
    level: "Advanced",
    duration: "90 mins",
    participants: 64,
    image: "https://images.unsplash.com/photo-1532153975070-2e9ab71f1b14?w=800&auto=format&fit=crop&q=60",
  },
];

export function LessonGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {LESSONS.map((lesson) => (
        <Card key={lesson.id} className="overflow-hidden">
          <div className="aspect-video relative">
            <img
              src={lesson.image}
              alt={lesson.title}
              className="object-cover w-full h-full"
            />
            <Badge className="absolute top-4 right-4">{lesson.level}</Badge>
          </div>
          <CardHeader>
            <CardTitle>{lesson.title}</CardTitle>
            <CardDescription>{lesson.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{lesson.duration}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{lesson.participants} enrolled</span>
              </div>
            </div>
            <Button className="w-full">
              <BookOpen className="mr-2 h-4 w-4" /> Start Learning
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}