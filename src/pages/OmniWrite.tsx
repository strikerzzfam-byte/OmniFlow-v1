import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Sparkles,
  Type,
  Bold,
  Italic,
  List,
  Save,
  Download,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import GSAPAnimations from "@/components/GSAPAnimations";
import MagneticButton from "@/components/MagneticButton";
import { gsap } from "gsap";

const OmniWrite = () => {
  const [content, setContent] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const tl = gsap.timeline();
    
    tl.fromTo(".omniwrite-header", 
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
    )
    .fromTo(".editor-card", 
      { opacity: 0, x: -50 },
      { opacity: 1, x: 0, duration: 0.6, ease: "power2.out" }, "-=0.4"
    )
    .fromTo(".suggestions-panel", 
      { opacity: 0, x: 50 },
      { opacity: 1, x: 0, duration: 0.6, ease: "power2.out" }, "-=0.4"
    );
  }, []);

  const suggestions = [
    "Make it more professional",
    "Add bullet points",
    "Simplify language",
    "Expand this section",
  ];

  const handleSave = () => {
    toast({
      title: "Document saved",
      description: "Your work has been saved successfully.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="omniwrite-header">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">OmniWrite</h1>
            <p className="text-muted-foreground">
              Intelligent writing assistant with real-time suggestions
            </p>
          </div>
          <div className="flex gap-2">
            <MagneticButton variant="outline" size="icon" onClick={handleSave}>
              <Save className="w-4 h-4" />
            </MagneticButton>
            <MagneticButton variant="outline" size="icon">
              <Download className="w-4 h-4" />
            </MagneticButton>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Editor */}
        <div className="lg:col-span-2">
          <Card className="editor-card glass p-6">
            {/* Toolbar */}
            <div className="flex items-center gap-2 pb-4 mb-4 border-b border-border/30">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button variant="ghost" size="icon" className="hover:bg-muted/50">
                  <Bold className="w-4 h-4" />
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button variant="ghost" size="icon" className="hover:bg-muted/50">
                  <Italic className="w-4 h-4" />
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button variant="ghost" size="icon" className="hover:bg-muted/50">
                  <List className="w-4 h-4" />
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button variant="ghost" size="icon" className="hover:bg-muted/50">
                  <Type className="w-4 h-4" />
                </Button>
              </motion.div>
            </div>

            {/* Text Area */}
            <Textarea
              placeholder="Start writing your masterpiece..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[500px] bg-transparent border-0 focus-visible:ring-0 text-lg resize-none"
            />

            {/* Status Bar */}
            <div className="flex items-center justify-between pt-4 mt-4 border-t border-border/30 text-sm text-muted-foreground">
              <span>{content.length} characters</span>
              <span>Last saved: Just now</span>
            </div>
          </Card>
        </div>

        {/* Suggestions Panel */}
        <div className="suggestions-panel space-y-6">
          {/* AI Suggestions */}
          <Card className="glass p-6">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-primary" />
              <h3 className="font-bold">AI Suggestions</h3>
            </div>
            <div className="space-y-2">
              {suggestions.map((suggestion, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ x: 5, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left border-border/50 hover:bg-primary/10 hover:border-primary/50 transition-all duration-300"
                  >
                    {suggestion}
                  </Button>
                </motion.div>
              ))}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="glass p-6">
            <h3 className="font-bold mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <motion.div whileHover={{ x: 5, scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  variant="outline"
                  className="w-full justify-start border-border/50 hover:bg-primary/10 group"
                >
                  <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.6 }}>
                    <Sparkles className="w-4 h-4 mr-2 group-hover:animate-pulse-glow" />
                  </motion.div>
                  Summarize
                </Button>
              </motion.div>
              <motion.div whileHover={{ x: 5, scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  variant="outline"
                  className="w-full justify-start border-border/50 hover:bg-primary/10 group"
                >
                  <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.6 }}>
                    <Sparkles className="w-4 h-4 mr-2 group-hover:animate-pulse-glow" />
                  </motion.div>
                  Enhance
                </Button>
              </motion.div>
              <motion.div whileHover={{ x: 5, scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  variant="outline"
                  className="w-full justify-start border-border/50 hover:bg-primary/10 group"
                >
                  <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.6 }}>
                    <Sparkles className="w-4 h-4 mr-2 group-hover:animate-pulse-glow" />
                  </motion.div>
                  Format
                </Button>
              </motion.div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OmniWrite;
