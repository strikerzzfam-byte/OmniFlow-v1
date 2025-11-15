import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Pen, Palette, Wand2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ParticleBackground from "@/components/ParticleBackground";
import { BouncingBalls } from "@/components/ui/bouncing-balls";
import GSAPAnimations from "@/components/GSAPAnimations";
import MagneticButton from "@/components/MagneticButton";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useAuth } from "@/contexts/AuthContext";

gsap.registerPlugin(ScrollTrigger);

const Landing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);

  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/auth');
    }
  };

  useEffect(() => {
    // Hero timeline animation
    const tl = gsap.timeline();
    
    tl.fromTo(".hero-title", 
      { opacity: 0, y: 100 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
    )
    .fromTo(".hero-subtitle", 
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }, "-=0.5"
    )
    .fromTo(".hero-buttons", 
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.7)" }, "-=0.3"
    );

    // Parallax background
    gsap.to(".parallax-bg", {
      yPercent: -50,
      ease: "none",
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: true
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const features = [
    {
      icon: Pen,
      title: "OmniWrite",
      description: "Intelligent writing assistant with real-time suggestions and formatting",
      gradient: "from-primary/20 to-primary/5",
    },
    {
      icon: Palette,
      title: "OmniDesign",
      description: "Drag-and-drop design lab with instant mockups and templates",
      gradient: "from-secondary/20 to-secondary/5",
    },
    {
      icon: Wand2,
      title: "OmniGenerate",
      description: "AI-powered content generation for blogs, scripts, and more",
      gradient: "from-primary/20 to-secondary/5",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden relative">
      {/* Interactive Background */}
      <div className="fixed inset-0 z-0">
        <BouncingBalls
          numBalls={80}
          colors={['#00B4D8', '#9D4EDD', '#06FFA5', '#FFB700']}
          opacity={0.6}
          minRadius={1}
          maxRadius={3}
          speed={0.3}
          interactive={true}
          followMouse={false}
          trailAlpha={0.95}
        />
      </div>
      <ParticleBackground />
      {/* Navbar */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 w-full z-50 glass border-b border-glass-border/30"
      >
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <motion.div 
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <img src="/omniflow-brand-logo.svg" alt="OmniFlow" className="h-10 w-auto" />
          </motion.div>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate("/roadmap")}
              className="hover:text-primary"
            >
              Roadmap
            </Button>
            <Button
              onClick={handleGetStarted}
              className="bg-primary hover:bg-primary/90 text-primary-foreground glow-primary"
            >
              Get Started <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center px-6 pt-20">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="parallax-bg absolute top-20 left-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float" />
          <div className="parallax-bg absolute bottom-20 right-10 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
          <div className="parallax-bg absolute top-1/2 left-1/2 w-64 h-64 bg-primary/3 rounded-full blur-2xl animate-rotate-slow" />
        </div>

        <div className="relative z-10 text-center max-w-5xl">
          <div className="hero-title">
            <h1 className="text-6xl md:text-8xl font-bold mb-6 leading-tight">
              Create Anything.
              <br />
              <span className="text-gradient">Manage Everything.</span>
            </h1>
          </div>

          <p className="hero-subtitle text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto">
            Powered by ArcNex Technologies — a next-gen all-in-one workspace that unifies writing, design, and content generation.
          </p>

          <div className="hero-buttons flex gap-4 justify-center flex-wrap">
            <MagneticButton
              size="lg"
              onClick={handleGetStarted}
              className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 glow-primary"
            >
              Get Started <ArrowRight className="ml-2 w-5 h-5" />
            </MagneticButton>
            <MagneticButton
              size="lg"
              variant="outline"
              className="border-primary/50 hover:bg-primary/10 text-lg px-8"
            >
              Try Live Demo
            </MagneticButton>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="relative py-32 px-6">
        <div className="container mx-auto max-w-6xl">
          <GSAPAnimations animation="slideUp" trigger=".features-header">
            <div className="features-header text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Everything you need, <span className="text-gradient">unified</span>
              </h2>
              <p className="text-xl text-muted-foreground">
                Three powerful modules, one seamless experience
              </p>
            </div>
          </GSAPAnimations>

          <GSAPAnimations animation="stagger" trigger=".features-grid">
            <div className="features-grid grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div
                  key={feature.title}
                  className={`glass p-8 rounded-2xl cursor-pointer transition-all hover:border-primary/50 bg-gradient-to-br ${feature.gradient} group feature-card`}
                >
                  <div className="feature-icon">
                    <feature.icon className="w-12 h-12 text-primary mb-4" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </GSAPAnimations>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/30 py-8 px-6">
        <div className="container mx-auto text-center">
          <p className="text-sm text-muted-foreground mb-2">
            OmniFlow v1 — Powered by <span className="text-primary font-semibold">ArcNex Technologies</span>
          </p>
          <p className="text-xs text-muted-foreground">
            Designed to redefine the future of SaaS creation.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
