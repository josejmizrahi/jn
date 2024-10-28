import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Forums } from "@/components/community/forums";
import { Events } from "@/components/community/events";
import { Members } from "@/components/community/members";

export default function CommunityPage() {
  return (
    <div className="container py-12">
      <div className="space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold">Community</h1>
          <p className="text-xl text-muted-foreground">
            Connect with members, join discussions, and participate in events
          </p>
        </div>

        <Tabs defaultValue="forums" className="space-y-8">
          <TabsList>
            <TabsTrigger value="forums">Forums</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
          </TabsList>

          <TabsContent value="forums" className="space-y-8">
            <Forums />
          </TabsContent>

          <TabsContent value="events" className="space-y-8">
            <Events />
          </TabsContent>

          <TabsContent value="members" className="space-y-8">
            <Members />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}