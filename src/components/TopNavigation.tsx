
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { UserMenu } from "./UserMenu";
import { useNavigate } from "react-router-dom";
import { Home, Star, DollarSign, BookOpen, LogIn, Users, Calendar } from "lucide-react";

interface TopNavigationProps {
  onNavigate: (section: 'home' | 'subscription' | 'goals' | 'assessment' | 'features' | 'about') => void;
}

export const TopNavigation = ({ onNavigate }: TopNavigationProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-orange-50 via-amber-50 to-yellow-50 border-b border-amber-200 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Left side - Logo/Brand */}
        <div className="flex items-center">
          <button 
            onClick={() => onNavigate('home')}
            className="text-2xl font-bold text-amber-800 hover:text-orange-600 transition-colors flex items-center space-x-2"
          >
            <span className="text-3xl">🧘</span>
            <span>NeoRishi</span>
          </button>
        </div>
        
        {/* Right side - Navigation Menu */}
        <div className="flex items-center space-x-6">
          <nav className="hidden md:flex items-center space-x-6">
            <button 
              onClick={() => onNavigate('home')}
              className="flex items-center space-x-2 text-amber-700 hover:text-amber-800 font-medium transition-colors"
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </button>
            <button 
              onClick={() => navigate('/calendar')}
              className="flex items-center space-x-2 text-purple-700 hover:text-purple-800 font-medium transition-colors"
            >
              <Calendar className="w-4 h-4" />
              <span>🌙 Calendar</span>
            </button>
            <button 
              onClick={() => onNavigate('about')}
              className="flex items-center space-x-2 text-amber-700 hover:text-amber-800 font-medium transition-colors"
            >
              <Users className="w-4 h-4" />
              <span>About Us</span>
            </button>
            <button 
              onClick={() => onNavigate('features')}
              className="flex items-center space-x-2 text-amber-700 hover:text-amber-800 font-medium transition-colors"
            >
              <Star className="w-4 h-4" />
              <span>Features</span>
            </button>
            <button 
              onClick={() => navigate('/blog')}
              className="flex items-center space-x-2 text-amber-700 hover:text-amber-800 font-medium transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              <span>Blog</span>
            </button>
          </nav>
          
          {/* Auth Section */}
          {user ? (
            <UserMenu />
          ) : (
            <Button 
              onClick={() => navigate('/auth')}
              className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white px-6 py-2 font-semibold flex items-center space-x-2"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
