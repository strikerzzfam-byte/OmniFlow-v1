import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { X, Play, Pause, RotateCcw, Zap } from 'lucide-react';
import { AdvancedShape } from '@/hooks/useAdvancedCanvasTools';

interface AnimationPanelProps {
  selectedShapes: AdvancedShape[];
  onShapeUpdate: (id: string, updates: Partial<AdvancedShape>) => void;
  onClose: () => void;
}

const AnimationPanel = ({ selectedShapes, onShapeUpdate, onClose }: AnimationPanelProps) => {
  const [previewMode, setPreviewMode] = useState(false);
  const shape = selectedShapes[0];

  if (!shape) {
    return (
      <motion.div
        initial={{ x: 300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 300, opacity: 0 }}
        className="w-80 h-full glass border-l border-glass-border/50 p-4"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            Animation
          </h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-muted-foreground text-center">Select an object to animate</p>
      </motion.div>
    );
  }

  const updateAnimation = (updates: Partial<NonNullable<AdvancedShape['animation']>>) => {
    const currentAnimation = shape.animation || { type: 'fade', duration: 1, delay: 0, repeat: false };
    selectedShapes.forEach(s => 
      onShapeUpdate(s.id, { animation: { ...currentAnimation, ...updates } })
    );
  };

  const removeAnimation = () => {
    selectedShapes.forEach(s => onShapeUpdate(s.id, { animation: undefined }));
  };

  const animationTypes = [
    { value: 'fade', label: 'Fade In/Out' },
    { value: 'slide', label: 'Slide' },
    { value: 'scale', label: 'Scale' },
    { value: 'rotate', label: 'Rotate' },
  ];

  const presets = [
    { name: 'Quick Fade', type: 'fade', duration: 0.3, delay: 0 },
    { name: 'Smooth Slide', type: 'slide', duration: 0.8, delay: 0.1 },
    { name: 'Bounce Scale', type: 'scale', duration: 0.6, delay: 0 },
    { name: 'Spin', type: 'rotate', duration: 1, delay: 0 },
  ];

  return (
    <motion.div
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 300, opacity: 0 }}
      className="w-80 h-full glass border-l border-glass-border/50 p-4 overflow-y-auto"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Zap className="w-5 h-5 text-primary" />
          Animation
        </h3>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setPreviewMode(!previewMode)}
            className={previewMode ? 'text-primary' : ''}
          >
            {previewMode ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Animation Toggle */}
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Enable Animation</Label>
          <Switch
            checked={!!shape.animation}
            onCheckedChange={(checked) => {
              if (checked) {
                updateAnimation({ type: 'fade', duration: 1, delay: 0, repeat: false });
              } else {
                removeAnimation();
              }
            }}
          />
        </div>

        {shape.animation && (
          <>
            <Separator />

            {/* Animation Type */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Animation Type</Label>
              <Select 
                value={shape.animation.type} 
                onValueChange={(value: any) => updateAnimation({ type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {animationTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Duration */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Duration</Label>
              <div className="flex items-center space-x-2">
                <Slider
                  value={[shape.animation.duration]}
                  onValueChange={([value]) => updateAnimation({ duration: value })}
                  min={0.1}
                  max={5}
                  step={0.1}
                  className="flex-1"
                />
                <span className="text-xs text-muted-foreground w-12">
                  {shape.animation.duration}s
                </span>
              </div>
            </div>

            {/* Delay */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Delay</Label>
              <div className="flex items-center space-x-2">
                <Slider
                  value={[shape.animation.delay]}
                  onValueChange={([value]) => updateAnimation({ delay: value })}
                  min={0}
                  max={3}
                  step={0.1}
                  className="flex-1"
                />
                <span className="text-xs text-muted-foreground w-12">
                  {shape.animation.delay}s
                </span>
              </div>
            </div>

            {/* Repeat */}
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Repeat</Label>
              <Switch
                checked={shape.animation.repeat}
                onCheckedChange={(checked) => updateAnimation({ repeat: checked })}
              />
            </div>

            <Separator />

            {/* Presets */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Quick Presets</Label>
              <div className="grid grid-cols-2 gap-2">
                {presets.map((preset) => (
                  <Button
                    key={preset.name}
                    variant="outline"
                    size="sm"
                    onClick={() => updateAnimation({
                      type: preset.type as any,
                      duration: preset.duration,
                      delay: preset.delay,
                    })}
                    className="text-xs h-8"
                  >
                    {preset.name}
                  </Button>
                ))}
              </div>
            </div>

            <Separator />

            {/* Preview */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Preview</Label>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPreviewMode(!previewMode)}
                  className="flex-1"
                >
                  {previewMode ? (
                    <>
                      <Pause className="w-4 h-4 mr-2" />
                      Stop Preview
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Preview
                    </>
                  )}
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setPreviewMode(false);
                    setTimeout(() => setPreviewMode(true), 100);
                  }}
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Animation Preview Box */}
            <div className="border border-border rounded-lg p-4 bg-muted/20">
              <div className="flex items-center justify-center h-20">
                <motion.div
                  className="w-8 h-8 bg-primary rounded"
                  animate={previewMode ? {
                    opacity: shape.animation.type === 'fade' ? [0, 1, 0] : 1,
                    x: shape.animation.type === 'slide' ? [0, 20, 0] : 0,
                    scale: shape.animation.type === 'scale' ? [1, 1.5, 1] : 1,
                    rotate: shape.animation.type === 'rotate' ? [0, 360] : 0,
                  } : {}}
                  transition={{
                    duration: shape.animation.duration,
                    delay: shape.animation.delay,
                    repeat: shape.animation.repeat ? Infinity : 0,
                    ease: "easeInOut"
                  }}
                />
              </div>
              <p className="text-xs text-muted-foreground text-center mt-2">
                Animation Preview
              </p>
            </div>

            <Separator />

            {/* Remove Animation */}
            <Button
              variant="outline"
              onClick={removeAnimation}
              className="w-full text-destructive hover:bg-destructive/10"
            >
              Remove Animation
            </Button>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default AnimationPanel;