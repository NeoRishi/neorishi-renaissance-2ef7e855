import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import WellnessToolkit from "@/components/WellnessToolkit";
import CallToAction from "@/components/CallToAction";
import About from "@/components/About";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <Features />
        <WellnessToolkit />
        <CallToAction />
        <About />
      </main>
      <Footer />
    </div>
  );
};

export default Index;