import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Palette, Download, Share2, Monitor, Tablet, Smartphone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const OmniDesign = () => {
  const { toast } = useToast();

  const templates = [
    { name: "Hero Banner", category: "Marketing", color: "from-primary/30 to-primary/10" },
    { name: "Product Card", category: "E-commerce", color: "from-secondary/30 to-secondary/10" },
    { name: "Social Post", category: "Social Media", color: "from-primary/20 to-secondary/20" },
  ];

  const colors = [
    { hex: "#00B4D8", name: "Primary" },
    { hex: "#9D4EDD", name: "Secondary" },
    { hex: "#F8F9FA", name: "Light" },
    { hex: "#0D0D0D", name: "Dark" },
  ];

  const handleExport = () => {
    toast({
      title: "Design exported",
      description: "Your design has been exported successfully.",
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
            <h1 className="text-4xl font-bold mb-2">OmniDesign</h1>
            <p className="text-muted-foreground">
              Drag-and-drop design lab with instant mockups
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={handleExport}>
              <Download className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Templates Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-6"
        >
          <Card className="glass p-6">
            <h3 className="font-bold mb-4">Templates</h3>
            <div className="space-y-3">
              {templates.map((template, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg bg-gradient-to-br ${template.color} border border-border/30 cursor-pointer hover:border-primary/50 transition-all`}
                >
                  <p className="font-medium mb-1">{template.name}</p>
                  <p className="text-xs text-muted-foreground">{template.category}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="glass p-6">
            <div className="flex items-center gap-2 mb-4">
              <Palette className="w-5 h-5 text-primary" />
              <h3 className="font-bold">Color Picker</h3>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {colors.map((color, index) => (
                <div
                  key={index}
                  className="aspect-square rounded-lg cursor-pointer hover:scale-105 transition-transform border border-border/30"
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                />
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Canvas Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-3 space-y-6"
        >
          {/* Device Preview Buttons */}
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="border-primary/50 bg-primary/10">
              <Monitor className="w-4 h-4 mr-2" />
              Desktop
            </Button>
            <Button variant="outline" size="sm">
              <Tablet className="w-4 h-4 mr-2" />
              Tablet
            </Button>
            <Button variant="outline" size="sm">
              <Smartphone className="w-4 h-4 mr-2" />
              Mobile
            </Button>
          </div>

          {/* Canvas */}
          <Card className="glass p-8 min-h-[600px] relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
            <div className="relative flex items-center justify-center h-full">
              <div className="text-center space-y-4">
                <div className="w-24 h-24 mx-auto bg-gradient-primary rounded-2xl animate-float" />
                <p className="text-xl font-semibold text-muted-foreground">
                  Your canvas awaits
                </p>
                <p className="text-sm text-muted-foreground max-w-md">
                  Select a template from the sidebar or start from scratch to create your masterpiece
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default OmniDesign;
