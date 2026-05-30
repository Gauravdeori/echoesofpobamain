import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Leaf,
  TreePine,
  Sprout,
  Recycle,
  Users,
  CalendarDays,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  ArrowLeft,
  ChevronDown,
  Sparkles,
  Globe,
  Heart,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import heroImage from "@/assets/environment-day-hero.png";

/* ─── countdown helper ─── */
function getTimeLeft(target: Date) {
  const now = new Date();
  const diff = target.getTime() - now.getTime();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, done: true };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    done: false,
  };
}

/* ─── intersection-observer hook for scroll animations ─── */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

/* ─── activities ─── */
const activities = [
  {
    icon: TreePine,
    title: "Forest Cleanup Drive",
    desc: "Join our team deep inside Poba Reserve Forest to pick up litter, clear plastic waste, and restore natural beauty.",
  },
  {
    icon: Sprout,
    title: "Tree Plantation",
    desc: "Plant native saplings along degraded forest patches and riverbanks to strengthen Poba's green cover.",
  },
  {
    icon: Recycle,
    title: "Waste Segregation Workshop",
    desc: "Learn practical waste management techniques you can bring back to your home and community.",
  },
  {
    icon: Users,
    title: "Community Awareness Rally",
    desc: "Walk together through nearby villages spreading the message of conservation and responsible living.",
  },
];

