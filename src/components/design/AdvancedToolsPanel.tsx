import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  MousePointer, Square, Circle, Hexagon, Star, ArrowRight, 
  Minus, Pen, Type, Image, Upload, Group, Ungroup,
  AlignLeft, AlignCenter, AlignRight, AlignVerticalJustifyStart, AlignVerticalJustifyCenter, AlignVerticalJustifyEnd,
  SeparatorHorizontal, SeparatorVertical, Copy, Trash2
} from 'lucide-react';

interface AdvancedToolsPanelProps {
  activeTool: string;
  onToolSelect: (tool: string) => void;
  selectedCount: number;
  onGroup: () => void;
  onUngroup: () => void;
  onAlign: (alignment: string) => void;
  onDistribute: (direction: string) => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

const AdvancedToolsPanel = ({ 
  activeTool, 
  onToolSelect, 
  selectedCount,
  onGroup,
  onUngroup,
  onAlign,
  onDistribute,
  onDuplicate,
  onDelete
}: AdvancedToolsPanelProps) => {
  const toolGroups = [
    {
      name: 'Selection',
      tools: [
        { id: 'select', icon: MousePointer, label: 'Select & Move' },
      ]
    },
    {
      name: 'Drawing',
      tools: [
        { id: 'pen', icon: Pen, label: 'Pen Tool' },
        { id: 'line', icon: Minus, label: 'Line' },
        { id: 'path', icon: Pen, label: 'Bezier Path' },
      ]
    },
    {
      name: 'Shapes',
      tools: [
        { id: 'rect', icon: Square, label: 'Rectangle' },
        { id: 'circle', icon: Circle, label: 'Circle' },
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

  const alignmentTools = [
    { id: 'left', icon: AlignLeft, label: 'Align Left' },
    { id: 'center', icon: AlignCenter, label: 'Align Center' },
    { id: 'right', icon: AlignRight, label: 'Align Right' },
    { id: 'top', icon: AlignVerticalJustifyStart, label: 'Align Top' },
    { id: 'middle', icon: AlignVerticalJustifyCenter, label: 'Align Middle' },
    { id: 'bottom', icon: AlignVerticalJustifyEnd, label: 'Align Bottom' },
  ];

  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-20 h-full glass border-r border-glass-border/50 flex flex-col py-4"
    >
      <div className="flex flex-col space-y-6">
        {/* Main Tools */}
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
                  className={`w-12 h-12 relative group ${
                    activeTool === tool.id 
                      ? 'bg-primary/20 text-primary border border-primary/50 shadow-lg shadow-primary/25' 
                      : 'hover:bg-primary/10 hover:text-primary'
                  }`}
                  title={tool.label}
                >
                  <tool.icon className="w-5 h-5" />
                  
                  {activeTool === tool.id && (
                    <motion.div
                      className="absolute inset-0 rounded-md bg-primary/20 blur-sm"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                  
                  <div className="absolute left-full ml-2 px-2 py-1 bg-background/90 backdrop-blur-sm border border-border rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                    {tool.label}
                  </div>
                </Button>
              </motion.div>
            ))}
          </div>
        ))}

        <Separator className="w-8 mx-auto" />

        {/* Selection Actions */}
        {selectedCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center space-y-2"
          >
            {/* Group/Ungroup */}
            {selectedCount > 1 && (
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onGroup}
                  className="w-12 h-12 hover:bg-primary/10 hover:text-primary"
                  title="Group Selection"
                >
                  <Group className="w-5 h-5" />
                </Button>
              </motion.div>
            )}

            {selectedCount === 1 && (
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onUngroup}
                  className="w-12 h-12 hover:bg-primary/10 hover:text-primary"
                  title="Ungroup"
                >
                  <Ungroup className="w-5 h-5" />
                </Button>
              </motion.div>
            )}

            {/* Duplicate */}
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                size="icon"
                onClick={onDuplicate}
                className="w-12 h-12 hover:bg-primary/10 hover:text-primary"
                title="Duplicate"
              >
                <Copy className="w-5 h-5" />
              </Button>
            </motion.div>

            {/* Delete */}
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                size="icon"
                onClick={onDelete}
                className="w-12 h-12 hover:bg-destructive/20 hover:text-destructive"
                title="Delete"
              >
                <Trash2 className="w-5 h-5" />
              </Button>
            </motion.div>
          </motion.div>
        )}

        {/* Alignment Tools */}
        {selectedCount > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center space-y-1"
          >
            <div className="w-8 h-px bg-gradient-to-r from-transparent via-secondary/30 to-transparent mb-2" />
            
            {alignmentTools.map((tool) => (
              <motion.div
                key={tool.id}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onAlign(tool.id)}
                  className="w-10 h-10 hover:bg-secondary/10 hover:text-secondary"
                  title={tool.label}
                >
                  <tool.icon className="w-4 h-4" />
                </Button>
              </motion.div>
            ))}

            {/* Distribute */}
            {selectedCount > 2 && (
              <>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDistribute('horizontal')}
                    className="w-10 h-10 hover:bg-secondary/10 hover:text-secondary"
                    title="Distribute Horizontally"
                  >
                    <SeparatorHorizontal className="w-4 h-4" />
                  </Button>
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDistribute('vertical')}
                    className="w-10 h-10 hover:bg-secondary/10 hover:text-secondary"
                    title="Distribute Vertically"
                  >
                    <SeparatorVertical className="w-4 h-4" />
                  </Button>
                </motion.div>
              </>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default AdvancedToolsPanel;