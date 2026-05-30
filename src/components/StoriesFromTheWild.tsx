import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import elephantImg from "@/assets/forest-trail-walk.jpg";
import mlaImg from "@/assets/stargazing-event.jpg";
import riverImg from "@/assets/aerial-river.jpg";

const stories = [
  {
    category: "FORESTS",
    title: "Walking Where Elephants Roam",
    desc: "Trekking deep into Poba's dense paths, mapping fresh footprints, boar tracks, and elephant paths.",
    img: elephantImg,
    link: "/our-work",
  },
  {
    category: "COMMUNITIES",
    title: "Hon'ble MLA Pledges Poba Support",
    desc: "Honorable MLA of Jonai visiting the Echoes of Poba awareness camp to take a pledge in support of the rainforest.",
    img: mlaImg,
    link: "/gallery",
  },
  {
    category: "WETLANDS",
    title: "Cleaning Riverbanks & Poba Streams",
    desc: "Clearing waste along river boundaries along the Assam-Arunachal border to protect aquatic habitats.",
    img: riverImg,
    link: "/our-work",
  },
];

const StoriesFromTheWild = () => {
  return (
    <section className="section-padding bg-background border-t border-border/40">
      <div className="container-wide">
        {/* Header Block */}
        <div className="grid lg:grid-cols-12 gap-8 items-end mb-16">
          <div className="lg:col-span-7">
            <span className="inline-block text-xs font-semibold text-moss uppercase tracking-widest mb-4">
              STORIES FROM THE WILD
            </span>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-brown-deep leading-tight">
              Real stories.<br />
              Real change.
            </h2>
          </div>
          <div className="lg:col-span-5 text-left">
            <p className="text-muted-foreground leading-relaxed mb-4 max-w-md">
              From trekking tracking paths to village community mobilization, discover how volunteers and nature thrive together at Poba.
            </p>
            <Link
              to="/gallery"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:text-primary/80 transition-colors uppercase tracking-wider"
            >
              View All Photos
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Stories Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {stories.map((s, idx) => (
            <div
              key={idx}
              className="group relative overflow-hidden rounded-2xl aspect-[3/4] shadow-elevated border border-border/20 cursor-pointer flex flex-col justify-end"
            >
              {/* Background image */}
              <div className="absolute inset-0 z-0">
                <img
                  src={s.img}
                  alt={s.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Dark gradient overlay */}
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, hsla(155, 45%, 6%, 0.88) 0%, hsla(155, 35%, 10%, 0.45) 50%, hsla(155, 40%, 12%, 0.15) 100%)",
                  }}
                />
              </div>

              {/* Text Content */}
              <div className="relative z-10 p-8 text-cream">
                <span className="text-[10px] font-bold text-moss uppercase tracking-widest mb-2 block">
                  {s.category}
                </span>
                <h3 className="font-display text-xl font-bold text-cream mb-3 leading-snug group-hover:text-moss transition-colors">
                  {s.title}
                </h3>
                <p className="text-sm text-cream/70 leading-relaxed mb-6">
                  {s.desc}
                </p>
                <Link
                  to={s.link}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-moss hover:text-moss/80 transition-colors uppercase tracking-wider"
                >
                  Read Story
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StoriesFromTheWild;
