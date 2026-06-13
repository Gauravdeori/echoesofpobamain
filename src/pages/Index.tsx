import Header from "@/components/Header";
import WhatWeDo from "@/components/WhatWeDo";
import EnvironmentDay from "@/components/EnvironmentDay";
import OurImpact from "@/components/OurImpact";
import StoriesFromTheWild from "@/components/StoriesFromTheWild";
import UpdatesAndNews from "@/components/UpdatesAndNews";
import CallToActionBanner from "@/components/CallToActionBanner";
import Contact from "@/components/Contact";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <div id="environment-day">
          <EnvironmentDay />
        </div>
        <WhatWeDo />
        <OurImpact />
        <StoriesFromTheWild />
        <UpdatesAndNews />
        <CallToActionBanner />
        <Contact />
      </main>
    </div>
  );
};

export default Index;
