import React, { useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { GenerationSettings } from '@/hooks/useOmniGenerate';
import { Sparkles, Wand2, Target, Users, FileText, MessageSquare } from 'lucide-react';

interface PromptStudioProps {
  settings: GenerationSettings;
  onSettingsChange: (settings: GenerationSettings) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

const tones = [
  { id: 'casual', name: 'Casual', color: '#10B981', icon: '😊' },
  { id: 'formal', name: 'Formal', color: '#3B82F6', icon: '🎩' },
  { id: 'emotional', name: 'Emotional', color: '#EC4899', icon: '❤️' },
  { id: 'humorous', name: 'Humorous', color: '#F59E0B', icon: '😄' },
  { id: 'luxury', name: 'Luxury', color: '#8B5CF6', icon: '💎' },
  { id: 'storytelling', name: 'Storytelling', color: '#EF4444', icon: '📚' }
];

const styles = [
  { id: 'educational', name: 'Educational', icon: '🎓' },
  { id: 'marketing', name: 'Marketing', icon: '📈' },
  { id: 'inspirational', name: 'Inspirational', icon: '✨' },
  { id: 'technical', name: 'Technical', icon: '⚙️' },
  { id: 'conversational', name: 'Conversational', icon: '💬' }
];

const PromptStudio: React.FC<PromptStudioProps> = React.memo(({
  settings,
  onSettingsChange,
  onGenerate,
  isGenerating
}) => {
  const handleTopicChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onSettingsChange({ ...settings, topic: e.target.value });
  }, [settings, onSettingsChange]);

  const handleAudienceChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onSettingsChange({ ...settings, audience: e.target.value });
  }, [settings, onSettingsChange]);

  return (
    <div className="h-full p-6 overflow-y-auto scrollbar-none">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto space-y-8"
      >
        {/* Header */}
        <div className="text-center">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="inline-flex items-center space-x-2 mb-4"
          >
            <Wand2 className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">Prompt Studio</h2>
          </motion.div>
          <p className="text-muted-foreground">
            Craft the perfect prompt to generate amazing content
          </p>
        </div>

        {/* Topic Input */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-3"
        >
          <Label className="flex items-center space-x-2">
            <Target className="w-4 h-4 text-primary" />
            <span>Topic / Idea</span>
          </Label>
          <Textarea
            placeholder="What would you like to create content about?"
            value={settings.topic}
            onChange={handleTopicChange}
            className="min-h-[100px] resize-none"
          />
        </motion.div>

        {/* Audience */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-3"
        >
          <Label className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-primary" />
            <span>Target Audience</span>
          </Label>
          <Input
            placeholder="Who is this content for?"
            value={settings.audience}
            onChange={handleAudienceChange}
          />
        </motion.div>

        {/* Tone Selector */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-3"
        >
          <Label className="flex items-center space-x-2">
            <MessageSquare className="w-4 h-4 text-primary" />
            <span>Tone</span>
          </Label>
          <div className="grid grid-cols-3 gap-2">
            {tones.map(tone => (
              <Button
                key={tone.id}
                variant={settings.tone === tone.id ? "default" : "outline"}
                size="sm"
                onClick={() => onSettingsChange({ ...settings, tone: tone.id as any })}
                className="justify-start"
              >
                <span className="mr-2">{tone.icon}</span>
                {tone.name}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Style Mode */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-3"
        >
          <Label className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <span>Style Mode</span>
          </Label>
          <div className="grid grid-cols-2 gap-2">
            {styles.map(style => (
              <Button
                key={style.id}
                variant={settings.style === style.id ? "default" : "outline"}
                size="sm"
                onClick={() => onSettingsChange({ ...settings, style: style.id as any })}
                className="justify-start"
              >
                <span className="mr-2">{style.icon}</span>
                {style.name}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Quick Settings */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-2 gap-4"
        >
          <div className="space-y-3">
            <Label>Length</Label>
            <div className="flex space-x-2">
              {['short', 'medium', 'long'].map(length => (
                <Button
                  key={length}
                  variant={settings.length === length ? "default" : "outline"}
                  size="sm"
                  onClick={() => onSettingsChange({ ...settings, length: length as any })}
                  className="flex-1"
                >
                  {length.charAt(0).toUpperCase() + length.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label>Perspective</Label>
            <div className="flex space-x-2">
              {['1st', '2nd', '3rd'].map(perspective => (
                <Button
                  key={perspective}
                  variant={settings.perspective === perspective ? "default" : "outline"}
                  size="sm"
                  onClick={() => onSettingsChange({ ...settings, perspective: perspective as any })}
                  className="flex-1"
                >
                  {perspective} Person
                </Button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Generate Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="pt-4"
        >
          <Button
            onClick={onGenerate}
            disabled={!settings.topic || isGenerating}
            size="lg"
            className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-semibold py-4"
          >
            {isGenerating ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
              />
            ) : (
              <Wand2 className="w-5 h-5 mr-2" />
            )}
            {isGenerating ? 'Generating Magic...' : 'Generate Content'}
          </Button>
        </motion.div>

        {/* Live Preview */}
        {settings.topic && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 bg-muted/30 rounded-lg border border-primary/20"
          >
            <h4 className="font-semibold mb-2 text-primary">Live Preview</h4>
            <p className="text-sm text-muted-foreground">
              Creating {settings.tone} {settings.style} content about "{settings.topic}" 
              for {settings.audience || 'general audience'} in {settings.perspective} person, 
              {settings.length} format.
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
});

export default PromptStudio;