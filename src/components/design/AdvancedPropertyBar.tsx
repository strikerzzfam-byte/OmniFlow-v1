import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { 
  Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight,
  Palette, RotateCcw, Move3D, Maximize, Eye, EyeOff, Lock, Unlock
} from 'lucide-react';
import { AdvancedShape } from '@/hooks/useAdvancedCanvasTools';

interface AdvancedPropertyBarProps {
  selectedShapes: AdvancedShape[];
  onShapeUpdate: (id: string, updates: Partial<AdvancedShape>) => void;
}

const AdvancedPropertyBar = ({ selectedShapes, onShapeUpdate }: AdvancedPropertyBarProps) => {
  const shape = selectedShapes[0];
  const multiSelect = selectedShapes.length > 1;

  if (!shape) {
    return (
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="h-16 glass border-b border-glass-border/50 flex items-center justify-center px-6"
      >
        <span className="text-muted-foreground">Select an object to edit properties</span>
      </motion.div>
    );
  }

  const updateProperty = (key: keyof AdvancedShape, value: any) => {
    selectedShapes.forEach(s => onShapeUpdate(s.id, { [key]: value }));
  };

  const fontFamilies = ['Inter', 'Satoshi', 'Arial', 'Helvetica', 'Georgia', 'Times New Roman', 'Courier New'];
  const fontWeights = ['300', '400', '500', '600', '700', '800'];

  return (
    <motion.div
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="h-16 glass border-b border-glass-border/50 flex items-center justify-between px-6 overflow-x-auto"
    >
      <div className="flex items-center space-x-4">
        {/* Position & Size */}
        <div className="flex items-center space-x-2">
          <Move3D className="w-4 h-4 text-muted-foreground" />
          <div className="flex items-center space-x-1">
            <span className="text-xs text-muted-foreground w-4">X</span>
            <Input
              type="number"
              value={Math.round(shape.x)}
              onChange={(e) => updateProperty('x', Number(e.target.value))}
              className="w-16 h-8 text-xs"
            />
          </div>
          <div className="flex items-center space-x-1">
            <span className="text-xs text-muted-foreground w-4">Y</span>
            <Input
              type="number"
              value={Math.round(shape.y)}
              onChange={(e) => updateProperty('y', Number(e.target.value))}
              className="w-16 h-8 text-xs"
            />
          </div>
          
          {(shape.type === 'rect' || shape.type === 'image') && (
            <>
              <Separator orientation="vertical" className="h-6" />
              <Maximize className="w-4 h-4 text-muted-foreground" />
              <div className="flex items-center space-x-1">
                <span className="text-xs text-muted-foreground w-4">W</span>
                <Input
                  type="number"
                  value={shape.width || 0}
                  onChange={(e) => updateProperty('width', Number(e.target.value))}
                  className="w-16 h-8 text-xs"
                />
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-xs text-muted-foreground w-4">H</span>
                <Input
                  type="number"
                  value={shape.height || 0}
                  onChange={(e) => updateProperty('height', Number(e.target.value))}
                  className="w-16 h-8 text-xs"
                />
              </div>
            </>
          )}

          {(shape.type === 'circle' || shape.type === 'star' || shape.type === 'polygon') && (
            <>
              <Separator orientation="vertical" className="h-6" />
              <div className="flex items-center space-x-1">
                <span className="text-xs text-muted-foreground">R</span>
                <Input
                  type="number"
                  value={shape.radius || 0}
                  onChange={(e) => updateProperty('radius', Number(e.target.value))}
                  className="w-16 h-8 text-xs"
                />
              </div>
            </>
          )}
        </div>

        <Separator orientation="vertical" className="h-8" />

        {/* Text Properties */}
        {shape.type === 'text' && (
          <div className="flex items-center space-x-2">
            <Select value={shape.fontFamily || 'Inter'} onValueChange={(value) => updateProperty('fontFamily', value)}>
              <SelectTrigger className="w-32 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {fontFamilies.map((font) => (
                  <SelectItem key={font} value={font}>{font}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Input
              type="number"
              value={shape.fontSize || 16}
              onChange={(e) => updateProperty('fontSize', Number(e.target.value))}
              className="w-16 h-8 text-xs"
              placeholder="Size"
            />
            
            <Select value={shape.fontWeight || '400'} onValueChange={(value) => updateProperty('fontWeight', value)}>
              <SelectTrigger className="w-20 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {fontWeights.map((weight) => (
                  <SelectItem key={weight} value={weight}>
                    {weight === '300' ? 'Light' : weight === '400' ? 'Regular' : weight === '500' ? 'Medium' : 
                     weight === '600' ? 'Semibold' : weight === '700' ? 'Bold' : 'Black'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex items-center space-x-1">
              <Button
                variant={shape.textAlign === 'left' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => updateProperty('textAlign', 'left')}
                className="w-8 h-8 p-0"
              >
                <AlignLeft className="w-4 h-4" />
              </Button>
              <Button
                variant={shape.textAlign === 'center' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => updateProperty('textAlign', 'center')}
                className="w-8 h-8 p-0"
              >
                <AlignCenter className="w-4 h-4" />
              </Button>
              <Button
                variant={shape.textAlign === 'right' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => updateProperty('textAlign', 'right')}
                className="w-8 h-8 p-0"
              >
                <AlignRight className="w-4 h-4" />
              </Button>
            </div>

            <Separator orientation="vertical" className="h-6" />

            <div className="flex items-center space-x-1">
              <span className="text-xs text-muted-foreground">Line</span>
              <Input
                type="number"
                value={shape.lineHeight || 1.2}
                onChange={(e) => updateProperty('lineHeight', Number(e.target.value))}
                className="w-16 h-8 text-xs"
                step="0.1"
                min="0.5"
                max="3"
              />
            </div>

            <div className="flex items-center space-x-1">
              <span className="text-xs text-muted-foreground">Spacing</span>
              <Input
                type="number"
                value={shape.letterSpacing || 0}
                onChange={(e) => updateProperty('letterSpacing', Number(e.target.value))}
                className="w-16 h-8 text-xs"
                step="0.1"
              />
            </div>
          </div>
        )}

        <Separator orientation="vertical" className="h-8" />

        {/* Colors */}
        <div className="flex items-center space-x-2">
          <Palette className="w-4 h-4 text-muted-foreground" />
          <div className="flex items-center space-x-1">
            <span className="text-xs text-muted-foreground">Fill</span>
            <Input
              type="color"
              value={shape.fill}
              onChange={(e) => updateProperty('fill', e.target.value)}
              className="w-12 h-8 p-0 border-0"
            />
          </div>
          
          {shape.type !== 'text' && (
            <>
              <div className="flex items-center space-x-1">
                <span className="text-xs text-muted-foreground">Stroke</span>
                <Input
                  type="color"
                  value={shape.stroke || '#000000'}
                  onChange={(e) => updateProperty('stroke', e.target.value)}
                  className="w-12 h-8 p-0 border-0"
                />
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-xs text-muted-foreground">Width</span>
                <Input
                  type="number"
                  value={shape.strokeWidth || 0}
                  onChange={(e) => updateProperty('strokeWidth', Number(e.target.value))}
                  className="w-16 h-8 text-xs"
                  min="0"
                  max="20"
                />
              </div>
            </>
          )}
        </div>

        <Separator orientation="vertical" className="h-8" />

        {/* Transform */}
        <div className="flex items-center space-x-2">
          <RotateCcw className="w-4 h-4 text-muted-foreground" />
          <div className="flex items-center space-x-1">
            <span className="text-xs text-muted-foreground">Rotation</span>
            <Input
              type="number"
              value={Math.round(shape.rotation || 0)}
              onChange={(e) => updateProperty('rotation', Number(e.target.value))}
              className="w-16 h-8 text-xs"
              min="-180"
              max="180"
            />
            <span className="text-xs text-muted-foreground">°</span>
          </div>
        </div>

        <Separator orientation="vertical" className="h-8" />

        {/* Opacity */}
        <div className="flex items-center space-x-2">
          <span className="text-xs text-muted-foreground">Opacity</span>
          <div className="w-20">
            <Slider
              value={[shape.opacity || 1]}
              onValueChange={([value]) => updateProperty('opacity', value)}
              min={0}
              max={1}
              step={0.1}
              className="h-2"
            />
          </div>
          <span className="text-xs text-muted-foreground w-8">
            {Math.round((shape.opacity || 1) * 100)}%
          </span>
        </div>

        {/* Border Radius for rectangles */}
        {shape.type === 'rect' && (
          <>
            <Separator orientation="vertical" className="h-8" />
            <div className="flex items-center space-x-2">
              <span className="text-xs text-muted-foreground">Radius</span>
              <Input
                type="number"
                value={shape.borderRadius || 0}
                onChange={(e) => updateProperty('borderRadius', Number(e.target.value))}
                className="w-16 h-8 text-xs"
                min="0"
                max="50"
              />
            </div>
          </>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => updateProperty('visible', !shape.visible)}
          className="w-8 h-8 p-0"
          title={shape.visible ? 'Hide' : 'Show'}
        >
          {shape.visible !== false ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
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
    </motion.div>
  );
};

export default AdvancedPropertyBar;