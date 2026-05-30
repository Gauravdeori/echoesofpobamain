import { Mail, Instagram, MapPin, Leaf, Facebook, Linkedin, Send, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const exploreLinks = [
  { to: "/about", label: "About Us" },
  { to: "/our-work", label: "Our Work" },
  { to: "/gallery", label: "Photo Gallery" },
  { to: "/#environment-day", label: "Environment Day" },
];

const getInvolvedLinks = [
  { to: "/volunteer", label: "Volunteer" },
  { to: "mailto:echoesofpoba@gmail.com?subject=Outreach%20Outlines", label: "Outreach" },
  { to: "mailto:echoesofpoba@gmail.com?subject=Donation%20Inquiry", label: "Donate Support" },
];

const supportLinks = [
  { to: "/about#mission", label: "FAQs" },
  { to: "/about#values", label: "Privacy Policy" },
  { to: "/about#values", label: "Terms of Use" },
];

const Contact = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("https://formsubmit.co/ajax/echoesofpoba@gmail.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          email: email,
          _subject: "New Newsletter Subscription - Echoes of Poba"
        })
      });

      const result = await response.json();

      if (response.ok) {
        // Save locally to localStorage as a fallback database cache
        const localData = JSON.parse(localStorage.getItem("poba_newsletter") || "[]");
        localData.push({
          email: email,
          timestamp: new Date().toISOString()
        });
        localStorage.setItem("poba_newsletter", JSON.stringify(localData));

        toast({
          title: "Subscribed! ✉️",
          description: "Thank you for subscribing to our newsletter.",
        });
        setEmail("");
      } else {
        throw new Error(result.message || "Something went wrong.");
      }
    } catch (error: any) {
      toast({
        title: "Subscription failed",
        description: error.message || "Unable to subscribe. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer
      id="contact"
      className="pt-20 pb-8 text-cream border-t border-cream/5"
      style={{
        background: "linear-gradient(180deg, hsl(155, 45%, 5%) 0%, hsl(155, 40%, 8%) 100%)",
      }}
    >
      <div className="container-wide px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12">
          
          {/* Brand/Column 1 */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-moss/10 border border-moss/20">
                <Leaf className="w-6 h-6 text-moss animate-sway" />
              </div>
              <div>
                <span className="font-display text-xl font-bold block leading-tight tracking-wide">
                  ECHOES OF POBA
                </span>
                <span className="text-[9px] text-moss tracking-widest uppercase">
                  Rooted in Purpose, Growing Impact
                </span>
              </div>
            </div>
            <p className="text-cream/70 text-sm leading-relaxed max-w-sm">
              A community-driven environmental initiative working to clean and protect 
              Poba Reserve Forest in Dhemaji district, Assam, along the Assam–Arunachal Pradesh border.
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-4 pt-2">
              {[
                { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
                { icon: Instagram, href: "https://instagram.com/echoesofpoba", label: "Instagram" },
                { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
              ].map((s, idx) => (
                <a
                  key={idx}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-cream/5 border border-cream/10 flex items-center justify-center hover:bg-moss/20 hover:border-moss/30 hover:text-forest-deep transition-all duration-300"
                  aria-label={s.label}
                >
                  <s.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Explore Links/Column 2 */}
          <div className="lg:col-span-2 space-y-5">
            <h4 className="font-display text-base font-semibold tracking-wider text-moss uppercase">
              Explore
            </h4>
            <ul className="space-y-3 text-sm">
              {exploreLinks.map((l, idx) => (
                <li key={idx}>
                  <Link
                    to={l.to}
                    className="text-cream/70 hover:text-moss transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Get Involved/Column 3 */}
          <div className="lg:col-span-2 space-y-5">
            <h4 className="font-display text-base font-semibold tracking-wider text-moss uppercase">
              Get Involved
            </h4>
            <ul className="space-y-3 text-sm">
              {getInvolvedLinks.map((l, idx) => (
                <li key={idx}>
                  {l.to.startsWith("mailto:") ? (
                    <a
                      href={l.to}
                      className="text-cream/70 hover:text-moss transition-colors"
                    >
                      {l.label}
                    </a>
                  ) : (
                    <Link
                      to={l.to}
                      className="text-cream/70 hover:text-moss transition-colors"
                    >
                      {l.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Support/Column 4 */}
          <div className="lg:col-span-2 space-y-5">
            <h4 className="font-display text-base font-semibold tracking-wider text-moss uppercase">
              Support
            </h4>
            <ul className="space-y-3 text-sm">
              {supportLinks.map((l, idx) => (
                <li key={idx}>
                  <Link
                    to={l.to}
                    className="text-cream/70 hover:text-moss transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Stay Connected/Column 5 */}
          <div className="lg:col-span-2 space-y-5">
            <h4 className="font-display text-base font-semibold tracking-wider text-moss uppercase">
              Stay Connected
            </h4>
            <p className="text-xs text-cream/70 leading-relaxed">
              Subscribe to receive updates, event invites, and stories from the wild.
            </p>
            <form onSubmit={handleSubscribe} className="relative mt-2">
              <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-cream/5 border border-cream/15 rounded-full px-4 py-2.5 pr-10 text-xs text-cream placeholder-cream/40 focus:outline-none focus:border-moss/50 focus:bg-cream/10 transition-all disabled:opacity-50"
                required
                disabled={isSubmitting}
              />
              <button
                type="submit"
                className="absolute right-1 top-1 bottom-1 w-8 rounded-full bg-moss text-forest-deep flex items-center justify-center hover:bg-moss/80 transition-colors cursor-pointer disabled:opacity-50"
                aria-label="Subscribe"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Copyright Bar */}
        <div className="mt-16 pt-8 border-t border-cream/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-cream/50">
          <p>
            © {new Date().getFullYear()} Echoes of Poba. All rights reserved.
          </p>
          <div className="flex items-center gap-1.5">
            <span>Designed with 💚 for nature</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Contact;
