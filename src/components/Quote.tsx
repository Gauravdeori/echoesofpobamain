import botanicalBranch from "@/assets/botanical-branch.png";

const Quote = () => {
  return (
    <section className="relative overflow-hidden py-16 md:py-20 bg-cream">
      <div className="container-wide px-4 md:px-8">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 max-w-5xl mx-auto">
          {/* Quote Mark & Text */}
          <div className="flex-1">
            <div className="flex items-start gap-4">
              {/* Decorative quote mark */}
              <span className="font-display text-7xl md:text-8xl font-bold text-accent/30 leading-none select-none -mt-4">
                &#x201C;&#x201C;
              </span>
              <div>
                <blockquote className="font-display text-2xl md:text-3xl font-semibold text-brown-deep italic leading-snug mb-4">
                  The earth does not belong to us;<br />
                  we belong to the earth.
                </blockquote>
                <cite className="text-sm font-medium text-muted-foreground not-italic">
                  – Chief Seattle
                </cite>
              </div>
            </div>
          </div>

          {/* Decorative Botanical Illustration */}
          <div className="w-32 md:w-44 shrink-0 opacity-60">
            <img
              src={botanicalBranch}
              alt=""
              aria-hidden="true"
              className="w-full h-auto animate-sway"
            />
          </div>
        </div>
      </div>

      {/* Subtle bottom border */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-border" />
    </section>
  );
};

export default Quote;
