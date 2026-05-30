import { Button } from "@/components/ui/button";
import { Leaf, Recycle, Users, Sprout, Globe, Play } from "lucide-react";
import heroImage from "@/assets/hero-forest.jpg";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  const handleWatchStoryClick = () => {
    navigate("/our-work");
  };

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background Image with custom Nature Earth gradient overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Lush Poba Forest Canopy"
          className="w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, hsla(155, 45%, 6%, 0.82) 0%, hsla(155, 35%, 10%, 0.6) 50%, hsla(155, 40%, 12%, 0.85) 100%)",
          }}
        />
      </div>

      <div className="container-wide relative z-10 px-4 md:px-8 py-16 md:py-24 lg:py-32 w-full">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-7 text-cream animate-fade-up">
            {/* Date line */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-sm font-semibold text-moss uppercase tracking-widest">
                5th June
              </span>
              <div className="h-px w-16 bg-moss/60" />
            </div>

            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7.5xl font-bold leading-[1.1] mb-6">
              Protect Nature.<br />
              Secure <span className="text-moss">Our Future.</span>
            </h1>

            <p className="text-lg md:text-xl text-cream/85 max-w-xl leading-relaxed mb-8">
              We work with nature and local communities to build a sustainable,
              thriving ecosystem in Poba Reserve Forest.
            </p>

            <div className="flex flex-wrap items-center gap-5">
              <Button
                variant="hero"
                size="lg"
                onClick={() => navigate("/about")}
                className="bg-moss text-forest-deep hover:bg-moss/90 font-bold px-8 py-6 rounded-full text-base transition-all duration-300"
              >
                Our Mission &rarr;
              </Button>
              <button
                onClick={handleWatchStoryClick}
                className="flex items-center gap-3 text-cream hover:text-moss transition-colors font-medium text-base group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-full border border-cream/30 flex items-center justify-center bg-cream/5 group-hover:border-moss group-hover:bg-moss/10 transition-all duration-300">
                  <Play className="w-4 h-4 text-cream fill-cream group-hover:text-moss group-hover:fill-moss transition-all" />
                </div>
                Watch Our Story
              </button>
            </div>
          </div>

          {/* Right Floating Stats Column */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end animate-fade-in">
            <div className="w-full max-w-sm glass-card-dark rounded-2xl p-8 border border-cream/10 space-y-6 shadow-elevated">
              {[
                {
                  icon: Recycle,
                  stat: "10+",
                  label: "Cleanup Drives",
                  desc: "Restoring forest pathways",
                },
                {
                  icon: Users,
                  stat: "30+",
                  label: "Active Volunteers",
                  desc: "Empowering youth conservation",
                },
                {
                  icon: Sprout,
                  stat: "150kg+",
                  label: "Waste Collected",
                  desc: "Cleared from reserve habitats",
                },
                {
                  icon: Globe,
                  stat: "10km+",
                  label: "Trails Cleaned",
                  desc: "Preserving wildlife footprints",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-4 group hover:translate-x-1 transition-transform duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-moss/10 border border-moss/20 flex items-center justify-center text-moss shrink-0 group-hover:bg-moss/20 transition-all duration-300">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-bold text-cream tracking-tight">
                        {item.stat}
                      </span>
                      <span className="text-sm font-semibold text-moss">
                        {item.label}
                      </span>
                    </div>
                    <p className="text-xs text-cream/60 mt-0.5 leading-snug">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
