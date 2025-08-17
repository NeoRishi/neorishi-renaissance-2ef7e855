import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TopNavigation } from "@/components/TopNavigation";
import { ArrowLeft, Calendar, User, Clock, ChevronDown, ChevronUp, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";

const placeholderImg = "/placeholder.svg";

const Blog = () => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState<number | null>(null);

  const handleNavigate = (section: 'home' | 'subscription' | 'goals' | 'assessment') => {
    navigate('/');
  };

  const blogPosts = [
    {
      id: 1,
      title: "The Ancient Science of Right Diet: Nourishing Your Constitution",
      excerpt: "Discover how Ayurvedic principles can transform your relationship with food and optimize your health through personalized nutrition.",
      content: `In Ayurveda, food is not just fuel—it's medicine. The ancient texts tell us "Annam Brahma" (food is divine), emphasizing that what we eat directly impacts our physical, mental, and spiritual well-being.

Your unique constitution (Prakriti) determines which foods will nourish you and which will create imbalance. A Vata-dominant person thrives on warm, grounding foods like cooked grains and root vegetables, while a Pitta constitution benefits from cooling foods like cucumber and mint.

The six tastes—sweet, sour, salty, pungent, bitter, and astringent—each serve a purpose in balancing your doshas. A complete meal should ideally include all six tastes to satisfy both your palate and your body's needs.

Eating with awareness transforms digestion. Chewing slowly, eating in a peaceful environment, and expressing gratitude before meals enhances your body's ability to extract nutrients and eliminate toxins.

Remember: There's no one-size-fits-all diet. What nourishes your friend may disturb your balance. Understanding your constitution is the key to lifelong vitality.`,
      author: "Dr. Ravi Sharma",
      date: "2024-03-15",
      readTime: "5 min read",
      category: "Nutrition"
    },
    {
      id: 2,
      title: "Movement as Medicine: The Yogic Approach to Exercise",
      excerpt: "Learn how ancient yogic practices can provide the perfect exercise routine for your body type and current life stage.",
      content: `Exercise in Ayurveda isn't about burning calories—it's about creating harmony between body, breath, and mind. The Yoga Sutras teach us that physical practice should be "Sthira Sukham" (stable and comfortable).

Different constitutions require different approaches to movement. Vata types benefit from gentle, grounding exercises like restorative yoga and walking. Pitta individuals thrive with moderate intensity activities like swimming or cycling. Kapha constitutions need more vigorous movement like running or dynamic yoga.

The ancient practice of Surya Namaskara (Sun Salutations) provides a complete workout that honors the solar energy while building strength, flexibility, and cardiovascular health. Just 12 rounds can invigorate your entire system.

Pranayama (breathing exercises) is equally important as physical movement. Practices like Bhastrika (bellows breath) can energize a sluggish system, while Sheetali (cooling breath) can calm excess heat.

Listen to your body's wisdom. Exercise should leave you feeling energized, not depleted. The goal is not perfection but progress—a sustainable practice that evolves with your changing needs.`,
      author: "Yogini Priya Devi",
      date: "2024-03-10",
      readTime: "4 min read",
      category: "Exercise"
    },
    {
      id: 3,
      title: "Dinacharya: The Art of Living in Rhythm with Nature",
      excerpt: "Explore how following ancient daily routines can synchronize your life with natural cycles and boost your overall well-being.",
      content: `Dinacharya, the Ayurvedic daily routine, is your blueprint for living in harmony with nature's rhythms. When we align our activities with the sun's cycle, we tap into the universe's natural intelligence.

Rising before sunrise, during the Brahma Muhurta (4-6 AM), allows you to absorb the pure, sattvic energy of dawn. This is when the mind is naturally calm and receptive to spiritual practices like meditation and prayer.

The morning routine includes oil pulling, tongue scraping, and abhyanga (self-massage with warm oil). These practices remove toxins accumulated overnight and prepare your body for the day ahead.

Eating your largest meal at midday, when digestive fire (Agni) is strongest, ensures optimal nutrient absorption. As the sun sets, your digestive capacity naturally diminishes, making dinner the lightest meal.

Evening practices like gentle yoga, meditation, or reading spiritual texts help transition from the day's activities to restful sleep. Going to bed by 10 PM allows your body to complete its natural detoxification cycles.

Consistency is key. Even small daily practices, when done regularly, create profound transformation. Your body has its own wisdom—Dinacharya simply helps you remember and honor it.`,
      author: "Acharya Vishnu Das",
      date: "2024-03-05",
      readTime: "6 min read",
      category: "Lifestyle"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-orange-100 via-amber-100 to-yellow-100 py-16 px-4 mb-10">
        <TopNavigation onNavigate={handleNavigate} />
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center relative z-10">
          <div className="mb-6">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')} 
              className="text-amber-700 hover:text-amber-800"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </div>
          <div className="flex flex-col items-center mb-6">
            <BookOpen className="w-16 h-16 text-amber-400 mb-2" />
            <h1 className="text-5xl font-extrabold text-amber-800 mb-2 drop-shadow-lg">Wisdom Blog</h1>
            <p className="text-lg text-amber-700 max-w-2xl mx-auto">
              Ancient wisdom for modern living. Discover timeless principles from Ayurveda, Yoga, and Sanatan Dharma to transform your daily life.
            </p>
          </div>
        </div>
        {/* Optional: Hero background image/illustration */}
        <img src="/lovable-uploads/3c67ba90-ae3a-4e7a-b07f-fa0a2b7edc68.png" alt="Blog Hero" className="absolute right-0 bottom-0 w-48 opacity-20 pointer-events-none hidden md:block" />
      </div>

      {/* Blog Posts Grid */}
      <div className="max-w-5xl mx-auto px-4 pb-12">
        <div className="grid gap-8 md:grid-cols-2">
          {blogPosts.map((post) => (
            <Card key={post.id} className="bg-white/90 backdrop-blur border-amber-200 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 flex flex-col">
              <div className="relative h-48 w-full rounded-t-xl overflow-hidden mb-2">
                <img
                  src={placeholderImg}
                  alt="Blog visual placeholder"
                  className="object-cover w-full h-full"
                />
                <span className="absolute top-3 left-3 bg-amber-200 text-amber-800 px-3 py-1 rounded-full text-xs font-semibold shadow">
                  {post.category}
                </span>
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl text-amber-800 mb-1 leading-tight">
                  {post.title}
                </CardTitle>
                <p className="text-amber-700 font-medium mb-2">
                  {post.excerpt}
                </p>
                <div className="flex items-center text-xs text-amber-600 space-x-4 mb-1">
                  <span className="flex items-center"><User className="w-4 h-4 mr-1" />{post.author}</span>
                  <span className="flex items-center"><Calendar className="w-4 h-4 mr-1" />{post.date}</span>
                  <span className="flex items-center"><Clock className="w-4 h-4 mr-1" />{post.readTime}</span>
                </div>
              </CardHeader>
              <CardContent className="pt-0 flex-1 flex flex-col">
                {expanded === post.id ? (
                  <>
                    <div className="text-amber-700 leading-relaxed whitespace-pre-line mb-4">
                      {post.content}
                    </div>
                    <Button
                      variant="outline"
                      className="self-start text-amber-700 border-amber-300 hover:bg-amber-50"
                      onClick={() => setExpanded(null)}
                      size="sm"
                    >
                      Show Less <ChevronUp className="w-4 h-4 ml-1" />
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="ghost"
                    className="self-start text-amber-700 hover:text-amber-900 px-0"
                    onClick={() => setExpanded(post.id)}
                    size="sm"
                  >
                    Read More <ChevronDown className="w-4 h-4 ml-1" />
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-20 text-center">
          <div className="bg-gradient-to-r from-orange-100 via-amber-100 to-yellow-100 rounded-2xl p-8 border border-amber-200 shadow-md inline-block">
            <h3 className="text-2xl font-bold text-amber-800 mb-4 flex items-center justify-center gap-2">
              <BookOpen className="w-7 h-7 text-amber-400" /> Ready to Transform Your Life?
            </h3>
            <p className="text-lg text-amber-700 mb-6">
              These ancient principles become powerful when personalized to your unique constitution. 
              Discover your path to optimal wellness.
            </p>
            <Button 
              onClick={() => {
                navigate('/');
                setTimeout(() => {
                  const element = document.getElementById('about-section');
                  element?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white px-8 py-3 text-lg font-semibold rounded-xl"
            >
              Start Your Wellness Journey
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;
