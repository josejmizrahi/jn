import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BookOpen, Users, Vote, Coins } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="container py-12 space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-6">
        <h1 className="text-4xl md:text-6xl font-bold">
          Welcome to the Jewish Network State
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          A digital platform fostering connection, learning, and growth within the global Jewish community.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/auth" passHref>
            <Button size="lg">Join Now</Button>
          </Link>
          <Link href="/about" passHref>
            <Button size="lg" variant="outline">
              Learn More
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 space-y-4 text-center">
          <BookOpen className="h-12 w-12 text-primary mx-auto" />
          <h3 className="text-xl font-semibold">Torah Study</h3>
          <p className="text-muted-foreground">
            Access digital learning resources and join study groups.
          </p>
        </Card>

        <Card className="p-6 space-y-4 text-center">
          <Users className="h-12 w-12 text-primary mx-auto" />
          <h3 className="text-xl font-semibold">Community</h3>
          <p className="text-muted-foreground">
            Connect with Jews worldwide and participate in discussions.
          </p>
        </Card>

        <Card className="p-6 space-y-4 text-center">
          <Vote className="h-12 w-12 text-primary mx-auto" />
          <h3 className="text-xl font-semibold">Governance</h3>
          <p className="text-muted-foreground">
            Participate in community decisions and initiatives.
          </p>
        </Card>

        <Card className="p-6 space-y-4 text-center">
          <Coins className="h-12 w-12 text-primary mx-auto" />
          <h3 className="text-xl font-semibold">Economy</h3>
          <p className="text-muted-foreground">
            Engage in the virtual economy with MitzvahPoints.
          </p>
        </Card>
      </section>

      {/* Call to Action */}
      <section className="bg-primary text-primary-foreground rounded-lg p-8 md:p-12 text-center space-y-6">
        <h2 className="text-2xl md:text-3xl font-bold">
          Ready to Join Our Community?
        </h2>
        <p className="text-lg max-w-2xl mx-auto">
          Become part of a growing digital Jewish community. Connect, learn, and contribute to our shared future.
        </p>
        <Link href="/auth" passHref>
          <Button size="lg" variant="secondary">
            Get Started
          </Button>
        </Link>
      </section>

      {/* Recent Activity */}
      <section className="space-y-8">
        <h2 className="text-2xl md:text-3xl font-bold text-center">
          Recent Community Activity
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold">New Torah Study Session</h4>
                <p className="text-sm text-muted-foreground">
                  Starting in 2 hours
                </p>
              </div>
            </div>
            <p className="text-muted-foreground">
              Join our weekly Parasha discussion with Rabbi Cohen.
            </p>
            <Button variant="outline" className="w-full">
              Learn More
            </Button>
          </Card>

          <Card className="p-6 space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold">Community Event</h4>
                <p className="text-sm text-muted-foreground">
                  Tomorrow at 7 PM
                </p>
              </div>
            </div>
            <p className="text-muted-foreground">
              Virtual Shabbat dinner and discussion.
            </p>
            <Button variant="outline" className="w-full">
              Join Event
            </Button>
          </Card>

          <Card className="p-6 space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Vote className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold">Active Proposal</h4>
                <p className="text-sm text-muted-foreground">
                  3 days remaining
                </p>
              </div>
            </div>
            <p className="text-muted-foreground">
              Vote on the new community guidelines.
            </p>
            <Button variant="outline" className="w-full">
              Vote Now
            </Button>
          </Card>
        </div>
      </section>
    </div>
  );
}
