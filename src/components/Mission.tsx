import { Target, Trash2, MapPin, Users, TreePine } from "lucide-react";

const missionPoints = [
  {
    icon: Trash2,
    title: "Forest Cleanliness Drives",
    description: "Organizing regular forest cleanliness drives",
  },
  {
    icon: MapPin,
    title: "Responsible Travel",
    description: "Promoting responsible travel and forest ethics",
  },
  {
    icon: Users,
    title: "Community Engagement",
    description: "Engaging local youth and volunteers in conservation",
  },
  {
    icon: TreePine,
    title: "Biodiversity Protection",
    description: "Protecting biodiversity and natural balance",
  },
];

const Mission = () => {
  return (
    <section className="section-padding bg-secondary">
      <div className="container-wide">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-6">
            <Target className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Our Mission</span>
          </div>
          
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-brown-deep mb-6">
            Clean, Protect, and Preserve
          </h2>
          
          <p className="text-lg text-muted-foreground leading-relaxed">
            Echoes of Poba works to clean, protect, and preserve Poba Reserve Forest 
            through consistent action and community involvement.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {missionPoints.map((point, index) => (
            <div
              key={index}
              className="group bg-cream rounded-2xl p-8 shadow-soft hover:shadow-card transition-all duration-300 hover:-translate-y-1 border border-border/50"
            >
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary transition-colors duration-300">
                <point.icon className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
              </div>
              <h3 className="font-display text-xl font-semibold text-brown-deep mb-3">
                {point.title}
              </h3>
              <p className="text-muted-foreground">
                {point.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Mission;
