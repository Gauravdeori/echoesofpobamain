import { Leaf, Users, TreePine, GraduationCap } from "lucide-react";

const pillars = [
  {
    icon: Leaf,
    title: "Sustainable Future",
  },
  {
    icon: Users,
    title: "Community Driven",
  },
  {
    icon: TreePine,
    title: "Nature Conservation",
  },
  {
    icon: GraduationCap,
    title: "Youth Empowerment",
  },
];

const Values = () => {
  return (
    <section className="py-12 md:py-16 bg-cream border-t border-border">
      <div className="container-wide px-4 md:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-6">
          {pillars.map((pillar) => (
            <div
              key={pillar.title}
              className="flex flex-col items-center text-center group"
            >
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-2 border-brown-light/50 flex items-center justify-center mb-4 group-hover:border-primary group-hover:bg-primary/5 transition-all duration-300">
                <pillar.icon className="w-7 h-7 md:w-8 md:h-8 text-brown-warm group-hover:text-primary transition-colors duration-300" />
              </div>
              <h3 className="font-display text-sm md:text-base font-semibold text-brown-deep">
                {pillar.title}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Values;
