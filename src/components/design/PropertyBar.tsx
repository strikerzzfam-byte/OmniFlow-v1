import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { 
  Type, Palette, Move, RotateCw, Eye, EyeOff, Lock, Unlock,
  AlignLeft, AlignCenter, AlignRight, Bold, Italic, Underline
} from 'lucide-react';
import { Shape } from '@/hooks/useCanvasTools';
import { cn } from '@/lib/utils';

interface PropertyBarProps {
  selectedShapes: Shape[];
  onShapeUpdate: (id: string, updates: Partial<Shape>) => void;
}

const PropertyBar: React.FC<PropertyBarProps> = ({ selectedShapes, onShapeUpdate }) => {
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  
  if (selectedShapes.length === 0) {
    return (
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="h-14 glass border-b border-glass-border/50 flex items-center justify-center px-6"
      >
        <span className="text-sm text-muted-foreground">Select an object to edit properties</span>
      </motion.div>
    );
  }

  const shape = selectedShapes[0];
  const isMultiSelect = selectedShapes.length > 1;

  const updateProperty = (property: string, value: any) => {
    selectedShapes.forEach(shape => {
      onShapeUpdate(shape.id, { [property]: value });
    });
  };

  const colors = [
    '#00B4D8', '#9D4EDD', '#FFD60A', '#FF006E', '#8338EC',
    '#3A86FF', '#06FFA5', '#FB8500', '#E63946', '#F77F00'
  ];

  return (
    <motion.div
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="h-14 glass border-b border-glass-border/50 flex items-center justify-between px-6 space-x-4"
    >
      {/* Position & Size */}
      <div className="flex items-center space-x-2">
        <Move className="w-4 h-4 text-muted-foreground" />
        <div className="flex items-center space-x-1">
          <Input
            type="number"
            value={Math.round(shape.x)}
            onChange={(e) => updateProperty('x', parseInt(e.target.value) || 0)}
            className="w-16 h-8 text-xs"
            placeholder="X"
          />
          <Input
            type="number"
            value={Math.round(shape.y)}
            onChange={(e) => updateProperty('y', parseInt(e.target.value) || 0)}
            className="w-16 h-8 text-xs"
            placeholder="Y"
          />
        </div>
        
        {shape.width && shape.height && (
          <div className="flex items-center space-x-1">
            <Input
              type="number"
              value={Math.round(shape.width)}
              onChange={(e) => updateProperty('width', parseInt(e.target.value) || 0)}
              className="w-16 h-8 text-xs"
              placeholder="W"
            />
            <Input
              type="number"
              value={Math.round(shape.height)}
              onChange={(e) => updateProperty('height', parseInt(e.target.value) || 0)}
              className="w-16 h-8 text-xs"
              placeholder="H"
            />
          </div>
        )}
      </div>

      <div className="w-px h-6 bg-border" />

      {/* Color & Fill */}
      <div className="flex items-center space-x-2">
        <Palette className="w-4 h-4 text-muted-foreground" />
        <div className="relative">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setColorPickerOpen(!colorPickerOpen)}
            className="w-8 h-8 p-0 border-2"
            style={{ backgroundColor: shape.fill || '#00B4D8' }}
          />
          
          {colorPickerOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-full mt-2 p-2 glass rounded-lg border border-glass-border/50 grid grid-cols-5 gap-1 z-50"
            >
              {colors.map((color) => (
                <Button
                  key={color}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    updateProperty('fill', color);
                    setColorPickerOpen(false);
                  }}
                  className="w-6 h-6 p-0 border"
                  style={{ backgroundColor: color }}
                />
              ))}
            </motion.div>
          )}
        </div>
        
        <div className="flex items-center space-x-1">
          <span className="text-xs text-muted-foreground">Opacity</span>
          <Slider
            value={[(shape.opacity || 1) * 100]}
            onValueChange={([value]) => updateProperty('opacity', value / 100)}
            max={100}
            step={1}
            className="w-20"
          />
        </div>
      </div>

      {/* Text Properties */}
      {shape.type === 'text' && (
        <>
          <div className="w-px h-6 bg-border" />
          <div className="flex items-center space-x-2">
            <Type className="w-4 h-4 text-muted-foreground" />
            <Select
              value={shape.fontFamily || 'Inter'}
              onValueChange={(value) => updateProperty('fontFamily', value)}
            >
              <SelectTrigger className="w-24 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Inter">Inter</SelectItem>
                <SelectItem value="Arial">Arial</SelectItem>
                <SelectItem value="Helvetica">Helvetica</SelectItem>
                <SelectItem value="Times">Times</SelectItem>
                <SelectItem value="Georgia">Georgia</SelectItem>
              </SelectContent>
            </Select>
            
            <Input
              type="number"
              value={shape.fontSize || 16}
              onChange={(e) => updateProperty('fontSize', parseInt(e.target.value) || 16)}
              className="w-16 h-8 text-xs"
              placeholder="Size"
            />
            
            <div className="flex items-center space-x-1">
              <Button
                variant={shape.fontWeight === 'bold' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => updateProperty('fontWeight', shape.fontWeight === 'bold' ? 'normal' : 'bold')}
                className="w-8 h-8 p-0"
              >
                <Bold className="w-4 h-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => updateProperty('textAlign', 'left')}
                className={cn("w-8 h-8 p-0", shape.textAlign === 'left' && "bg-primary/20")}
              >
                <AlignLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => updateProperty('textAlign', 'center')}
                className={cn("w-8 h-8 p-0", shape.textAlign === 'center' && "bg-primary/20")}
              >
                <AlignCenter className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => updateProperty('textAlign', 'right')}
                className={cn("w-8 h-8 p-0", shape.textAlign === 'right' && "bg-primary/20")}
              >
                <AlignRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </>
      )}

      <div className="w-px h-6 bg-border" />

      {/* Transform */}
      <div className="flex items-center space-x-2">
        <RotateCw className="w-4 h-4 text-muted-foreground" />
        <Input
          type="number"
          value={Math.round(shape.rotation || 0)}
          onChange={(e) => updateProperty('rotation', parseInt(e.target.value) || 0)}
          className="w-16 h-8 text-xs"
          placeholder="°"
        />
      </div>

      {/* Visibility & Lock */}
      <div className="flex items-center space-x-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => updateProperty('visible', !shape.visible)}
          className="w-8 h-8 p-0"
          title={shape.visible ? 'Hide' : 'Show'}
        >
          {shape.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => updateProperty('locked', !shape.locked)}
          className="w-8 h-8 p-0"
          title={shape.locked ? 'Unlock' : 'Lock'}
        >
          {shape.locked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
        </Button>
      </div>

      {isMultiSelect && (
        <div className="text-xs text-muted-foreground">
          {selectedShapes.length} objects selected
        </div>
      )}
    </motion.div>
  );
};

export default PropertyBar;