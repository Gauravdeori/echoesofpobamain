import Header from "@/components/Header";
import About from "@/components/About";
import Vision from "@/components/Vision";
import Mission from "@/components/Mission";
import Values from "@/components/Values";
import Contact from "@/components/Contact";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-background animate-fade-in">
      <Header />
      <main className="space-y-4">
        <About />
        <div id="vision">
          <Vision />
        </div>
        <div id="mission">
          <Mission />
        </div>
        <div id="values">
          <Values />
        </div>
      </main>
      <Contact />
    </div>
  );
};

export default AboutPage;
