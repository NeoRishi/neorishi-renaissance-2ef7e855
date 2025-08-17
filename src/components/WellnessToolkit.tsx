const WellnessToolkit = () => {
  const tools = [
    {
      icon: "🔮",
      title: "Constitution Assessment",
      description: "Discover your unique Ayurvedic body type"
    },
    {
      icon: "📅",
      title: "Daily Routines",
      description: "Personalized schedules that fit your life"
    },
    {
      icon: "🥗",
      title: "Nutrition Plans", 
      description: "Tailored diet recommendations"
    },
    {
      icon: "🧘",
      title: "Meditation & Breathwork",
      description: "Guided practices for your constitution"
    },
    {
      icon: "🤸",
      title: "Adaptive Yoga",
      description: "Sequences tailored to your needs"
    },
    {
      icon: "📊",
      title: "Progress Tracking",
      description: "Monitor your wellness journey"
    }
  ];

  return (
    <section className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-6 mb-16 fade-in-up">
          <h2 className="text-4xl lg:text-5xl font-bold">
            Your Complete <span className="hero-text">Wellness Toolkit</span>
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {tools.map((tool, index) => (
            <div 
              key={index}
              className="spiritual-card p-6 space-y-4 fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="text-3xl">{tool.icon}</div>
              <h3 className="text-lg font-semibold text-foreground">{tool.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{tool.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WellnessToolkit;