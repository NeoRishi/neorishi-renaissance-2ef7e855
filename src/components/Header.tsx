import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Menu, X, Home, Star, Users, BookOpen, LogIn } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { UserMenu } from "./UserMenu";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  onNavigate: (section: 'home' | 'subscription' | 'goals' | 'assessment' | 'features' | 'about') => void;
}

export const Header = ({ onNavigate }: HeaderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const navigation = [
    { name: 'Home', action: () => onNavigate('home'), icon: Home },
    { name: 'Features', action: () => onNavigate('features'), icon: Star },
    { name: 'About Us', action: () => onNavigate('about'), icon: Users },
    { name: 'Blog', action: () => navigate('/blog'), icon: BookOpen },
  ];

  return (
    <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div 
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => onNavigate('home')}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-3xl">🧘</span>
            <span className="text-2xl font-bold text-foreground">NeoRishi</span>
          </motion.div>

          {/* Desktop Navigation */}
          <motion.div 
            className="hidden md:flex items-center space-x-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {navigation.map((item) => (
              <button
                key={item.name}
                onClick={item.action}
                className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                <item.icon className="w-4 h-4" />
                <span>{item.name}</span>
              </button>
            ))}
            
            {/* Auth Section */}
            {user ? (
              <UserMenu />
            ) : (
              <Button 
                onClick={() => navigate('/auth')}
                variant="premium" 
                size="sm"
                className="flex items-center space-x-2"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </Button>
            )}
          </motion.div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div 
            className="md:hidden mt-4 pb-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col space-y-4">
              {navigation.map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    item.action();
                    setIsOpen(false);
                  }}
                  className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors text-left"
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </button>
              ))}
              
              {/* Mobile Auth Section */}
              {user ? (
                <UserMenu />
              ) : (
                <Button 
                  onClick={() => {
                    navigate('/auth');
                    setIsOpen(false);
                  }}
                  variant="premium" 
                  size="sm" 
                  className="w-fit flex items-center space-x-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </nav>
    </header>
  );
};