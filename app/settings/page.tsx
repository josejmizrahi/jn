import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
  return (
    <div className="container py-12 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account preferences</p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Configure how you receive notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="email-notifications">Email Notifications</Label>
              <Switch id="email-notifications" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="browser-notifications">Browser Notifications</Label>
              <Switch id="browser-notifications" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Privacy</CardTitle>
            <CardDescription>Manage your privacy settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="profile-visibility">Public Profile</Label>
              <Switch id="profile-visibility" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="activity-visibility">Show Activity Status</Label>
              <Switch id="activity-visibility" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>Manage your account settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <Button variant="outline" className="w-full">Change Password</Button>
              <Button variant="outline" className="w-full">Export Data</Button>
            </div>
            <Separator />
            <div className="space-y-2">
              <Button variant="destructive" className="w-full">Delete Account</Button>
              <p className="text-sm text-muted-foreground text-center">
                This action cannot be undone.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}