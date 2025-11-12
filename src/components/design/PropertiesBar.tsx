import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { 
  Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight,
  Copy, Trash2, Lock, Unlock, Eye, EyeOff
} from 'lucide-react';
import { CanvasShape } from '@/hooks/useCanvasTools';
import SimpleColorPicker from './SimpleColorPicker';

interface PropertiesBarProps {
  selectedShapes: CanvasShape[];
  onShapeUpdate: (id: string, updates: Partial<CanvasShape>) => void;
  onCopy: () => void;
  onDelete: () => void;
}

const PropertiesBar = ({ selectedShapes, onShapeUpdate, onCopy, onDelete }: PropertiesBarProps) => {
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

  const updateProperty = (key: keyof CanvasShape, value: any) => {
    selectedShapes.forEach(s => onShapeUpdate(s.id, { [key]: value }));
  };

  return (
    <motion.div
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="h-16 glass border-b border-glass-border/50 flex items-center justify-between px-6 overflow-x-auto"
    >
      <div className="flex items-center space-x-4">
        {/* Position & Size */}
        <div className="flex items-center space-x-2">
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
        </div>

        <div className="w-px h-8 bg-border" />

        {/* Text Properties */}
        {shape.type === 'text' && (
          <div className="flex items-center space-x-2">
            <Select value={shape.fontFamily || 'Inter'} onValueChange={(value) => updateProperty('fontFamily', value)}>
              <SelectTrigger className="w-32 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Inter">Inter</SelectItem>
                <SelectItem value="Satoshi">Satoshi</SelectItem>
                <SelectItem value="Arial">Arial</SelectItem>
                <SelectItem value="Helvetica">Helvetica</SelectItem>
              </SelectContent>
            </Select>
            
            <Input
              type="number"
              value={shape.fontSize || 16}
              onChange={(e) => updateProperty('fontSize', Number(e.target.value))}
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
            </div>
          </div>
        )}

        <div className="w-px h-8 bg-border" />

        {/* Colors */}
        <div className="flex items-center space-x-2">
          <SimpleColorPicker
            color={shape.fill}
            onChange={(color) => updateProperty('fill', color)}
            label="Fill"
          />
          
          {shape.type !== 'text' && (
            <SimpleColorPicker
              color={shape.stroke || '#000000'}
              onChange={(color) => updateProperty('stroke', color)}
              label="Stroke"
            />
          )}
        </div>

        <div className="w-px h-8 bg-border" />

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
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onCopy}
          className="w-8 h-8 p-0"
          title="Copy"
        >
          <Copy className="w-4 h-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onDelete}
          className="w-8 h-8 p-0 hover:bg-destructive/20 hover:text-destructive"
          title="Delete"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
};

export default PropertiesBar;