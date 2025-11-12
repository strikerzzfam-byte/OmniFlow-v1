import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { MousePointer, Square, Circle, Type, Trash2, Minus, ArrowRight, Star, Image, Palette, Layers, Settings, Pen } from 'lucide-react';

interface ToolbarProps {
  selectedTool: string;
  onToolSelect: (tool: string) => void;
  onClearCanvas: () => void;
  onToggleProperties?: () => void;
  onToggleLayers?: () => void;
}

const Toolbar = ({ selectedTool, onToolSelect, onClearCanvas, onToggleProperties, onToggleLayers }: ToolbarProps) => {
  const tools = [
    { id: 'select', icon: MousePointer, label: 'Select' },
    { id: 'pen', icon: Pen, label: 'Draw' },
    { id: 'rect', icon: Square, label: 'Rectangle' },
    { id: 'circle', icon: Circle, label: 'Circle' },
    { id: 'text', icon: Type, label: 'Text' },
    { id: 'line', icon: Minus, label: 'Line' },
    { id: 'arrow', icon: ArrowRight, label: 'Arrow' },
    { id: 'star', icon: Star, label: 'Star' },
    { id: 'image', icon: Image, label: 'Image' },
  ];
  
  const panelTools = [
    { id: 'properties', icon: Settings, label: 'Properties', action: onToggleProperties },
    { id: 'layers', icon: Layers, label: 'Layers', action: onToggleLayers },
  ];

  return (
    <div className="w-16 h-full glass border-r border-glass-border/50 flex flex-col items-center py-4 space-y-2">
      {tools.map((tool) => (
        <motion.div
          key={tool.id}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            variant={selectedTool === tool.id ? "default" : "ghost"}
            size="icon"
            onClick={() => onToolSelect(tool.id)}
            className={`w-12 h-12 ${
              selectedTool === tool.id 
                ? 'bg-primary text-primary-foreground glow-primary' 
                : 'hover:bg-muted/50'
            }`}
            title={tool.label}
          >
            <tool.icon className="w-5 h-5" />
          </Button>
        </motion.div>
      ))}
      
      <div className="w-full h-px bg-border my-2" />
      
      {panelTools.map((tool) => (
        <motion.div
          key={tool.id}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={tool.action}
            className="w-12 h-12 hover:bg-muted/50"
            title={tool.label}
          >
            <tool.icon className="w-5 h-5" />
          </Button>
        </motion.div>
      ))}
      
      <div className="flex-1" />
      
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={onClearCanvas}
          className="w-12 h-12 hover:bg-destructive/20 hover:text-destructive"
          title="Clear Canvas"
        >
          <Trash2 className="w-5 h-5" />
        </Button>
      </motion.div>
    </div>
  );
};

export default Toolbar;