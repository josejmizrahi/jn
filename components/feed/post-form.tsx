"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { PostType } from "@/lib/types";
import { EventFields } from "./form-fields/event-fields";
import { EducationFields } from "./form-fields/education-fields";
import { FundraisingFields } from "./form-fields/fundraising-fields";
import { MarketplaceFields } from "./form-fields/marketplace-fields";
import { LivestreamFields } from "./form-fields/livestream-fields";
import { PollFields } from "./form-fields/poll-fields";

const POST_TYPES = [
  { value: "text", label: "Text Post" },
  { value: "multimedia", label: "Media Post" },
  { value: "event", label: "Event" },
  { value: "education", label: "Educational Content" },
  { value: "fundraising", label: "Fundraising" },
  { value: "governance", label: "Governance Proposal" },
  { value: "poll", label: "Poll" },
  { value: "marketplace", label: "Marketplace" },
  { value: "livestream", label: "Livestream" },
  { value: "collaboration", label: "Collaboration" }
];

const CATEGORIES = {
  text: ["Announcement", "Question", "Story", "Other"],
  event: ["Social", "Religious", "Educational", "Cultural", "Community"],
  education: ["Torah Study", "Hebrew", "History", "Philosophy", "Customs"],
  marketplace: ["Judaica", "Books", "Art", "Services", "Food", "Clothing"],
  fundraising: ["Community", "Charity", "Education", "Infrastructure"],
  governance: ["Policy", "Community", "Resource Allocation", "Membership"]
};

interface PostFormProps {
  onSubmit: (data: any) => Promise<void>;
  isLoading: boolean;
}

export function PostForm({ onSubmit, isLoading }: PostFormProps) {
  const [type, setType] = useState<PostType>("text");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [fieldData, setFieldData] = useState<Record<string, any>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData = {
      type,
      title,
      content,
      category,
      metadata: fieldData
    };

    await onSubmit(formData);
  };

  const renderTypeSpecificFields = () => {
    const props = {
      data: fieldData,
      onChange: (data: Record<string, any>) => setFieldData({ ...fieldData, ...data })
    };

    switch (type) {
      case "event":
        return <EventFields {...props} />;
      case "education":
        return <EducationFields {...props} />;
      case "fundraising":
        return <FundraisingFields {...props} />;
      case "marketplace":
        return <MarketplaceFields {...props} />;
      case "livestream":
        return <LivestreamFields {...props} />;
      case "poll":
        return <PollFields {...props} />;
      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="type">Post Type</Label>
        <Select
          value={type}
          onValueChange={(value) => setType(value as PostType)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select post type" />
          </SelectTrigger>
          <SelectContent>
            {POST_TYPES.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {(CATEGORIES[type as keyof typeof CATEGORIES] || CATEGORIES.text).map((cat) => (
              <SelectItem key={cat} value={cat.toLowerCase()}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter post title"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Description</Label>
        <Textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your post content..."
          required
          className="min-h-[100px]"
        />
      </div>

      {renderTypeSpecificFields()}

      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Creating..." : "Create Post"}
        </Button>
      </div>
    </form>
  );
}