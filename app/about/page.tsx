import { Card, CardContent } from "@/components/ui/card";
import { Star, Users, BookOpen, Vote, Coins, Heart } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="container py-12 space-y-16">
      {/* Mission Statement */}
      <section className="text-center space-y-6">
        <h1 className="text-4xl md:text-6xl font-bold">About Our Network State</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Building a digital home for the global Jewish community, fostering connection, learning, and shared growth
        </p>
      </section>

      {/* Core Values */}
      <section className="space-y-8">
        <h2 className="text-3xl font-bold text-center">Our Core Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Star className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Community First</h3>
              <p className="text-muted-foreground">
                Building strong connections and supporting each other in our shared journey
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Continuous Learning</h3>
              <p className="text-muted-foreground">
                Embracing Torah study and personal growth through shared knowledge
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Heart className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Mutual Respect</h3>
              <p className="text-muted-foreground">
                Fostering an inclusive environment where all voices are heard and valued
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works */}
      <section className="space-y-8">
        <h2 className="text-3xl font-bold text-center">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Users className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Join the Community</h3>
                <p className="text-muted-foreground">
                  Create your profile and connect with members worldwide
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <BookOpen className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Learn and Grow</h3>
                <p className="text-muted-foreground">
                  Access Torah study resources and participate in learning groups
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Vote className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Participate in Governance</h3>
                <p className="text-muted-foreground">
                  Have your say in community decisions and initiatives
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Coins className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Engage in the Economy</h3>
                <p className="text-muted-foreground">
                  Earn and spend MitzvahPoints through community contributions
                </p>
              </div>
            </div>
          </div>

          <Card className="p-6 space-y-6">
            <h3 className="text-xl font-semibold">Digital Citizenship Levels</h3>
            <div className="space-y-4">
              {[
                { level: "Resident", points: "0-500 MP", description: "New community members" },
                { level: "Citizen", points: "501-2000 MP", description: "Active participants" },
                { level: "Leader", points: "2001-5000 MP", description: "Community contributors" },
                { level: "Elder", points: "5001+ MP", description: "Experienced mentors" },
              ].map((tier) => (
                <div key={tier.level} className="flex items-center justify-between border-b pb-4 last:border-0">
                  <div>
                    <div className="font-semibold">{tier.level}</div>
                    <div className="text-sm text-muted-foreground">{tier.description}</div>
                  </div>
                  <div className="text-sm font-medium">{tier.points}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}