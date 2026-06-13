import React from "react";
import ComingSoonPage from "@/components/admin/ComingSoonPage";
import { Image } from "lucide-react";

const GalleryAdminPage: React.FC = () => (
  <ComingSoonPage
    title="Gallery"
    description="Upload photos, organize albums, and manage your gallery. This module is under development."
    icon={Image}
  />
);

export default GalleryAdminPage;
