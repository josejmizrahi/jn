"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2 } from "lucide-react";

interface PollFieldsProps {
  data: Record<string, any>;
  onChange: (data: Record<string, any>) => void;
}

export function PollFields({ data, onChange }: PollFieldsProps) {
  const [options, setOptions] = useState<string[]>(data.options || ["", ""]);

  const updateField = (field: string, value: any) => {
    onChange({ [field]: value });
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
    updateField("options", newOptions);
  };

  const addOption = () => {
    setOptions([...options, ""]);
    updateField("options", [...options, ""]);
  };

  const removeOption = (index: number) => {
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
    updateField("options", newOptions);
  };

  return (
    <>
      <div className="space-y-2">
        <Label>Poll Type</Label>
        <Select 
          value={data.pollType || "single"} 
          onValueChange={(value) => updateField("pollType", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select poll type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="single">Single Choice</SelectItem>
            <SelectItem value="multiple">Multiple Choice</SelectItem>
            <SelectItem value="ranked">Ranked Choice</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>End Date</Label>
          <Input
            type="date"
            value={data.endDate || ""}
            onChange={(e) => updateField("endDate", e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label>Minimum Votes Required</Label>
          <Input
            type="number"
            min="1"
            value={data.minVotes || ""}
            onChange={(e) => updateField("minVotes", e.target.value)}
            placeholder="Optional minimum"
          />
        </div>
      </div>

      <div className="space-y-4">
        <Label>Poll Options</Label>
        {options.map((option, index) => (
          <div key={index} className="flex gap-2">
            <Input
              value={option}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              placeholder={`Option ${index + 1}`}
              required
            />
            {options.length > 2 && (
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => removeOption(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          onClick={addOption}
          className="w-full"
        >
          Add Option
        </Button>
      </div>
    </>
  );
}