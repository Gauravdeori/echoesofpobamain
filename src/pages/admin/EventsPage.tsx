import React from "react";
import ComingSoonPage from "@/components/admin/ComingSoonPage";
import { CalendarDays } from "lucide-react";

const EventsPage: React.FC = () => (
  <ComingSoonPage
    title="Events"
    description="Create and manage events, set dates and locations, and track RSVPs. This module is under development."
    icon={CalendarDays}
  />
);

export default EventsPage;
