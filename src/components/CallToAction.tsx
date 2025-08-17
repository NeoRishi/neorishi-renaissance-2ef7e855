import { Button } from "@/components/ui/button";

const CallToAction = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-primary/5 via-primary-glow/5 to-primary/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="spiritual-card p-12 text-center space-y-8 max-w-2xl mx-auto fade-in-up">
          <h2 className="text-3xl lg:text-4xl font-bold">
            Ready to <span className="hero-text">Begin?</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Join thousands discovering their optimal wellness path
          </p>
          <Button variant="hero" size="xl" className="glow-on-hover">
            🌟 Start Free Assessment
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;