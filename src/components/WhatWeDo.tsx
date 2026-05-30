import { Sprout, Recycle, TreePine, Users, ArrowRight } from "lucide-react";
import afforestationImg from "@/assets/forest-canopy.jpg";
import cleanlinessImg from "@/assets/cleanup-team-baskets.jpg";
import wildlifeImg from "@/assets/wildlife-elephant.jpg";
import communityImg from "@/assets/stargazing-event.jpg";
import { Link } from "react-router-dom";

const categories = [
  {
    icon: TreePine,
    tag: "Forest Conservation",
    title: "Afforestation & Protection",
    desc: "Protecting and restoring Poba Reserve Forest canopy to safeguard biodiversity and combat climate change.",
    img: afforestationImg,
    link: "/about#mission",
  },
  {
    icon: Recycle,
    tag: "Cleanliness Drives",
    title: "Waste Cleansing Campaigns",
    desc: "Removing plastic waste and litter from forest paths and waterways to protect wildlife and keep the jungle clean.",
    img: cleanlinessImg,
    link: "/our-work",
  },
  {
    icon: Sprout,
    tag: "Wildlife Protection",
    title: "Habitat Safeguarding",
    desc: "Mapping elephant corridors and animal pathways to prevent human-wildlife conflict and support biodiversity.",
    img: wildlifeImg,
    link: "/our-work",
  },
  {
    icon: Users,
    tag: "Community Engagement",
    title: "Youth & Local Rallies",
    desc: "Empowering village youth, conducting workshops, and organizing awareness camps to grow local conservation action.",
    img: communityImg,
    link: "/about#mission",
  },
];

const WhatWeDo = () => {
  return (
    <section className="section-padding bg-background border-t border-border/40">
      <div className="container-wide">
        {/* Header Block */}
        <div className="grid lg:grid-cols-12 gap-8 items-end mb-16">
          <div className="lg:col-span-7">
            <span className="inline-block text-xs font-semibold text-moss uppercase tracking-widest mb-4">
              WHAT WE DO
            </span>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-brown-deep leading-tight">
              Solutions rooted in <span className="text-primary italic font-serif">nature</span>,<br className="hidden sm:inline" />
              driven by people.
            </h2>
          </div>
          <div className="lg:col-span-5 text-left lg:text-right">
            <p className="text-muted-foreground leading-relaxed mb-4 max-w-md lg:ml-auto">
              We focus on sustainable, community-based solutions to protect and restore 
              the natural balance of Poba Reserve Forest.
            </p>
            <Link
              to="/our-work"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:text-primary/80 transition-colors uppercase tracking-wider"
            >
              Explore Our Work
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((c, idx) => (
            <div
              key={idx}
              className="group bg-cream rounded-2xl overflow-hidden shadow-soft border border-border/40 flex flex-col h-full hover:shadow-card hover:-translate-y-1 transition-all duration-300"
            >
              {/* Image Container */}
              <div className="aspect-[4/3] w-full overflow-hidden relative">
                <img
                  src={c.img}
                  alt={c.tag}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Floating circle icon */}
                <div className="absolute bottom-4 left-4 w-10 h-10 rounded-full bg-forest-deep flex items-center justify-center text-moss shadow-md border border-moss/20">
                  <c.icon className="w-5 h-5" />
                </div>
              </div>

              {/* Text Container */}
              <div className="p-6 flex flex-col flex-grow">
                <span className="text-[11px] font-semibold text-moss uppercase tracking-wider mb-2 block">
                  {c.tag}
                </span>
                <h3 className="font-display text-lg font-bold text-brown-deep mb-2 leading-snug">
                  {c.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6 flex-grow">
                  {c.desc}
                </p>
                <Link
                  to={c.link}
                  className="inline-flex items-center gap-1 text-xs font-bold text-primary group-hover:text-primary/80 transition-colors uppercase tracking-wider"
                >
                  Learn More
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

export default WhatWeDo;
