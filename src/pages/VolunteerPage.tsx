import Header from "@/components/Header";
import VolunteerForm from "@/components/VolunteerForm";
import Contact from "@/components/Contact";

const VolunteerPage = () => {
  return (
    <div className="min-h-screen bg-background animate-fade-in">
      <Header />
      <main>
        <div id="volunteer">
          <VolunteerForm />
        </div>
      </main>
      <Contact />
    </div>
  );
};

export default VolunteerPage;
