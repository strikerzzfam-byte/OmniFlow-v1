import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pen, Palette, Wand2, TrendingUp, FileText, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold mb-2">Welcome back! 👋</h1>
        <p className="text-muted-foreground text-lg">
          Ready to create something amazing today?
        </p>
      </motion.div>

      {/* Main Modules Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {modules.map((module, index) => (
          <motion.div
            key={module.title}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card
              className={`glass p-6 cursor-pointer transition-all hover:border-primary/50 hover:shadow-glow bg-gradient-to-br ${module.gradient} group`}
              onClick={() => navigate(module.path)}
            >
              <module.icon className={`w-12 h-12 mb-4 ${module.color} group-hover:scale-110 transition-transform`} />
              <h3 className="text-2xl font-bold mb-2">{module.title}</h3>
              <p className="text-muted-foreground mb-4">{module.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{module.stats}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="hover:bg-primary/10 hover:text-primary"
                >
                  Open →
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Stats and Recent Activity */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="glass p-6">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="w-6 h-6 text-primary" />
              <h3 className="text-xl font-bold">Quick Stats</h3>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Total Projects</span>
                <span className="text-2xl font-bold text-gradient">20</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">AI Generations</span>
                <span className="text-2xl font-bold text-gradient">147</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Time Saved</span>
                <span className="text-2xl font-bold text-gradient">32h</span>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="glass p-6">
            <div className="flex items-center gap-3 mb-6">
              <Clock className="w-6 h-6 text-primary" />
              <h3 className="text-xl font-bold">Recent Activity</h3>
            </div>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/30 transition-colors cursor-pointer"
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
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
