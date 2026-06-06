import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Camera, ChevronDown, ChevronUp } from "lucide-react";

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
  { src: "/env-day/env-day-1.jpg", caption: "Community members teaming up to plant new tree saplings." },
  { src: "/env-day/env-day-2.jpg", caption: "Volunteers enthusiastically sweeping and clearing garbage from public spaces." },
  { src: "/env-day/env-day-3.jpg", caption: "Young environmentalists carefully planting and securing a young tree." },
  { src: "/env-day/env-day-4.jpg", caption: "A local playground area, cleaned and ready for children to enjoy." },
  { src: "/env-day/env-day-5.jpg", caption: "Our amazing group of volunteers posing behind the World Environment Day banner." },
  { src: "/env-day/env-day-6.jpg", caption: "Working hand-in-hand to ensure our local environment stays green." },
  { src: "/env-day/env-day-7.jpg", caption: "Collecting plastic waste and sorting it for proper disposal." },
  { src: "/env-day/env-day-8.jpg", caption: "Another tree planted, another step towards a healthier ecosystem." },
  { src: "/env-day/env-day-9.jpg", caption: "Dedicated individuals taking time off to care for Mother Nature." },
  { src: "/env-day/env-day-10.jpg", caption: "Teamwork makes the dream work—especially when it comes to conservation!" },
  { src: "/env-day/env-day-11.jpg", caption: "Showing immense dedication towards the cleanliness drive." },
  { src: "/env-day/env-day-12.jpg", caption: "Every small action counts: picking up litter along the walkways." },
  { src: "/env-day/env-day-13.jpg", caption: "A proud moment after successfully planting numerous saplings." },
  { src: "/env-day/env-day-14.jpg", caption: "Ensuring the roots are firmly planted in the soil." },
  { src: "/env-day/env-day-15.jpg", caption: "Smiles all around as the community comes together for a noble cause." },
  { src: "/env-day/env-day-16.jpg", caption: "Leading by example: teaching the next generation about environmental care." },
  { src: "/env-day/env-day-17.jpg", caption: "A cleaner, greener neighborhood thanks to our wonderful volunteers." },
  { src: "/env-day/env-day-18.jpg", caption: "Thank you to everyone who participated in the Echoes of Poba drive!" }
];

const EnvironmentDay = () => {
  const [showAll, setShowAll] = useState(false);
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
            World Environment Day 2024
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
            { label: "Event Date", value: "June 5, 2024" }
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
              className="group relative rounded-2xl overflow-hidden shadow-card hover:shadow-elevated transition-all duration-500 hover:-translate-y-1 bg-cream border border-border/50 flex flex-col"
            >
              <div className="aspect-[4/3] relative overflow-hidden bg-muted">
                <img
                  src={image.src}
                  alt={`Environment Day Gallery ${i + 1}`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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
    </section>
  );
};

export default EnvironmentDay;
