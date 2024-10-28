"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface EducationFieldsProps {
  data: Record<string, any>;
  onChange: (data: Record<string, any>) => void;
}

export function EducationFields({ data, onChange }: EducationFieldsProps) {
  const updateField = (field: string, value: any) => {
    onChange({ [field]: value });
  };

  return (
    <>
      <div className="space-y-2">
        <Label>Difficulty Level</Label>
        <Select 
          value={data.level || "beginner"} 
          onValueChange={(value) => updateField("level", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select difficulty level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="beginner">Beginner</SelectItem>
            <SelectItem value="intermediate">Intermediate</SelectItem>
            <SelectItem value="advanced">Advanced</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Format</Label>
        <Select 
          value={data.format || "text"} 
          onValueChange={(value) => updateField("format", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select content format" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="text">Text</SelectItem>
            <SelectItem value="video">Video</SelectItem>
            <SelectItem value="audio">Audio</SelectItem>
            <SelectItem value="interactive">Interactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Duration (minutes)</Label>
          <Input
            type="number"
            min="1"
            value={data.duration || ""}
            onChange={(e) => updateField("duration", e.target.value)}
            placeholder="Duration in minutes"
            required
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

      <div className="space-y-2">
        <Label>Prerequisites</Label>
        <Input
          value={data.prerequisites || ""}
          onChange={(e) => updateField("prerequisites", e.target.value)}
          placeholder="Any required prior knowledge"
        />
      </div>
    </>
  );
}