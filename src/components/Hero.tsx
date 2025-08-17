import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-meditation.jpg";

const Hero = () => {
  return (
    <section id="home" className="min-h-screen flex items-center justify-center pt-16 pattern-dots">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 fade-in-up">
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                <span className="hero-text">NeoRishi</span>
              </h1>
              <p className="text-xl lg:text-2xl text-muted-foreground font-medium">
                Your AI-Powered Spiritual Wellness Mentor
              </p>
              <div className="flex flex-wrap gap-2 text-sm text-primary font-medium">
                <span>Ancient Wisdom</span>
                <span>•</span>
                <span>Modern Technology</span>
                <span>•</span>
                <span>Personalized Journey</span>
              </div>
            </div>

            <div className="space-y-4">
              <Button variant="hero" size="xl" className="glow-on-hover">
                ✨ Start Your Wellness Journey
              </Button>
              <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                <span>Free Assessment</span>
                <span>•</span>
                <span>7-Day Trial</span>
                <span>•</span>
                <span>Personalized Plan</span>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative fade-in">
            <div className="spiritual-card p-8 glow-on-hover">
              <img 
                src={heroImage} 
                alt="NeoRishi - Ancient Rishi with AI Technology"
                className="w-full h-auto rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;