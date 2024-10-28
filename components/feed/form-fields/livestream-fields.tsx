"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface LivestreamFieldsProps {
  data: Record<string, any>;
  onChange: (data: Record<string, any>) => void;
}

export function LivestreamFields({ data, onChange }: LivestreamFieldsProps) {
  const updateField = (field: string, value: any) => {
    onChange({ [field]: value });
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Start Date & Time</Label>
          <Input
            type="datetime-local"
            value={data.startTime || ""}
            onChange={(e) => updateField("startTime", e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label>Estimated Duration (minutes)</Label>
          <Input
            type="number"
            min="1"
            value={data.duration || ""}
            onChange={(e) => updateField("duration", e.target.value)}
            placeholder="Duration in minutes"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Platform</Label>
        <Select 
          value={data.platform || "zoom"} 
          onValueChange={(value) => updateField("platform", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select streaming platform" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="zoom">Zoom</SelectItem>
            <SelectItem value="meet">Google Meet</SelectItem>
            <SelectItem value="teams">Microsoft Teams</SelectItem>
            <SelectItem value="custom">Custom Platform</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Access Type</Label>
        <Select 
          value={data.accessType || "public"} 
          onValueChange={(value) => updateField("accessType", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select access type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="public">Public</SelectItem>
            <SelectItem value="private">Private (Invite Only)</SelectItem>
            <SelectItem value="paid">Paid Access</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {data.accessType === "paid" && (
        <div className="space-y-2">
          <Label>Access Cost (MP)</Label>
          <Input
            type="number"
            min="1"
            value={data.cost || ""}
            onChange={(e) => updateField("cost", e.target.value)}
            placeholder="Cost in MitzvahPoints"
            required
          />
        </div>
      )}

      <div className="space-y-2">
        <Label>Maximum Participants</Label>
        <Input
          type="number"
          min="1"
          value={data.maxParticipants || ""}
          onChange={(e) => updateField("maxParticipants", e.target.value)}
          placeholder="Optional limit"
        />
      </div>
    </>
  );
}