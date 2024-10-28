"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Filter, Tag } from "lucide-react";

const MARKETPLACE_ITEMS = [
  {
    id: 1,
    title: "Torah Study Bundle",
    description: "Complete set of study materials and guides",
    price: 750,
    category: "Education",
    seller: "Community Library",
    available: 5,
  },
  {
    id: 2,
    title: "Virtual Event Hosting",
    description: "Host your own community event with our platform",
    price: 500,
    category: "Services",
    seller: "Tech Team",
    available: 10,
  },
  {
    id: 3,
    title: "Custom Profile Theme",
    description: "Unique design for your community profile",
    price: 300,
    category: "Customization",
    seller: "Design Team",
    available: 15,
  },
  {
    id: 4,
    title: "Mentorship Session",
    description: "One-hour session with a community leader",
    price: 1000,
    category: "Education",
    seller: "Mentorship Program",
    available: 3,
  },
];

export function Marketplace() {
  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search marketplace..." />
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
      </div>

      {/* Marketplace Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MARKETPLACE_ITEMS.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge>{item.category}</Badge>
                <span className="text-sm text-muted-foreground">
                  {item.available} available
                </span>
              </div>
              <CardTitle className="mt-2">{item.title}</CardTitle>
              <CardDescription>{item.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {item.seller}
                    </span>
                  </div>
                  <span className="font-bold">{item.price} MP</span>
                </div>
                <Button className="w-full">Purchase</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}