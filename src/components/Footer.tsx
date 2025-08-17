
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube, Heart } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-amber-900 via-orange-900 to-yellow-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <span className="text-3xl">🧘</span>
              <h3 className="text-2xl font-bold">NeoRishi</h3>
            </div>
            <p className="text-amber-100 leading-relaxed">
              Bridging ancient wisdom with modern AI to create personalized wellness journeys for the digital age.
            </p>
            <div className="flex space-x-4">
              <Facebook className="w-5 h-5 text-amber-200 hover:text-white cursor-pointer transition-colors" />
              <Twitter className="w-5 h-5 text-amber-200 hover:text-white cursor-pointer transition-colors" />
              <Instagram className="w-5 h-5 text-amber-200 hover:text-white cursor-pointer transition-colors" />
              <Youtube className="w-5 h-5 text-amber-200 hover:text-white cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#home" className="text-amber-200 hover:text-white transition-colors">Home</a></li>
              <li><a href="#about-section" className="text-amber-200 hover:text-white transition-colors">About Us</a></li>
              <li><a href="#features-section" className="text-amber-200 hover:text-white transition-colors">Features</a></li>
              <li><a href="/blog" className="text-amber-200 hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="text-amber-200 hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-amber-200 hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Our Services</h4>
            <ul className="space-y-2">
              <li><span className="text-amber-200">Prakriti Assessment</span></li>
              <li><span className="text-amber-200">Personalized Nutrition</span></li>
              <li><span className="text-amber-200">Yoga & Meditation</span></li>
              <li><span className="text-amber-200">Lifestyle Coaching</span></li>
              <li><span className="text-amber-200">Spiritual Guidance</span></li>
              <li><span className="text-amber-200">Wellness Analytics</span></li>
            </ul>
          </div>

          {/* Connect With Us */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Connect With Us</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-amber-200" />
                <span className="text-amber-200">hello@neorishi.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-amber-200" />
                <span className="text-amber-200">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-amber-200" />
                <span className="text-amber-200">San Francisco, CA</span>
              </div>
            </div>
            
            {/* Newsletter Signup */}
            <div className="mt-6">
              <h5 className="font-medium mb-2">Stay Updated</h5>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Enter your email"
                  className="flex-1 px-3 py-2 bg-amber-800 border border-amber-700 rounded-l-md text-white placeholder-amber-300 focus:outline-none focus:border-amber-500"
                />
                <button className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 px-4 py-2 rounded-r-md transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-amber-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-amber-200 text-sm mb-4 md:mb-0">
            © 2024 NeoRishi. All rights reserved.
          </div>
          <div className="flex items-center space-x-2 text-amber-200 text-sm">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-red-400" />
            <span>for your wellness journey</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
