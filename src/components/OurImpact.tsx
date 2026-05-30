import { Recycle, Users, Sprout, Globe, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const stats = [
  {
    icon: Recycle,
    value: "10+",
    label: "Cleanup Drives",
    desc: "Consistent efforts to clear solid waste from forest trails.",
  },
  {
    icon: Users,
    value: "30+",
    label: "Active Volunteers",
    desc: "Empowering village youth in collaborative action.",
  },
  {
    icon: Sprout,
    value: "150kg",
    label: "Waste Collected",
    desc: "Plastics and metal debris removed from nature.",
  },
  {
    icon: Globe,
    value: "10km",
    label: "Trails Cleaned",
    desc: "Clearing wildlife corridors and footprints paths.",
  },
];

const OurImpact = () => {
  return (
    <section className="bg-forest-deep text-cream py-20 px-4 md:px-8 border-t border-cream/5">
      <div className="container-wide">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Left Text Block */}
          <div className="lg:col-span-4 space-y-6">
            <span className="text-xs font-semibold text-moss uppercase tracking-widest block">
              OUR IMPACT
            </span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
              Real impact.<br />
              Lasting change.
            </h2>
            <p className="text-cream/70 text-sm md:text-base leading-relaxed max-w-sm">
              We believe in measurable, transparent, and direct conservation actions 
              to keep Poba Reserve Forest clean and safe.
            </p>
            <div className="pt-2">
              <Link
                to="/our-work"
                className="inline-flex items-center gap-2 border border-cream/20 hover:border-moss hover:bg-moss/10 rounded-full px-6 py-3 text-sm font-semibold text-cream transition-all duration-300 group"
              >
                View Impact Details
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Right Grid Stats */}
          <div className="lg:col-span-8">
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((s, idx) => {
                const borderClasses = idx === 0 
                  ? "border-l-0 pl-0" 
                  : idx === 1
                  ? "border-l-0 pl-0 sm:border-l sm:pl-6" 
                  : idx === 2
                  ? "border-l-0 pl-0 md:border-l md:pl-6"
                  : "border-l-0 pl-0 sm:border-l sm:pl-6";

                return (
                  <div key={idx} className={`space-y-4 border-cream/10 ${borderClasses}`}>
                    <div className="w-10 h-10 rounded-lg bg-cream/5 flex items-center justify-center text-moss border border-cream/10">
                    <s.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-3xl md:text-4xl font-display font-bold text-cream tracking-tight">
                      {s.value}
                    </div>
                    <div className="text-sm font-semibold text-moss mt-1">
                      {s.label}
                    </div>
                    <p className="text-xs text-cream/50 mt-2 leading-relaxed">
                      {s.desc}
                    </p>
                  </div>
                </div>
              );
            })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurImpact;
