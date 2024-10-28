"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Users, Calendar } from "lucide-react";

const PAST_PROPOSALS = [
  {
    id: 1,
    title: "Virtual Events Platform",
    description: "Implementation of a dedicated platform for virtual community events",
    category: "Technology",
    status: "Passed",
    endDate: "2024-03-15",
    votes: {
      total: 520,
      yes: 480,
      no: 40,
    },
    quorum: 400,
    proposedBy: "Rachel Goldman",
  },
  {
    id: 2,
    title: "Youth Program Initiative",
    description: "Creation of specialized programs for young community members",
    category: "Education",
    status: "Failed",
    endDate: "2024-03-10",
    votes: {
      total: 380,
      yes: 180,
      no: 200,
    },
    quorum: 400,
    proposedBy: "Joseph Klein",
  },
  {
    id: 3,
    title: "Community Newsletter",
    description: "Weekly digital newsletter for community updates and announcements",
    category: "Community",
    status: "Passed",
    endDate: "2024-03-05",
    votes: {
      total: 450,
      yes: 400,
      no: 50,
    },
    quorum: 400,
    proposedBy: "Hannah Weiss",
  },
];

export function VotingHistory() {
  return (
    <div className="space-y-6">
      {PAST_PROPOSALS.map((proposal) => (
        <Card key={proposal.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge>{proposal.category}</Badge>
                  <Badge 
                    variant={proposal.status === "Passed" ? "default" : "destructive"}
                  >
                    {proposal.status}
                  </Badge>
                </div>
                <CardTitle>{proposal.title}</CardTitle>
                <CardDescription>{proposal.description}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {proposal.votes.total} total votes
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Ended {new Date(proposal.endDate).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Yes: {proposal.votes.yes}</span>
                  <span>No: {proposal.votes.no}</span>
                </div>
                <Progress value={(proposal.votes.yes / proposal.votes.total) * 100} />
              </div>

              <div className="text-sm text-muted-foreground">
                Proposed by {proposal.proposedBy}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}