import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Brain, 
  Users, 
  BarChart3, 
  ShoppingBag, 
  Plug, 
  Palette, 
  Share2, 
  Trello, 
  Cloud, 
  Globe 
} from "lucide-react";

const Roadmap = () => {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Workflow Assistant",
      description: "A built-in assistant that helps users summarize, rewrite, and organize projects automatically. Smart task generation from text, one-click content improvement, and context-aware suggestions across all modules.",
      status: "Coming Soon",
      statusColor: "from-accent/20 to-accent/5",
      progress: 35,
    },
    {
      icon: Users,
      title: "Team Collaboration Mode",
      description: "Real-time workspace sharing with teammates — write, design, and create together. Live multi-user editing, comment and mention system, and version history tracking.",
      status: "In Development",
      statusColor: "from-primary/20 to-primary/5",
      progress: 60,
    },
    {
      icon: BarChart3,
      title: "Smart Analytics Dashboard",
      description: "Insights for creators — track engagement, performance, and growth. Blog and content performance analytics, design engagement stats, and smart 'Success Meter' for generated content.",
      status: "Coming Soon",
      statusColor: "from-accent/20 to-accent/5",
      progress: 25,
    },
    {
      icon: ShoppingBag,
      title: "Template Marketplace",
      description: "Access community-built templates for writing, branding, and campaigns. Free and premium templates across categories: blogs, marketing, scripts, UI layouts. Save & remix templates.",
      status: "Concept Stage",
      statusColor: "from-muted/20 to-muted/5",
      progress: 15,
    },
    {
      icon: Plug,
      title: "Third-Party Integrations",
      description: "Connect OmniFlow to your favorite tools including Google Drive, Notion, Figma, and Slack for seamless workflow integration.",
      status: "Integration Testing",
      statusColor: "from-primary/20 to-primary/5",
      progress: 70,
    },
    {
      icon: Palette,
      title: "OmniTheme Studio",
      description: "Full theme customization experience with custom gradients and palettes, font pairings and brand presets. Export your theme JSON config.",
      status: "Coming Soon",
      statusColor: "from-accent/20 to-accent/5",
      progress: 40,
    },
    {
      icon: Share2,
      title: "One-Click Publish",
      description: "Instantly publish generated content to blogs or social platforms. WordPress, Medium, and LinkedIn auto-publish with preview and approval mode before posting.",
      status: "In Design",
      statusColor: "from-secondary/20 to-secondary/5",
      progress: 30,
    },
    {
      icon: Trello,
      title: "Smart Project Boards",
      description: "Organize your work with visual boards. Drag-and-drop cards for ideas, drafts, and tasks with tag-based sorting and timeline view.",
      status: "Planned",
      statusColor: "from-muted/20 to-muted/5",
      progress: 10,
    },
    {
      icon: Cloud,
      title: "Secure Cloud Sync",
      description: "Automatically sync user drafts, preferences, and designs across devices. Cloud backup, multi-device sync, and offline editing support.",
      status: "Coming Soon",
      statusColor: "from-accent/20 to-accent/5",
      progress: 45,
    },
    {
      icon: Globe,
      title: "Public Portfolio Mode",
      description: "Share your best creations with the world. Auto-generate portfolio pages from OmniWrite or OmniDesign with custom subdomain (username.omniflow.app) and community engagement features.",
      status: "Prototype Stage",
      statusColor: "from-secondary/20 to-secondary/5",
      progress: 20,
    },
  ];

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "In Development":
      case "Integration Testing":
        return "default";
      case "In Design":
      case "Prototype Stage":
        return "secondary";
      case "Concept Stage":
      case "Planned":
        return "outline";
      default:
        return "secondary";
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header Section */}
      <section className="relative py-20 px-6 border-b border-border/30">
        <div className="container mx-auto max-w-6xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              The Future of <span className="text-gradient">OmniFlow</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We're not done redefining creativity — stay tuned for what's next. Here's what we're building for you.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
              >
                <Card className={`glass h-full border-border/50 hover:border-primary/50 transition-all duration-300 bg-gradient-to-br ${feature.statusColor}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                        <feature.icon className="w-6 h-6 text-primary" />
                      </div>
                      <Badge variant={getStatusVariant(feature.status)} className="text-xs">
                        {feature.status}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
                    <CardDescription className="text-sm leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Progress</span>
                        <span className="font-medium">{feature.progress}%</span>
                      </div>
                      <Progress value={feature.progress} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-16 px-6 border-t border-border/30">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="text-3xl font-bold mb-4">
              Want to shape the future of <span className="text-gradient">OmniFlow</span>?
            </h3>
            <p className="text-muted-foreground mb-8">
              Join our community and share your ideas. Your feedback drives our roadmap.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Roadmap;
