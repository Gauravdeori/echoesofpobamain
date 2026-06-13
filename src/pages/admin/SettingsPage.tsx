import React from "react";
import ComingSoonPage from "@/components/admin/ComingSoonPage";
import { Settings } from "lucide-react";

const SettingsPage: React.FC = () => (
  <ComingSoonPage
    title="Settings"
    description="Configure site settings, manage admin accounts, and customize preferences. This module is under development."
    icon={Settings}
  />
);

export default SettingsPage;
