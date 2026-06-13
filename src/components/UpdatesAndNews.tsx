import React, { useState } from "react";
import { usePublishedPosts, Post } from "@/hooks/useFirestorePosts";
import { format } from "date-fns";
import {
  Calendar,
  X,
  Video,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Leaf,
  Heart,
  MessageCircle,
  Send,
  Bookmark,
} from "lucide-react";
import defaultImage from "@/assets/hero-forest.jpg";

const categoryStyles: Record<string, { bg: string; text: string; border: string }> = {
  news: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-700 dark:text-emerald-400",
    border: "border-emerald-500/25",
  },
  event: {
    bg: "bg-blue-500/10",
    text: "text-blue-700 dark:text-blue-400",
    border: "border-blue-500/25",
  },
  update: {
    bg: "bg-amber-500/10",
    text: "text-amber-700 dark:text-amber-400",
    border: "border-amber-500/25",
  },
  announcement: {
    bg: "bg-purple-500/10",
    text: "text-purple-700 dark:text-purple-400",
    border: "border-purple-500/25",
  },
};

const UpdatesAndNews: React.FC = () => {
  const { data: posts, isLoading } = usePublishedPosts();
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [showAll, setShowAll] = useState(false);

  const displayedPosts = showAll ? posts || [] : (posts || []).slice(0, 3);

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

  if (isLoading) {
    return (
      <section className="section-padding bg-cream/30 border-t border-border/40">
        <div className="container-wide text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary/20 border-t-primary mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">Loading latest updates…</p>
        </div>
      </section>
    );
  }

  if (!posts || posts.length === 0) {
    return null;
  }

  return (
    <section className="section-padding bg-cream/30 border-t border-border/40" id="updates">
      <div className="container-wide">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-xs font-semibold text-moss uppercase tracking-widest mb-4">
            LATEST UPDATES
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-brown-deep mb-6">
            News & Field Campaigns
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Follow our direct work, press statements, community announcements, and milestones from Poba Reserve Forest.
          </p>
        </div>

        {/* Posts Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {displayedPosts.map((post) => {
            const styles = categoryStyles[post.category] || categoryStyles.update;
            return (
              <div
                key={post.id}
                onClick={() => setSelectedPost(post)}
                className="group flex flex-col justify-between rounded-2xl bg-cream border border-border/40 overflow-hidden shadow-soft hover:shadow-elevated transition-all duration-300 cursor-pointer hover:-translate-y-1"
              >
                {/* Featured Image - Square container, object-contain to show full image */}
                <div className="relative aspect-square w-full bg-black/5 overflow-hidden border-b border-border/30 flex items-center justify-center">
                  <img
                    src={post.featuredImage || defaultImage}
                    alt={post.title}
                    className="max-w-full max-h-full object-contain transition-transform duration-500 group-hover:scale-102"
                    loading="lazy"
                  />
                  <div className="absolute left-4 top-4 flex gap-1.5">
                    <span
                      className={`rounded-full border px-3 py-0.5 text-[10px] font-semibold uppercase tracking-wider shadow-sm backdrop-blur-md bg-white/95 ${styles.text} ${styles.border}`}
                    >
                      {post.category}
                    </span>
                    {post.videoUrl && (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/95 text-moss shadow-sm backdrop-blur-md">
                        <Video className="h-3 w-3" />
                      </span>
                    )}
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                      <Calendar className="h-3.5 w-3.5 text-moss/70" />
                      {format(post.publishedAt || post.createdAt, "MMMM d, yyyy")}
                    </div>
                    <h3 className="font-display text-lg font-bold text-brown-deep leading-snug group-hover:text-moss transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                      {post.content}
                    </p>
                  </div>

                  <div className="inline-flex items-center gap-1 text-xs font-bold text-moss uppercase tracking-wider border-t border-border/20 pt-4 mt-auto">
                    Read Update
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Show More / Show Less Button */}
        {posts.length > 3 && (
          <div className="text-center mt-12">
            <button
              onClick={() => setShowAll(!showAll)}
              className="inline-flex items-center gap-2 rounded-xl border border-border/80 bg-cream px-5 py-2.5 text-sm font-semibold text-brown-deep transition-all hover:bg-cream/80 hover:text-moss"
            >
              {showAll ? (
                <>
                  <ChevronUp className="h-4 w-4" />
                  Show Fewer Updates
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4" />
                  Show All Updates ({posts.length})
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Modal Lightbox - Instagram Post Style */}
      {selectedPost && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-brown-deep/80 backdrop-blur-sm p-4 overflow-y-auto"
          onClick={() => setSelectedPost(null)}
        >
          <div
            className="relative w-full max-w-lg rounded-2xl bg-cream border border-border/50 shadow-elevated overflow-hidden flex flex-col my-8 max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header: Organization Avatar & Name */}
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-border/30">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-sm border border-emerald-500/20">
                  <Leaf className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-brown-deep tracking-wide leading-tight">
                    echoesofpoba
                  </h3>
                  <p className="text-[10px] text-muted-foreground leading-tight capitalize">
                    {selectedPost.category} • {format(selectedPost.publishedAt || selectedPost.createdAt, "MMM d, yyyy")}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedPost(null)}
                className="rounded-full p-1.5 text-muted-foreground hover:bg-black/5 hover:text-brown-deep transition-colors"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable Content (Insta-image + text caption underneath) */}
            <div className="overflow-y-auto flex-1 flex flex-col">
              {/* Media Space */}
              {selectedPost.videoUrl && getVideoEmbedUrl(selectedPost.videoUrl) ? (
                <div className="relative aspect-video w-full bg-black shrink-0">
                  <iframe
                    src={getVideoEmbedUrl(selectedPost.videoUrl)!}
                    title={selectedPost.title}
                    allowFullScreen
                    className="absolute inset-0 h-full w-full border-none"
                  />
                </div>
              ) : (
                selectedPost.featuredImage && (
                  <div className="relative w-full aspect-square bg-neutral-900/5 flex justify-center items-center border-b border-border/20 shrink-0">
                    <img
                      src={selectedPost.featuredImage}
                      alt={selectedPost.title}
                      className="max-w-full max-h-full object-contain w-full h-full"
                    />
                  </div>
                )
              )}

              {/* Insta Action Bar (For visual style) */}
              <div className="px-4 pt-3 flex items-center justify-between shrink-0">
                <div className="flex gap-4">
                  <Heart className="h-5 w-5 text-brown-deep hover:text-red-500 cursor-pointer transition-colors" />
                  <MessageCircle className="h-5 w-5 text-brown-deep hover:text-moss cursor-pointer transition-colors" />
                  <Send className="h-5 w-5 text-brown-deep hover:text-moss cursor-pointer transition-colors" />
                </div>
                <Bookmark className="h-5 w-5 text-brown-deep hover:text-moss cursor-pointer transition-colors" />
              </div>

              {/* Text Caption Area */}
              <div className="p-4 pt-3.5 space-y-3 flex-1">
                <div>
                  <span className="text-xs font-extrabold text-brown-deep mr-2">
                    echoesofpoba
                  </span>
                  <h1 className="inline font-display text-sm font-semibold text-brown-deep leading-snug">
                    {selectedPost.title}
                  </h1>
                </div>

                <div className="text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap font-sans">
                  {selectedPost.content}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default UpdatesAndNews;
