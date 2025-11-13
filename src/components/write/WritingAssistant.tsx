import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Wand2, Palette, Type, Zap, RotateCcw, Expand, 
  Shrink, Languages, Lightbulb, Target, BookOpen,
  TrendingUp, Eye, MessageSquare
} from 'lucide-react';
import { WritingTone } from '@/hooks/useRichEditor';

interface WritingAssistantProps {
  editor: any;
  currentTone: WritingTone;
  tones: WritingTone[];
  onToneChange: (tone: WritingTone) => void;
  onSummarize: () => string | undefined;
  onExpand: (text: string) => string;
  onRephrase: (text: string, tone: WritingTone) => string;
  wordCount: number;
  readabilityScore: number;
  seoScore: number;
}

const WritingAssistant: React.FC<WritingAssistantProps> = ({
  editor,
  currentTone,
  tones,
  onToneChange,
  onSummarize,
  onExpand,
  onRephrase,
  wordCount,
  readabilityScore,
  seoScore
}) => {
  const [activePanel, setActivePanel] = useState<'tones' | 'actions' | 'stats' | null>('stats');

  const getSelectedText = () => {
    if (!editor) return '';
    const { from, to } = editor.state.selection;
    return editor.state.doc.textBetween(from, to);
  };

  const handleQuickAction = (action: string) => {
    const selectedText = getSelectedText();
    
    switch (action) {
      case 'summarize':
        const summary = onSummarize();
        if (summary) {
          editor.chain().focus().insertContent(`\n\n**Summary:** ${summary}\n\n`).run();
        }
        break;
      case 'expand':
        if (selectedText) {
          const expanded = onExpand(selectedText);
          editor.chain().focus().insertContent(expanded).run();
        }
        break;
      case 'rephrase':
        if (selectedText) {
          const rephrased = onRephrase(selectedText, currentTone);
          editor.chain().focus().insertContent(rephrased).run();
        }
        break;
      case 'translate':
        if (selectedText) {
          // Mock translation
          editor.chain().focus().insertContent(`[Translated: ${selectedText}]`).run();
        }
        break;
      case 'grammar':
        if (selectedText) {
          // Mock grammar correction
          const corrected = selectedText.replace(/\bi\b/g, 'I').replace(/\bteh\b/g, 'the');
          editor.chain().focus().insertContent(corrected).run();
        }
        break;
      case 'simplify':
        if (selectedText) {
          // Mock simplification
          const simplified = selectedText.replace(/utilize/g, 'use').replace(/facilitate/g, 'help');
          editor.chain().focus().insertContent(simplified).run();
        }
        break;
    }
  };

  const quickActions = [
    { id: 'summarize', icon: Shrink, label: 'Summarize', description: 'Create a brief summary' },
    { id: 'expand', icon: Expand, label: 'Expand', description: 'Add more detail' },
    { id: 'rephrase', icon: RotateCcw, label: 'Rephrase', description: 'Rewrite in current tone' },
    { id: 'translate', icon: Languages, label: 'Translate', description: 'Translate text' },
    { id: 'grammar', icon: BookOpen, label: 'Fix Grammar', description: 'Correct grammar and spelling' },
    { id: 'simplify', icon: Lightbulb, label: 'Simplify', description: 'Make text easier to read' }
  ];

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <motion.div
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-80 glass border-l border-glass-border/50 flex flex-col"
    >
      {/* Header */}
      <div className="p-4 border-b border-glass-border/50">
        <div className="flex items-center space-x-2 mb-3">
          <Wand2 className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">Writing Assistant</h3>
        </div>
        
        <div className="flex space-x-1">
          {[
            { id: 'stats', icon: TrendingUp, label: 'Stats' },
            { id: 'tones', icon: Palette, label: 'Tones' },
            { id: 'actions', icon: Zap, label: 'Actions' }
          ].map(tab => (
            <Button
              key={tab.id}
              variant={activePanel === tab.id ? "default" : "ghost"}
              size="sm"
              onClick={() => setActivePanel(activePanel === tab.id ? null : tab.id as any)}
              className="flex-1"
            >
              <tab.icon className="w-4 h-4 mr-1" />
              {tab.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {activePanel === 'stats' && (
            <motion.div
              key="stats"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-4 space-y-4"
            >
              <Card className="p-4 bg-muted/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Word Count</span>
                  <BookOpen className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="text-2xl font-bold">{wordCount.toLocaleString()}</div>
              </Card>

              <Card className="p-4 bg-muted/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Readability</span>
                  <Eye className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className={`text-2xl font-bold ${getScoreColor(readabilityScore)}`}>
                  {Math.round(readabilityScore)}%
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {readabilityScore >= 80 ? 'Very Easy' : 
                   readabilityScore >= 60 ? 'Easy' : 
                   readabilityScore >= 40 ? 'Moderate' : 'Difficult'}
                </div>
              </Card>

              <Card className="p-4 bg-muted/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">SEO Score</span>
                  <Target className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className={`text-2xl font-bold ${getScoreColor(seoScore)}`}>
                  {seoScore}%
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {seoScore >= 80 ? 'Excellent' : 
                   seoScore >= 60 ? 'Good' : 
                   seoScore >= 40 ? 'Fair' : 'Needs Work'}
                </div>
              </Card>
            </motion.div>
          )}

          {activePanel === 'tones' && (
            <motion.div
              key="tones"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-4 space-y-3"
            >
              <div className="text-sm text-muted-foreground mb-3">
                Current tone: <Badge variant="outline" style={{ color: currentTone.color }}>
                  {currentTone.name}
                </Badge>
              </div>
              
              {tones.map(tone => (
                <Card
                  key={tone.id}
                  className={`p-3 cursor-pointer transition-all hover:bg-muted/50 ${
                    currentTone.id === tone.id ? 'ring-2 ring-primary/50' : ''
                  }`}
                  onClick={() => onToneChange(tone)}
                >
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: tone.color }}
                    />
                    <div className="flex-1">
                      <div className="font-medium">{tone.name}</div>
                      <div className="text-xs text-muted-foreground">{tone.description}</div>
                    </div>
                  </div>
                </Card>
              ))}
            </motion.div>
          )}

          {activePanel === 'actions' && (
            <motion.div
              key="actions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-4 space-y-3"
            >
              {quickActions.map(action => (
                <Card
                  key={action.id}
                  className="p-3 cursor-pointer transition-all hover:bg-muted/50"
                  onClick={() => handleQuickAction(action.id)}
                >
                  <div className="flex items-center space-x-3">
                    <action.icon className="w-5 h-5 text-primary" />
                    <div className="flex-1">
                      <div className="font-medium">{action.label}</div>
                      <div className="text-xs text-muted-foreground">{action.description}</div>
                    </div>
                  </div>
                </Card>
              ))}
              
              <div className="pt-4 border-t border-glass-border/50">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-2">
                  <Lightbulb className="w-4 h-4" />
                  <span>AI Suggestions</span>
                </div>
                <div className="space-y-2">
                  <div className="text-xs p-2 bg-muted/30 rounded">
                    💡 Consider adding more subheadings to improve structure
                  </div>
                  <div className="text-xs p-2 bg-muted/30 rounded">
                    🎯 Add a call-to-action to increase engagement
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default WritingAssistant;