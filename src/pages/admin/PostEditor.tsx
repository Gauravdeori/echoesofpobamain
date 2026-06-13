import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/integrations/firebase/AuthContext";
import {
  usePost,
  useCreatePost,
  useUpdatePost,
  PostInput,
} from "@/hooks/useFirestorePosts";
import { useFirebaseStorage } from "@/hooks/useFirebaseStorage";
import { useToast } from "@/components/ui/use-toast";
import {
  ArrowLeft,
  Upload,
  X,
  Image as ImageIcon,
  Video,
  CalendarClock,
  Loader2,
  Save,
  Send,
  Clock,
  Eye,
} from "lucide-react";

type Category = "news" | "event" | "update" | "announcement";
type PublishMode = "draft" | "publish" | "schedule";

const categories: { label: string; value: Category }[] = [
  { label: "News", value: "news" },
  { label: "Event", value: "event" },
  { label: "Update", value: "update" },
  { label: "Announcement", value: "announcement" },
];

const PostEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: existingPost, isLoading: loadingPost } = usePost(id);
  const createMutation = useCreatePost();
  const updateMutation = useUpdatePost();
  const { progress, isUploading, uploadFile, resetUploadState } =
    useFirebaseStorage();

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<Category>("update");
  const [featuredImage, setFeaturedImage] = useState<string>("");
  const [videoUrl, setVideoUrl] = useState("");
  const [publishMode, setPublishMode] = useState<PublishMode>("draft");
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Populate form for editing
  useEffect(() => {
    if (existingPost) {
      setTitle(existingPost.title);
      setContent(existingPost.content);
      setCategory(existingPost.category);
      setFeaturedImage(existingPost.featuredImage || "");
      setVideoUrl(existingPost.videoUrl || "");
      if (existingPost.status === "scheduled" && existingPost.scheduledAt) {
        setPublishMode("schedule");
        const d = new Date(existingPost.scheduledAt);
        setScheduledDate(d.toISOString().split("T")[0]);
        setScheduledTime(d.toTimeString().slice(0, 5));
      } else if (existingPost.status === "published") {
        setPublishMode("publish");
      } else {
        setPublishMode("draft");
      }
    }
  }, [existingPost]);

  // Compress image before upload using Canvas API
  const compressImage = (file: File, maxWidth = 1200, quality = 0.8): Promise<File> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();
      reader.onload = (e) => {
        img.onload = () => {
          let { width, height } = img;
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (!ctx) { resolve(file); return; }
          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob(
            (blob) => {
              if (!blob) { resolve(file); return; }
              const compressed = new File([blob], file.name.replace(/\.\w+$/, ".webp"), {
                type: "image/webp",
                lastModified: Date.now(),
              });
              resolve(compressed);
            },
            "image/webp",
            quality
          );
        };
        img.onerror = () => resolve(file);
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file",
        description: "Please upload an image file.",
        variant: "destructive",
      });
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Maximum file size is 10 MB.",
        variant: "destructive",
      });
      return;
    }
    try {
      toast({ title: "Processing image…", description: "Compressing locally." });
      const compressed = await compressImage(file, 800, 0.6);
      const reader = new FileReader();
      reader.readAsDataURL(compressed);
      reader.onloadend = () => {
        const base64data = reader.result as string;
        setFeaturedImage(base64data);
        toast({ title: "Success", description: "Image compressed and set." });
      };
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to process image.",
        variant: "destructive",
      });
    }
  };

  const removeImage = () => {
    setFeaturedImage("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const getVideoEmbedUrl = (url: string): string | null => {
    if (!url) return null;
    // YouTube
    const ytMatch = url.match(
      /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );
    if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
    // Vimeo
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    return null;
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a post title.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    let status: "draft" | "published" | "scheduled" = "draft";
    let scheduledAt: Date | null = null;
    let publishedAt: Date | null = null;

    if (publishMode === "publish") {
      status = "published";
      publishedAt = new Date();
    } else if (publishMode === "schedule") {
      if (!scheduledDate || !scheduledTime) {
        toast({
          title: "Schedule required",
          description: "Please set a date and time for scheduling.",
          variant: "destructive",
        });
        setIsSaving(false);
        return;
      }
      status = "scheduled";
      scheduledAt = new Date(`${scheduledDate}T${scheduledTime}`);
      if (scheduledAt <= new Date()) {
        toast({
          title: "Invalid schedule",
          description: "Scheduled time must be in the future.",
          variant: "destructive",
        });
        setIsSaving(false);
        return;
      }
    }

    const postData: PostInput = {
      title: title.trim(),
      content,
      category,
      status,
      featuredImage: featuredImage || undefined,
      videoUrl: videoUrl || undefined,
      scheduledAt,
      publishedAt,
      authorId: user?.uid || "",
      authorEmail: user?.email || "",
    };

    try {
      if (isEditing && id) {
        await updateMutation.mutateAsync({ id, data: postData });
        toast({ title: "Post updated", description: "Changes saved." });
      } else {
        await createMutation.mutateAsync(postData);
        toast({
          title: "Post created",
          description:
            status === "published"
              ? "Post published successfully."
              : status === "scheduled"
              ? "Post scheduled."
              : "Draft saved.",
        });
      }
      navigate("/admin/posts");
    } catch (error: any) {
      console.error("Failed to save post:", error);
      toast({
        title: "Error",
        description: error?.message || "Failed to save post.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const embedUrl = getVideoEmbedUrl(videoUrl);

  if (isEditing && loadingPost) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-white/30" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/admin/posts")}
          className="rounded-lg p-2 text-white/40 transition-colors hover:bg-white/[0.06] hover:text-white/70"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="font-display text-2xl font-bold text-white">
            {isEditing ? "Edit Post" : "New Post"}
          </h1>
          <p className="text-sm text-white/40">
            {isEditing
              ? "Update your post content and settings"
              : "Create a new post, news, or announcement"}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main content — left 2/3 */}
        <div className="space-y-5 lg:col-span-2">
          {/* Title */}
          <div className="space-y-1.5">
            <label
              htmlFor="post-title"
              className="block text-xs font-medium uppercase tracking-wider text-white/50"
            >
              Title
            </label>
            <input
              id="post-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter post title…"
              className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-sm text-white placeholder-white/20 outline-none transition-all focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/20"
            />
          </div>

          {/* Content */}
          <div className="space-y-1.5">
            <label
              htmlFor="post-content"
              className="block text-xs font-medium uppercase tracking-wider text-white/50"
            >
              Content
            </label>
            <textarea
              id="post-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your post content here… Markdown is supported."
              rows={14}
              className="w-full resize-y rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-sm leading-relaxed text-white placeholder-white/20 outline-none transition-all focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/20"
            />
          </div>

          {/* Featured Image */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-white/50">
              <ImageIcon className="h-3.5 w-3.5" />
              Featured Image
            </label>
            {featuredImage ? (
              <div className="relative overflow-hidden rounded-xl border border-white/[0.08]">
                <img
                  src={featuredImage}
                  alt="Featured"
                  className="h-48 w-full object-cover"
                />
                <button
                  onClick={removeImage}
                  className="absolute right-2 top-2 rounded-lg bg-black/60 p-1.5 text-white/70 backdrop-blur transition-colors hover:bg-black/80 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-white/[0.08] bg-white/[0.02] px-4 py-10 transition-all hover:border-emerald-500/30 hover:bg-white/[0.04]"
              >
                {isUploading ? (
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-6 w-6 animate-spin text-emerald-400" />
                    <div className="w-40 overflow-hidden rounded-full bg-white/[0.08]">
                      <div
                        className="h-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <span className="text-xs text-white/40">
                      {Math.round(progress)}%
                    </span>
                  </div>
                ) : (
                  <>
                    <Upload className="mb-2 h-6 w-6 text-white/20" />
                    <p className="text-sm text-white/30">
                      Click to upload image
                    </p>
                    <p className="text-[11px] text-white/15">
                      JPG, PNG, WebP — Max 5 MB
                    </p>
                  </>
                )}
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <div className="mt-2">
              <input
                type="text"
                placeholder="Or paste a direct image URL (e.g. https://example.com/image.jpg)…"
                value={featuredImage}
                onChange={(e) => setFeaturedImage(e.target.value)}
                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-xs text-white placeholder-white/20 outline-none transition-all focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/20"
              />
            </div>
          </div>

          {/* Video URL */}
          <div className="space-y-1.5">
            <label
              htmlFor="post-video"
              className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-white/50"
            >
              <Video className="h-3.5 w-3.5" />
              Video URL
            </label>
            <input
              id="post-video"
              type="url"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://youtube.com/watch?v=… or https://vimeo.com/…"
              className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-sm text-white placeholder-white/20 outline-none transition-all focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/20"
            />
            {embedUrl && (
              <div className="mt-2 overflow-hidden rounded-xl border border-white/[0.08]">
                <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                  <iframe
                    src={embedUrl}
                    title="Video preview"
                    allowFullScreen
                    className="absolute inset-0 h-full w-full"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar — right 1/3 */}
        <div className="space-y-5">
          {/* Category */}
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 space-y-3">
            <label className="block text-xs font-medium uppercase tracking-wider text-white/50">
              Category
            </label>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setCategory(cat.value)}
                  className={`rounded-xl px-3 py-2 text-xs font-medium transition-all
                    ${
                      category === cat.value
                        ? "bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/20"
                        : "bg-white/[0.03] text-white/40 hover:bg-white/[0.06] hover:text-white/60"
                    }
                  `}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Publish mode */}
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 space-y-3">
            <label className="block text-xs font-medium uppercase tracking-wider text-white/50">
              Publish
            </label>
            <div className="space-y-2">
              <button
                onClick={() => setPublishMode("draft")}
                className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-medium transition-all
                  ${
                    publishMode === "draft"
                      ? "bg-white/[0.06] text-white/80 ring-1 ring-white/[0.1]"
                      : "text-white/40 hover:bg-white/[0.03] hover:text-white/60"
                  }
                `}
              >
                <Save className="h-3.5 w-3.5" />
                Save as Draft
              </button>
              <button
                onClick={() => setPublishMode("publish")}
                className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-medium transition-all
                  ${
                    publishMode === "publish"
                      ? "bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/20"
                      : "text-white/40 hover:bg-white/[0.03] hover:text-white/60"
                  }
                `}
              >
                <Send className="h-3.5 w-3.5" />
                Publish Now
              </button>
              <button
                onClick={() => setPublishMode("schedule")}
                className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-medium transition-all
                  ${
                    publishMode === "schedule"
                      ? "bg-blue-500/15 text-blue-400 ring-1 ring-blue-500/20"
                      : "text-white/40 hover:bg-white/[0.03] hover:text-white/60"
                  }
                `}
              >
                <CalendarClock className="h-3.5 w-3.5" />
                Schedule
              </button>
            </div>

            {/* Schedule date/time */}
            {publishMode === "schedule" && (
              <div className="space-y-2 pt-1">
                <input
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-xs text-white outline-none focus:border-blue-500/40 focus:ring-1 focus:ring-blue-500/20 [color-scheme:dark]"
                />
                <input
                  type="time"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-xs text-white outline-none focus:border-blue-500/40 focus:ring-1 focus:ring-blue-500/20 [color-scheme:dark]"
                />
                {scheduledDate && scheduledTime && (
                  <div className="flex items-center gap-1.5 rounded-lg bg-blue-500/10 px-2.5 py-1.5 text-[11px] text-blue-400">
                    <Clock className="h-3 w-3" />
                    {new Date(
                      `${scheduledDate}T${scheduledTime}`
                    ).toLocaleString()}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="space-y-2">
            <button
              onClick={handleSubmit}
              disabled={isSaving || isUploading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition-all hover:from-emerald-500 hover:to-teal-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving…
                </>
              ) : publishMode === "publish" ? (
                <>
                  <Send className="h-4 w-4" />
                  Publish
                </>
              ) : publishMode === "schedule" ? (
                <>
                  <CalendarClock className="h-4 w-4" />
                  Schedule
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Draft
                </>
              )}
            </button>
            <button
              onClick={() => navigate("/admin/posts")}
              className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm font-medium text-white/50 transition-all hover:bg-white/[0.06] hover:text-white/70"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostEditor;
