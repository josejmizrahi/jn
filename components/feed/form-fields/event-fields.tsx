"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface EventFieldsProps {
  data: Record<string, any>;
  onChange: (data: Record<string, any>) => void;
}

export function EventFields({ data, onChange }: EventFieldsProps) {
  const updateField = (field: string, value: any) => {
    onChange({ [field]: value });
  };

  return (
    <>
      <div className="space-y-2">
        <Label>Event Type</Label>
        <Select 
          value={data.eventType || "online"} 
          onValueChange={(value) => updateField("eventType", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select event type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="online">Online</SelectItem>
            <SelectItem value="in-person">In Person</SelectItem>
            <SelectItem value="hybrid">Hybrid</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Start Date & Time</Label>
          <Input
            type="datetime-local"
            value={data.startDate || ""}
            onChange={(e) => updateField("startDate", e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label>End Date & Time</Label>
          <Input
            type="datetime-local"
            value={data.endDate || ""}
            onChange={(e) => updateField("endDate", e.target.value)}
            required
          />
        </div>
      </div>

      {(data.eventType === "in-person" || data.eventType === "hybrid") && (
        <>
          <div className="space-y-2">
            <Label>Location Name</Label>
            <Input
              value={data.location || ""}
              onChange={(e) => updateField("location", e.target.value)}
              placeholder="e.g., Community Center"
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Address</Label>
            <Input
              value={data.address || ""}
              onChange={(e) => updateField("address", e.target.value)}
              placeholder="Full address"
              required
            />
          </div>
        </>
      )}

      {(data.eventType === "online" || data.eventType === "hybrid") && (
        <div className="space-y-2">
          <Label>Virtual Meeting Link</Label>
          <Input
            value={data.virtualLink || ""}
            onChange={(e) => updateField("virtualLink", e.target.value)}
            placeholder="Meeting URL"
            required
          />
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Maximum Attendees</Label>
          <Input
            type="number"
            min="1"
            value={data.maxAttendees || ""}
            onChange={(e) => updateField("maxAttendees", e.target.value)}
            placeholder="Optional"
          />
        </div>
        <div className="space-y-2">
          <Label>Cost (MP)</Label>
          <Input
            type="number"
            min="0"
            value={data.cost || ""}
            onChange={(e) => updateField("cost", e.target.value)}
            placeholder="0 for free"
          />
        </div>
      </div>
    </>
  );
}