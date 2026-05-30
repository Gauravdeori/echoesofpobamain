import { useState, useEffect } from "react";
import { Menu, X, Leaf, Mail, Facebook, Instagram, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";

const navLinks = [
  { to: "/about", label: "About" },
  { to: "/about#vision", label: "Vision" },
  { to: "/about#mission", label: "Mission" },
  { to: "/about#values", label: "Values" },
  { to: "/our-work", label: "Our Work" },
  { to: "/#environment-day", label: "Events" },
  { to: "/gallery", label: "Gallery" },
  { to: "#contact", label: "Contact" },
];

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (to: string) => {
    setIsMobileMenuOpen(false);
    if (to.startsWith("#")) {
      const element = document.getElementById(to.replace("#", ""));
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else if (to.includes("#")) {
      const [path, hash] = to.split("#");
      if (location.pathname === path) {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      } else {
        navigate(to);
      }
    } else {
      if (location.pathname === to) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        navigate(to);
      }
    }
  };

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="bg-forest-deep text-cream text-xs sm:text-sm">
        <div className="container-wide px-4 md:px-8 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Leaf className="w-3.5 h-3.5 text-moss" />
            <span>Welcome to Echoes of POBA</span>
          </div>
          <div className="hidden sm:flex items-center gap-5">
            <a
              href="mailto:echoesofpoba@gmail.com"
              className="flex items-center gap-1.5 hover:text-moss transition-colors"
            >
              <Mail className="w-3.5 h-3.5" />
              echoesofpoba@gmail.com
            </a>
            <div className="flex items-center gap-3">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-moss transition-colors" aria-label="Facebook">
                <Facebook className="w-3.5 h-3.5" />
              </a>
              <a href="https://instagram.com/echoesofpoba" target="_blank" rel="noopener noreferrer" className="hover:text-moss transition-colors" aria-label="Instagram">
                <Instagram className="w-3.5 h-3.5" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-moss transition-colors" aria-label="LinkedIn">
                <Linkedin className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header
        className={`sticky top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-cream/98 backdrop-blur-md shadow-soft py-3"
            : "bg-cream py-4"
        }`}
      >
        <div className="container-wide px-4 md:px-8">
          <nav className="flex items-center justify-between">
            {/* Logo */}
            <a
              href="/"
              className="flex items-center gap-3 group"
              onClick={(e) => {
                e.preventDefault();
                if (location.pathname === "/") {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                } else {
                  navigate("/");
                }
              }}
            >
              <div className="p-2 rounded-full bg-primary/10 group-hover:bg-primary/15 transition-colors">
                <Leaf className="w-5 h-5 text-primary" />
              </div>
              <div className="flex flex-col">
                <span className="font-display text-lg font-bold text-brown-deep tracking-wide leading-tight">
                  ECHOES OF POBA
                </span>
                <span className="text-[10px] text-brown-light tracking-widest uppercase leading-tight">
                  Rooted in Purpose, Growing Impact
                </span>
              </div>
            </a>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-7">
              {navLinks.map((link) => (
                <button
                  key={link.to}
                  onClick={() => handleNavClick(link.to)}
                  className="text-sm font-medium text-foreground hover:text-primary transition-colors duration-300 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
                >
                  {link.label}
                </button>
              ))}
              <Button
                variant="hero"
                size="sm"
                onClick={() => handleNavClick("/volunteer")}
              >
                Get Involved
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-foreground" />
              ) : (
                <Menu className="w-6 h-6 text-foreground" />
              )}
            </button>
          </nav>

          {/* Mobile Menu */}
          <div
            className={`lg:hidden absolute left-0 right-0 top-full bg-cream/98 backdrop-blur-lg shadow-elevated transition-all duration-300 overflow-hidden ${
              isMobileMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="p-6 space-y-4">
              {navLinks.map((link) => (
                <button
                  key={link.to}
                  onClick={() => handleNavClick(link.to)}
                  className="block w-full text-left text-foreground font-medium py-2 hover:text-primary transition-colors"
                >
                  {link.label}
                </button>
              ))}

              <Button
                variant="hero"
                className="w-full mt-4"
                onClick={() => handleNavClick("/volunteer")}
              >
                Get Involved
              </Button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
