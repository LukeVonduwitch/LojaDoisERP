import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline">Settings</h1>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Application Settings</CardTitle>
          <CardDescription>Manage your application preferences and configurations here.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Settings page is under construction. More options will be available soon.</p>
          {/* Placeholder for settings options */}
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <span className="font-medium">Theme preference</span>
              <span className="text-muted-foreground">System</span>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <span className="font-medium">Notifications</span>
              <span className="text-muted-foreground">Enabled</span>
            </div>
             <div className="flex items-center justify-between p-4 border rounded-lg">
              <span className="font-medium">Default Currency</span>
              <span className="text-muted-foreground">USD</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
