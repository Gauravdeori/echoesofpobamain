import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Leaf, ArrowLeft, ChevronDown, Sparkles, Globe, Heart, Camera } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/environment-day-hero.png";

/* ─── intersection-observer hook for scroll animations ─── */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
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

const WorldEnvironmentDay = () => {
  const aboutReveal = useReveal();
  const galleryReveal = useReveal();

  /* floating particles state for hero */
  const [particles] = useState(() =>
    Array.from({ length: 18 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 6,
      duration: 8 + Math.random() * 6,
      size: 4 + Math.random() * 8,
    }))
  );

  return (
    <div className="min-h-screen bg-background">
      {/* ─── HERO ─── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* background */}
        <div className="absolute inset-0">
          <img src={heroImage} alt="Lush green forest" className="w-full h-full object-cover" />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, hsla(20 35% 10% / 0.72) 0%, hsla(120 25% 15% / 0.5) 40%, hsla(20 35% 10% / 0.82) 100%)",
            }}
          />
        </div>

        {/* floating leaf particles */}
        {particles.map((p) => (
          <span
            key={p.id}
            className="absolute opacity-30 pointer-events-none"
            style={{
              left: `${p.left}%`,
              bottom: "-20px",
              width: p.size,
              height: p.size,
              borderRadius: "50% 0 50% 50%",
              background: "hsl(115 40% 50%)",
              animation: `wed-rise ${p.duration}s ${p.delay}s linear infinite`,
            }}
          />
        ))}

        {/* back button */}
        <Link
          to="/"
          className="absolute top-6 left-6 z-30 flex items-center gap-2 text-cream/80 hover:text-cream transition-colors text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {/* content */}
        <div className="relative z-10 container-wide px-4 md:px-8 text-center">
          <div className="max-w-4xl mx-auto animate-fade-up">
            {/* badge */}
            <div className="inline-flex items-center gap-2 bg-cream/10 backdrop-blur-sm border border-cream/20 rounded-full px-5 py-2 mb-8">
              <Globe className="w-4 h-4 text-gold-soft" />
              <span className="text-sm font-medium text-cream/90">June 5, 2024</span>
              <span className="text-cream/40">•</span>
              <span className="text-sm font-medium text-gold-soft">Event Concluded</span>
            </div>

            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-cream mb-6 leading-tight">
              A Resounding{" "}
              <span className="relative inline-block">
                <span className="text-gold-soft">Success</span>
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                  <path d="M2 8 C60 2, 140 2, 198 8" stroke="hsl(32 50% 55%)" strokeWidth="3" strokeLinecap="round" opacity="0.5" />
                </svg>
              </span>
            </h1>

            <p className="text-lg md:text-xl text-cream/85 max-w-2xl mx-auto mb-10 leading-relaxed">
              Thank you to everyone who stepped out to clean, protect, and restore our environment during the World Environment Day drive. Your efforts made a lasting impact!
            </p>

            <div className="inline-flex items-center gap-2 bg-gold-warm/20 border border-gold-warm/40 rounded-full px-6 py-3 mb-10">
              <Sparkles className="w-5 h-5 text-gold-warm" />
              <span className="text-lg font-semibold text-gold-soft">Thank you, Volunteers!</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="hero"
                size="xl"
                onClick={() => document.getElementById("wed-gallery")?.scrollIntoView({ behavior: "smooth" })}
              >
                <Camera className="w-5 h-5" />
                View Gallery
              </Button>
            </div>
          </div>
        </div>

        {/* scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
          <button
            onClick={() => document.getElementById("wed-about")?.scrollIntoView({ behavior: "smooth" })}
            className="flex flex-col items-center text-cream/60 hover:text-cream transition-colors"
            aria-label="Scroll down"
          >
            <span className="text-sm mb-2">Discover More</span>
            <ChevronDown className="w-6 h-6" />
          </button>
        </div>
      </section>

      {/* ─── ABOUT THE SUCCESS ─── */}
      <section
        id="wed-about"
        className="section-padding"
        style={{ background: "var(--gradient-section)" }}
      >
        <div
          ref={aboutReveal.ref}
          className={`container-wide transition-all duration-700 ${aboutReveal.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-6">
                <Leaf className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">Impact Achieved</span>
              </div>
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-brown-deep mb-6 leading-tight">
                One Day. One Forest.{" "}
                <span className="text-primary">One Community.</span>
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                The World Environment Day drive brought together people from all walks of life. With incredible dedication, our volunteers cleaned up public areas, sorted waste, and planted numerous tree saplings to revitalize our green cover.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                We couldn't have achieved this milestone without the hard work and enthusiasm of our community. Below is a glimpse of the difference we made together.
              </p>
            </div>

            {/* decorative card */}
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-primary/15 via-transparent to-gold-warm/15 rounded-3xl blur-2xl" />
              <div className="relative bg-cream rounded-3xl overflow-hidden shadow-elevated border border-border">
                <div className="aspect-[4/3] relative">
                  <img
                    src={galleryImages[0].src}
                    alt="Poba forest volunteers"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-cream via-transparent to-transparent" />
                </div>
                <div className="p-6 -mt-8 relative">
                  <div className="flex items-center gap-2 mb-3">
                    <Heart className="w-4 h-4 text-primary fill-primary" />
                    <span className="text-sm font-semibold text-primary">Community Driven</span>
                  </div>
                  <h3 className="font-display text-xl font-bold text-brown-deep mb-2">
                    Cleanliness & Plantation Program
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    A tremendous effort by everyone involved to protect and restore nature.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── GALLERY ─── */}
      <section id="wed-gallery" className="section-padding bg-secondary/50">
        <div
          ref={galleryReveal.ref}
          className={`container-wide transition-all duration-700 ${galleryReveal.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-6">
              <Camera className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Moments Captured</span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-brown-deep mb-4">
              Event Gallery
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Relive the highlights of our cleanliness and plantation drive.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {galleryImages.map((image, i) => (
              <div
                key={i}
                className="group relative rounded-2xl overflow-hidden shadow-card hover:shadow-elevated transition-all duration-500 hover:-translate-y-1 bg-cream border border-border/50 flex flex-col"
                style={{ transitionDelay: `${(i % 3) * 80}ms` }}
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
        </div>
      </section>

      {/* ─── FOOTER STRIP ─── */}
      <footer
        className="py-8 text-center"
        style={{
          background: "linear-gradient(135deg, hsl(20 35% 16%) 0%, hsl(120 25% 20%) 100%)",
        }}
      >
        <p className="text-cream/70 text-sm">
          © {new Date().getFullYear()} Echoes of Poba · World Environment Day Drive
        </p>
        <Link to="/" className="inline-flex items-center gap-2 text-cream/50 hover:text-cream text-sm mt-2 transition-colors">
          <ArrowLeft className="w-3 h-3" />
          Return to main site
        </Link>
      </footer>
    </div>
  );
};

export default WorldEnvironmentDay;
