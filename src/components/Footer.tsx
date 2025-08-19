
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-card border-t border-border py-12">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center justify-center space-y-6">
          {/* Social Media Icons */}
          <div className="flex space-x-6">
            <Facebook className="w-6 h-6 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
            <Twitter className="w-6 h-6 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
            <Instagram className="w-6 h-6 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
            <Youtube className="w-6 h-6 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
          </div>

          {/* Copyright */}
          <div className="text-center space-y-2">
            <p className="text-muted-foreground">
              © 2025 RishiVerse
            </p>
            <p className="text-sm text-muted-foreground">
              Made with ❤️ for your wellness journey
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
