import React, { useState } from "react";
import { Link } from "react-router-dom";
import { usePosts, useDeletePost } from "@/hooks/useFirestorePosts";
import {
  Plus,
  Search,
  Trash2,
  Pencil,
  Loader2,
  FileText,
  Filter,
} from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";

type StatusFilter = "all" | "draft" | "published" | "scheduled";

const PostsPage: React.FC = () => {
  const { data: posts, isLoading } = usePosts();
  const deleteMutation = useDeletePost();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const filteredPosts = (posts || []).filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.content.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || post.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      await deleteMutation.mutateAsync(id);
      toast({ title: "Post deleted", description: `"${title}" has been removed.` });
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete post.",
        variant: "destructive",
      });
    }
  };

  const filterButtons: { label: string; value: StatusFilter }[] = [
    { label: "All", value: "all" },
    { label: "Published", value: "published" },
    { label: "Drafts", value: "draft" },
    { label: "Scheduled", value: "scheduled" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">
            Posts & Updates
          </h1>
          <p className="mt-0.5 text-sm text-white/40">
            Manage your content, news, and announcements.
          </p>
        </div>
        <Link
          to="/admin/posts/new"
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition-all hover:from-emerald-500 hover:to-teal-500"
        >
          <Plus className="h-4 w-4" />
          New Post
        </Link>
      </div>

      {/* Search + Filter bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/25" />
          <input
            id="posts-search"
            type="text"
            placeholder="Search posts…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] py-2.5 pl-10 pr-4 text-sm text-white placeholder-white/20 outline-none transition-all focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/20"
          />
        </div>
        <div className="flex items-center gap-1 rounded-xl border border-white/[0.08] bg-white/[0.02] p-1">
          <Filter className="ml-2 h-3.5 w-3.5 text-white/25" />
          {filterButtons.map((btn) => (
            <button
              key={btn.value}
              onClick={() => setStatusFilter(btn.value)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all
                ${
                  statusFilter === btn.value
                    ? "bg-emerald-500/15 text-emerald-400"
                    : "text-white/40 hover:text-white/60"
                }
              `}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Posts table / list */}
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-white/30" />
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <FileText className="mb-3 h-12 w-12 text-white/10" />
            <p className="text-sm text-white/30">
              {search || statusFilter !== "all"
                ? "No posts match your filters"
                : "No posts yet"}
            </p>
            {!search && statusFilter === "all" && (
              <Link
                to="/admin/posts/new"
                className="mt-3 text-xs font-medium text-emerald-400 hover:text-emerald-300"
              >
                Create your first post →
              </Link>
            )}
          </div>
        ) : (
          <>
            {/* Table header */}
            <div className="hidden border-b border-white/[0.06] px-5 py-3 sm:grid sm:grid-cols-12 sm:gap-4">
              <span className="col-span-5 text-[11px] font-semibold uppercase tracking-wider text-white/30">
                Title
              </span>
              <span className="col-span-2 text-[11px] font-semibold uppercase tracking-wider text-white/30">
                Category
              </span>
              <span className="col-span-2 text-[11px] font-semibold uppercase tracking-wider text-white/30">
                Status
              </span>
              <span className="col-span-2 text-[11px] font-semibold uppercase tracking-wider text-white/30">
                Date
              </span>
              <span className="col-span-1 text-right text-[11px] font-semibold uppercase tracking-wider text-white/30">
                Actions
              </span>
            </div>

            {/* Rows */}
            <div className="divide-y divide-white/[0.04]">
              {filteredPosts.map((post) => (
                <div
                  key={post.id}
                  className="group flex flex-col gap-2 px-5 py-3.5 transition-colors hover:bg-white/[0.02] sm:grid sm:grid-cols-12 sm:items-center sm:gap-4"
                >
                  <div className="col-span-5 min-w-0">
                    <Link
                      to={`/admin/posts/edit/${post.id}`}
                      className="block truncate text-sm font-medium text-white/80 transition-colors hover:text-emerald-400"
                    >
                      {post.title || "Untitled"}
                    </Link>
                  </div>
                  <div className="col-span-2">
                    <span className="rounded-md bg-white/[0.05] px-2 py-0.5 text-[11px] font-medium capitalize text-white/40">
                      {post.category}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span
                      className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide
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
                  </div>
                  <div className="col-span-2 text-xs text-white/30">
                    {format(post.createdAt, "MMM d, yyyy")}
                  </div>
                  <div className="col-span-1 flex items-center justify-end gap-1">
                    <Link
                      to={`/admin/posts/edit/${post.id}`}
                      className="rounded-lg p-2 text-white/30 transition-colors hover:bg-white/[0.06] hover:text-white/70"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Link>
                    <button
                      onClick={() => handleDelete(post.id, post.title)}
                      disabled={deleteMutation.isPending}
                      className="rounded-lg p-2 text-white/30 transition-colors hover:bg-red-500/10 hover:text-red-400"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PostsPage;
