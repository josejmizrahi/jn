"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface FundraisingFieldsProps {
  data: Record<string, any>;
  onChange: (data: Record<string, any>) => void;
}

export function FundraisingFields({ data, onChange }: FundraisingFieldsProps) {
  const updateField = (field: string, value: any) => {
    onChange({ [field]: value });
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Goal Amount (MP)</Label>
          <Input
            type="number"
            min="1"
            value={data.goalAmount || ""}
            onChange={(e) => updateField("goalAmount", e.target.value)}
            placeholder="Target amount"
            required
          />
        </div>
        <div className="space-y-2">
          <Label>End Date</Label>
          <Input
            type="date"
            value={data.endDate || ""}
            onChange={(e) => updateField("endDate", e.target.value)}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Beneficiary Organization/Individual</Label>
        <Input
          value={data.beneficiary || ""}
          onChange={(e) => updateField("beneficiary", e.target.value)}
          placeholder="Who will receive the funds"
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Use of Funds</Label>
        <Textarea
          value={data.useOfFunds || ""}
          onChange={(e) => updateField("useOfFunds", e.target.value)}
          placeholder="Explain how the funds will be used"
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Minimum Donation (MP)</Label>
        <Input
          type="number"
          min="1"
          value={data.minimumDonation || ""}
          onChange={(e) => updateField("minimumDonation", e.target.value)}
          placeholder="Optional minimum donation amount"
        />
      </div>
    </>
  );
}