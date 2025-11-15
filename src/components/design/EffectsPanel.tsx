import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { X, Sparkles, Zap, Focus, Sun } from 'lucide-react';
import { CanvasShape } from '@/hooks/useCanvasTools';
import SimpleColorPicker from './SimpleColorPicker';

interface EffectsPanelProps {
  selectedShapes: CanvasShape[];
  onShapeUpdate: (id: string, updates: Partial<CanvasShape>) => void;
  onClose: () => void;
}

const EffectsPanel = ({ selectedShapes, onShapeUpdate, onClose }: EffectsPanelProps) => {
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
            <Sparkles className="w-5 h-5 text-primary" />
            Effects
          </h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-muted-foreground text-center">Select an object to apply effects</p>
      </motion.div>
    );
  }

  const updateProperty = (key: keyof CanvasShape, value: any) => {
    selectedShapes.forEach(s => onShapeUpdate(s.id, { [key]: value }));
  };

  const updateShadow = (updates: Partial<NonNullable<CanvasShape['shadow']>>) => {
    const currentShadow = shape.shadow || { blur: 0, offset: { x: 0, y: 0 }, color: '#000000' };
    updateProperty('shadow', { ...currentShadow, ...updates });
  };

  const updateGlow = (updates: Partial<NonNullable<CanvasShape['glow']>>) => {
    const currentGlow = shape.glow || { blur: 0, color: '#00B4D8' };
    updateProperty('glow', { ...currentGlow, ...updates });
  };

  return (
    <motion.div
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 300, opacity: 0 }}
      className="w-80 h-full glass border-l border-glass-border/50 p-4 overflow-y-auto"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          Effects
        </h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-6">
        {/* Drop Shadow */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Sun className="w-4 h-4" />
              Drop Shadow
            </Label>
            <Switch
              checked={!!shape.shadow && shape.shadow.blur > 0}
              onCheckedChange={(checked) => {
                if (checked) {
                  updateShadow({ blur: 10, offset: { x: 2, y: 2 }, color: '#000000' });
                } else {
                  updateProperty('shadow', undefined);
                }
              }}
            />
          </div>

          {shape.shadow && shape.shadow.blur > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-3 pl-6"
            >
              <div>
                <Label className="text-xs text-muted-foreground">Blur</Label>
                <Slider
                  value={[shape.shadow.blur]}
                  onValueChange={([value]) => updateShadow({ blur: value })}
                  max={50}
                  step={1}
                  className="mt-2"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs text-muted-foreground">X Offset</Label>
                  <Input
                    type="number"
                    value={shape.shadow.offset.x}
                    onChange={(e) => updateShadow({ 
                      offset: { ...shape.shadow!.offset, x: Number(e.target.value) }
                    })}
                    className="h-8 mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Y Offset</Label>
                  <Input
                    type="number"
                    value={shape.shadow.offset.y}
                    onChange={(e) => updateShadow({ 
                      offset: { ...shape.shadow!.offset, y: Number(e.target.value) }
                    })}
                    className="h-8 mt-1"
                  />
                </div>
              </div>
              
              <SimpleColorPicker
                color={shape.shadow.color}
                onChange={(color) => updateShadow({ color })}
                label="Shadow Color"
              />
            </motion.div>
          )}
        </div>

        <Separator />

        {/* Neon Glow */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              Neon Glow
            </Label>
            <Switch
              checked={!!shape.glow && shape.glow.blur > 0}
              onCheckedChange={(checked) => {
                if (checked) {
                  updateGlow({ blur: 15, color: '#00B4D8' });
                } else {
                  updateProperty('glow', undefined);
                }
              }}
            />
          </div>

          {shape.glow && shape.glow.blur > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-3 pl-6"
            >
              <div>
                <Label className="text-xs text-muted-foreground">Intensity</Label>
                <Slider
                  value={[shape.glow.blur]}
                  onValueChange={([value]) => updateGlow({ blur: value })}
                  max={50}
                  step={1}
                  className="mt-2"
                />
              </div>
              
              <SimpleColorPicker
                color={shape.glow.color}
                onChange={(color) => updateGlow({ color })}
                label="Glow Color"
              />
            </motion.div>
          )}
        </div>

        <Separator />

        {/* Transform Effects */}
        <div className="space-y-4">
          <Label className="text-sm font-medium flex items-center gap-2">
            <Focus className="w-4 h-4" />
            Transform
          </Label>
          
          <div>
            <Label className="text-xs text-muted-foreground">Rotation</Label>
            <Slider
              value={[shape.rotation || 0]}
              onValueChange={([value]) => updateProperty('rotation', value)}
              min={-180}
              max={180}
              step={1}
              className="mt-2"
            />
            <div className="text-xs text-muted-foreground mt-1">
              {Math.round(shape.rotation || 0)}°
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs text-muted-foreground">Scale X</Label>
              <Slider
                value={[shape.scaleX || 1]}
                onValueChange={([value]) => updateProperty('scaleX', value)}
                min={0.1}
                max={3}
                step={0.1}
                className="mt-2"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Scale Y</Label>
              <Slider
                value={[shape.scaleY || 1]}
                onValueChange={([value]) => updateProperty('scaleY', value)}
                min={0.1}
                max={3}
                step={0.1}
                className="mt-2"
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Quick Presets */}
        <div className="space-y-4">
          <Label className="text-sm font-medium">Quick Presets</Label>
          
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                updateShadow({ blur: 20, offset: { x: 0, y: 10 }, color: '#000000' });
                updateGlow({ blur: 0, color: '#00B4D8' });
              }}
              className="text-xs"
            >
              Soft Shadow
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                updateGlow({ blur: 25, color: '#00B4D8' });
                updateProperty('shadow', undefined);
              }}
              className="text-xs"
            >
              Neon Glow
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                updateShadow({ blur: 5, offset: { x: 2, y: 2 }, color: '#000000' });
                updateGlow({ blur: 15, color: '#9D4EDD' });
              }}
              className="text-xs"
            >
              Cyberpunk
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                updateProperty('shadow', undefined);
                updateProperty('glow', undefined);
              }}
              className="text-xs"
            >
              Clear All
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default EffectsPanel;