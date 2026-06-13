import React from "react";
import { Link } from "react-router-dom";
import { usePosts } from "@/hooks/useFirestorePosts";
import {
  FileText,
  CheckCircle2,
  Clock,
  FilePen,
  Plus,
  ExternalLink,
  Loader2,
  TrendingUp,
} from "lucide-react";
import { format } from "date-fns";

const AdminDashboard: React.FC = () => {
  const { data: posts, isLoading } = usePosts();

  const totalPosts = posts?.length || 0;
  const published = posts?.filter((p) => p.status === "published").length || 0;
  const drafts = posts?.filter((p) => p.status === "draft").length || 0;
  const scheduled = posts?.filter((p) => p.status === "scheduled").length || 0;

  const stats = [
    {
      label: "Total Posts",
      value: totalPosts,
      icon: FileText,
      gradient: "from-emerald-500 to-teal-600",
      shadow: "shadow-emerald-500/20",
    },
    {
      label: "Published",
      value: published,
      icon: CheckCircle2,
      gradient: "from-green-500 to-emerald-600",
      shadow: "shadow-green-500/20",
    },
    {
      label: "Drafts",
      value: drafts,
      icon: FilePen,
      gradient: "from-amber-500 to-orange-500",
      shadow: "shadow-amber-500/20",
    },
    {
      label: "Scheduled",
      value: scheduled,
      icon: Clock,
      gradient: "from-blue-500 to-indigo-500",
      shadow: "shadow-blue-500/20",
    },
  ];

  const recentPosts = posts?.slice(0, 5) || [];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">
            Dashboard
          </h1>
          <p className="mt-0.5 text-sm text-white/40">
            Welcome back. Here's an overview of your content.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            to="/admin/posts/new"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition-all hover:from-emerald-500 hover:to-teal-500"
          >
            <Plus className="h-4 w-4" />
            New Post
          </Link>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm font-medium text-white/60 transition-all hover:bg-white/[0.06] hover:text-white/80"
          >
            <ExternalLink className="h-4 w-4" />
            View Site
          </a>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 transition-all duration-200 hover:border-white/[0.1] hover:bg-white/[0.04]"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-white/40">
                  {stat.label}
                </p>
                <p className="mt-2 text-3xl font-bold text-white">
                  {isLoading ? (
                    <Loader2 className="h-6 w-6 animate-spin text-white/30" />
                  ) : (
                    stat.value
                  )}
                </p>
              </div>
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg ${stat.shadow}`}
              >
                <stat.icon className="h-5 w-5 text-white" />
              </div>
            </div>
            {/* Bottom accent line */}
            <div
              className={`absolute bottom-0 left-0 h-[2px] w-full bg-gradient-to-r ${stat.gradient} opacity-0 transition-opacity group-hover:opacity-100`}
            />
          </div>
        ))}
      </div>

      {/* Recent posts */}
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02]">
        <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-emerald-400" />
            <h2 className="text-sm font-semibold text-white">Recent Posts</h2>
          </div>
          <Link
            to="/admin/posts"
            className="text-xs font-medium text-emerald-400 transition-colors hover:text-emerald-300"
          >
            View all →
          </Link>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-white/30" />
          </div>
        ) : recentPosts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <FileText className="mb-3 h-10 w-10 text-white/10" />
            <p className="text-sm text-white/30">No posts yet</p>
            <Link
              to="/admin/posts/new"
              className="mt-3 text-xs font-medium text-emerald-400 hover:text-emerald-300"
            >
              Create your first post →
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-white/[0.04]">
            {recentPosts.map((post) => (
              <Link
                key={post.id}
                to={`/admin/posts/edit/${post.id}`}
                className="flex items-center justify-between px-5 py-3.5 transition-colors hover:bg-white/[0.02]"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-white/80">
                    {post.title}
                  </p>
                  <p className="mt-0.5 text-xs text-white/30">
                    {format(post.createdAt, "MMM d, yyyy")}
                  </p>
                </div>
                <span
                  className={`ml-3 flex-shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide
                    ${
                      post.status === "published"
                        ? "bg-emerald-500/10 text-emerald-400"
                        : post.status === "scheduled"
                        ? "bg-blue-500/10 text-blue-400"
                        : "bg-white/[0.06] text-white/40"
                    }
                  `}
                >
                  {post.status}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
