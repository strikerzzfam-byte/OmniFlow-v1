import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Pen, Palette, Wand2, TrendingUp, FileText, Clock, Search, Plus, Sparkles, BarChart3, Zap, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";
import GSAPAnimations from "@/components/GSAPAnimations";
import MagneticButton from "@/components/MagneticButton";
import CountUpAnimation from "@/components/CountUpAnimation";
import { useEffect, useState } from "react";
import { gsap } from "gsap";

const Dashboard = () => {
  const navigate = useNavigate();
  const [commandQuery, setCommandQuery] = useState('');
  const [showFAB, setShowFAB] = useState(false);

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
        
        {/* Command Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 relative max-w-2xl"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="🔍 Ask OmniFlow... (Search, generate, open tools, run actions)"
              value={commandQuery}
              onChange={(e) => setCommandQuery(e.target.value)}
              className="pl-12 pr-4 py-3 text-lg glass border-primary/30 focus:border-primary/50 bg-background/50"
            />
          </div>
        </motion.div>
        
        {/* Smart Suggestions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-4 flex flex-wrap gap-3"
        >
          <Badge variant="outline" className="px-4 py-2 cursor-pointer hover:bg-primary/10 hover:border-primary/50 transition-all">
            ✨ Continue Writing
          </Badge>
          <Badge variant="outline" className="px-4 py-2 cursor-pointer hover:bg-secondary/10 hover:border-secondary/50 transition-all">
            🎨 Create a Design
          </Badge>
          <Badge variant="outline" className="px-4 py-2 cursor-pointer hover:bg-primary/10 hover:border-primary/50 transition-all">
            ⚡ Generate Captions
          </Badge>
        </motion.div>
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
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">{module.stats}</span>
                <div className="w-16 h-2 bg-muted/30 rounded-full overflow-hidden">
                  <div className={`h-full bg-gradient-to-r ${module.gradient.replace('/20', '/60').replace('/5', '/40')} rounded-full`} style={{width: '70%'}} />
                </div>
              </div>
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
              <div className="flex justify-between items-center p-3 rounded-lg bg-gradient-to-r from-primary/10 to-transparent border border-primary/20">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-primary" />
                  <span className="text-muted-foreground">Total Projects</span>
                </div>
                <div className="flex items-center gap-2">
                  <CountUpAnimation endValue={20} className="text-2xl font-bold text-gradient" />
                  <div className="w-12 h-6">
                    <svg className="w-full h-full" viewBox="0 0 48 24">
                      <polyline points="2,20 12,15 22,18 32,10 42,12" stroke="#00B4D8" strokeWidth="2" fill="none" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-gradient-to-r from-secondary/10 to-transparent border border-secondary/20">
                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-secondary" />
                  <span className="text-muted-foreground">AI Generations</span>
                </div>
                <CountUpAnimation endValue={147} className="text-2xl font-bold text-gradient" />
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-gradient-to-r from-primary/10 to-transparent border border-primary/20">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-primary" />
                  <span className="text-muted-foreground">Time Saved</span>
                </div>
                <div className="flex items-center gap-2">
                  <CountUpAnimation endValue={32} suffix="h" className="text-2xl font-bold text-gradient" />
                  <div className="w-16 h-2 bg-muted/30 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: '80%' }}
                      transition={{ delay: 1, duration: 1.5 }}
                    />
                  </div>
                </div>
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
              <div className="relative">
                <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-primary/50 via-secondary/30 to-transparent" />
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/30 transition-all cursor-pointer group relative"
                    >
                      <div className="relative z-10 p-2 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30">
                        <activity.icon className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium group-hover:text-primary transition-colors">{activity.title}</p>
                        <Badge variant="outline" className="text-xs mt-1">{activity.type}</Badge>
                      </div>
                      <Badge variant="secondary" className="text-xs bg-gradient-to-r from-primary/10 to-secondary/10">
                        {activity.time}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              </div>
            </GSAPAnimations>
          </Card>
        </GSAPAnimations>
      </div>
      
      {/* Module Overview Banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8 }}
        className="relative overflow-hidden rounded-2xl p-8 glass border border-primary/30"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/5 to-primary/10 animate-pulse" />
        <div className="relative z-10 text-center">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="inline-block mb-4"
          >
            <Sparkles className="w-8 h-8 text-primary" />
          </motion.div>
          <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            ✨ OmniFlow connects all your creative tools in one intelligent workspace.
          </h3>
          <p className="text-muted-foreground">Seamlessly switch between writing, designing, and generating content with AI assistance.</p>
        </div>
      </motion.div>
      
      {/* Explore More Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="space-y-4"
      >
        <h3 className="text-xl font-bold flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" />
          Explore More
        </h3>
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none">
          {[
            { title: "Blog Templates", desc: "Ready-to-use formats", icon: "📝" },
            { title: "Brand Kit", desc: "Consistent styling", icon: "🎨" },
            { title: "AI Workflows", desc: "Automated processes", icon: "⚙️" },
            { title: "Starter Packs", desc: "Complete projects", icon: "🚀" }
          ].map((item, index) => (
            <motion.div
              key={item.title}
              whileHover={{ scale: 1.05, y: -5 }}
              className="min-w-[200px] p-4 glass rounded-lg border border-primary/20 cursor-pointer"
            >
              <div className="text-2xl mb-2">{item.icon}</div>
              <h4 className="font-semibold">{item.title}</h4>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
      
      {/* Floating Action Button */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.2, type: "spring", stiffness: 200 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <Button
          size="lg"
          className="w-14 h-14 rounded-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-lg hover:shadow-xl transition-all"
          onClick={() => setShowFAB(!showFAB)}
        >
          <Plus className="w-6 h-6" />
        </Button>
        
        {showFAB && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="absolute bottom-16 right-0 bg-background/95 backdrop-blur-sm border border-primary/30 rounded-lg p-2 min-w-[160px] shadow-xl"
          >
            {[
              { label: "Create Blog", icon: Pen, path: "/dashboard/omniwrite" },
              { label: "Start Design", icon: Palette, path: "/dashboard/omnidesign" },
              { label: "Generate Content", icon: Wand2, path: "/dashboard/omnigenerate" }
            ].map((item) => (
              <Button
                key={item.label}
                variant="ghost"
                size="sm"
                className="w-full justify-start mb-1 last:mb-0"
                onClick={() => navigate(item.path)}
              >
                <item.icon className="w-4 h-4 mr-2" />
                {item.label}
              </Button>
            ))}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Dashboard;
