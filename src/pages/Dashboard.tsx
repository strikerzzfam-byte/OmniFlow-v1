import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pen, Palette, Wand2, TrendingUp, FileText, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import GSAPAnimations from "@/components/GSAPAnimations";
import MagneticButton from "@/components/MagneticButton";
import CountUpAnimation from "@/components/CountUpAnimation";
import { useEffect } from "react";
import { gsap } from "gsap";

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const tl = gsap.timeline();
    
    tl.fromTo(".welcome-section", 
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
    )
    .fromTo(".module-card", 
      { opacity: 0, y: 30, scale: 0.9 },
      { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.1, ease: "back.out(1.7)" }, "-=0.4"
    );

    document.querySelectorAll('.module-card').forEach(card => {
      card.addEventListener('mouseenter', () => {
        gsap.to(card.querySelector('.module-icon'), {
          rotation: 360,
          scale: 1.2,
          duration: 0.6,
          ease: "back.out(1.7)"
        });
      });
      
      card.addEventListener('mouseleave', () => {
        gsap.to(card.querySelector('.module-icon'), {
          rotation: 0,
          scale: 1,
          duration: 0.4,
          ease: "power2.out"
        });
      });
    });
  }, []);

  const modules = [
    {
      icon: Pen,
      title: "OmniWrite",
      description: "Start writing with AI assistance",
      stats: "3 documents",
      path: "/dashboard/omniwrite",
      gradient: "from-primary/20 to-primary/5",
      color: "text-primary",
    },
    {
      icon: Palette,
      title: "OmniDesign",
      description: "Create stunning designs",
      stats: "5 templates",
      path: "/dashboard/omnidesign",
      gradient: "from-secondary/20 to-secondary/5",
      color: "text-secondary",
    },
    {
      icon: Wand2,
      title: "OmniGenerate",
      description: "Generate content with AI",
      stats: "12 generations",
      path: "/dashboard/omnigenerate",
      gradient: "from-primary/20 to-secondary/5",
      color: "text-primary",
    },
  ];

  const recentActivity = [
    { icon: FileText, title: "Product Launch Blog", time: "2 hours ago", type: "OmniWrite" },
    { icon: Palette, title: "Marketing Banner", time: "5 hours ago", type: "OmniDesign" },
    { icon: Wand2, title: "Social Media Captions", time: "1 day ago", type: "OmniGenerate" },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="welcome-section relative">
        <h1 className="text-4xl font-bold mb-2">
          Welcome back! 
          <motion.span
            animate={{ rotate: [0, 14, -8, 14, -4, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            className="inline-block"
          >
            👋
          </motion.span>
        </h1>
        <p className="text-muted-foreground text-lg">
          Ready to create something amazing today?
        </p>
      </div>

      {/* Main Modules Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {modules.map((module, index) => (
          <Card
            key={module.title}
            className={`module-card glass p-6 cursor-pointer transition-all hover:border-primary/50 hover:shadow-glow bg-gradient-to-br ${module.gradient} group overflow-hidden relative`}
            onClick={() => navigate(module.path)}
          >
            <div className="module-icon">
              <module.icon className={`w-12 h-12 mb-4 ${module.color}`} />
            </div>
            <h3 className="text-2xl font-bold mb-2">{module.title}</h3>
            <p className="text-muted-foreground mb-4">{module.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{module.stats}</span>
              <MagneticButton
                variant="ghost"
                size="sm"
                className="hover:bg-primary/10 hover:text-primary"
              >
                Open →
              </MagneticButton>
            </div>
          </Card>
        ))}
      </div>

      {/* Stats and Recent Activity */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Quick Stats */}
        <GSAPAnimations animation="slideUp" delay={0.3}>
          <Card className="glass p-6">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="w-6 h-6 text-primary" />
              <h3 className="text-xl font-bold">Quick Stats</h3>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Total Projects</span>
                <CountUpAnimation endValue={20} className="text-2xl font-bold text-gradient" />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">AI Generations</span>
                <CountUpAnimation endValue={147} className="text-2xl font-bold text-gradient" />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Time Saved</span>
                <CountUpAnimation endValue={32} suffix="h" className="text-2xl font-bold text-gradient" />
              </div>
            </div>
          </Card>
        </GSAPAnimations>

        {/* Recent Activity */}
        <GSAPAnimations animation="slideUp" delay={0.5}>
          <Card className="glass p-6">
            <div className="flex items-center gap-3 mb-6">
              <Clock className="w-6 h-6 text-primary" />
              <h3 className="text-xl font-bold">Recent Activity</h3>
            </div>
            <GSAPAnimations animation="stagger">
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/30 transition-colors cursor-pointer group"
                  >
                    <activity.icon className="w-5 h-5 text-primary" />
                    <div className="flex-1">
                      <p className="font-medium">{activity.title}</p>
                      <p className="text-sm text-muted-foreground">{activity.type}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{activity.time}</span>
                  </div>
                ))}
              </div>
            </GSAPAnimations>
          </Card>
        </GSAPAnimations>
      </div>
    </div>
  );
};

export default Dashboard;
