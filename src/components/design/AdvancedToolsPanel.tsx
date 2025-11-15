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
        { id: 'line', icon: Minus, label: 'Line' },
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
              <div
                key={tool.id}
                onClick={() => onToolSelect(tool.id)}
                className={`w-12 h-12 rounded-md flex items-center justify-center transition-all cursor-pointer ${
                  activeTool === tool.id 
                    ? 'bg-[#00B4D8] text-white' 
                    : 'text-[#F8F9FA]/80 hover:bg-[#00B4D8]/20 hover:text-[#00B4D8]'
                }`}
                title={tool.label}
              >
                <tool.icon className="w-5 h-5" />
              </div>
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
                  className="w-12 h-12 hover:bg-primary/10 hover:text-primary text-[#F8F9FA]/80"
                  title="Group Selection"
                >
                  <Group className="w-5 h-5 stroke-current" />
                </Button>
              </motion.div>
            )}

            {selectedCount === 1 && (
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onUngroup}
                  className="w-12 h-12 hover:bg-primary/10 hover:text-primary text-[#F8F9FA]/80"
                  title="Ungroup"
                >
                  <Ungroup className="w-5 h-5 stroke-current" />
                </Button>
              </motion.div>
            )}

            {/* Duplicate */}
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                size="icon"
                onClick={onDuplicate}
                className="w-12 h-12 hover:bg-primary/10 hover:text-primary text-[#F8F9FA]/80"
                title="Duplicate"
              >
                <Copy className="w-5 h-5 stroke-current" />
              </Button>
            </motion.div>

            {/* Delete */}
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                size="icon"
                onClick={onDelete}
                className="w-12 h-12 hover:bg-destructive/20 hover:text-destructive text-[#F8F9FA]/80"
                title="Delete"
              >
                <Trash2 className="w-5 h-5 stroke-current" />
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
                  className="w-10 h-10 hover:bg-secondary/10 hover:text-secondary text-[#F8F9FA]/80"
                  title={tool.label}
                >
                  <tool.icon className="w-4 h-4 stroke-current" />
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
                    className="w-10 h-10 hover:bg-secondary/10 hover:text-secondary text-[#F8F9FA]/80"
                    title="Distribute Horizontally"
                  >
                    <SeparatorHorizontal className="w-4 h-4 stroke-current" />
                  </Button>
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDistribute('vertical')}
                    className="w-10 h-10 hover:bg-secondary/10 hover:text-secondary text-[#F8F9FA]/80"
                    title="Distribute Vertically"
                  >
                    <SeparatorVertical className="w-4 h-4 stroke-current" />
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