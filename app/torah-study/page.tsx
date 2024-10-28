import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LessonGrid } from "@/components/torah-study/lesson-grid";
import { StudyGroups } from "@/components/torah-study/study-groups";
import { Resources } from "@/components/torah-study/resources";

export default function TorahStudyPage() {
  return (
    <div className="container py-12">
      <div className="space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold">Torah Study Platform</h1>
          <p className="text-xl text-muted-foreground">
            Explore lessons, join study groups, and access learning resources
          </p>
        </div>

        <Tabs defaultValue="lessons" className="space-y-8">
          <TabsList>
            <TabsTrigger value="lessons">Lessons</TabsTrigger>
            <TabsTrigger value="groups">Study Groups</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
          </TabsList>

          <TabsContent value="lessons" className="space-y-8">
            <LessonGrid />
          </TabsContent>

          <TabsContent value="groups" className="space-y-8">
            <StudyGroups />
          </TabsContent>

          <TabsContent value="resources" className="space-y-8">
            <Resources />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}