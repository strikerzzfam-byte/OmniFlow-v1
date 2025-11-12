import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  MousePointer, Square, Circle, Type, Minus, ArrowRight, 
  Triangle, Pen, Image, Star, Hexagon, Upload
} from 'lucide-react';

interface ToolsPanelProps {
  activeTool: string;
  onToolSelect: (tool: string) => void;
}

const ToolsPanel = ({ activeTool, onToolSelect }: ToolsPanelProps) => {
  const toolGroups = [
    {
      name: 'Selection',
      tools: [
        { id: 'select', icon: MousePointer, label: 'Select' },
      ]
    },
    {
      name: 'Drawing',
      tools: [
        { id: 'pen', icon: Pen, label: 'Pen' },
        { id: 'line', icon: Minus, label: 'Line' },
      ]
    },
    {
      name: 'Shapes',
      tools: [
        { id: 'rect', icon: Square, label: 'Rectangle' },
        { id: 'circle', icon: Circle, label: 'Circle' },
        { id: 'triangle', icon: Triangle, label: 'Triangle' },
        { id: 'polygon', icon: Hexagon, label: 'Polygon' },
        { id: 'star', icon: Star, label: 'Star' },
        { id: 'arrow', icon: ArrowRight, label: 'Arrow' },
      ]
    },
    {
      name: 'Content',
      tools: [
        { id: 'text', icon: Type, label: 'Text' },
        { id: 'image', icon: Image, label: 'Image' },
        { id: 'upload', icon: Upload, label: 'Upload' },
      ]
    }
  ];

  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-20 h-full glass border-r border-glass-border/50 flex flex-col py-4"
    >
      <div className="flex flex-col space-y-6">
        {toolGroups.map((group, groupIndex) => (
          <div key={group.name} className="flex flex-col items-center space-y-2">
            {groupIndex > 0 && (
              <div className="w-8 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
            )}
            
            {group.tools.map((tool) => (
              <motion.div
                key={tool.id}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant={activeTool === tool.id ? "default" : "ghost"}
                  size="icon"
                  onClick={() => onToolSelect(tool.id)}
                  className={`w-12 h-12 relative group cursor-pointer ${
                    activeTool === tool.id 
                      ? 'bg-primary/20 text-primary border border-primary/50 shadow-lg shadow-primary/25' 
                      : 'hover:bg-primary/10 hover:text-primary'
                  }`}
                  title={tool.label}
                >
                  <tool.icon className="w-5 h-5" />
                  
                  {/* Neon glow effect for active tool */}
                  {activeTool === tool.id && (
                    <motion.div
                      className="absolute inset-0 rounded-md bg-primary/20 blur-sm"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                  
                  {/* Hover tooltip */}
                  <div className="absolute left-full ml-2 px-2 py-1 bg-background/90 backdrop-blur-sm border border-border rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                    {tool.label}
                  </div>
                </Button>
              </motion.div>
            ))}
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default ToolsPanel;