import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Bot, Sparkles, Palette, Layout, Type, Image, 
  Wand2, X, Send, Lightbulb, Zap, Star
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SmartAssistantProps {
  onClose: () => void;
  onApplySuggestion: (suggestion: any) => void;
}

const SmartAssistant: React.FC<SmartAssistantProps> = ({ onClose, onApplySuggestion }) => {
  const [activeTab, setActiveTab] = useState<'generate' | 'suggestions' | 'optimize'>('generate');
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const suggestions = [
    {
      id: 1,
      title: 'Improve Color Harmony',
      description: 'Apply a complementary color scheme to enhance visual appeal',
      icon: Palette,
      type: 'color',
      confidence: 95
    },
    {
      id: 2,
      title: 'Balance Layout',
      description: 'Redistribute elements for better visual weight distribution',
      icon: Layout,
      type: 'layout',
      confidence: 88
    },
    {
      id: 3,
      title: 'Typography Enhancement',
      description: 'Optimize font pairing and hierarchy for better readability',
      icon: Type,
      type: 'typography',
      confidence: 92
    },
    {
      id: 4,
      title: 'Add Visual Interest',
      description: 'Include subtle animations and micro-interactions',
      icon: Sparkles,
      type: 'effects',
      confidence: 85
    }
  ];

  const quickPrompts = [
    'Create a modern logo design',
    'Design a social media post',
    'Generate a color palette',
    'Create geometric patterns',
    'Design a business card layout',
    'Make a poster design'
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    // Simulate AI generation
    setTimeout(() => {
      setIsGenerating(false);
      // Add generated elements to canvas
    }, 2000);
  };

  const tabs = [
    { id: 'generate', label: 'Generate', icon: Wand2 },
    { id: 'suggestions', label: 'Suggestions', icon: Lightbulb },
    { id: 'optimize', label: 'Optimize', icon: Zap }
  ];

  return (
    <motion.div
      initial={{ x: 400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 400, opacity: 0 }}
      className="w-96 glass border-l border-glass-border/50 flex flex-col h-full"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-glass-border/50">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#00B4D8] to-[#9D4EDD] flex items-center justify-center">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <h3 className="font-semibold text-foreground">AI Assistant</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="w-8 h-8 p-0"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-glass-border/50">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "flex-1 rounded-none border-b-2 border-transparent",
                activeTab === tab.id && "border-[#00B4D8] bg-[#00B4D8]/10"
              )}
            >
              <Icon className="w-4 h-4 mr-2" />
              {tab.label}
            </Button>
          );
        })}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {activeTab === 'generate' && (
            <motion.div
              key="generate"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-4 space-y-4"
            >
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Describe what you want to create
                </label>
                <Textarea
                  placeholder="e.g., Create a modern logo with geometric shapes and blue gradient..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-[100px] resize-none"
                />
              </div>

              <Button
                onClick={handleGenerate}
                disabled={!prompt.trim() || isGenerating}
                className="w-full bg-gradient-to-r from-[#00B4D8] to-[#9D4EDD] hover:from-[#00B4D8]/80 hover:to-[#9D4EDD]/80"
              >
                {isGenerating ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Generating...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Send className="w-4 h-4" />
                    <span>Generate</span>
                  </div>
                )}
              </Button>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Quick Prompts
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {quickPrompts.map((quickPrompt, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => setPrompt(quickPrompt)}
                      className="justify-start text-left h-auto py-2 px-3"
                    >
                      <Sparkles className="w-3 h-3 mr-2 text-[#9D4EDD]" />
                      {quickPrompt}
                    </Button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'suggestions' && (
            <motion.div
              key="suggestions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-4 space-y-3"
            >
              {suggestions.map((suggestion) => {
                const Icon = suggestion.icon;
                return (
                  <div
                    key={suggestion.id}
                    className="p-4 rounded-lg border border-glass-border/50 hover:border-[#00B4D8]/30 transition-colors group cursor-pointer"
                    onClick={() => onApplySuggestion(suggestion)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#00B4D8]/20 to-[#9D4EDD]/20 flex items-center justify-center">
                        <Icon className="w-4 h-4 text-[#00B4D8]" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-foreground group-hover:text-[#00B4D8] transition-colors">
                            {suggestion.title}
                          </h4>
                          <div className="flex items-center space-x-1">
                            <Star className="w-3 h-3 text-yellow-400 fill-current" />
                            <span className="text-xs text-muted-foreground">
                              {suggestion.confidence}%
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {suggestion.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          )}

          {activeTab === 'optimize' && (
            <motion.div
              key="optimize"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-4 space-y-4"
            >
              <div className="text-center py-8">
                <Zap className="w-12 h-12 text-[#9D4EDD] mx-auto mb-4" />
                <h3 className="font-medium text-foreground mb-2">Auto-Optimize Design</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Let AI analyze and optimize your design for better visual impact
                </p>
                <Button className="bg-gradient-to-r from-[#00B4D8] to-[#9D4EDD]">
                  <Zap className="w-4 h-4 mr-2" />
                  Optimize Now
                </Button>
              </div>

              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                  <div className="flex items-center space-x-2 mb-1">
                    <div className="w-2 h-2 rounded-full bg-green-400" />
                    <span className="text-sm font-medium text-green-400">Accessibility</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Color contrast meets WCAG standards</p>
                </div>

                <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                  <div className="flex items-center space-x-2 mb-1">
                    <div className="w-2 h-2 rounded-full bg-yellow-400" />
                    <span className="text-sm font-medium text-yellow-400">Performance</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Consider reducing complex shapes</p>
                </div>

                <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <div className="flex items-center space-x-2 mb-1">
                    <div className="w-2 h-2 rounded-full bg-blue-400" />
                    <span className="text-sm font-medium text-blue-400">Composition</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Good use of whitespace and balance</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default SmartAssistant;