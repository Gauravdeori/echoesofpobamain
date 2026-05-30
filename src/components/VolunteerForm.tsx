import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Heart, Send, CheckCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const VolunteerForm = () => {
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name.trim() || !formData.email.trim()) {
      toast({
        title: "Please fill required fields",
        description: "Name and email are required to sign up.",
        variant: "destructive",
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
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
          name: formData.name,
          email: formData.email,
          phone: formData.phone || "Not provided",
          message: formData.message || "No message",
          _subject: `New Volunteer Sign-Up: ${formData.name}`
        })
      });

      const result = await response.json();

      if (response.ok) {
        // Save locally to localStorage as a fallback database cache
        const localData = JSON.parse(localStorage.getItem("poba_volunteers") || "[]");
        localData.push({
          ...formData,
          timestamp: new Date().toISOString()
        });
        localStorage.setItem("poba_volunteers", JSON.stringify(localData));

        setFormData({ name: "", email: "", phone: "", message: "" });
        setIsSubmitted(true);
        toast({
          title: "Thank you for joining!",
          description: "We'll be in touch with you soon.",
        });
      } else {
        throw new Error(result.message || "Something went wrong. Please try again.");
      }
    } catch (error: any) {
      toast({
        title: "Submission failed",
        description: error.message || "Unable to submit volunteer form. Please check your internet and try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <section className="section-padding bg-secondary">
        <div className="container-wide">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-primary-foreground" />
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-brown-deep mb-4">
              Thank You for Joining!
            </h2>
            <p className="text-lg text-muted-foreground">
              Your commitment to protecting Poba Reserve Forest means the world to us. 
              We'll be in touch with you soon about upcoming activities.
            </p>
            <Button
              variant="outline"
              className="mt-8"
              onClick={() => setIsSubmitted(false)}
            >
              Submit Another Response
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-padding bg-secondary">
      <div className="container-wide">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text Content */}
          <div>
            <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-6">
              <Heart className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Get Involved</span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-brown-deep mb-6">
              Join Our Mission
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              Whether you're local to Assam or visiting from elsewhere, your hands and heart 
              can make a difference. Sign up to volunteer with us and be part of the change.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span className="text-foreground">Participate in cleanup drives</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span className="text-foreground">Help spread awareness</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span className="text-foreground">Support local conservation</span>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-cream rounded-2xl p-8 shadow-card border border-border/50">
            <h3 className="font-display text-2xl font-semibold text-brown-deep mb-6">
              Volunteer Sign-Up
            </h3>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                  Name <span className="text-destructive">*</span>
                </label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Your full name"
                  value={formData.name}
                  onChange={handleChange}
                  className="bg-background border-border"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                  Email <span className="text-destructive">*</span>
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="bg-background border-border"
                  required
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                  Phone <span className="text-muted-foreground">(optional)</span>
                </label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+91 XXXXX XXXXX"
                  value={formData.phone}
                  onChange={handleChange}
                  className="bg-background border-border"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                  Message <span className="text-muted-foreground">(optional)</span>
                </label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Tell us why you want to volunteer or any questions you have..."
                  value={formData.message}
                  onChange={handleChange}
                  className="bg-background border-border min-h-[120px]"
                />
              </div>
              <Button type="submit" variant="default" size="lg" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Submit Application
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VolunteerForm;
