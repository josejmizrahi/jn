import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Users, Vote, Coins, Bell, Calendar } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="container py-12 space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, David</h1>
          <p className="text-muted-foreground">Here's what's happening in your community</p>
        </div>
        <Button>
          <Bell className="mr-2 h-4 w-4" />
          Notifications
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">MitzvahPoints</CardTitle>
            <Coins className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,250 MP</div>
            <p className="text-xs text-muted-foreground">+150 this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Study Sessions</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Completed this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Connections</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">48</div>
            <p className="text-xs text-muted-foreground">Active community members</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Proposals</CardTitle>
            <Vote className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Active voting sessions</p>
          </CardContent>
        </Card>
      </div>

      {/* Citizenship Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Citizenship Progress</CardTitle>
          <CardDescription>Your journey towards becoming a community leader</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between text-sm">
            <span>Current Level: Citizen</span>
            <span>1,250 / 2,000 MP</span>
          </div>
          <Progress value={62.5} />
          <p className="text-sm text-muted-foreground">
            750 more MitzvahPoints needed to reach Leader status
          </p>
        </CardContent>
      </Card>

      {/* Upcoming Events */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Events</CardTitle>
          <CardDescription>Your scheduled activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                title: "Torah Study Session",
                date: "Today at 7:00 PM",
                type: "Study",
                icon: BookOpen,
              },
              {
                title: "Community Meeting",
                date: "Tomorrow at 6:30 PM",
                type: "Meeting",
                icon: Users,
              },
              {
                title: "Governance Vote",
                date: "Friday at 8:00 PM",
                type: "Vote",
                icon: Vote,
              },
            ].map((event) => (
              <div
                key={event.title}
                className="flex items-center justify-between border-b pb-4 last:border-0"
              >
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <event.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold">{event.title}</div>
                    <div className="text-sm text-muted-foreground">{event.date}</div>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Calendar className="mr-2 h-4 w-4" />
                  Add to Calendar
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}