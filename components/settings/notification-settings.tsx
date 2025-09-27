"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/contexts/auth-context"
import { Bell, Mail, Smartphone, Settings } from "lucide-react"

export function NotificationSettings() {
  const { user } = useAuth()
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    loanUpdates: true,
    paymentReminders: true,
    marketingEmails: false,
    frequency: "immediate",
  })

  const handleSave = () => {
    console.log("Saving notification settings:", settings)
    // In a real app, this would save to your API
  }

  if (!user) return null

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-serif font-bold text-balance mb-2">Notification Settings</h1>
        <p className="text-muted-foreground">Manage how you receive updates and alerts</p>
      </div>

      <div className="space-y-6">
        {/* Delivery Methods */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Delivery Methods
            </CardTitle>
            <CardDescription>Choose how you want to receive notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <div>
                  <Label htmlFor="email-notifications" className="text-sm font-medium">
                    Email Notifications
                  </Label>
                  <p className="text-xs text-muted-foreground">Receive updates via email</p>
                </div>
              </div>
              <Switch
                id="email-notifications"
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => setSettings({ ...settings, emailNotifications: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-4 h-4 text-muted-foreground" />
                <div>
                  <Label htmlFor="push-notifications" className="text-sm font-medium">
                    Push Notifications
                  </Label>
                  <p className="text-xs text-muted-foreground">Browser and app notifications</p>
                </div>
              </div>
              <Switch
                id="push-notifications"
                checked={settings.pushNotifications}
                onCheckedChange={(checked) => setSettings({ ...settings, pushNotifications: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Smartphone className="w-4 h-4 text-muted-foreground" />
                <div>
                  <Label htmlFor="sms-notifications" className="text-sm font-medium">
                    SMS Notifications
                  </Label>
                  <p className="text-xs text-muted-foreground">Text message alerts</p>
                </div>
              </div>
              <Switch
                id="sms-notifications"
                checked={settings.smsNotifications}
                onCheckedChange={(checked) => setSettings({ ...settings, smsNotifications: checked })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Notification Types */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Notification Types
            </CardTitle>
            <CardDescription>Control what types of notifications you receive</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="loan-updates" className="text-sm font-medium">
                  Loan Updates
                </Label>
                <p className="text-xs text-muted-foreground">Application status, approvals, rejections</p>
              </div>
              <Switch
                id="loan-updates"
                checked={settings.loanUpdates}
                onCheckedChange={(checked) => setSettings({ ...settings, loanUpdates: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="payment-reminders" className="text-sm font-medium">
                  Payment Reminders
                </Label>
                <p className="text-xs text-muted-foreground">Due dates and overdue notices</p>
              </div>
              <Switch
                id="payment-reminders"
                checked={settings.paymentReminders}
                onCheckedChange={(checked) => setSettings({ ...settings, paymentReminders: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="marketing-emails" className="text-sm font-medium">
                  Marketing Emails
                </Label>
                <p className="text-xs text-muted-foreground">Product updates and promotional content</p>
              </div>
              <Switch
                id="marketing-emails"
                checked={settings.marketingEmails}
                onCheckedChange={(checked) => setSettings({ ...settings, marketingEmails: checked })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Frequency */}
        <Card>
          <CardHeader>
            <CardTitle>Notification Frequency</CardTitle>
            <CardDescription>How often you want to receive notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="frequency">Frequency</Label>
              <Select
                value={settings.frequency}
                onValueChange={(value) => setSettings({ ...settings, frequency: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="immediate">Immediate</SelectItem>
                  <SelectItem value="daily">Daily Digest</SelectItem>
                  <SelectItem value="weekly">Weekly Summary</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button variant="outline" className="flex-1 bg-transparent">
            Reset to Defaults
          </Button>
          <Button onClick={handleSave} className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  )
}
