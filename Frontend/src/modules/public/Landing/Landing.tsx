import { useEffect } from "react";
import Navbar from "./Components/Navbar";
import Hero from "./Components/Hero";
import FeaturesSection from "./Components/FeaturesSection";
import Footer from "./Components/Footer";
import MotionWrapper from "../../../ui/Pages_Transitions/MotionWrapper";

const Landing = () => {
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        const featuresSection = document.querySelector("#features");
        if (featuresSection) {
          featuresSection.scrollIntoView({ behavior: "smooth" });
        }
        window.removeEventListener("scroll", handleScroll);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <MotionWrapper>
      <div className="relative min-h-screen text-white overflow-hidden bg-transparent">
        <Navbar />

        <main className="overflow-hidden">
          <Hero />
          <FeaturesSection />
        </main>

        <Footer />
      </div>
    </MotionWrapper>
  );
};

export default Landing;
