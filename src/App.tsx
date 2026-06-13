import { useEffect, lazy, Suspense } from "react";
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

// Lazy-load all admin modules so Firebase is only loaded when visiting /admin
const AdminLogin = lazy(() => import("@/pages/admin/AdminLogin"));
const AdminDashboard = lazy(() => import("@/pages/admin/AdminDashboard"));
const PostsPage = lazy(() => import("@/pages/admin/PostsPage"));
const PostEditor = lazy(() => import("@/pages/admin/PostEditor"));
const EventsPage = lazy(() => import("@/pages/admin/EventsPage"));
const GalleryAdminPage = lazy(() => import("@/pages/admin/GalleryAdminPage"));
const VolunteersAdminPage = lazy(() => import("@/pages/admin/VolunteersAdminPage"));
const DonationsPage = lazy(() => import("@/pages/admin/DonationsPage"));
const TeamMembersPage = lazy(() => import("@/pages/admin/TeamMembersPage"));
const MessagesPage = lazy(() => import("@/pages/admin/MessagesPage"));
const SettingsPage = lazy(() => import("@/pages/admin/SettingsPage"));

// These are small and needed for the admin shell, also lazy-loaded
const AdminGuard = lazy(() => import("@/components/admin/AdminGuard"));
const AdminLayout = lazy(() => import("@/components/admin/AdminLayout"));
const AuthProviderWrapper = lazy(() =>
  import("@/integrations/firebase/AuthContext").then((mod) => ({
    default: mod.AuthProvider,
  }))
);

const queryClient = new QueryClient();

// Loading fallback for admin routes
const AdminLoader = () => (
  <div className="flex h-screen w-full items-center justify-center bg-[#0a0f0d]">
    <div className="flex flex-col items-center gap-3">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500/20 border-t-emerald-400" />
      <p className="text-sm text-emerald-300/40 font-sans">Loading…</p>
    </div>
  </div>
);

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
              <Suspense fallback={<AdminLoader />}>
                <AuthProviderWrapper>
                  <AdminLogin />
                </AuthProviderWrapper>
              </Suspense>
            }
          />
          <Route
            path="/admin/*"
            element={
              <Suspense fallback={<AdminLoader />}>
                <AuthProviderWrapper>
                  <AdminGuard>
                    <AdminLayout />
                  </AdminGuard>
                </AuthProviderWrapper>
              </Suspense>
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
