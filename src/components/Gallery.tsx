import { useState } from "react";
import { X } from "lucide-react";
import heroForest from "@/assets/hero-forest.jpg";
import cleanupDrive1 from "@/assets/cleanup-drive-1.jpg";
import cleanupDrive2 from "@/assets/cleanup-drive-2.jpg";
import volunteersPair from "@/assets/volunteers-pair.jpg";
import forestCleanup from "@/assets/forest-cleanup.jpg";
import aerialRiver from "@/assets/aerial-river.jpg";
import forestTrailWalk from "@/assets/forest-trail-walk.jpg";
import stargazingEvent from "@/assets/stargazing-event.jpg";
import cleanupTeamBaskets from "@/assets/cleanup-team-baskets.jpg";
import cleanupCollage from "@/assets/cleanup-collage.jpg";
import certificateAppreciation from "@/assets/certificate-appreciation.jpg";

const galleryImages = [
  { src: heroForest, alt: "Aerial view of Poba Reserve Forest", category: "Nature" },
  { src: cleanupDrive1, alt: "Volunteers during cleanup drive", category: "Our Work" },
  { src: forestTrailWalk, alt: "Volunteers walking through the forest trail", category: "Our Work" },
  { src: cleanupTeamBaskets, alt: "Cleanup team with bamboo baskets at Poba", category: "Our Work" },
  { src: aerialRiver, alt: "Aerial view of river and forest", category: "Nature" },
  { src: stargazingEvent, alt: "Hon'ble MLA Jonai visiting the Echoes of Poba awareness camp on 2nd February, taking a pledge in support of Poba", category: "Events" },
  { src: cleanupCollage, alt: "Cleanup drive results and forest views", category: "Our Work" },
  { src: certificateAppreciation, alt: "Certificate of Appreciation from Poba Rainforest Nature Festival 2026", category: "Recognition" },
  { src: cleanupDrive2, alt: "Echoes of Poba team group photo", category: "Our Work" },
  { src: forestCleanup, alt: "Volunteers cleaning forest grounds", category: "Our Work" },
  { src: volunteersPair, alt: "Volunteers with collected waste bags", category: "Our Work" },
];

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <section className="section-padding bg-cream">
      <div className="container-wide">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-sm font-medium text-accent uppercase tracking-wider mb-4">
            Photo Gallery
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-brown-deep mb-6">
            Glimpses of Poba
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Explore the natural beauty of Poba Reserve Forest and our conservation efforts.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {galleryImages.map((image, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-xl cursor-pointer aspect-square"
              onClick={() => setSelectedImage(image.src)}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-brown-deep/15 md:bg-brown-deep/0 md:group-hover:bg-brown-deep/40 transition-colors duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-0 md:translate-y-full md:group-hover:translate-y-0 transition-transform duration-300">
                <span className="inline-block bg-cream/90 text-brown-deep text-xs font-medium px-3 py-1 rounded-full shadow-sm">
                  {image.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-brown-deep/95 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-cream hover:text-gold-soft transition-colors"
            onClick={() => setSelectedImage(null)}
            aria-label="Close lightbox"
          >
            <X className="w-8 h-8" />
          </button>
          <img
            src={selectedImage}
            alt="Gallery image"
            className="max-w-full max-h-[90vh] rounded-lg shadow-elevated"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  );
};

export default Gallery;
