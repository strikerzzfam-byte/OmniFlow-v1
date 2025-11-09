import { useState } from "react";
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

const OmniWrite = () => {
  const [content, setContent] = useState("");
  const { toast } = useToast();

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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">OmniWrite</h1>
            <p className="text-muted-foreground">
              Intelligent writing assistant with real-time suggestions
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={handleSave}>
              <Save className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Editor */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-2"
        >
          <Card className="glass p-6">
            {/* Toolbar */}
            <div className="flex items-center gap-2 pb-4 mb-4 border-b border-border/30">
              <Button variant="ghost" size="icon" className="hover:bg-muted/50">
                <Bold className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-muted/50">
                <Italic className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-muted/50">
                <List className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-muted/50">
                <Type className="w-4 h-4" />
              </Button>
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
        </motion.div>

        {/* Suggestions Panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-6"
        >
          {/* AI Suggestions */}
          <Card className="glass p-6">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-primary" />
              <h3 className="font-bold">AI Suggestions</h3>
            </div>
            <div className="space-y-2">
              {suggestions.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full justify-start text-left border-border/50 hover:bg-primary/10 hover:border-primary/50"
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="glass p-6">
            <h3 className="font-bold mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start border-border/50 hover:bg-primary/10"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Summarize
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start border-border/50 hover:bg-primary/10"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Enhance
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start border-border/50 hover:bg-primary/10"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Format
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default OmniWrite;
