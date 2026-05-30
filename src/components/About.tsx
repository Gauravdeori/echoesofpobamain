import { Leaf } from "lucide-react";
import watercolorTree from "@/assets/watercolor-tree.png";

const About = () => {
  return (
    <section className="section-padding bg-background">
      <div className="container-wide">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left — Watercolor Tree */}
          <div className="flex justify-center">
            <img
              src={watercolorTree}
              alt="Watercolor illustration of a tree representing growth and conservation"
              className="w-full max-w-md h-auto drop-shadow-sm"
            />
          </div>

          {/* Right — Text Content */}
          <div>
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {/* Left column — belief */}
              <div>
                <h2 className="font-display text-2xl md:text-3xl font-bold text-brown-deep mb-4 leading-tight">
                  At Echoes of POBA,
                </h2>
                <p className="font-display text-lg text-brown-warm leading-relaxed">
                  we believe in sustainable actions
                  and collective responsibility.
                </p>
                <div className="flex items-center gap-3 mt-4">
                  <div className="h-px w-12 bg-brown-light/50" />
                  <Leaf className="w-4 h-4 text-primary/50" />
                </div>
              </div>

              {/* Right column — description */}
              <div>
                <p className="text-muted-foreground leading-relaxed">
                  Through our initiatives in afforestation,
                  conservation, and community engagement,
                  we strive to protect our environment
                  and empower future generations.
                </p>
                <a
                  href="#work"
                  onClick={(e) => {
                    e.preventDefault();
                    document.querySelector("#work")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="inline-flex items-center gap-2 mt-5 text-sm font-bold text-accent uppercase tracking-wider hover:text-accent/80 transition-colors"
                >
                  EXPLORE OUR PROJECTS
                  <span className="text-accent/60">✿</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
