import React, { useState, useRef } from "react";
import {
  useGallery,
  useCreateGalleryItem,
  useUpdateGalleryItem,
  useDeleteGalleryItem,
  GalleryItem,
  GalleryItemInput,
} from "@/hooks/useFirestoreGallery";
import { useFirebaseStorage } from "@/hooks/useFirebaseStorage";
import { useToast } from "@/components/ui/use-toast";
import {
  Plus,
  Trash2,
  Image as ImageIcon,
  Upload,
  X,
  Loader2,
  Save,
  ArrowUpDown,
  Filter,
  Check,
  Edit2,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

type GalleryCategory = "Nature" | "Our Work" | "Events" | "Recognition";
const categories: GalleryCategory[] = ["Nature", "Our Work", "Events", "Recognition"];

const GalleryAdminPage: React.FC = () => {
  const { data: galleryItems, isLoading } = useGallery();
  const createMutation = useCreateGalleryItem();
  const updateMutation = useUpdateGalleryItem();
  const deleteMutation = useDeleteGalleryItem();
  const { progress, isUploading, uploadFile, resetUploadState } = useFirebaseStorage();
  const { toast } = useToast();

  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // UI states
  const [showAddForm, setShowAddForm] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>("All");
  
  // New Item states
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [newImagePreview, setNewImagePreview] = useState<string>("");
  const [newImageSrc, setNewImageSrc] = useState("");
  const [newAltText, setNewAltText] = useState("");
  const [newCategory, setNewCategory] = useState<GalleryCategory>("Nature");
  const [isSaving, setIsSaving] = useState(false);

  // Edit states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editAltText, setEditAltText] = useState("");
  const [editCategory, setEditCategory] = useState<GalleryCategory>("Nature");

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

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file",
        description: "Please select an image file.",
        variant: "destructive",
      });
      return;
    }
    setNewImageFile(file);
    setNewImagePreview(URL.createObjectURL(file));
  };

  const handleCreateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newImageFile && !newImageSrc.trim()) {
      toast({
        title: "Image source required",
        description: "Please upload an image or paste a direct image URL.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      let url = newImageSrc.trim();

      if (newImageFile) {
        toast({ title: "Processing image…", description: "Compressing locally." });
        const compressed = await compressImage(newImageFile, 800, 0.6);
        url = await fileToBase64(compressed);
      }

      // Determine order (append to end)
      const currentCount = galleryItems?.length || 0;
      
      const itemData: GalleryItemInput = {
        src: url,
        alt: newAltText.trim(),
        category: newCategory,
        order: currentCount,
      };

      await createMutation.mutateAsync(itemData);
      toast({
        title: "Image added",
        description: "Image added to the gallery successfully.",
      });

      // Reset Form
      setNewImageFile(null);
      setNewImagePreview("");
      setNewImageSrc("");
      setNewAltText("");
      setNewCategory("Nature");
      setShowAddForm(false);
    } catch (error: any) {
      console.error("Failed to add gallery item:", error);
      toast({
        title: "Error",
        description: error?.message || "Failed to add image to gallery.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
      resetUploadState();
    }
  };

  const handleStartEdit = (item: GalleryItem) => {
    setEditingId(item.id);
    setEditAltText(item.alt);
    setEditCategory(item.category);
  };

  const handleSaveEdit = async (id: string) => {
    try {
      await updateMutation.mutateAsync({
        id,
        data: {
          alt: editAltText.trim(),
          category: editCategory,
        },
      });
      setEditingId(null);
      toast({
        title: "Image updated",
        description: "Gallery item details have been saved.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to update item.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (item: GalleryItem) => {
    if (!window.confirm("Are you sure you want to delete this image?")) return;
    try {
      await deleteMutation.mutateAsync(item.id);
      toast({
        title: "Image deleted",
        description: "The image was successfully deleted from the gallery.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to delete image.",
        variant: "destructive",
      });
    }
  };

  const handleReorder = async (item: GalleryItem, direction: "up" | "down") => {
    if (!galleryItems) return;
    const index = galleryItems.findIndex((x) => x.id === item.id);
    if (index === -1) return;
    
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= galleryItems.length) return;

    const targetItem = galleryItems[targetIndex];

    try {
      // Swap order values
      await Promise.all([
        updateMutation.mutateAsync({ id: item.id, data: { order: targetItem.order } }),
        updateMutation.mutateAsync({ id: targetItem.id, data: { order: item.order } }),
      ]);
      toast({
        title: "Reordered",
        description: "Gallery order updated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update gallery order.",
        variant: "destructive",
      });
    }
  };

  const filteredItems = (galleryItems || []).filter((item) => {
    return filterCategory === "All" || item.category === filterCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Gallery</h1>
          <p className="mt-0.5 text-sm text-white/40">
            Upload and organize photos in the public gallery.
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition-all hover:from-emerald-500 hover:to-teal-500"
        >
          {showAddForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {showAddForm ? "Cancel" : "Add Image"}
        </button>
      </div>

      {/* Add Form Panel */}
      {showAddForm && (
        <form
          onSubmit={handleCreateItem}
          className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 space-y-4 max-w-2xl"
        >
          <h3 className="text-sm font-semibold uppercase tracking-wider text-emerald-400">
            Upload New Photo
          </h3>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Upload Zone */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium uppercase tracking-wider text-white/50">
                Photo File
              </label>
              {newImagePreview ? (
                <div className="relative overflow-hidden rounded-xl border border-white/[0.08]">
                  <img
                    src={newImagePreview}
                    alt="Preview"
                    className="h-40 w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setNewImageFile(null);
                      setNewImagePreview("");
                      setNewImageSrc("");
                    }}
                    className="absolute right-2 top-2 rounded-lg bg-black/60 p-1.5 text-white/70 backdrop-blur transition-colors hover:bg-black/80 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-white/[0.08] bg-white/[0.02] px-4 py-8 transition-all hover:border-emerald-500/30 hover:bg-white/[0.04]"
                >
                  {isUploading ? (
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="h-6 w-6 animate-spin text-emerald-400" />
                      <div className="w-28 overflow-hidden rounded-full bg-white/[0.08]">
                        <div
                          className="h-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-white/40">
                        {Math.round(progress)}%
                      </span>
                    </div>
                  ) : (
                    <>
                      <Upload className="mb-2 h-5 w-5 text-white/20" />
                      <p className="text-xs text-white/30">Click to upload image</p>
                      <p className="text-[10px] text-white/15">JPG, PNG, WebP — Max 10 MB</p>
                    </>
                  )}
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                disabled={isSaving || isUploading}
              />
              <div className="mt-2">
                <input
                  type="url"
                  placeholder="Or paste a direct image URL (https://…)"
                  value={newImageSrc}
                  onChange={(e) => {
                    setNewImageSrc(e.target.value);
                    setNewImagePreview(e.target.value);
                  }}
                  className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-xs text-white placeholder-white/20 outline-none transition-all focus:border-emerald-500/40"
                />
              </div>
            </div>

            {/* Inputs */}
            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="block text-xs font-medium uppercase tracking-wider text-white/50">
                  Category
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setNewCategory(cat)}
                      className={`rounded-lg py-1.5 text-[11px] font-medium transition-all
                        ${
                          newCategory === cat
                            ? "bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/20"
                            : "bg-white/[0.02] text-white/40 hover:bg-white/[0.05]"
                        }
                      `}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="alt-text"
                  className="block text-xs font-medium uppercase tracking-wider text-white/50"
                >
                  Description / Alt Text
                </label>
                <textarea
                  id="alt-text"
                  placeholder="Enter a brief description for accessibility…"
                  value={newAltText}
                  onChange={(e) => setNewAltText(e.target.value)}
                  rows={3}
                  className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-xs text-white placeholder-white/20 outline-none transition-all focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/20"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => {
                setShowAddForm(false);
                setNewImageFile(null);
                setNewImagePreview("");
                setNewAltText("");
              }}
              className="rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-2 text-xs font-medium text-white/50 transition-all hover:bg-white/[0.05]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving || isUploading || !newImageFile}
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
                  Save Photo
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* Filter bar */}
      <div className="flex items-center gap-2">
        <Filter className="h-3.5 w-3.5 text-white/25" />
        <span className="text-xs text-white/40 uppercase tracking-wider mr-2">Filter:</span>
        <div className="flex flex-wrap gap-1">
          <button
            onClick={() => setFilterCategory("All")}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all
              ${
                filterCategory === "All"
                  ? "bg-emerald-500/15 text-emerald-400"
                  : "text-white/40 hover:text-white/60 bg-white/[0.02]"
              }
            `}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all
                ${
                  filterCategory === cat
                    ? "bg-emerald-500/15 text-emerald-400"
                    : "text-white/40 hover:text-white/60 bg-white/[0.02]"
                }
              `}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Gallery Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-white/30" />
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.02] py-20">
          <ImageIcon className="h-10 w-10 text-white/10 mb-2" />
          <p className="text-sm text-white/30">No photos in this category yet</p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item, index) => {
            const isEditingThis = editingId === item.id;
            return (
              <div
                key={item.id}
                className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] transition-all hover:border-white/[0.12] flex flex-col"
              >
                {/* Image & Reorder buttons */}
                <div className="relative aspect-video w-full bg-black/40 overflow-hidden">
                  <img
                    src={item.src}
                    alt={item.alt}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                  
                  {/* Category Tag */}
                  <span className="absolute left-3 top-3 rounded-full bg-emerald-500/80 px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase text-white shadow-md">
                    {item.category}
                  </span>

                  {/* Reordering Controls (Only visible when not filtering or if order swapping is clean) */}
                  {filterCategory === "All" && (
                    <div className="absolute right-2 top-2 flex flex-col gap-1 rounded-lg bg-black/60 p-1 opacity-0 transition-opacity group-hover:opacity-100 backdrop-blur-sm">
                      <button
                        onClick={() => handleReorder(item, "up")}
                        disabled={index === 0}
                        className="rounded p-1 text-white/50 hover:bg-white/10 hover:text-white disabled:opacity-20"
                        title="Move Up"
                      >
                        <ChevronUp className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleReorder(item, "down")}
                        disabled={index === filteredItems.length - 1}
                        className="rounded p-1 text-white/50 hover:bg-white/10 hover:text-white disabled:opacity-20"
                        title="Move Down"
                      >
                        <ChevronDown className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Info and action panel */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  {isEditingThis ? (
                    <div className="space-y-2.5">
                      <div>
                        <label className="block text-[10px] font-semibold text-white/30 uppercase tracking-wider mb-1">
                          Category
                        </label>
                        <select
                          value={editCategory}
                          onChange={(e) => setEditCategory(e.target.value as GalleryCategory)}
                          className="w-full rounded-lg border border-white/[0.08] bg-white/[0.04] px-2.5 py-1.5 text-xs text-white outline-none focus:border-emerald-500/40"
                        >
                          {categories.map((c) => (
                            <option key={c} value={c} className="bg-neutral-900">
                              {c}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-white/30 uppercase tracking-wider mb-1">
                          Alt Text / Description
                        </label>
                        <textarea
                          value={editAltText}
                          onChange={(e) => setEditAltText(e.target.value)}
                          rows={2}
                          className="w-full rounded-lg border border-white/[0.08] bg-white/[0.04] px-2.5 py-1.5 text-xs text-white outline-none focus:border-emerald-500/40"
                        />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="text-xs text-white/70 line-clamp-2 min-h-[2rem]">
                        {item.alt || <span className="italic text-white/30">No description</span>}
                      </p>
                      <span className="mt-2 block text-[9px] font-semibold text-white/20 uppercase tracking-wider">
                        Order #{item.order}
                      </span>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between border-t border-white/[0.06] pt-3">
                    <div className="flex gap-1">
                      {isEditingThis ? (
                        <>
                          <button
                            onClick={() => handleSaveEdit(item.id)}
                            className="inline-flex items-center gap-1 rounded-lg bg-emerald-500/15 px-2.5 py-1.5 text-[11px] font-semibold text-emerald-400 hover:bg-emerald-500/25"
                          >
                            <Check className="h-3 w-3" />
                            Save
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="inline-flex items-center gap-1 rounded-lg bg-white/[0.04] px-2.5 py-1.5 text-[11px] font-semibold text-white/60 hover:bg-white/[0.08]"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleStartEdit(item)}
                          className="inline-flex items-center gap-1 rounded-lg bg-white/[0.04] px-2.5 py-1.5 text-[11px] font-semibold text-white/50 hover:bg-white/[0.08] hover:text-white"
                        >
                          <Edit2 className="h-3 w-3" />
                          Edit
                        </button>
                      )}
                    </div>
                    
                    {!isEditingThis && (
                      <button
                        onClick={() => handleDelete(item)}
                        className="rounded-lg p-1.5 text-white/30 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                        title="Delete photo"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default GalleryAdminPage;
