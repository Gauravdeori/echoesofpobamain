import React from "react";
import ComingSoonPage from "@/components/admin/ComingSoonPage";
import { Users } from "lucide-react";

const VolunteersPage: React.FC = () => (
  <ComingSoonPage
    title="Volunteers"
    description="Review volunteer applications, manage volunteer data, and coordinate activities. This module is under development."
    icon={Users}
  />
);

export default VolunteersPage;
