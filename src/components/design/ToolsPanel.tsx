import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  MousePointer2, Square, Circle, Pentagon, Star, ArrowRight, 
  Minus, Type, Image, Paintbrush, Group, Ungroup, AlignLeft,
  AlignCenter, AlignRight, Copy, Trash2, RotateCw
} from 'lucide-react';
import { Tool } from '@/hooks/useCanvasTools';
import { cn } from '@/lib/utils';

interface ToolsPanelProps {
  activeTool: Tool;
  onToolSelect: (tool: Tool) => void;
  selectedCount: number;
  onGroup: () => void;
  onUngroup: () => void;
  onAlign: (type: string) => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

const ToolsPanel: React.FC<ToolsPanelProps> = ({
  activeTool,
  onToolSelect,
  selectedCount,
  onGroup,
  onUngroup,
  onAlign,
  onDuplicate,
  onDelete
}) => {
  const tools = [
    { id: 'select', icon: MousePointer2, label: 'Select', shortcut: 'V' },
    { id: 'rect', icon: Square, label: 'Rectangle', shortcut: 'R' },
    { id: 'circle', icon: Circle, label: 'Circle', shortcut: 'O' },
    { id: 'polygon', icon: Pentagon, label: 'Polygon', shortcut: 'P' },
    { id: 'star', icon: Star, label: 'Star', shortcut: 'S' },
    { id: 'arrow', icon: ArrowRight, label: 'Arrow', shortcut: 'A' },
    { id: 'line', icon: Minus, label: 'Line', shortcut: 'L' },
    { id: 'text', icon: Type, label: 'Text', shortcut: 'T' },
    { id: 'image', icon: Image, label: 'Image', shortcut: 'I' },
    { id: 'pen', icon: Paintbrush, label: 'Pen', shortcut: 'B' }
  ];

  const actions = [
    { icon: Copy, label: 'Duplicate', action: onDuplicate, disabled: selectedCount === 0 },
    { icon: Group, label: 'Group', action: onGroup, disabled: selectedCount < 2 },
    { icon: Ungroup, label: 'Ungroup', action: onUngroup, disabled: selectedCount === 0 },
    { icon: AlignLeft, label: 'Align Left', action: () => onAlign('left'), disabled: selectedCount < 2 },
    { icon: AlignCenter, label: 'Align Center', action: () => onAlign('center'), disabled: selectedCount < 2 },
    { icon: AlignRight, label: 'Align Right', action: () => onAlign('right'), disabled: selectedCount < 2 },
    { icon: Trash2, label: 'Delete', action: onDelete, disabled: selectedCount === 0 }
  ];

  return (
    <motion.div
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-16 glass border-r border-glass-border/50 flex flex-col items-center py-4 space-y-2"
    >
      {/* Drawing Tools */}
      <div className="space-y-1">
        {tools.map((tool) => {
          const Icon = tool.icon;
          const isActive = activeTool === tool.id;
          
          return (
            <Button
              key={tool.id}
              variant={isActive ? "default" : "ghost"}
              size="sm"
              onClick={() => onToolSelect(tool.id as Tool)}
              className={cn(
                "w-12 h-12 p-0 relative group",
                isActive && "bg-gradient-to-r from-[#00B4D8]/20 to-[#9D4EDD]/20 border-[#00B4D8]/30"
              )}
              title={`${tool.label} (${tool.shortcut})`}
            >
              <Icon className={cn(
                "w-5 h-5",
                isActive ? "text-[#00B4D8]" : "text-muted-foreground"
              )} />
              
              {/* Tooltip */}
              <div className="absolute left-full ml-2 px-2 py-1 bg-black/80 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                {tool.label} ({tool.shortcut})
              </div>
            </Button>
          );
        })}
      </div>

      <div className="w-8 h-px bg-border my-2" />

      {/* Action Tools */}
      <div className="space-y-1">
        {actions.map((action, index) => {
          const Icon = action.icon;
          
          return (
            <Button
              key={index}
              variant="ghost"
              size="sm"
              onClick={action.action}
              disabled={action.disabled}
              className={cn(
                "w-12 h-12 p-0 relative group",
                action.disabled && "opacity-30 cursor-not-allowed"
              )}
              title={action.label}
            >
              <Icon className="w-4 h-4 text-muted-foreground" />
              
              {/* Tooltip */}
              <div className="absolute left-full ml-2 px-2 py-1 bg-black/80 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                {action.label}
              </div>
            </Button>
          );
        })}
      </div>

      {/* AI Assistant Trigger */}
      <div className="mt-auto">
        <Button
          variant="outline"
          size="sm"
          className="w-12 h-12 p-0 bg-gradient-to-r from-[#00B4D8]/10 to-[#9D4EDD]/10 border-gradient-to-r border-[#00B4D8]/30 hover:from-[#00B4D8]/20 hover:to-[#9D4EDD]/20"
          title="AI Assistant"
        >
          <div className="w-5 h-5 rounded-full bg-gradient-to-r from-[#00B4D8] to-[#9D4EDD] flex items-center justify-center">
            <span className="text-xs font-bold text-white">AI</span>
          </div>
        </Button>
      </div>
    </motion.div>
  );
};

export default ToolsPanel;