import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Overview } from "@/components/economy/overview";
import { Marketplace } from "@/components/economy/marketplace";
import { Transactions } from "@/components/economy/transactions";

export default function EconomyPage() {
  return (
    <div className="container py-12">
      <div className="space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold">Virtual Economy</h1>
          <p className="text-xl text-muted-foreground">
            Earn and spend MitzvahPoints, contribute to community projects
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            <Overview />
          </TabsContent>

          <TabsContent value="marketplace" className="space-y-8">
            <Marketplace />
          </TabsContent>

          <TabsContent value="transactions" className="space-y-8">
            <Transactions />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}