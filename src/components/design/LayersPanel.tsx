import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X, Eye, EyeOff, Lock, Unlock, Trash2 } from 'lucide-react';
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

  return (
    <motion.div
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -300, opacity: 0 }}
      className="w-80 h-full glass border-r border-glass-border/50 p-4 overflow-y-auto"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Layers</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-2">
        {shapes.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <p>No layers yet</p>
            <p className="text-sm">Start drawing to create layers</p>
          </div>
        ) : (
          shapes.map((shape, index) => (
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
                    className="w-6 h-6"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLock(shape);
                    }}
                  >
                    {shape.locked ? (
                      <Lock className="w-3 h-3" />
                    ) : (
                      <Unlock className="w-3 h-3" />
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
    </motion.div>
  );
};

export default LayersPanel;