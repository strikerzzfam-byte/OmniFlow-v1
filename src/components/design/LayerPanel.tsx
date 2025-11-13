import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Layers, Eye, EyeOff, Lock, Unlock, Copy, Trash2, 
  ChevronDown, ChevronRight, X, GripVertical
} from 'lucide-react';
import { Shape } from '@/hooks/useCanvasTools';
import { cn } from '@/lib/utils';

interface LayerPanelProps {
  shapes: Shape[];
  selectedIds: string[];
  onShapeSelect: (id: string, multi?: boolean) => void;
  onShapeUpdate: (id: string, updates: Partial<Shape>) => void;
  onShapeDelete: (id: string) => void;
  onShapeCopy: (id: string) => void;
  onClose: () => void;
}

const LayerPanel: React.FC<LayerPanelProps> = ({
  shapes,
  selectedIds,
  onShapeSelect,
  onShapeUpdate,
  onShapeDelete,
  onShapeCopy,
  onClose
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  const filteredShapes = shapes
    .filter(shape => 
      !searchTerm || 
      (shape.text && shape.text.toLowerCase().includes(searchTerm.toLowerCase())) ||
      shape.type.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => (b.zIndex || 0) - (a.zIndex || 0));

  const getShapeIcon = (type: string) => {
    const icons = {
      rect: '▭',
      circle: '●',
      text: 'T',
      star: '★',
      line: '—',
      polygon: '⬟',
      arrow: '→',
      group: '📁',
      image: '🖼'
    };
    return icons[type] || '◯';
  };

  const getShapeName = (shape: Shape) => {
    if (shape.text) return shape.text.slice(0, 20) + (shape.text.length > 20 ? '...' : '');
    return `${shape.type.charAt(0).toUpperCase() + shape.type.slice(1)}`;
  };

  const toggleGroup = (groupId: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupId)) {
      newExpanded.delete(groupId);
    } else {
      newExpanded.add(groupId);
    }
    setExpandedGroups(newExpanded);
  };

  return (
    <motion.div
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -300, opacity: 0 }}
      className="w-80 glass border-r border-glass-border/50 flex flex-col h-full"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-glass-border/50">
        <div className="flex items-center space-x-2">
          <Layers className="w-5 h-5 text-[#00B4D8]" />
          <h3 className="font-semibold text-foreground">Layers</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="w-8 h-8 p-0"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-glass-border/50">
        <Input
          placeholder="Search layers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="h-8"
        />
      </div>

      {/* Layer List */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence>
          {filteredShapes.map((shape, index) => {
            const isSelected = selectedIds.includes(shape.id);
            const isGroup = shape.type === 'group';
            const isExpanded = expandedGroups.has(shape.id);

            return (
              <motion.div
                key={shape.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.02 }}
                className={cn(
                  "group relative border-b border-glass-border/30 hover:bg-white/5 transition-colors",
                  isSelected && "bg-[#00B4D8]/10 border-[#00B4D8]/30"
                )}
              >
                <div className="flex items-center p-3 space-x-2">
                  {/* Drag Handle */}
                  <GripVertical className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 cursor-grab" />

                  {/* Group Expand/Collapse */}
                  {isGroup && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleGroup(shape.id)}
                      className="w-4 h-4 p-0"
                    >
                      {isExpanded ? (
                        <ChevronDown className="w-3 h-3" />
                      ) : (
                        <ChevronRight className="w-3 h-3" />
                      )}
                    </Button>
                  )}

                  {/* Shape Icon */}
                  <div className="w-6 h-6 flex items-center justify-center text-sm">
                    {getShapeIcon(shape.type)}
                  </div>

                  {/* Shape Name */}
                  <div
                    className="flex-1 cursor-pointer"
                    onClick={() => onShapeSelect(shape.id)}
                  >
                    <div className="text-sm font-medium text-foreground">
                      {getShapeName(shape)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {Math.round(shape.x)}, {Math.round(shape.y)}
                      {shape.width && shape.height && (
                        <span> • {Math.round(shape.width)}×{Math.round(shape.height)}</span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onShapeUpdate(shape.id, { visible: !shape.visible })}
                      className="w-6 h-6 p-0"
                      title={shape.visible ? 'Hide' : 'Show'}
                    >
                      {shape.visible !== false ? (
                        <Eye className="w-3 h-3" />
                      ) : (
                        <EyeOff className="w-3 h-3 text-muted-foreground" />
                      )}
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onShapeUpdate(shape.id, { locked: !shape.locked })}
                      className="w-6 h-6 p-0"
                      title={shape.locked ? 'Unlock' : 'Lock'}
                    >
                      {shape.locked ? (
                        <Lock className="w-3 h-3" />
                      ) : (
                        <Unlock className="w-3 h-3" />
                      )}
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onShapeCopy(shape.id)}
                      className="w-6 h-6 p-0"
                      title="Duplicate"
                    >
                      <Copy className="w-3 h-3" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onShapeDelete(shape.id)}
                      className="w-6 h-6 p-0 text-red-400 hover:text-red-300"
                      title="Delete"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>

                {/* Group Children */}
                {isGroup && isExpanded && shape.children && (
                  <div className="ml-8 border-l border-glass-border/30">
                    {shape.children.map((childId: string) => {
                      const childShape = shapes.find(s => s.id === childId);
                      if (!childShape) return null;

                      return (
                        <div
                          key={childId}
                          className="flex items-center p-2 space-x-2 hover:bg-white/5"
                        >
                          <div className="w-4 h-4 flex items-center justify-center text-xs">
                            {getShapeIcon(childShape.type)}
                          </div>
                          <div className="flex-1 text-sm text-muted-foreground">
                            {getShapeName(childShape)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filteredShapes.length === 0 && (
          <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
            <Layers className="w-8 h-8 mb-2 opacity-50" />
            <p className="text-sm">No layers found</p>
            {searchTerm && (
              <p className="text-xs mt-1">Try a different search term</p>
            )}
          </div>
        )}
      </div>

      {/* Footer Stats */}
      <div className="p-4 border-t border-glass-border/50 text-xs text-muted-foreground">
        <div className="flex justify-between">
          <span>{shapes.length} objects</span>
          <span>{selectedIds.length} selected</span>
        </div>
      </div>
    </motion.div>
  );
};

export default LayerPanel;