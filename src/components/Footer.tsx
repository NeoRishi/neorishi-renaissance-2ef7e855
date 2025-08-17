import logoIcon from "@/assets/logo-icon.png";

const Footer = () => {
  return (
    <footer className="bg-foreground/5 backdrop-blur-sm border-t border-border/50 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-6">
          <div className="flex items-center justify-center space-x-3">
            <img src={logoIcon} alt="NeoRishi" className="h-8 w-8" />
            <span className="text-2xl font-bold hero-text">🧘NeoRishi</span>
          </div>
          
          <p className="text-muted-foreground max-w-md mx-auto">
            Ancient wisdom meets modern technology for your personalized spiritual wellness journey.
          </p>
          
          <div className="flex justify-center space-x-8 text-sm text-muted-foreground">
            <a href="#privacy" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#terms" className="hover:text-primary transition-colors">Terms of Service</a>
            <a href="#contact" className="hover:text-primary transition-colors">Contact</a>
          </div>
          
          <div className="text-xs text-muted-foreground/70">
            © 2024 NeoRishi. All rights reserved. 🕉️
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;