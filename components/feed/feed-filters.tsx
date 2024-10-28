"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const CONTENT_TYPES = [
  { value: "all", label: "All Content" },
  { value: "text", label: "Text Posts" },
  { value: "multimedia", label: "Media Posts" },
  { value: "event", label: "Events" },
  { value: "education", label: "Educational" },
  { value: "fundraising", label: "Fundraising" },
  { value: "governance", label: "Governance" },
  { value: "poll", label: "Polls" },
  { value: "marketplace", label: "Marketplace" },
  { value: "livestream", label: "Livestreams" },
  { value: "collaboration", label: "Collaborations" },
];

export const SORT_OPTIONS = [
  { value: "recent", label: "Most Recent" },
  { value: "popular", label: "Most Popular" },
  { value: "trending", label: "Trending" },
];

interface FeedFiltersProps {
  searchQuery: string;
  contentType: string;
  sortBy: string;
  onSearchChange: (value: string) => void;
  onContentTypeChange: (value: string) => void;
  onSortChange: (value: string) => void;
}

export function FeedFilters({
  searchQuery,
  contentType,
  sortBy,
  onSearchChange,
  onContentTypeChange,
  onSortChange,
}: FeedFiltersProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search feed..."
          className="pl-9"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="flex gap-4">
        <Select value={contentType} onValueChange={onContentTypeChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Content Type" />
          </SelectTrigger>
          <SelectContent>
            {CONTENT_TYPES.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}