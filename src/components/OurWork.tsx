import cleanupDrive1 from "@/assets/cleanup-drive-1.jpg";
import cleanupDrive2 from "@/assets/cleanup-drive-2.jpg";
import forestTrailWalk from "@/assets/forest-trail-walk.jpg";

const OurWork = () => {
  return (
    <section className="section-padding bg-background">
      <div className="container-wide">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-sm font-medium text-accent uppercase tracking-wider mb-4">
            Our Work
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-brown-deep mb-6">
            Cleanliness Drives & Jungle Treks
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Real photos of our forest clean-up drives and wildlife exploration treks 
            through the heart of Poba Reserve Forest.
          </p>
        </div>

        {/* Wildlife Trek Feature */}
        <div className="mb-12 group relative overflow-hidden rounded-2xl shadow-elevated">
          <img
            src={forestTrailWalk}
            alt="Echoes of Poba team trekking through dense forest trails on 16th January"
            className="w-full h-[28rem] object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(to top, hsla(20 35% 12% / 0.8) 0%, hsla(20 35% 12% / 0.3) 40%, transparent 100%)",
            }}
          />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
            <span className="inline-block text-xs font-medium uppercase tracking-wider text-gold-soft mb-2">
              16th January 2026 · Wildlife Trek
            </span>
            <h3 className="font-display text-xl md:text-2xl font-semibold text-cream mb-3">
              Walking Where Elephants Roam
            </h3>
            <p className="text-cream/85 text-sm md:text-base max-w-2xl leading-relaxed">
              Five members of Echoes of Poba stepped into the jungle and into the stories written by wildlife itself. 
              We witnessed elephant paths, fresh elephant footprints, fox tracks, and wild boar footprints—silent proof 
              that we were walking through a living jungle. Every footprint reminded us that this forest belongs to them, 
              and we were just humble visitors.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="group relative overflow-hidden rounded-2xl shadow-elevated">
            <img
              src={cleanupDrive1}
              alt="Volunteers during forest cleanup drive"
              className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-brown-deep/45 md:bg-brown-deep/0 md:group-hover:bg-brown-deep/50 transition-colors duration-300" />
            <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-0 md:translate-y-full md:group-hover:translate-y-0 transition-transform duration-300">
              <h3 className="font-display text-xl font-semibold text-cream">
                Community Cleanup Day
              </h3>
              <p className="text-cream/80 text-sm mt-2">
                Volunteers come together to remove waste from forest trails.
              </p>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl shadow-elevated">
            <img
              src={cleanupDrive2}
              alt="Youth volunteers with collected garbage bags"
              className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-brown-deep/45 md:bg-brown-deep/0 md:group-hover:bg-brown-deep/50 transition-colors duration-300" />
            <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-0 md:translate-y-full md:group-hover:translate-y-0 transition-transform duration-300">
              <h3 className="font-display text-xl font-semibold text-cream">
                Youth Conservation Initiative
              </h3>
              <p className="text-cream/80 text-sm mt-2">
                Local youth leading by example in forest conservation.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="font-display text-4xl md:text-5xl font-bold text-accent mb-2">
              10+
            </div>
            <p className="text-muted-foreground">Cleanup Drives</p>
          </div>
          <div>
            <div className="font-display text-4xl md:text-5xl font-bold text-accent mb-2">
              30+
            </div>
            <p className="text-muted-foreground">Volunteers</p>
          </div>
          <div>
            <div className="font-display text-4xl md:text-5xl font-bold text-accent mb-2">
              150kg
            </div>
            <p className="text-muted-foreground">Waste Collected</p>
          </div>
          <div>
            <div className="font-display text-4xl md:text-5xl font-bold text-accent mb-2">
              10km
            </div>
            <p className="text-muted-foreground">Trails Cleaned</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurWork;
