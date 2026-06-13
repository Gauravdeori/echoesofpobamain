import React, { useState, useRef, useEffect } from "react";
import {
  useEvents,
  useCreateEvent,
  useUpdateEvent,
  useDeleteEvent,
  EventItem,
  EventItemInput,
} from "@/hooks/useFirestoreEvents";
import { useFirebaseStorage } from "@/hooks/useFirebaseStorage";
import { useToast } from "@/components/ui/use-toast";
import {
  Plus,
  Trash2,
  Calendar,
  MapPin,
  Upload,
  X,
  Loader2,
  Save,
  Filter,
  Search,
  Check,
  Edit2,
  Clock,
  ImageIcon,
} from "lucide-react";
import { format } from "date-fns";

type EventStatus = "upcoming" | "past" | "draft";

const EventsPage: React.FC = () => {
  const { data: events, isLoading } = useEvents();
  const createMutation = useCreateEvent();
  const updateMutation = useUpdateEvent();
  const deleteMutation = useDeleteEvent();
  const { progress, isUploading, uploadFile, resetUploadState } = useFirebaseStorage();
  const { toast } = useToast();

  const fileInputRef = useRef<HTMLInputElement>(null);

  // UI States
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [featuredImage, setFeaturedImage] = useState("");
  const [status, setStatus] = useState<EventStatus>("upcoming");
  const [isSaving, setIsSaving] = useState(false);

  // Reset or populate form when editingId changes
  useEffect(() => {
    if (editingId && events) {
      const item = events.find((x) => x.id === editingId);
      if (item) {
        setTitle(item.title);
        setDescription(item.description);
        setLocation(item.location);
        setFeaturedImage(item.featuredImage || "");
        setStatus(item.status);
        
        // Parse date and time
        const d = new Date(item.date);
        setDate(d.toISOString().split("T")[0]);
        setTime(d.toTimeString().slice(0, 5));
        
        setShowForm(true);
      }
    } else {
      // Clear form
      setTitle("");
      setDescription("");
      setLocation("");
      setFeaturedImage("");
      setStatus("upcoming");
      setDate("");
      setTime("");
    }
  }, [editingId, events]);

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
    try {
      toast({ title: "Compressing image…", description: "Optimizing for upload." });
      const compressed = await compressImage(file);
      
      const uploadPath = `events/images/${Date.now()}_${compressed.name.replace(/\s+/g, "_")}`;
      const url = await uploadFile(compressed, uploadPath);
      setFeaturedImage(url);
      toast({ title: "Image uploaded", description: "Event image set successfully." });
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error?.message || "Failed to upload image.",
        variant: "destructive",
      });
    } finally {
      resetUploadState();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date || !time || !location.trim()) {
      toast({
        title: "Missing fields",
        description: "Please fill out all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    const eventDate = new Date(`${date}T${time}`);
    const eventInput: EventItemInput = {
      title: title.trim(),
      description: description.trim(),
      date: eventDate,
      location: location.trim(),
      featuredImage: featuredImage || undefined,
      status,
    };

    try {
      if (editingId) {
        await updateMutation.mutateAsync({ id: editingId, data: eventInput });
        toast({ title: "Event updated", description: `"${title}" has been saved.` });
      } else {
        await createMutation.mutateAsync(eventInput);
        toast({ title: "Event created", description: `"${title}" was added successfully.` });
      }
      setShowForm(false);
      setEditingId(null);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to save event.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (item: EventItem) => {
    if (!window.confirm(`Are you sure you want to delete event "${item.title}"?`)) return;
    try {
      await deleteMutation.mutateAsync(item.id);
      toast({ title: "Event deleted", description: `"${item.title}" has been removed.` });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to delete event.",
        variant: "destructive",
      });
    }
  };

  const filteredEvents = (events || []).filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase()) ||
      item.location.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || item.status === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Events</h1>
          <p className="mt-0.5 text-sm text-white/40">
            Create, edit, and organize community and environmental events.
          </p>
        </div>
        <button
          onClick={() => {
            if (showForm) {
              setShowForm(false);
              setEditingId(null);
            } else {
              setShowForm(true);
            }
          }}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition-all hover:from-emerald-500 hover:to-teal-500"
        >
          {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {showForm ? "Cancel" : "Add Event"}
        </button>
      </div>

      {/* Form Card */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 space-y-4 max-w-3xl"
        >
          <h3 className="text-sm font-semibold uppercase tracking-wider text-emerald-400">
            {editingId ? "Edit Event Details" : "Create New Event"}
          </h3>

          <div className="grid gap-4 md:grid-cols-2">
            {/* Left side */}
            <div className="space-y-3.5">
              <div className="space-y-1.5">
                <label className="block text-xs font-medium uppercase tracking-wider text-white/50">
                  Event Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter event name…"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder-white/20 outline-none transition-all focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium uppercase tracking-wider text-white/50">
                    Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2.5 text-xs text-white outline-none focus:border-emerald-500/40 [color-scheme:dark]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium uppercase tracking-wider text-white/50">
                    Time *
                  </label>
                  <input
                    type="time"
                    required
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2.5 text-xs text-white outline-none focus:border-emerald-500/40 [color-scheme:dark]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-medium uppercase tracking-wider text-white/50">
                  Location *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jonai, Rangkop, or Poba Forest…"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder-white/20 outline-none transition-all focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/20"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-medium uppercase tracking-wider text-white/50">
                  Status
                </label>
                <div className="flex gap-2">
                  {(["upcoming", "past", "draft"] as EventStatus[]).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setStatus(st)}
                      className={`flex-1 rounded-xl py-2 text-xs font-semibold capitalize transition-all
                        ${
                          status === st
                            ? st === "upcoming"
                              ? "bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/20"
                              : st === "past"
                              ? "bg-blue-500/15 text-blue-400 ring-1 ring-blue-500/20"
                              : "bg-white/[0.1] text-white/70 ring-1 ring-white/[0.15]"
                            : "bg-white/[0.02] text-white/40 hover:bg-white/[0.05]"
                        }
                      `}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right side (Description & Image) */}
            <div className="space-y-3.5">
              <div className="space-y-1.5">
                <label className="block text-xs font-medium uppercase tracking-wider text-white/50">
                  Description
                </label>
                <textarea
                  placeholder="Enter event details and schedules…"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder-white/20 outline-none transition-all focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/20 resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-medium uppercase tracking-wider text-white/50">
                  Featured Image
                </label>
                {featuredImage ? (
                  <div className="relative overflow-hidden rounded-xl border border-white/[0.08] h-32">
                    <img
                      src={featuredImage}
                      alt="Featured"
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setFeaturedImage("")}
                      className="absolute right-2 top-2 rounded-lg bg-black/60 p-1.5 text-white/70 backdrop-blur transition-colors hover:bg-black/80 hover:text-white"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-white/[0.08] bg-white/[0.02] px-4 py-7 transition-all hover:border-emerald-500/30 hover:bg-white/[0.04]"
                  >
                    {isUploading ? (
                      <div className="flex flex-col items-center gap-1.5">
                        <Loader2 className="h-5 w-5 animate-spin text-emerald-400" />
                        <div className="w-24 overflow-hidden rounded-full bg-white/[0.08]">
                          <div
                            className="h-1 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-white/40">{Math.round(progress)}%</span>
                      </div>
                    ) : (
                      <>
                        <Upload className="mb-1.5 h-5 w-5 text-white/20" />
                        <p className="text-xs text-white/30">Click to upload image</p>
                        <p className="text-[9px] text-white/12">JPG, PNG, WebP — Max 5 MB</p>
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
                  disabled={isSaving || isUploading}
                />
                <div className="mt-2">
                  <input
                    type="url"
                    placeholder="Or paste a direct image URL (e.g. https://example.com/image.jpg)…"
                    value={featuredImage}
                    onChange={(e) => setFeaturedImage(e.target.value)}
                    className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-xs text-white placeholder-white/20 outline-none transition-all focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/20"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-white/[0.04]">
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
              }}
              className="rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-2 text-xs font-medium text-white/50 transition-all hover:bg-white/[0.05]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving || isUploading}
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2 text-xs font-semibold text-white transition-all hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Saving…
                </>
              ) : (
                <>
                  <Save className="h-3.5 w-3.5" />
                  Save Event
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* Filters & Search */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/25" />
          <input
            type="text"
            placeholder="Search events by title, description or location…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] py-2.5 pl-10 pr-4 text-sm text-white placeholder-white/20 outline-none transition-all focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/20"
          />
        </div>
        <div className="flex items-center gap-1 rounded-xl border border-white/[0.08] bg-white/[0.02] p-1">
          <Filter className="ml-2 h-3.5 w-3.5 text-white/25" />
          {["All", "Upcoming", "Past", "Draft"].map((btn) => (
            <button
              key={btn}
              onClick={() => setStatusFilter(btn)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all
                ${
                  statusFilter === btn
                    ? "bg-emerald-500/15 text-emerald-400"
                    : "text-white/40 hover:text-white/60"
                }
              `}
            >
              {btn}
            </button>
          ))}
        </div>
      </div>

      {/* Events List / Cards */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-white/30" />
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.02] py-20">
          <Calendar className="h-10 w-10 text-white/10 mb-2" />
          <p className="text-sm text-white/30">No events found matching your search</p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map((item) => (
            <div
              key={item.id}
              className="flex flex-col rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12] overflow-hidden transition-all duration-300"
            >
              {/* Image Banner */}
              <div className="relative aspect-video bg-black/40">
                {item.featuredImage ? (
                  <img
                    src={item.featuredImage}
                    alt={item.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-emerald-950/20 text-emerald-500/40">
                    <ImageIcon className="h-10 w-10" />
                  </div>
                )}
                {/* Status Badge */}
                <span
                  className={`absolute left-3 top-3 rounded-full px-2.5 py-0.5 text-[9px] font-bold tracking-wider uppercase shadow-md
                    ${
                      item.status === "upcoming"
                        ? "bg-emerald-500/80 text-white"
                        : item.status === "past"
                        ? "bg-blue-500/80 text-white"
                        : "bg-neutral-600/80 text-neutral-200"
                    }
                  `}
                >
                  {item.status}
                </span>
              </div>

              {/* Info details */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-white/90 line-clamp-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-white/40 line-clamp-3 min-h-[3rem]">
                    {item.description || <span className="italic text-white/20">No description</span>}
                  </p>

                  <div className="pt-2 space-y-1">
                    <div className="flex items-center gap-1.5 text-[11px] text-white/50">
                      <Clock className="h-3 w-3 text-emerald-400" />
                      {format(item.date, "MMM d, yyyy 'at' h:mm a")}
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-white/50">
                      <MapPin className="h-3 w-3 text-emerald-400" />
                      {item.location}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-white/[0.06] pt-3">
                  <button
                    onClick={() => {
                      setEditingId(item.id);
                    }}
                    className="inline-flex items-center gap-1 rounded-lg bg-white/[0.04] px-2.5 py-1.5 text-[11px] font-semibold text-white/50 hover:bg-white/[0.08] hover:text-white"
                  >
                    <Edit2 className="h-3 w-3" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item)}
                    disabled={deleteMutation.isPending}
                    className="rounded-lg p-1.5 text-white/30 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventsPage;
