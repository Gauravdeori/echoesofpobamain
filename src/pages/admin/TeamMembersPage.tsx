import React from "react";
import ComingSoonPage from "@/components/admin/ComingSoonPage";
import { UserCog } from "lucide-react";

const TeamMembersPage: React.FC = () => (
  <ComingSoonPage
    title="Team Members"
    description="Add and manage team members, assign roles, and update profiles. This module is under development."
    icon={UserCog}
  />
);

export default TeamMembersPage;
