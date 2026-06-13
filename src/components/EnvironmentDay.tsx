import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Camera, ChevronDown, ChevronUp, X } from "lucide-react";

/* ─── intersection-observer hook for scroll animations ─── */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

/* ─── Gallery Data ─── */
const galleryImages = [
  { src: "/env-day/env-day-1.jpg", caption: "Community leaders and volunteers planting a sapling together during the World Environment Day 2026 drive." },
  { src: "/env-day/env-day-2.jpg", caption: "Volunteers sweeping and cleaning streets, collecting plastic waste." },
  { src: "/env-day/env-day-3.jpg", caption: "Students working together to plant a native tree sapling." },
  { src: "/env-day/env-day-4.jpg", caption: "A local children's playground cleaned up and restored by our team." },
  { src: "/env-day/env-day-5.jpg", caption: "A proud moment: Our large group of volunteers posing with their cleaning gear behind the event banner." },
  { src: "/env-day/env-day-6.jpg", caption: "Volunteers preparing the soil and carefully placing the sapling." },
  { src: "/env-day/env-day-7.jpg", caption: "Using tools to clear weeds and prepare the ground for plantation." },
  { src: "/env-day/env-day-8.jpg", caption: "Dozens of bags filled with collected plastic waste and garbage, ready for disposal." },
  { src: "/env-day/env-day-9.jpg", caption: "Eco-club members checking on a newly planted tree sapling." },
  { src: "/env-day/env-day-10.jpg", caption: "A tree sapling secured with a green protective mesh to ensure its survival." },
  { src: "/env-day/env-day-11.jpg", caption: "Young students actively participating and learning the process of tree plantation." },
  { src: "/env-day/env-day-12.jpg", caption: "Carefully securing the roots of a sapling in its new home." },
  { src: "/env-day/env-day-13.jpg", caption: "Playground area upgraded with protective guards installed around new saplings." },
  { src: "/env-day/env-day-14.jpg", caption: "Working in pairs to plant saplings and revitalize our community spaces." },
  { src: "/env-day/env-day-15.jpg", caption: "A volunteer ensuring the soil is firmly placed around the new tree." },
  { src: "/env-day/env-day-16.jpg", caption: "A team of young volunteers ready to sweep and clear litter from public streets." },
  { src: "/env-day/env-day-17.jpg", caption: "Clearing overgrown weeds and collecting hidden plastic waste in green patches." },
  { src: "/env-day/env-day-18.jpg", caption: "Volunteers of all ages working side-by-side to strengthen Poba's ecosystem." },
  { src: "/env-day/env-day-19.jpg", caption: "A young volunteer carefully planting a native sapling to help expand Poba's green canopy." },
  { src: "/env-day/env-day-20.jpg", caption: "Volunteers teaming up to plant a sapling, showcasing the spirit of teamwork on World Environment Day." },
  { src: "/env-day/env-day-21.jpg", caption: "Community members dedicating their time to nurture new trees and restore the local environment." },
  { src: "/env-day/env-day-22.jpg", caption: "Hands-on participation from the youth, playing a vital role in our tree-planting initiatives." },
  { src: "/env-day/env-day-23.jpg", caption: "A proud volunteer actively planting new life to restore the lush environment." },
  { src: "/env-day/env-day-24.jpg", caption: "Working together to dig and prepare the soil for a successful sapling plantation." },
  { src: "/env-day/env-day-25.jpg", caption: "Securing the sapling's roots to ensure a strong foundation for future growth." },
  { src: "/env-day/env-day-26.jpg", caption: "A snapshot of the incredible teamwork and dedication shown by our environmental heroes." }
];

const EnvironmentDay = () => {
  const [showAll, setShowAll] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const sectionReveal = useReveal();

  const displayedImages = showAll ? galleryImages : galleryImages.slice(0, 6);

  return (
    <section className="section-padding bg-secondary/30" style={{ background: "var(--gradient-section)" }}>
      <div
        ref={sectionReveal.ref}
        className={`container-wide transition-all duration-700 ${sectionReveal.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
      >
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Drive Highlights</span>
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-brown-deep mb-4">
            World Environment Day 2026
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our cleanliness, awareness, and plantation drive was a resounding success. 
            Thank you to all our volunteers for stepping up to protect Poba!
          </p>
        </div>

        {/* Info stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 max-w-4xl mx-auto">
          {[
            { label: "Saplings Planted", value: "50+" },
            { label: "Volunteers Joined", value: "30+" },
            { label: "Areas Cleaned", value: "Jonai & Rangkop" },
            { label: "Event Date", value: "June 5, 2026" }
          ].map((stat, i) => (
            <div key={i} className="bg-cream rounded-2xl p-6 shadow-soft border border-border/50 text-center">
              <span className="block text-2xl md:text-3xl font-bold text-primary mb-1">{stat.value}</span>
              <span className="text-xs text-muted-foreground uppercase tracking-wider">{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedImages.map((image, i) => (
            <div
              key={i}
              className="group relative rounded-2xl overflow-hidden shadow-card hover:shadow-elevated transition-all duration-500 hover:-translate-y-1 bg-cream border border-border/50 flex flex-col cursor-pointer"
              onClick={() => setSelectedImage(image.src)}
            >
              <div className="aspect-[4/3] relative overflow-hidden bg-muted">
                <img
                  src={image.src}
                  alt={`Environment Day Gallery ${i + 1}`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-brown-deep/15 md:bg-brown-deep/0 md:group-hover:bg-brown-deep/40 transition-colors duration-300 flex items-center justify-center">
                  <div className="bg-cream/90 text-brown-deep rounded-full p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-md">
                    <Camera className="w-5 h-5" />
                  </div>
                </div>
              </div>
              <div className="p-5 flex-grow flex items-center">
                <p className="text-sm text-muted-foreground font-medium text-center w-full">
                  {image.caption}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Show More / Show Less Button */}
        <div className="text-center mt-12">
          <Button
            onClick={() => setShowAll(!showAll)}
            variant="outline"
            size="lg"
            className="gap-2 bg-cream hover:bg-cream/80 border-border"
          >
            <Camera className="w-4 h-4 text-primary" />
            {showAll ? "Show Less" : "Show More Photos"}
            {showAll ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
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
            alt="Environment Day Lightbox"
            className="max-w-full max-h-[90vh] rounded-lg shadow-elevated"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  );
};

export default EnvironmentDay;
