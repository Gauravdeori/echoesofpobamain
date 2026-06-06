import { Sparkles, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const EnvironmentDayBanner = () => {
  return (
    <section className="relative overflow-hidden">
      <div
        className="py-4 px-4"
        style={{
          background:
            "linear-gradient(90deg, hsl(20 35% 18%) 0%, hsl(120 25% 25%) 40%, hsl(28 50% 38%) 100%)",
        }}
      >
        {/* subtle animated shimmer */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(110deg, transparent 25%, hsla(40 70% 80% / 0.25) 50%, transparent 75%)",
            backgroundSize: "200% 100%",
            animation: "shimmer 3s ease-in-out infinite",
          }}
        />

        <div className="container-wide relative flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-gold-soft animate-pulse" />
            <span className="text-cream font-semibold text-sm sm:text-base">
              🌍 World Environment Day 2026 was a huge success!
            </span>
          </div>
          <Link
            to="/#environment-day"
            className="inline-flex items-center gap-1.5 bg-cream/15 hover:bg-cream/25 backdrop-blur-sm border border-cream/20 rounded-full px-4 py-1.5 text-cream text-sm font-medium transition-all duration-300 hover:gap-2.5"
          >
            View Gallery
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default EnvironmentDayBanner;
