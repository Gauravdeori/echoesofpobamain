import { Leaf, ArrowRight } from "lucide-react";
import forestBg from "@/assets/aerial-river.jpg";
import { useNavigate } from "react-router-dom";

const CallToActionBanner = () => {
  const navigate = useNavigate();

  return (
    <section className="py-12 px-4 md:px-8 bg-background">
      <div className="container-wide relative overflow-hidden rounded-3xl min-h-[220px] flex items-center p-8 md:p-12 border border-moss/20 shadow-elevated">
        {/* Background Image with Dark Forest Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={forestBg}
            alt="Poba Forest Canopy Background"
            className="w-full h-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, hsla(155, 45%, 6%, 0.85) 0%, hsla(155, 30%, 10%, 0.7) 100%)",
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 w-full flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Left Text side */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 sm:gap-5 max-w-xl">
            <div className="w-14 h-14 rounded-full bg-moss/20 border border-moss/30 flex items-center justify-center text-moss shrink-0 shadow-lg">
              <Leaf className="w-6 h-6 animate-sway" />
            </div>
            <div>
              <h3 className="font-display text-xl md:text-2xl font-bold text-cream">
                Be a part of the change.
              </h3>
              <p className="text-sm text-cream/70 mt-1 leading-relaxed">
                Together, we can create a healthier, greener, and more protected Poba Reserve Forest. Join us today.
              </p>
            </div>
          </div>

          {/* Right Buttons side */}
          <div className="flex flex-wrap items-center gap-4 shrink-0">
            <button
              onClick={() => navigate("/volunteer")}
              className="bg-moss hover:bg-moss/90 text-forest-deep font-bold px-6 py-3 rounded-full text-sm transition-all duration-300 shadow-md cursor-pointer flex items-center gap-2"
            >
              Volunteer With Us
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href="mailto:echoesofpoba@gmail.com?subject=Donation%20Inquiry%20-%20Echoes%20of%20Poba"
              className="border border-cream/20 hover:border-moss hover:bg-moss/10 text-cream font-bold px-6 py-3 rounded-full text-sm transition-all duration-300 cursor-pointer"
            >
              Donate Now
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToActionBanner;
