import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ActiveProposals } from "@/components/governance/active-proposals";
import { CreateProposal } from "@/components/governance/create-proposal";
import { VotingHistory } from "@/components/governance/voting-history";

export default function GovernancePage() {
  return (
    <div className="container py-12">
      <div className="space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold">Community Governance</h1>
          <p className="text-xl text-muted-foreground">
            Participate in community decision-making and shape our future together
          </p>
        </div>

        <Tabs defaultValue="active" className="space-y-8">
          <TabsList>
            <TabsTrigger value="active">Active Proposals</TabsTrigger>
            <TabsTrigger value="create">Create Proposal</TabsTrigger>
            <TabsTrigger value="history">Voting History</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-8">
            <ActiveProposals />
          </TabsContent>

          <TabsContent value="create" className="space-y-8">
            <CreateProposal />
          </TabsContent>

          <TabsContent value="history" className="space-y-8">
            <VotingHistory />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}