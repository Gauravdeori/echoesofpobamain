import { Eye, Sparkles } from "lucide-react";
import forestCanopy from "@/assets/forest-canopy.jpg";

const Vision = () => {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={forestCanopy}
          alt="Forest canopy view"
          className="w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(180deg, hsla(20 35% 14% / 0.82) 0%, hsla(120 25% 18% / 0.78) 100%)",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 container-wide px-4 md:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-cream/10 backdrop-blur-sm rounded-full px-4 py-2 mb-8">
            <Eye className="w-4 h-4 text-gold-soft" />
            <span className="text-sm font-medium text-cream">Our Vision</span>
          </div>
          
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-cream mb-8 leading-tight">
            A Forest Full of <span className="text-gold-soft">Life</span>, Not Litter
          </h2>
          
          <p className="text-lg md:text-xl text-cream/90 leading-relaxed max-w-3xl mx-auto">
            A clean, living, and respected Poba Reserve Forest where nature thrives undisturbed 
            and future generations inherit a forest full of life, not litter.
          </p>

          <div className="mt-12 flex justify-center">
            <Sparkles className="w-8 h-8 text-gold-soft animate-float" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Vision;
