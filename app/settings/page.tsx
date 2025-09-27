import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { NotificationSettings } from "@/components/settings/notification-settings"

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <NotificationSettings />
    </DashboardLayout>
  )
}
