import { useState } from 'react';
import { motion, Reorder } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  X, Eye, EyeOff, Lock, Unlock, Trash2, Copy, 
  ChevronDown, ChevronRight, Folder, FolderOpen
} from 'lucide-react';
import { CanvasShape } from '@/hooks/useCanvasTools';

interface LayerGroup {
  id: string;
  name: string;
  expanded: boolean;
  shapes: string[];
}

interface LayerPanelProps {
  shapes: CanvasShape[];
  selectedIds: string[];
  onShapeSelect: (id: string, multi?: boolean) => void;
  onShapeUpdate: (id: string, updates: Partial<CanvasShape>) => void;
  onShapeDelete: (id: string) => void;
  onShapeCopy: (id: string) => void;
  onClose: () => void;
}

const LayerPanel = ({ 
  shapes, 
  selectedIds, 
  onShapeSelect, 
  onShapeUpdate, 
  onShapeDelete, 
  onShapeCopy,
  onClose 
}: LayerPanelProps) => {
  const [groups, setGroups] = useState<LayerGroup[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const getShapeIcon = (type: string) => {
    const icons = {
      rect: '⬜',
      circle: '⭕',
      text: '📝',
      line: '📏',
      arrow: '➡️',
      star: '⭐',
      polygon: '🔷',
      triangle: '🔺',
      image: '🖼️',
      path: '✏️'
    };
    return icons[type as keyof typeof icons] || '❓';
  };

  const filteredShapes = shapes.filter(shape => 
    shape.text?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shape.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedShapes = [...filteredShapes].sort((a, b) => (b.zIndex || 0) - (a.zIndex || 0));

  const toggleGroup = (groupId: string) => {
    setGroups(prev => prev.map(group => 
      group.id === groupId ? { ...group, expanded: !group.expanded } : group
    ));
  };

  const createGroup = () => {
    if (selectedIds.length > 1) {
      const newGroup: LayerGroup = {
        id: `group-${Date.now()}`,
        name: `Group ${groups.length + 1}`,
        expanded: true,
        shapes: selectedIds
      };
      setGroups(prev => [...prev, newGroup]);
    }
  };

  return (
    <motion.div
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -300, opacity: 0 }}
      className="w-80 h-full glass border-r border-glass-border/50 flex flex-col"
    >
      {/* Header */}
      <div className="p-4 border-b border-glass-border/50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Layers</h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
        
        {/* Search */}
        <Input
          placeholder="Search layers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="h-8 mb-3"
        />
        
        {/* Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={createGroup}
            disabled={selectedIds.length < 2}
            className="text-xs"
          >
            Group ({selectedIds.length})
          </Button>
        </div>
      </div>

      {/* Layers List */}
      <div className="flex-1 overflow-y-auto p-2">
        {sortedShapes.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <p>No layers yet</p>
            <p className="text-sm">Start drawing to create layers</p>
          </div>
        ) : (
          <div className="space-y-1">
            {/* Groups */}
            {groups.map((group) => (
              <div key={group.id} className="mb-2">
                <motion.div
                  className="flex items-center gap-2 p-2 rounded-lg bg-muted/30 hover:bg-muted/50 cursor-pointer"
                  onClick={() => toggleGroup(group.id)}
                >
                  {group.expanded ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                  {group.expanded ? (
                    <FolderOpen className="w-4 h-4 text-primary" />
                  ) : (
                    <Folder className="w-4 h-4 text-primary" />
                  )}
                  <span className="font-medium">{group.name}</span>
                  <span className="text-xs text-muted-foreground ml-auto">
                    {group.shapes.length}
                  </span>
                </motion.div>
                
                {group.expanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="ml-6 space-y-1 mt-1"
                  >
                    {group.shapes.map(shapeId => {
                      const shape = shapes.find(s => s.id === shapeId);
                      if (!shape) return null;
                      
                      return (
                        <LayerItem
                          key={shape.id}
                          shape={shape}
                          isSelected={selectedIds.includes(shape.id)}
                          onSelect={onShapeSelect}
                          onUpdate={onShapeUpdate}
                          onDelete={onShapeDelete}
                          onCopy={onShapeCopy}
                          getIcon={getShapeIcon}
                        />
                      );
                    })}
                  </motion.div>
                )}
              </div>
            ))}
            
            {/* Ungrouped Shapes */}
            <Reorder.Group
              axis="y"
              values={sortedShapes}
              onReorder={() => {}} // Handle reordering
              className="space-y-1"
            >
              {sortedShapes
                .filter(shape => !groups.some(group => group.shapes.includes(shape.id)))
                .map((shape) => (
                  <Reorder.Item key={shape.id} value={shape}>
                    <LayerItem
                      shape={shape}
                      isSelected={selectedIds.includes(shape.id)}
                      onSelect={onShapeSelect}
                      onUpdate={onShapeUpdate}
                      onDelete={onShapeDelete}
                      onCopy={onShapeCopy}
                      getIcon={getShapeIcon}
                    />
                  </Reorder.Item>
                ))}
            </Reorder.Group>
          </div>
        )}
      </div>
    </motion.div>
  );
};

interface LayerItemProps {
  shape: CanvasShape;
  isSelected: boolean;
  onSelect: (id: string, multi?: boolean) => void;
  onUpdate: (id: string, updates: Partial<CanvasShape>) => void;
  onDelete: (id: string) => void;
  onCopy: (id: string) => void;
  getIcon: (type: string) => string;
}

const LayerItem = ({ 
  shape, 
  isSelected, 
  onSelect, 
  onUpdate, 
  onDelete, 
  onCopy, 
  getIcon 
}: LayerItemProps) => {
  return (
    <motion.div
      layout
      className={`p-3 rounded-lg border cursor-pointer transition-all group ${
        isSelected
          ? 'bg-primary/20 border-primary shadow-lg shadow-primary/25'
          : 'bg-muted/30 border-border hover:bg-muted/50 hover:border-primary/50'
      }`}
      onClick={(e) => onSelect(shape.id, e.shiftKey)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <span className="text-lg flex-shrink-0">{getIcon(shape.type)}</span>
          <div className="min-w-0 flex-1">
            <p className="font-medium capitalize truncate">
              {shape.type}
              {shape.type === 'text' && shape.text && (
                <span className="text-muted-foreground"> - {shape.text.slice(0, 15)}...</span>
              )}
            </p>
            <p className="text-xs text-muted-foreground">
              {Math.round(shape.x)}, {Math.round(shape.y)}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            className="w-6 h-6"
            onClick={(e) => {
              e.stopPropagation();
              onUpdate(shape.id, { visible: !shape.visible });
            }}
          >
            {shape.visible !== false ? (
              <Eye className="w-3 h-3" />
            ) : (
              <EyeOff className="w-3 h-3 text-muted-foreground" />
            )}
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="w-6 h-6"
            onClick={(e) => {
              e.stopPropagation();
              onUpdate(shape.id, { locked: !shape.locked });
            }}
          >
            {shape.locked ? (
              <Lock className="w-3 h-3 text-muted-foreground" />
            ) : (
              <Unlock className="w-3 h-3" />
            )}
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="w-6 h-6"
            onClick={(e) => {
              e.stopPropagation();
              onCopy(shape.id);
            }}
          >
            <Copy className="w-3 h-3" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="w-6 h-6 hover:bg-destructive/20 hover:text-destructive"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(shape.id);
            }}
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default LayerPanel;