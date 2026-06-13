import React from "react";
import ComingSoonPage from "@/components/admin/ComingSoonPage";
import { Heart } from "lucide-react";

const DonationsPage: React.FC = () => (
  <ComingSoonPage
    title="Donations"
    description="Track donations, manage donors, and generate reports. This module is under development."
    icon={Heart}
  />
);

export default DonationsPage;
