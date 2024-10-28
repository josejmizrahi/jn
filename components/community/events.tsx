"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Clock } from "lucide-react";

const EVENTS = [
  {
    id: 1,
    title: "Community Shabbat Dinner",
    description: "Join us for a warm and welcoming Shabbat dinner with the community",
    date: "2024-04-05",
    time: "19:00",
    location: "Community Center",
    attendees: 45,
    maxAttendees: 60,
    type: "In Person",
    categories: ["Social", "Shabbat"],
  },
  {
    id: 2,
    title: "Torah Learning Workshop",
    description: "Interactive workshop on weekly Parasha with guest speakers",
    date: "2024-04-10",
    time: "20:00",
    location: "Virtual",
    attendees: 120,
    maxAttendees: 200,
    type: "Online",
    categories: ["Education", "Torah"],
  },
  {
    id: 3,
    title: "Jewish Art Exhibition",
    description: "Showcase of contemporary Jewish art and artists",
    date: "2024-04-15",
    time: "14:00",
    location: "Cultural Center",
    attendees: 75,
    maxAttendees: 150,
    type: "In Person",
    categories: ["Culture", "Art"],
  },
];

export function Events() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Upcoming Events</h2>
        <Button>Create Event</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {EVENTS.map((event) => (
          <Card key={event.id}>
            <CardHeader>
              <div className="space-y-2">
                <Badge variant="outline">{event.type}</Badge>
                <CardTitle>{event.title}</CardTitle>
                <CardDescription>{event.description}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {new Date(event.date).toLocaleDateString()} at {event.time}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{event.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {event.attendees}/{event.maxAttendees} attending
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {event.categories.map((category) => (
                    <Badge key={category} variant="secondary">
                      {category}
                    </Badge>
                  ))}
                </div>
                <Button className="w-full">Register</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}