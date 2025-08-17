const About = () => {
  const stats = [
    { number: "10,000+", label: "Happy Users" },
    { number: "4.9/5", label: "User Rating" },
    { number: "50+", label: "Countries" },
    { number: "99%", label: "Success Rate" }
  ];

  return (
    <section id="about" className="py-20 bg-gradient-to-br from-secondary/10 via-background to-accent/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          <div className="space-y-6 fade-in-up">
            <h2 className="text-4xl lg:text-5xl font-bold">
              About <span className="hero-text">NeoRishi</span>
            </h2>
            <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed">
              We combine 5000-year-old Ayurvedic wisdom with cutting-edge AI to make ancient wellness 
              teachings accessible for modern life. Every recommendation is personalized to your unique 
              constitution and goals.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 fade-in-up">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className="spiritual-card p-6 text-center space-y-2"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-2xl lg:text-3xl font-bold hero-text">
                  {stat.number}
                </div>
                <div className="text-sm text-muted-foreground font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;