/* ─── page ─── */
const WorldEnvironmentDay = () => {
  const { toast } = useToast();

  /* countdown */
  const targetDate = new Date("2026-06-05T07:00:00+05:30");
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(targetDate));
  useEffect(() => {
    const id = setInterval(() => setTimeLeft(getTimeLeft(targetDate)), 1000);
    return () => clearInterval(id);
  }, []);

  /* form */
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      toast({ title: "Please fill required fields", description: "Name and email are required.", variant: "destructive" });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      toast({ title: "Invalid email", description: "Please enter a valid email address.", variant: "destructive" });
      return;
    }
    const subject = encodeURIComponent("World Environment Day 2026 – Sign Up: " + form.name);
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone || "Not provided"}\nMessage: ${form.message || "No message"}`
    );
    window.open(`mailto:echoesofpoba@gmail.com?subject=${subject}&body=${body}`, "_blank");
    setSubmitted(true);
    toast({ title: "You're in! 🌱", description: "Thank you for joining the movement." });
  };

  /* scroll reveals */
  const aboutReveal = useReveal();
  const activitiesReveal = useReveal();
  const formReveal = useReveal();

  /* floating particles state for hero */
  const [particles] = useState(() =>
    Array.from({ length: 18 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 6,
      duration: 8 + Math.random() * 6,
      size: 4 + Math.random() * 8,
    }))
  );

  return (
    <div className="min-h-screen bg-background">
      {/* ─── HERO ─── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* background */}
        <div className="absolute inset-0">
          <img src={heroImage} alt="Lush green forest" className="w-full h-full object-cover" />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, hsla(20 35% 10% / 0.72) 0%, hsla(120 25% 15% / 0.5) 40%, hsla(20 35% 10% / 0.82) 100%)",
            }}
          />
        </div>

        {/* floating leaf particles */}
        {particles.map((p) => (
          <span
            key={p.id}
            className="absolute opacity-30 pointer-events-none"
            style={{
              left: `${p.left}%`,
              bottom: "-20px",
              width: p.size,
              height: p.size,
              borderRadius: "50% 0 50% 50%",
              background: "hsl(115 40% 50%)",
              animation: `wed-rise ${p.duration}s ${p.delay}s linear infinite`,
            }}
          />
        ))}

        {/* back button */}
        <Link
          to="/"
          className="absolute top-6 left-6 z-30 flex items-center gap-2 text-cream/80 hover:text-cream transition-colors text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {/* content */}
        <div className="relative z-10 container-wide px-4 md:px-8 text-center">
          <div className="max-w-4xl mx-auto animate-fade-up">
            {/* badge */}
            <div className="inline-flex items-center gap-2 bg-cream/10 backdrop-blur-sm border border-cream/20 rounded-full px-5 py-2 mb-8">
              <Globe className="w-4 h-4 text-gold-soft" />
              <span className="text-sm font-medium text-cream/90">June 5, 2026</span>
              <span className="text-cream/40">•</span>
              <span className="text-sm font-medium text-gold-soft">World Environment Day</span>
            </div>

            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-cream mb-6 leading-tight">
              Join Us to{" "}
              <span className="relative inline-block">
                <span className="text-gold-soft">Clean Our</span>
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                  <path d="M2 8 C60 2, 140 2, 198 8" stroke="hsl(32 50% 55%)" strokeWidth="3" strokeLinecap="round" opacity="0.5" />
                </svg>
              </span>
              <br />
              Surroundings
            </h1>

            <p className="text-lg md:text-xl text-cream/85 max-w-2xl mx-auto mb-10 leading-relaxed">
              Be a part of the change. This World Environment Day, Echoes of Poba invites you to
              step into nature, roll up your sleeves, and help protect the forest we call home.
            </p>

            {/* countdown */}
            {!timeLeft.done && (
              <div className="flex justify-center gap-3 sm:gap-5 mb-10">
                {(
                  [
                    ["days", timeLeft.days],
                    ["hours", timeLeft.hours],
                    ["mins", timeLeft.minutes],
                    ["secs", timeLeft.seconds],
                  ] as const
                ).map(([label, value]) => (
                  <div
                    key={label}
                    className="flex flex-col items-center bg-cream/10 backdrop-blur-md border border-cream/15 rounded-2xl w-[72px] sm:w-[88px] py-4"
                  >
                    <span className="font-display text-3xl sm:text-4xl font-bold text-cream tabular-nums">
                      {String(value).padStart(2, "0")}
                    </span>
                    <span className="text-xs text-cream/60 uppercase tracking-wider mt-1">{label}</span>
                  </div>
                ))}
              </div>
            )}

            {timeLeft.done && (
              <div className="inline-flex items-center gap-2 bg-gold-warm/20 border border-gold-warm/40 rounded-full px-6 py-3 mb-10 animate-pulse">
                <Sparkles className="w-5 h-5 text-gold-warm" />
                <span className="text-lg font-semibold text-gold-soft">It's World Environment Day — Let's Go!</span>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="hero"
                size="xl"
                onClick={() => document.getElementById("wed-form")?.scrollIntoView({ behavior: "smooth" })}
              >
                <Heart className="w-5 h-5" />
                Register Now
              </Button>
              <Button
                variant="heroOutline"
                size="xl"
                className="border-cream text-cream hover:bg-cream/10"
                onClick={() => document.getElementById("wed-about")?.scrollIntoView({ behavior: "smooth" })}
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>

        {/* scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
          <button
            onClick={() => document.getElementById("wed-about")?.scrollIntoView({ behavior: "smooth" })}
            className="flex flex-col items-center text-cream/60 hover:text-cream transition-colors"
            aria-label="Scroll down"
          >
            <span className="text-sm mb-2">Discover More</span>
            <ChevronDown className="w-6 h-6" />
          </button>
        </div>
      </section>

      {/* ─── ABOUT THE EVENT ─── */}
      <section
        id="wed-about"
        className="section-padding"
        style={{ background: "var(--gradient-section)" }}
      >
        <div
          ref={aboutReveal.ref}
          className={`container-wide transition-all duration-700 ${aboutReveal.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* left */}
            <div>
              <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-6">
                <Leaf className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">About the Event</span>
              </div>
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-brown-deep mb-6 leading-tight">
                One Day. One Forest.{" "}
                <span className="text-primary">One Community.</span>
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                Every year on June 5th, the world comes together to celebrate our environment.
                This year, <strong className="text-foreground">Echoes of Poba</strong> is organising a day-long event
                inside and around Poba Reserve Forest — dedicated to cleaning, planting, learning, and connecting
                with the natural world.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                Whether you're a student, a working professional, or simply someone who cares —
                your presence matters. Fill out the form below to be a part of this movement.
              </p>

              {/* event details */}
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { icon: CalendarDays, label: "Date", value: "June 5, 2026" },
                  { icon: Clock, label: "Time", value: "7:00 AM onwards" },
                  { icon: MapPin, label: "Location", value: "Poba Reserve Forest, Assam" },
                  { icon: Users, label: "Open to", value: "Everyone — all ages" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-3 bg-cream rounded-xl px-4 py-3 shadow-soft border border-border/50"
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <item.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{item.label}</p>
                      <p className="text-sm font-semibold text-brown-deep">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* right — decorative card */}
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-primary/15 via-transparent to-gold-warm/15 rounded-3xl blur-2xl" />
              <div className="relative bg-cream rounded-3xl overflow-hidden shadow-elevated border border-border">
                <div className="aspect-[4/3] relative">
                  <img
                    src={heroImage}
                    alt="Poba forest"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-cream via-transparent to-transparent" />
                </div>
                <div className="p-6 -mt-8 relative">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
                    <span className="text-sm font-semibold text-primary">Registration Open</span>
                  </div>
                  <h3 className="font-display text-xl font-bold text-brown-deep mb-2">
                    World Environment Day 2026
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    A day of action for Poba Reserve Forest — cleanup drives, plantation, and community rallies.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── ACTIVITIES ─── */}
      <section className="section-padding bg-secondary">
        <div
          ref={activitiesReveal.ref}
          className={`container-wide transition-all duration-700 ${activitiesReveal.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-6">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">What's Planned</span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-brown-deep mb-4">
              Activities for the Day
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A full day packed with hands-on environmental action and community bonding.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {activities.map((a, i) => (
              <div
                key={a.title}
                className="group bg-cream rounded-2xl p-6 shadow-card hover:shadow-elevated transition-all duration-500 hover:-translate-y-1 border border-border/50"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                  <a.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-display text-lg font-bold text-brown-deep mb-2">{a.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── REGISTRATION FORM ─── */}
      <section id="wed-form" className="section-padding" style={{ background: "var(--gradient-section)" }}>
        <div
          ref={formReveal.ref}
          className={`container-wide transition-all duration-700 ${formReveal.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          {submitted ? (
            <div className="max-w-2xl mx-auto text-center">
              <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-primary-foreground" />
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-brown-deep mb-4">
                You're Registered! 🌿
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Thank you for stepping up. We'll share event details and reminders with you soon.
                Together, we'll make this World Environment Day count.
              </p>
              <Button variant="outline" onClick={() => setSubmitted(false)}>
                Submit Another Response
              </Button>
            </div>
          ) : (
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* left text */}
              <div>
                <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-6">
                  <Heart className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-primary">Be the Change</span>
                </div>
                <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-brown-deep mb-6">
                  Register to Join
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                  Fill out this quick form and become a part of Echoes of Poba's World Environment Day event.
                  No prior experience needed — just a willingness to care.
                </p>
                <div className="space-y-4">
                  {[
                    "Free to participate — everyone is welcome",
                    "Refreshments and event kit provided",
                    "Receive a volunteer certificate",
                    "Connect with like-minded changemakers",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                      <span className="text-foreground">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* right form */}
              <div className="bg-cream rounded-2xl p-8 shadow-card border border-border/50">
                <h3 className="font-display text-2xl font-semibold text-brown-deep mb-6">
                  Event Registration
                </h3>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label htmlFor="wed-name" className="block text-sm font-medium text-foreground mb-2">
                      Full Name <span className="text-destructive">*</span>
                    </label>
                    <Input
                      id="wed-name"
                      name="name"
                      placeholder="Your full name"
                      value={form.name}
                      onChange={onChange}
                      className="bg-background border-border"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="wed-email" className="block text-sm font-medium text-foreground mb-2">
                      Email <span className="text-destructive">*</span>
                    </label>
                    <Input
                      id="wed-email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={onChange}
                      className="bg-background border-border"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="wed-phone" className="block text-sm font-medium text-foreground mb-2">
                      Phone <span className="text-muted-foreground">(optional)</span>
                    </label>
                    <Input
                      id="wed-phone"
                      name="phone"
                      type="tel"
                      placeholder="+91 XXXXX XXXXX"
                      value={form.phone}
                      onChange={onChange}
                      className="bg-background border-border"
                    />
                  </div>
                  <div>
                    <label htmlFor="wed-message" className="block text-sm font-medium text-foreground mb-2">
                      Message <span className="text-muted-foreground">(optional)</span>
                    </label>
                    <Textarea
                      id="wed-message"
                      name="message"
                      placeholder="Tell us why you want to join or any questions you have..."
                      value={form.message}
                      onChange={onChange}
                      className="bg-background border-border min-h-[120px]"
                    />
                  </div>
                  <Button type="submit" variant="default" size="lg" className="w-full">
                    <Send className="w-4 h-4" />
                    Submit Registration
                  </Button>
                </form>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ─── FOOTER STRIP ─── */}
      <footer
        className="py-8 text-center"
        style={{
          background: "linear-gradient(135deg, hsl(20 35% 16%) 0%, hsl(120 25% 20%) 100%)",
        }}
      >
        <p className="text-cream/70 text-sm">
          © {new Date().getFullYear()} Echoes of Poba · World Environment Day 2026
        </p>
        <Link to="/" className="inline-flex items-center gap-2 text-cream/50 hover:text-cream text-sm mt-2 transition-colors">
          <ArrowLeft className="w-3 h-3" />
          Return to main site
        </Link>
      </footer>
    </div>
  );
};

export default WorldEnvironmentDay;
