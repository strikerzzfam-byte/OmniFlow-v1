import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Eye, EyeOff, Lock, Unlock, Trash2, Type, Shapes, Palette, Zap } from 'lucide-react';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';

interface Shape {
  id: string;
  type: 'rect' | 'circle' | 'text' | 'line' | 'arrow' | 'star' | 'image';
  x: number;
  y: number;
  width?: number;
  height?: number;
  radius?: number;
  fill: string;
  stroke?: string;
  strokeWidth?: number;
  text?: string;
  fontSize?: number;
  fontFamily?: string;
  rotation?: number;
  scaleX?: number;
  scaleY?: number;
  opacity?: number;
  points?: number[];
  src?: string;
  visible?: boolean;
  locked?: boolean;
}

interface LayersPanelProps {
  onClose: () => void;
  selectedShape: Shape | null;
  onShapeSelect: (shape: Shape | null) => void;
}

const LayersPanel = ({ onClose, selectedShape, onShapeSelect }: LayersPanelProps) => {
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [filter, setFilter] = useState<'all' | 'shapes' | 'text'>('all');
  const [editingText, setEditingText] = useState<string | null>(null);
  const [textValue, setTextValue] = useState('');
  const [fontFamily, setFontFamily] = useState('Inter');
  const [fontSize, setFontSize] = useState(16);
  const [textColor, setTextColor] = useState('#000000');
  const ydocRef = useRef<Y.Doc | null>(null);
  const providerRef = useRef<WebsocketProvider | null>(null);

  useEffect(() => {
    const ydoc = new Y.Doc();
    const provider = new WebsocketProvider('ws://localhost:1234', 'omnidesign-room', ydoc);
    const yShapes = ydoc.getArray('shapes');

    ydocRef.current = ydoc;
    providerRef.current = provider;

    const updateShapes = () => {
      const newShapes = yShapes.toArray() as Shape[];
      setShapes(newShapes);
    };

    yShapes.observe(updateShapes);
    updateShapes();

    return () => {
      yShapes.unobserve(updateShapes);
      provider.destroy();
    };
  }, []);

  const getShapeIcon = (type: string) => {
    switch (type) {
      case 'rect': return '⬜';
      case 'circle': return '⭕';
      case 'text': return '📝';
      case 'line': return '📏';
      case 'arrow': return '➡️';
      case 'star': return '⭐';
      case 'image': return '🖼️';
      default: return '❓';
    }
  };

  const toggleVisibility = (shape: Shape) => {
    if (!ydocRef.current) return;
    
    const yShapes = ydocRef.current.getArray('shapes');
    const shapeIndex = shapes.findIndex(s => s.id === shape.id);
    
    if (shapeIndex >= 0) {
      const updatedShape = { ...shape, visible: !shape.visible };
      yShapes.delete(shapeIndex, 1);
      yShapes.insert(shapeIndex, [updatedShape]);
    }
  };

  const toggleLock = (shape: Shape) => {
    if (!ydocRef.current) return;
    
    const yShapes = ydocRef.current.getArray('shapes');
    const shapeIndex = shapes.findIndex(s => s.id === shape.id);
    
    if (shapeIndex >= 0) {
      const updatedShape = { ...shape, locked: !shape.locked };
      yShapes.delete(shapeIndex, 1);
      yShapes.insert(shapeIndex, [updatedShape]);
    }
  };

  const deleteShape = (shape: Shape) => {
    if (!ydocRef.current) return;
    
    const yShapes = ydocRef.current.getArray('shapes');
    const shapeIndex = shapes.findIndex(s => s.id === shape.id);
    
    if (shapeIndex >= 0) {
      yShapes.delete(shapeIndex, 1);
      if (selectedShape?.id === shape.id) {
        onShapeSelect(null);
      }
    }
  };

  const updateTextShape = (shapeId: string, updates: Partial<Shape>) => {
    if (!ydocRef.current) return;
    
    const yShapes = ydocRef.current.getArray('shapes');
    const shapeIndex = shapes.findIndex(s => s.id === shapeId);
    
    if (shapeIndex >= 0) {
      const updatedShape = { ...shapes[shapeIndex], ...updates };
      yShapes.delete(shapeIndex, 1);
      yShapes.insert(shapeIndex, [updatedShape]);
    }
  };

  const handleTextEdit = (shape: Shape) => {
    setEditingText(shape.id);
    setTextValue(shape.text || '');
    setFontFamily(shape.fontFamily || 'Inter');
    setFontSize(shape.fontSize || 16);
    setTextColor(shape.fill || '#000000');
  };

  const saveTextEdit = () => {
    if (editingText) {
      updateTextShape(editingText, {
        text: textValue,
        fontFamily,
        fontSize,
        fill: textColor
      });
      setEditingText(null);
    }
  };

  const filteredShapes = shapes.filter(shape => {
    if (filter === 'text') return shape.type === 'text';
    if (filter === 'shapes') return shape.type !== 'text';
    return true;
  });

  return (
    <motion.div
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -300, opacity: 0 }}
      className="w-80 h-full glass border-r border-glass-border/50 p-4 overflow-y-auto"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Layers</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-1 mb-4">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('all')}
          className="flex-1"
        >
          All ({shapes.length})
        </Button>
        <Button
          variant={filter === 'shapes' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('shapes')}
          className="flex-1"
        >
          <Shapes className="w-4 h-4 mr-1" />
          {shapes.filter(s => s.type !== 'text').length}
        </Button>
        <Button
          variant={filter === 'text' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('text')}
          className="flex-1"
        >
          <Type className="w-4 h-4 mr-1" />
          {shapes.filter(s => s.type === 'text').length}
        </Button>
      </div>

      <div className="space-y-2">
        {filteredShapes.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <p>No {filter === 'all' ? 'layers' : filter} yet</p>
            <p className="text-sm">Start drawing to create layers</p>
          </div>
        ) : (
          filteredShapes.map((shape, index) => (
            <motion.div
              key={shape.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`p-3 rounded-lg border cursor-pointer transition-all ${
                selectedShape?.id === shape.id
                  ? 'bg-primary/20 border-primary'
                  : 'bg-muted/50 border-border hover:bg-muted/70'
              }`}
              onClick={() => onShapeSelect(shape)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-lg">{getShapeIcon(shape.type)}</span>
                  <div>
                    <p className="font-medium capitalize">
                      {shape.type} {shape.type === 'text' && shape.text ? `- ${shape.text.slice(0, 15)}...` : ''}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {Math.round(shape.x)}, {Math.round(shape.y)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-1">
                  {shape.type === 'text' && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-6 h-6"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTextEdit(shape);
                      }}
                    >
                      <Type className="w-3 h-3" />
                    </Button>
                  )}
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-6 h-6"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleVisibility(shape);
                    }}
                  >
                    {shape.visible !== false ? (
                      <Eye className="w-3 h-3" />
                    ) : (
                      <EyeOff className="w-3 h-3" />
                    )}
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-6 h-6 hover:bg-destructive/20 hover:text-destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteShape(shape);
                    }}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Text Editing Modal */}
      {editingText && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-background border rounded-lg p-6 w-96 max-w-[90vw]">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Type className="w-5 h-5" />
              Edit Text
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Text</label>
                <Input
                  value={textValue}
                  onChange={(e) => setTextValue(e.target.value)}
                  placeholder="Enter text..."
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium mb-2 block">Font</label>
                  <Select value={fontFamily} onValueChange={setFontFamily}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Inter">Inter</SelectItem>
                      <SelectItem value="Arial">Arial</SelectItem>
                      <SelectItem value="Helvetica">Helvetica</SelectItem>
                      <SelectItem value="Times New Roman">Times</SelectItem>
                      <SelectItem value="Georgia">Georgia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Size</label>
                  <Input
                    type="number"
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    min="8"
                    max="72"
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                  <Palette className="w-4 h-4" />
                  Color
                </label>
                <Input
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setEditingText(null)}>
                Cancel
              </Button>
              <Button onClick={saveTextEdit}>
                Save
              </Button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default LayersPanel;