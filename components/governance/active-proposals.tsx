"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Users, Calendar, Vote } from "lucide-react";

const PROPOSALS = [
  {
    id: 1,
    title: "Community Center Expansion",
    description: "Proposal to expand our virtual community center with new features",
    category: "Infrastructure",
    status: "Active",
    endDate: "2024-04-20",
    votes: {
      total: 450,
      yes: 320,
      no: 130,
    },
    quorum: 400,
    proposedBy: "David Cohen",
  },
  {
    id: 2,
    title: "New Educational Program",
    description: "Introduction of advanced Torah study courses with certified teachers",
    category: "Education",
    status: "Active",
    endDate: "2024-04-25",
    votes: {
      total: 280,
      yes: 245,
      no: 35,
    },
    quorum: 400,
    proposedBy: "Sarah Levy",
  },
  {
    id: 3,
    title: "Community Guidelines Update",
    description: "Proposed updates to community participation guidelines",
    category: "Governance",
    status: "Active",
    endDate: "2024-04-15",
    votes: {
      total: 380,
      yes: 290,
      no: 90,
    },
    quorum: 400,
    proposedBy: "Michael Stern",
  },
];

export function ActiveProposals() {
  return (
    <div className="space-y-6">
      {PROPOSALS.map((proposal) => (
        <Card key={proposal.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge>{proposal.category}</Badge>
                  <Badge variant="outline">{proposal.status}</Badge>
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
                    {proposal.votes.total} votes of {proposal.quorum} required
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Ends {new Date(proposal.endDate).toLocaleDateString()}
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

              <div className="flex gap-4">
                <Button className="flex-1">
                  <Vote className="mr-2 h-4 w-4" /> Vote Yes
                </Button>
                <Button variant="outline" className="flex-1">
                  <Vote className="mr-2 h-4 w-4" /> Vote No
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}