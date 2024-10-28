"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Coins, TrendingUp, Gift, Award } from "lucide-react";

export function Overview() {
  return (
    <div className="space-y-8">
      {/* Balance and Level Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Coins className="h-5 w-5" />
              MitzvahPoints Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">1,250 MP</div>
            <div className="mt-2 text-sm text-muted-foreground">
              +150 MP earned this week
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Contribution Level
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">Level 3</div>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress to Level 4</span>
                <span>750/1000 MP</span>
              </div>
              <Progress value={75} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Recent Achievements
          </CardTitle>
          <CardDescription>Your latest community contributions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                title: "Regular Contributor",
                description: "Participated in 10 community discussions",
                points: 100,
                date: "2024-04-01",
              },
              {
                title: "Torah Scholar",
                description: "Completed 5 Torah study sessions",
                points: 150,
                date: "2024-03-28",
              },
              {
                title: "Community Builder",
                description: "Organized a virtual event",
                points: 200,
                date: "2024-03-25",
              },
            ].map((achievement) => (
              <div
                key={achievement.title}
                className="flex items-center justify-between border-b pb-4 last:border-0"
              >
                <div className="space-y-1">
                  <div className="font-medium">{achievement.title}</div>
                  <div className="text-sm text-muted-foreground">
                    {achievement.description}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">+{achievement.points} MP</div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(achievement.date).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Available Rewards */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5" />
            Available Rewards
          </CardTitle>
          <CardDescription>Unlock special benefits with your points</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              {
                title: "Premium Study Materials",
                description: "Access exclusive Torah study resources",
                cost: 500,
                available: true,
              },
              {
                title: "Event Organization Rights",
                description: "Create and manage community events",
                cost: 1000,
                available: true,
              },
              {
                title: "Mentorship Program",
                description: "One-on-one learning with community leaders",
                cost: 2000,
                available: false,
              },
              {
                title: "Custom Profile Badge",
                description: "Unique recognition for your contributions",
                cost: 1500,
                available: false,
              },
            ].map((reward) => (
              <Card key={reward.title}>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold">{reward.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {reward.description}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{reward.cost} MP</span>
                      <Button
                        variant={reward.available ? "default" : "outline"}
                        disabled={!reward.available}
                      >
                        {reward.available ? "Redeem" : "Locked"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}