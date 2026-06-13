import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import AboutPage from "./pages/AboutPage";
import OurWorkPage from "./pages/OurWorkPage";
import GalleryPage from "./pages/GalleryPage";
import VolunteerPage from "./pages/VolunteerPage";
import NotFound from "./pages/NotFound";

// Admin imports
import { AuthProvider } from "@/integrations/firebase/AuthContext";
import AdminGuard from "@/components/admin/AdminGuard";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminLogin from "@/pages/admin/AdminLogin";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import PostsPage from "@/pages/admin/PostsPage";
import PostEditor from "@/pages/admin/PostEditor";
import EventsPage from "@/pages/admin/EventsPage";
import GalleryAdminPage from "@/pages/admin/GalleryAdminPage";
import VolunteersAdminPage from "@/pages/admin/VolunteersAdminPage";
import DonationsPage from "@/pages/admin/DonationsPage";
import TeamMembersPage from "@/pages/admin/TeamMembersPage";
import MessagesPage from "@/pages/admin/MessagesPage";
import SettingsPage from "@/pages/admin/SettingsPage";

const queryClient = new QueryClient();

// Scroll helper to reset view or scroll to hash elements smoothly on path changes
const ScrollToHash = () => {
  const { hash, pathname } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.replace("#", "");
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 150);
      }
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [hash, pathname]);

  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToHash />
        <Routes>
          {/* ── Public routes ── */}
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/our-work" element={<OurWorkPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/volunteer" element={<VolunteerPage />} />

          {/* ── Admin routes (hidden, no public link) ── */}
          <Route
            path="/admin"
            element={
              <AuthProvider>
                <AdminLogin />
              </AuthProvider>
            }
          />
          <Route
            path="/admin/*"
            element={
              <AuthProvider>
                <AdminGuard>
                  <AdminLayout />
                </AdminGuard>
              </AuthProvider>
            }
          >
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="posts" element={<PostsPage />} />
            <Route path="posts/new" element={<PostEditor />} />
            <Route path="posts/edit/:id" element={<PostEditor />} />
            <Route path="events" element={<EventsPage />} />
            <Route path="gallery" element={<GalleryAdminPage />} />
            <Route path="volunteers" element={<VolunteersAdminPage />} />
            <Route path="donations" element={<DonationsPage />} />
            <Route path="team" element={<TeamMembersPage />} />
            <Route path="messages" element={<MessagesPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
