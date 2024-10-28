"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface MarketplaceFieldsProps {
  data: Record<string, any>;
  onChange: (data: Record<string, any>) => void;
}

export function MarketplaceFields({ data, onChange }: MarketplaceFieldsProps) {
  const updateField = (field: string, value: any) => {
    onChange({ [field]: value });
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Price (MP)</Label>
          <Input
            type="number"
            min="0"
            value={data.price || ""}
            onChange={(e) => updateField("price", e.target.value)}
            placeholder="Price in MitzvahPoints"
            required
          />
        </div>
        <div className="space-y-2">
          <Label>Quantity Available</Label>
          <Input
            type="number"
            min="1"
            value={data.quantity || ""}
            onChange={(e) => updateField("quantity", e.target.value)}
            placeholder="Number of items"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Condition</Label>
        <Select 
          value={data.condition || "new"} 
          onValueChange={(value) => updateField("condition", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select item condition" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="like-new">Like New</SelectItem>
            <SelectItem value="good">Good</SelectItem>
            <SelectItem value="fair">Fair</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Location</Label>
        <Input
          value={data.location || ""}
          onChange={(e) => updateField("location", e.target.value)}
          placeholder="Item location"
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Shipping Options</Label>
        <Select 
          value={data.shipping || "local"} 
          onValueChange={(value) => updateField("shipping", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select shipping option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="local">Local Pickup Only</SelectItem>
            <SelectItem value="domestic">Domestic Shipping</SelectItem>
            <SelectItem value="international">International Shipping</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );
}