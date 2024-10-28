"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CATEGORIES = [
  "Infrastructure",
  "Education",
  "Governance",
  "Community",
  "Culture",
  "Technology",
];

export function CreateProposal() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Submission logic will be implemented here
    setIsSubmitting(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Proposal</CardTitle>
        <CardDescription>
          Submit a new proposal for community voting and discussion
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Proposal Title</Label>
            <Input
              id="title"
              placeholder="Enter a clear, descriptive title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category.toLowerCase()}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Provide a detailed description of your proposal"
              className="min-h-[200px]"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration">Voting Duration (days)</Label>
            <Input
              id="duration"
              type="number"
              min="1"
              max="30"
              defaultValue="7"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="quorum">Required Quorum</Label>
            <Input
              id="quorum"
              type="number"
              min="100"
              defaultValue="400"
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Proposal"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}