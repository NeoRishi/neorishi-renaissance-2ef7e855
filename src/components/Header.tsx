import { Button } from "@/components/ui/button";
import logoIcon from "@/assets/logo-icon.png";

const Header = () => {
  return (
    <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <img src={logoIcon} alt="NeoRishi" className="h-8 w-8" />
            <span className="text-2xl font-bold hero-text">🧘NeoRishi</span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#home" className="text-foreground/80 hover:text-primary transition-colors">
              🏠 Home
            </a>
            <a href="#about" className="text-foreground/80 hover:text-primary transition-colors">
              👥 About Us
            </a>
            <a href="#features" className="text-foreground/80 hover:text-primary transition-colors">
              ⭐ Features
            </a>
            <a href="#blog" className="text-foreground/80 hover:text-primary transition-colors">
              📝 Blog
            </a>
          </nav>

          {/* Sign In Button */}
          <Button variant="spiritual" size="sm">
            🚀 Sign In
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;