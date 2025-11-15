import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { X, Palette } from 'lucide-react';

interface Shape {
  id: string;
  type: 'rect' | 'circle' | 'text' | 'line' | 'arrow' | 'star' | 'image';
  x: number;
  y: number;
  width?: number;
  height?: number;
  radius?: number;
  fill: string;
  stroke?: string;
  strokeWidth?: number;
  text?: string;
  fontSize?: number;
  fontFamily?: string;
  rotation?: number;
  scaleX?: number;
  scaleY?: number;
  opacity?: number;
  points?: number[];
  src?: string;
}

interface PropertiesPanelProps {
  shape: Shape;
  onShapeUpdate: (shape: Shape) => void;
  onClose: () => void;
}

const PropertiesPanel = ({ shape, onShapeUpdate, onClose }: PropertiesPanelProps) => {
  const [localShape, setLocalShape] = useState(shape);

  const updateProperty = (key: keyof Shape, value: any) => {
    const updated = { ...localShape, [key]: value };
    setLocalShape(updated);
    onShapeUpdate(updated);
  };

  const colorPresets = [
    '#00B4D8', '#9D4EDD', '#F77F00', '#D62828', '#FCBF49',
    '#06FFA5', '#FF006E', '#8338EC', '#3A86FF', '#FB8500'
  ];

  return (
    <motion.div
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 300, opacity: 0 }}
      className="w-80 h-full glass border-l border-glass-border/50 p-4 overflow-y-auto"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Properties</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-6">
        {/* Position */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Position</Label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs text-muted-foreground">X</Label>
              <Input
                type="number"
                value={Math.round(localShape.x)}
                onChange={(e) => updateProperty('x', Number(e.target.value))}
                className="h-8"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Y</Label>
              <Input
                type="number"
                value={Math.round(localShape.y)}
                onChange={(e) => updateProperty('y', Number(e.target.value))}
                className="h-8"
              />
            </div>
          </div>
        </div>

        {/* Size */}
        {(localShape.type === 'rect' || localShape.type === 'image') && (
          <div className="space-y-3">
            <Label className="text-sm font-medium">Size</Label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs text-muted-foreground">Width</Label>
                <Input
                  type="number"
                  value={localShape.width || 0}
                  onChange={(e) => updateProperty('width', Number(e.target.value))}
                  className="h-8"
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Height</Label>
                <Input
                  type="number"
                  value={localShape.height || 0}
                  onChange={(e) => updateProperty('height', Number(e.target.value))}
                  className="h-8"
                />
              </div>
            </div>
          </div>
        )}

        {/* Radius */}
        {(localShape.type === 'circle' || localShape.type === 'star') && (
          <div className="space-y-3">
            <Label className="text-sm font-medium">Radius</Label>
            <Input
              type="number"
              value={localShape.radius || 0}
              onChange={(e) => updateProperty('radius', Number(e.target.value))}
              className="h-8"
            />
          </div>
        )}

        {/* Text Properties */}
        {localShape.type === 'text' && (
          <div className="space-y-3">
            <Label className="text-sm font-medium">Text</Label>
            <Input
              value={localShape.text || ''}
              onChange={(e) => updateProperty('text', e.target.value)}
              className="h-8"
            />
            <div>
              <Label className="text-xs text-muted-foreground">Font Size</Label>
              <Input
                type="number"
                value={localShape.fontSize || 16}
                onChange={(e) => updateProperty('fontSize', Number(e.target.value))}
                className="h-8"
              />
            </div>
          </div>
        )}

        {/* Fill Color */}
        <div className="space-y-3">
          <Label className="text-sm font-medium flex items-center gap-2">
            <Palette className="w-4 h-4" />
            Fill Color
          </Label>
          <Input
            type="color"
            value={localShape.fill}
            onChange={(e) => updateProperty('fill', e.target.value)}
            className="h-8 w-full"
          />
          <div className="grid grid-cols-5 gap-2">
            {colorPresets.map((color) => (
              <button
                key={color}
                className="w-8 h-8 rounded border-2 border-border hover:scale-110 transition-transform"
                style={{ backgroundColor: color }}
                onClick={() => updateProperty('fill', color)}
              />
            ))}
          </div>
        </div>

        {/* Stroke */}
        {localShape.type !== 'text' && (
          <div className="space-y-3">
            <Label className="text-sm font-medium">Stroke</Label>
            <Input
              type="color"
              value={localShape.stroke || '#000000'}
              onChange={(e) => updateProperty('stroke', e.target.value)}
              className="h-8"
            />
            <div>
              <Label className="text-xs text-muted-foreground">Stroke Width</Label>
              <Slider
                value={[localShape.strokeWidth || 0]}
                onValueChange={([value]) => updateProperty('strokeWidth', value)}
                max={20}
                step={1}
                className="mt-2"
              />
            </div>
          </div>
        )}

        {/* Transform */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Transform</Label>
          <div>
            <Label className="text-xs text-muted-foreground">Rotation</Label>
            <Slider
              value={[localShape.rotation || 0]}
              onValueChange={([value]) => updateProperty('rotation', value)}
              min={-180}
              max={180}
              step={1}
              className="mt-2"
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Opacity</Label>
            <Slider
              value={[localShape.opacity || 1]}
              onValueChange={([value]) => updateProperty('opacity', value)}
              min={0}
              max={1}
              step={0.1}
              className="mt-2"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PropertiesPanel;