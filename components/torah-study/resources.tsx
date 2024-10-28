"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, FileText, Video, Bookmark } from "lucide-react";

const RESOURCES = [
  {
    id: 1,
    title: "Complete Torah Text",
    description: "Full Hebrew text with English translation and commentary",
    type: "Document",
    format: "PDF",
    size: "2.4 MB",
    tags: ["Torah", "Text", "Translation"],
  },
  {
    id: 2,
    title: "Introduction to Jewish Prayer",
    description: "Video series explaining the structure and meaning of prayers",
    type: "Video",
    format: "MP4",
    duration: "45 mins",
    tags: ["Prayer", "Tutorial", "Beginner"],
  },
  {
    id: 3,
    title: "Hebrew Reading Guide",
    description: "Comprehensive guide to reading Hebrew with vowels",
    type: "Document",
    format: "PDF",
    size: "1.8 MB",
    tags: ["Hebrew", "Language", "Guide"],
  },
];

export function Resources() {
  return (
    <div className="space-y-6">
      {RESOURCES.map((resource) => (
        <Card key={resource.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="flex items-center gap-2">
                  {resource.type === "Document" ? (
                    <FileText className="h-5 w-5" />
                  ) : (
                    <Video className="h-5 w-5" />
                  )}
                  {resource.title}
                </CardTitle>
                <CardDescription>{resource.description}</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon">
                  <Bookmark className="h-4 w-4" />
                </Button>
                <Button>
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
              <span>Format: {resource.format}</span>
              {resource.size && <span>Size: {resource.size}</span>}
              {resource.duration && <span>Duration: {resource.duration}</span>}
            </div>
            <div className="flex flex-wrap gap-2">
              {resource.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}