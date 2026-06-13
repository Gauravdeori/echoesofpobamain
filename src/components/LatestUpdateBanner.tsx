import React, { useState, useEffect } from "react";
import { usePublishedPosts, Post } from "@/hooks/useFirestorePosts";
import { X, Bell, ArrowRight, Video, Calendar } from "lucide-react";
import { format } from "date-fns";

const LatestUpdateBanner: React.FC = () => {
  const { data: posts, isLoading } = usePublishedPosts();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  useEffect(() => {
    if (posts && posts.length > 0) {
      const latest = posts[0];
      const pubDate = latest.publishedAt || latest.createdAt;
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      // Show banner only if the post is less than 7 days old
      if (new Date(pubDate) >= oneWeekAgo) {
        // Check if user has already dismissed this specific post
        const dismissedPostId = localStorage.getItem("dismissed_announcement_id");
        if (dismissedPostId !== latest.id) {
          setIsOpen(true);
        }
      }
    }
  }, [posts]);

  if (isLoading || !isOpen || !posts || posts.length === 0) {
    return null;
  }

  const latestPost = posts[0];

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    localStorage.setItem("dismissed_announcement_id", latestPost.id);
    setIsOpen(false);
  };

  const getVideoEmbedUrl = (url: string): string | null => {
    if (!url) return null;
    const ytMatch = url.match(
      /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );
    if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    return null;
  };

  return (
    <>
      <div
        onClick={() => setSelectedPost(latestPost)}
        className="relative bg-gradient-to-r from-emerald-950 via-forest-deep to-neutral-900 border-b border-emerald-500/25 px-4 py-3.5 text-cream cursor-pointer hover:from-emerald-900 hover:to-neutral-800 transition-all duration-300 z-40 group shadow-md"
      >
        <div className="container-wide flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pr-10">
          <div className="flex items-center gap-3">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 animate-pulse">
              <Bell className="h-4 w-4" />
            </span>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/20">
                New
              </span>
              <span className="text-xs font-bold text-cream/90 group-hover:text-emerald-300 transition-colors line-clamp-1">
                {latestPost.title}
              </span>
              <span className="text-[11px] text-cream/40 hidden md:inline">
                • {format(latestPost.publishedAt || latestPost.createdAt, "MMM d, yyyy")}
              </span>
            </div>
          </div>
          <div className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 uppercase tracking-widest sm:ml-auto">
            Read Update
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </div>
        </div>

        {/* Dismiss Button */}
        <button
          onClick={handleDismiss}
          className="absolute right-4 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-cream/40 hover:bg-white/10 hover:text-cream transition-colors"
          aria-label="Dismiss banner"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Lightbox Modal for reading */}
      {selectedPost && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-brown-deep/80 backdrop-blur-sm p-4 overflow-y-auto"
          onClick={() => setSelectedPost(null)}
        >
          <div
            className="relative w-full max-w-3xl rounded-2xl bg-cream border border-border/50 shadow-elevated overflow-hidden flex flex-col my-8 max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedPost(null)}
              className="absolute right-4 top-4 z-10 rounded-full bg-black/60 p-2 text-white/80 transition-colors hover:bg-black/80 hover:text-white"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Featured Media / Banner */}
            <div className="overflow-y-auto">
              {selectedPost.videoUrl && getVideoEmbedUrl(selectedPost.videoUrl) ? (
                <div className="relative aspect-video w-full bg-black">
                  <iframe
                    src={getVideoEmbedUrl(selectedPost.videoUrl)!}
                    title={selectedPost.title}
                    allowFullScreen
                    className="absolute inset-0 h-full w-full border-none"
                  />
                </div>
              ) : (
                selectedPost.featuredImage && (
                  <div className="relative aspect-[21/9] w-full bg-black/10">
                    <img
                      src={selectedPost.featuredImage}
                      alt={selectedPost.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )
              )}

              {/* Main Content Area */}
              <div className="p-6 md:p-8 space-y-6">
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-full border px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-700 border-emerald-500/25">
                      {selectedPost.category}
                    </span>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                      <Calendar className="h-3.5 w-3.5" />
                      {format(selectedPost.publishedAt || selectedPost.createdAt, "MMMM d, yyyy")}
                    </div>
                  </div>

                  <h1 className="font-display text-2xl md:text-3xl font-bold text-brown-deep leading-tight">
                    {selectedPost.title}
                  </h1>
                </div>

                <div className="prose prose-stone dark:prose-invert max-w-none text-muted-foreground leading-relaxed text-sm md:text-base space-y-4 whitespace-pre-wrap font-sans">
                  {selectedPost.content}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LatestUpdateBanner;
