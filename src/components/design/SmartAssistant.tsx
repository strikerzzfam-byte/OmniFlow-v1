import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Sparkles, Wand2, Palette, Type, Layout, Image, 
  Lightbulb, Zap, Send, X, RefreshCw
} from 'lucide-react';

interface SmartAssistantProps {
  onClose: () => void;
  onApplySuggestion: (suggestion: any) => void;
}

const SmartAssistant = ({ onClose, onApplySuggestion }: SmartAssistantProps) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);

  const quickPrompts = [
    "Create a modern logo design",
    "Design a social media post",
    "Make a professional presentation slide",
    "Generate a color palette",
    "Suggest typography pairing",
    "Create a poster layout"
  ];

  const colorPalettes = [
    {
      name: "Ocean Breeze",
      colors: ["#00B4D8", "#0077B6", "#023E8A", "#03045E", "#90E0EF"],
      mood: "Professional, Calm"
    },
    {
      name: "Sunset Glow",
      colors: ["#F77F00", "#FCBF49", "#EAE2B7", "#D62828", "#003049"],
      mood: "Energetic, Warm"
    },
    {
      name: "Forest Zen",
      colors: ["#2D6A4F", "#40916C", "#52B788", "#74C69D", "#95D5B2"],
      mood: "Natural, Peaceful"
    },
    {
      name: "Neon Cyber",
      colors: ["#9D4EDD", "#C77DFF", "#E0AAFF", "#00F5FF", "#08F7FE"],
      mood: "Futuristic, Bold"
    }
  ];

  const layoutSuggestions = [
    {
      name: "Hero Section",
      description: "Large heading with supporting text and CTA",
      elements: ["title", "subtitle", "button", "background"]
    },
    {
      name: "Feature Grid",
      description: "3-column layout showcasing key features",
      elements: ["icons", "headings", "descriptions"]
    },
    {
      name: "Testimonial Card",
      description: "Quote with author photo and details",
      elements: ["quote", "avatar", "name", "title"]
    },
    {
      name: "Product Showcase",
      description: "Product image with details and pricing",
      elements: ["image", "title", "price", "description"]
    }
  ];

  const typographyPairs = [
    {
      name: "Modern Professional",
      heading: "Inter Bold",
      body: "Inter Regular",
      style: "Clean, readable, versatile"
    },
    {
      name: "Creative Editorial",
      heading: "Playfair Display",
      body: "Source Sans Pro",
      style: "Elegant, sophisticated"
    },
    {
      name: "Tech Startup",
      heading: "Satoshi Bold",
      body: "Satoshi Regular",
      style: "Modern, friendly, approachable"
    },
    {
      name: "Luxury Brand",
      heading: "Cormorant Garamond",
      body: "Lato",
      style: "Premium, refined"
    }
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    
    // Simulate AI generation
    setTimeout(() => {
      const mockSuggestions = [
        {
          type: 'layout',
          title: 'Suggested Layout',
          description: 'Based on your prompt, here\'s a recommended layout structure',
          preview: '🎨'
        },
        {
          type: 'colors',
          title: 'Color Palette',
          description: 'Harmonious colors that match your design intent',
          preview: '🎨'
        },
        {
          type: 'typography',
          title: 'Font Pairing',
          description: 'Typography combination for optimal readability',
          preview: '📝'
        }
      ];
      
      setSuggestions(mockSuggestions);
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <motion.div
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 300, opacity: 0 }}
      className="w-96 h-full glass border-l border-glass-border/50 flex flex-col"
    >
      {/* Header */}
      <div className="p-4 border-b border-glass-border/50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            AI Assistant
          </h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* AI Prompt Input */}
        <div className="space-y-3">
          <div className="flex gap-2">
            <Input
              placeholder="Describe what you want to create..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="flex-1"
              onKeyPress={(e) => e.key === 'Enter' && handleGenerate()}
            />
            <Button 
              onClick={handleGenerate} 
              disabled={isGenerating || !prompt.trim()}
              size="icon"
            >
              {isGenerating ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>

          {/* Quick Prompts */}
          <div className="flex flex-wrap gap-1">
            {quickPrompts.slice(0, 3).map((quickPrompt) => (
              <Badge
                key={quickPrompt}
                variant="secondary"
                className="cursor-pointer hover:bg-primary/20 text-xs"
                onClick={() => setPrompt(quickPrompt)}
              >
                {quickPrompt}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* AI Suggestions */}
        <AnimatePresence>
          {suggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              <h4 className="font-medium flex items-center gap-2">
                <Wand2 className="w-4 h-4 text-primary" />
                AI Suggestions
              </h4>
              {suggestions.map((suggestion, index) => (
                <Card key={index} className="p-3 hover:bg-muted/50 cursor-pointer transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">{suggestion.preview}</div>
                    <div className="flex-1">
                      <h5 className="font-medium text-sm">{suggestion.title}</h5>
                      <p className="text-xs text-muted-foreground">{suggestion.description}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onApplySuggestion(suggestion)}
                    >
                      Apply
                    </Button>
                  </div>
                </Card>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Color Palettes */}
        <div className="space-y-3">
          <h4 className="font-medium flex items-center gap-2">
            <Palette className="w-4 h-4 text-primary" />
            Color Palettes
          </h4>
          <div className="space-y-2">
            {colorPalettes.map((palette) => (
              <Card key={palette.name} className="p-3 hover:bg-muted/50 cursor-pointer transition-colors">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h5 className="font-medium text-sm">{palette.name}</h5>
                    <Badge variant="outline" className="text-xs">{palette.mood}</Badge>
                  </div>
                  <div className="flex gap-1">
                    {palette.colors.map((color, index) => (
                      <div
                        key={index}
                        className="w-6 h-6 rounded border border-border"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <Separator />

        {/* Layout Suggestions */}
        <div className="space-y-3">
          <h4 className="font-medium flex items-center gap-2">
            <Layout className="w-4 h-4 text-primary" />
            Layout Ideas
          </h4>
          <div className="space-y-2">
            {layoutSuggestions.map((layout) => (
              <Card key={layout.name} className="p-3 hover:bg-muted/50 cursor-pointer transition-colors">
                <div className="space-y-2">
                  <h5 className="font-medium text-sm">{layout.name}</h5>
                  <p className="text-xs text-muted-foreground">{layout.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {layout.elements.map((element) => (
                      <Badge key={element} variant="secondary" className="text-xs">
                        {element}
                      </Badge>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <Separator />

        {/* Typography Pairs */}
        <div className="space-y-3">
          <h4 className="font-medium flex items-center gap-2">
            <Type className="w-4 h-4 text-primary" />
            Typography
          </h4>
          <div className="space-y-2">
            {typographyPairs.map((pair) => (
              <Card key={pair.name} className="p-3 hover:bg-muted/50 cursor-pointer transition-colors">
                <div className="space-y-2">
                  <h5 className="font-medium text-sm">{pair.name}</h5>
                  <div className="text-xs text-muted-foreground">
                    <div><strong>Heading:</strong> {pair.heading}</div>
                    <div><strong>Body:</strong> {pair.body}</div>
                    <div className="mt-1 italic">{pair.style}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Smart Tips */}
        <div className="space-y-3">
          <h4 className="font-medium flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-primary" />
            Smart Tips
          </h4>
          <div className="space-y-2 text-xs text-muted-foreground">
            <div className="flex items-start gap-2">
              <Zap className="w-3 h-3 mt-0.5 text-primary" />
              <span>Use consistent spacing between elements for better visual hierarchy</span>
            </div>
            <div className="flex items-start gap-2">
              <Zap className="w-3 h-3 mt-0.5 text-primary" />
              <span>Limit your color palette to 3-5 colors for cohesive design</span>
            </div>
            <div className="flex items-start gap-2">
              <Zap className="w-3 h-3 mt-0.5 text-primary" />
              <span>Ensure sufficient contrast between text and background</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SmartAssistant;