import React from "react";
import ComingSoonPage from "@/components/admin/ComingSoonPage";
import { MessageSquare } from "lucide-react";

const MessagesPage: React.FC = () => (
  <ComingSoonPage
    title="Messages"
    description="View and respond to contact form submissions and inquiries. This module is under development."
    icon={MessageSquare}
  />
);

export default MessagesPage;
