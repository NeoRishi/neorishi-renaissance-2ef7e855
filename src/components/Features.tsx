import { Button } from "@/components/ui/button";

const Features = () => {
  const features = [
    {
      icon: "💪",
      title: "Physical Wellness",
      description: "Overcome low energy, poor digestion, and weight struggles"
    },
    {
      icon: "🧠",
      title: "Mental Clarity", 
      description: "Find focus, reduce anxiety, and boost motivation"
    },
    {
      icon: "✨",
      title: "Spiritual Growth",
      description: "Discover your purpose and inner peace"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-background via-secondary/20 to-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-6 mb-16 fade-in-up">
          <h2 className="text-4xl lg:text-5xl font-bold">
            Transform Your <span className="hero-text">Wellness Journey</span>
          </h2>
          <p className="text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto">
            Feeling tired, stuck, or out of sync with your body and mind? NeoRishi combines 5000-year-old Ayurvedic wisdom with modern AI to create your personalized path to wellness.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="spiritual-card p-8 text-center space-y-4 fade-in-up"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-foreground">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center fade-in-up">
          <Button variant="wellness" size="lg">
            🔍 Explore How It Works
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Features;