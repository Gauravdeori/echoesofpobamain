import Header from "@/components/Header";
import Gallery from "@/components/Gallery";
import Contact from "@/components/Contact";

const GalleryPage = () => {
  return (
    <div className="min-h-screen bg-background animate-fade-in">
      <Header />
      <main>
        <div id="gallery">
          <Gallery />
        </div>
      </main>
      <Contact />
    </div>
  );
};

export default GalleryPage;
