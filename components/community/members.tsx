"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, MapPin, Calendar } from "lucide-react";

const MEMBERS = [
  {
    id: 1,
    name: "David Cohen",
    location: "Jerusalem, Israel",
    joinDate: "2024-01",
    avatar: "https://i.pravatar.cc/150?u=1",
    interests: ["Torah Study", "Community Service"],
    role: "Community Leader",
  },
  {
    id: 2,
    name: "Sarah Levy",
    location: "New York, USA",
    joinDate: "2024-02",
    avatar: "https://i.pravatar.cc/150?u=2",
    interests: ["Jewish Education", "Arts"],
    role: "Member",
  },
  {
    id: 3,
    name: "Michael Stern",
    location: "London, UK",
    joinDate: "2024-03",
    avatar: "https://i.pravatar.cc/150?u=3",
    interests: ["Hebrew Language", "History"],
    role: "Content Creator",
  },
];

export function Members() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search members..."
            className="pl-9"
          />
        </div>
        <Button variant="outline">Filter</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MEMBERS.map((member) => (
          <Card key={member.id}>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={member.avatar} alt={member.name} />
                  <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">{member.name}</h3>
                  <Badge variant="outline">{member.role}</Badge>
                </div>
                <div className="w-full space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center justify-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{member.location}</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Joined {new Date(member.joinDate).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 justify-center">
                  {member.interests.map((interest) => (
                    <Badge key={interest} variant="secondary">
                      {interest}
                    </Badge>
                  ))}
                </div>
                <Button variant="outline" className="w-full">View Profile</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}