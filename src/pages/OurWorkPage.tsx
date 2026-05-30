import Header from "@/components/Header";
import OurWork from "@/components/OurWork";
import Contact from "@/components/Contact";

const OurWorkPage = () => {
  return (
    <div className="min-h-screen bg-background animate-fade-in">
      <Header />
      <main>
        <div id="work">
          <OurWork />
        </div>
      </main>
      <Contact />
    </div>
  );
};

export default OurWorkPage;
