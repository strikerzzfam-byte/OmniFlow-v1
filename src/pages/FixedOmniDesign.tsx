import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Stage, Layer, Rect, Circle, Text, Line, Star, RegularPolygon, Transformer } from 'react-konva';
import { KonvaEventObject } from 'konva/lib/Node';
import Konva from 'konva';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { 
  MousePointer, Square, Circle as CircleIcon, Type, Minus, ArrowRight, 
  Triangle, Pen, Star as StarIcon, Hexagon, Undo, Redo, Download, 
  Grid3X3, Ruler, Layers, Sparkles, Users, Wifi, Copy, ClipboardPaste,
  Eye, EyeOff, Lock, Unlock, Trash2, X
} from 'lucide-react';

interface Shape {
  id: string;
  type: 'rect' | 'circle' | 'text' | 'line' | 'star' | 'polygon' | 'triangle';
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
  points?: number[];
  rotation?: number;
  scaleX?: number;
  scaleY?: number;
  opacity?: number;
  visible?: boolean;
  locked?: boolean;
}

const FixedOmniDesign = () => {
  const { toast } = useToast();
  const stageRef = useRef<Konva.Stage>(null);
  const transformerRef = useRef<Konva.Transformer>(null);
  const ydocRef = useRef<Y.Doc | null>(null);
  const providerRef = useRef<WebsocketProvider | null>(null);

  // State
  const [activeTool, setActiveTool] = useState('select');
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [clipboard, setClipboard] = useState<Shape[]>([]);
  const [zoom, setZoom] = useState(1);
  const [grid, setGrid] = useState(false);
  const [rulers, setRulers] = useState(false);
  const [showLayersPanel, setShowLayersPanel] = useState(true);
  const [showEffectsPanel, setShowEffectsPanel] = useState(false);
  const [showExportPanel, setShowExportPanel] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  // Initialize collaboration
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

    provider.on('status', (event: any) => {
      setIsConnected(event.status === 'connected');
    });

    return () => {
      yShapes.unobserve(updateShapes);
      provider.destroy();
    };
  }, []);

  // Add shape function
  const addShape = useCallback((x: number, y: number) => {
    if (!ydocRef.current) return;

    const id = `shape-${Date.now()}-${Math.random()}`;
    let newShape: Shape;

    switch (activeTool) {
      case 'rect':
        newShape = { id, type: 'rect', x, y, width: 100, height: 80, fill: '#00B4D8', stroke: '#0077B6', strokeWidth: 2, visible: true, locked: false };
        break;
      case 'circle':
        newShape = { id, type: 'circle', x, y, radius: 50, fill: '#9D4EDD', stroke: '#7209B7', strokeWidth: 2, visible: true, locked: false };
        break;
      case 'text':
        newShape = { id, type: 'text', x, y, text: 'Text', fill: '#F8F9FA', fontSize: 16, visible: true, locked: false };
        break;
      case 'star':
        newShape = { id, type: 'star', x, y, radius: 40, fill: '#FCBF49', stroke: '#F77F00', strokeWidth: 2, visible: true, locked: false };
        break;
      case 'polygon':
        newShape = { id, type: 'polygon', x, y, radius: 50, fill: '#F77F00', stroke: '#D62828', strokeWidth: 2, visible: true, locked: false };
        break;
      case 'triangle':
        newShape = { id, type: 'triangle', x, y, radius: 50, fill: '#06FFA5', stroke: '#04E762', strokeWidth: 2, visible: true, locked: false };
        break;
      case 'line':
        newShape = { id, type: 'line', x, y, points: [0, 0, 100, 0], stroke: '#F77F00', strokeWidth: 3, fill: 'transparent', visible: true, locked: false };
        break;
      default:
        return;
    }

    const yShapes = ydocRef.current.getArray('shapes');
    yShapes.push([newShape]);
    
    toast({
      title: "Shape added",
      description: `${newShape.type} created`,
    });
  }, [activeTool, toast]);

  // Update shape function
  const updateShape = useCallback((id: string, updates: Partial<Shape>) => {
    if (!ydocRef.current) return;

    const yShapes = ydocRef.current.getArray('shapes');
    const shapeIndex = shapes.findIndex(s => s.id === id);
    
    if (shapeIndex >= 0) {
      const updatedShape = { ...shapes[shapeIndex], ...updates };
      yShapes.delete(shapeIndex, 1);
      yShapes.insert(shapeIndex, [updatedShape]);
    }
  }, [shapes]);

  // Delete shape function
  const deleteShape = useCallback((id: string) => {
    if (!ydocRef.current) return;

    const yShapes = ydocRef.current.getArray('shapes');
    const shapeIndex = shapes.findIndex(s => s.id === id);
    
    if (shapeIndex >= 0) {
      yShapes.delete(shapeIndex, 1);
      setSelectedIds(prev => prev.filter(sid => sid !== id));
      toast({
        title: "Shape deleted",
        description: "Shape removed from canvas",
      });
    }
  }, [shapes, toast]);

  // Copy/Paste functions
  const copyShapes = useCallback(() => {
    const selectedShapes = shapes.filter(s => selectedIds.includes(s.id));
    setClipboard(selectedShapes);
    toast({
      title: "Copied",
      description: `${selectedShapes.length} shape(s) copied`,
    });
  }, [shapes, selectedIds, toast]);

  const pasteShapes = useCallback(() => {
    if (clipboard.length === 0) return;

    clipboard.forEach(shape => {
      const newShape = {
        ...shape,
        id: `shape-${Date.now()}-${Math.random()}`,
        x: shape.x + 20,
        y: shape.y + 20,
      };
      
      if (ydocRef.current) {
        const yShapes = ydocRef.current.getArray('shapes');
        yShapes.push([newShape]);
      }
    });

    toast({
      title: "Pasted",
      description: `${clipboard.length} shape(s) pasted`,
    });
  }, [clipboard, toast]);

  // Undo function
  const undo = useCallback(() => {
    if (shapes.length > 0 && ydocRef.current) {
      const yShapes = ydocRef.current.getArray('shapes');
      yShapes.delete(yShapes.length - 1, 1);
      toast({
        title: "Undone",
        description: "Last action undone",
      });
    }
  }, [shapes.length, toast]);

  // Canvas event handlers
  const handleStageClick = useCallback((e: KonvaEventObject<MouseEvent>) => {
    if (e.target === e.target.getStage()) {
      setSelectedIds([]);
      if (activeTool !== 'select') {
        const pos = e.target.getStage()?.getPointerPosition();
        if (pos) addShape(pos.x, pos.y);
      }
    }
  }, [activeTool, addShape]);

  const handleShapeClick = useCallback((shapeId: string, e: KonvaEventObject<MouseEvent>) => {
    e.cancelBubble = true;
    if (e.evt.shiftKey) {
      setSelectedIds(prev => 
        prev.includes(shapeId) 
          ? prev.filter(id => id !== shapeId)
          : [...prev, shapeId]
      );
    } else {
      setSelectedIds([shapeId]);
    }
  }, []);

  const handleDragEnd = useCallback((e: KonvaEventObject<DragEvent>, shapeId: string) => {
    updateShape(shapeId, {
      x: e.target.x(),
      y: e.target.y(),
    });
  }, [updateShape]);

  // Update transformer when selection changes
  useEffect(() => {
    if (!transformerRef.current || !stageRef.current) return;

    const transformer = transformerRef.current;
    const stage = stageRef.current;

    if (selectedIds.length === 0) {
      transformer.nodes([]);
    } else {
      const selectedNodes = selectedIds
        .map(id => stage.findOne(`#${id}`))
        .filter(Boolean);
      transformer.nodes(selectedNodes);
    }
    
    transformer.getLayer()?.batchDraw();
  }, [selectedIds]);

  // Keyboard shortcuts
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'z':
          e.preventDefault();
          undo();
          break;
        case 'c':
          e.preventDefault();
          copyShapes();
          break;
        case 'v':
          e.preventDefault();
          pasteShapes();
          break;
        case 'a':
          e.preventDefault();
          setSelectedIds(shapes.map(s => s.id));
          break;
      }
    }
    if (e.key === 'Delete' || e.key === 'Backspace') {
      e.preventDefault();
      selectedIds.forEach(id => deleteShape(id));
    }
  }, [undo, copyShapes, pasteShapes, shapes, selectedIds, deleteShape]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Tools configuration
  const tools = [
    { id: 'select', icon: MousePointer, label: 'Select' },
    { id: 'rect', icon: Square, label: 'Rectangle' },
    { id: 'circle', icon: CircleIcon, label: 'Circle' },
    { id: 'triangle', icon: Triangle, label: 'Triangle' },
    { id: 'polygon', icon: Hexagon, label: 'Polygon' },
    { id: 'star', icon: StarIcon, label: 'Star' },
    { id: 'line', icon: Minus, label: 'Line' },
    { id: 'text', icon: Type, label: 'Text' },
  ];

  // Render shape function
  const renderShape = (shape: Shape) => {
    if (shape.visible === false) return null;

    const commonProps = {
      id: shape.id,
      key: shape.id,
      x: shape.x,
      y: shape.y,
      fill: shape.fill,
      stroke: shape.stroke,
      strokeWidth: shape.strokeWidth || 0,
      opacity: shape.opacity || 1,
      rotation: shape.rotation || 0,
      scaleX: shape.scaleX || 1,
      scaleY: shape.scaleY || 1,
      draggable: activeTool === 'select' && !shape.locked,
      onClick: (e: KonvaEventObject<MouseEvent>) => handleShapeClick(shape.id, e),
      onDragEnd: (e: KonvaEventObject<DragEvent>) => handleDragEnd(e, shape.id),
    };

    switch (shape.type) {
      case 'rect':
        return <Rect {...commonProps} width={shape.width || 100} height={shape.height || 80} />;
      case 'circle':
        return <Circle {...commonProps} radius={shape.radius || 50} />;
      case 'text':
        return <Text {...commonProps} text={shape.text || 'Text'} fontSize={shape.fontSize || 16} />;
      case 'star':
        return <Star {...commonProps} numPoints={5} innerRadius={(shape.radius || 40) * 0.5} outerRadius={shape.radius || 40} />;
      case 'polygon':
        return <RegularPolygon {...commonProps} sides={6} radius={shape.radius || 50} />;
      case 'triangle':
        return <RegularPolygon {...commonProps} sides={3} radius={shape.radius || 50} />;
      case 'line':
        return <Line {...commonProps} points={shape.points || [0, 0, 100, 0]} lineCap="round" />;
      default:
        return null;
    }
  };

  const selectedShapes = shapes.filter(s => selectedIds.includes(s.id));
  const selectedShape = selectedShapes[0];

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-background via-background/95 to-background/90 overflow-hidden">
      {/* Top Bar */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="h-16 glass border-b border-glass-border/50 flex items-center justify-between px-6"
      >
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent">
            OmniDesign
          </h1>
          <span className="text-sm text-muted-foreground">ArcNex Studio</span>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 bg-muted/30 rounded-lg p-1">
            <Button variant="ghost" size="sm" onClick={undo} title="Undo">
              <Undo className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={copyShapes} title="Copy">
              <Copy className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={pasteShapes} title="Paste">
              <ClipboardPaste className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex items-center space-x-1 bg-muted/30 rounded-lg p-1">
            <Button 
              variant={grid ? "default" : "ghost"} 
              size="sm" 
              onClick={() => setGrid(!grid)}
              title="Grid"
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button 
              variant={rulers ? "default" : "ghost"} 
              size="sm" 
              onClick={() => setRulers(!rulers)}
              title="Rulers"
            >
              <Ruler className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex items-center space-x-1 bg-muted/30 rounded-lg p-1">
            <Button 
              variant={showLayersPanel ? "default" : "ghost"} 
              size="sm" 
              onClick={() => setShowLayersPanel(!showLayersPanel)}
            >
              <Layers className="w-4 h-4" />
            </Button>
            <Button 
              variant={showEffectsPanel ? "default" : "ghost"} 
              size="sm" 
              onClick={() => setShowEffectsPanel(!showEffectsPanel)}
            >
              <Sparkles className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Wifi className={`w-4 h-4 ${isConnected ? 'text-green-400' : 'text-red-400'}`} />
            <span className="text-sm text-muted-foreground">
              {isConnected ? 'Connected' : 'Offline'}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">1 user</span>
          </div>
        </div>
      </motion.div>

      {/* Properties Bar */}
      {selectedShape && (
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="h-16 glass border-b border-glass-border/50 flex items-center justify-between px-6"
        >
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-xs text-muted-foreground w-4">X</span>
              <Input
                type="number"
                value={Math.round(selectedShape.x)}
                onChange={(e) => updateShape(selectedShape.id, { x: Number(e.target.value) })}
                className="w-16 h-8 text-xs"
              />
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-muted-foreground w-4">Y</span>
              <Input
                type="number"
                value={Math.round(selectedShape.y)}
                onChange={(e) => updateShape(selectedShape.id, { y: Number(e.target.value) })}
                className="w-16 h-8 text-xs"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-xs text-muted-foreground">Fill</span>
              <Input
                type="color"
                value={selectedShape.fill}
                onChange={(e) => updateShape(selectedShape.id, { fill: e.target.value })}
                className="w-12 h-8 p-0 border-0"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-xs text-muted-foreground">Opacity</span>
              <div className="w-20">
                <Slider
                  value={[selectedShape.opacity || 1]}
                  onValueChange={([value]) => updateShape(selectedShape.id, { opacity: value })}
                  min={0}
                  max={1}
                  step={0.1}
                  className="h-2"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => updateShape(selectedShape.id, { visible: !selectedShape.visible })}
            >
              {selectedShape.visible !== false ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => updateShape(selectedShape.id, { locked: !selectedShape.locked })}
            >
              {selectedShape.locked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => deleteShape(selectedShape.id)}
              className="hover:bg-destructive/20 hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Tools Panel */}
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="w-20 h-full glass border-r border-glass-border/50 flex flex-col py-4"
        >
          <div className="flex flex-col space-y-2">
            {tools.map((tool) => (
              <motion.div key={tool.id} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant={activeTool === tool.id ? "default" : "ghost"}
                  size="icon"
                  onClick={() => setActiveTool(tool.id)}
                  className={`w-12 h-12 ${
                    activeTool === tool.id 
                      ? 'bg-primary/20 text-primary border border-primary/50' 
                      : 'hover:bg-primary/10'
                  }`}
                  title={tool.label}
                >
                  <tool.icon className="w-5 h-5" />
                </Button>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Layers Panel */}
        <AnimatePresence>
          {showLayersPanel && (
            <motion.div
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              className="w-80 h-full glass border-r border-glass-border/50 p-4 overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Layers</h3>
                <Button variant="ghost" size="icon" onClick={() => setShowLayersPanel(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="space-y-2">
                {shapes.map((shape) => (
                  <div
                    key={shape.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      selectedIds.includes(shape.id)
                        ? 'bg-primary/20 border-primary'
                        : 'bg-muted/30 border-border hover:bg-muted/50'
                    }`}
                    onClick={() => setSelectedIds([shape.id])}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{shape.type === 'rect' ? '⬜' : shape.type === 'circle' ? '⭕' : shape.type === 'text' ? '📝' : shape.type === 'star' ? '⭐' : shape.type === 'line' ? '📏' : '🔷'}</span>
                        <div>
                          <p className="font-medium capitalize">{shape.type}</p>
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
                            updateShape(shape.id, { visible: !shape.visible });
                          }}
                        >
                          {shape.visible !== false ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-6 h-6 hover:bg-destructive/20 hover:text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteShape(shape.id);
                          }}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Canvas Area */}
        <div className="flex-1 relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full p-4"
          >
            <div className="relative w-full h-full bg-background/30 rounded-lg overflow-hidden">
              {grid && (
                <div 
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage: `
                      linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
                    `,
                    backgroundSize: '20px 20px',
                  }}
                />
              )}

              <Stage
                ref={stageRef}
                width={window.innerWidth - (showLayersPanel ? 480 : 100)}
                height={window.innerHeight - (selectedShape ? 200 : 150)}
                scaleX={zoom}
                scaleY={zoom}
                onClick={handleStageClick}
                className={activeTool === 'select' ? 'cursor-default' : 'cursor-crosshair'}
              >
                <Layer>
                  {shapes.map(renderShape)}
                </Layer>
                
                <Layer>
                  <Transformer
                    ref={transformerRef}
                    anchorStroke="#00B4D8"
                    anchorFill="#00B4D8"
                    borderStroke="#00B4D8"
                    borderDash={[3, 3]}
                  />
                </Layer>
              </Stage>

              <motion.div className="absolute bottom-4 right-4 flex items-center gap-2 glass rounded-lg p-2">
                <button onClick={() => setZoom(zoom * 0.8)} className="w-8 h-8 rounded bg-background/50 hover:bg-background/70 flex items-center justify-center text-sm">−</button>
                <span className="text-sm font-medium px-2">{Math.round(zoom * 100)}%</span>
                <button onClick={() => setZoom(zoom * 1.2)} className="w-8 h-8 rounded bg-background/50 hover:bg-background/70 flex items-center justify-center text-sm">+</button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Quick Tips */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="fixed bottom-4 left-4 glass rounded-lg p-3 text-xs text-muted-foreground max-w-xs"
      >
        <p className="font-medium mb-1">Quick Tips:</p>
        <p>• Select tool to move shapes</p>
        <p>• Click tools to draw shapes</p>
        <p>• Shift+click to multi-select</p>
        <p>• Ctrl+C/V to copy/paste</p>
        <p>• Delete key to remove</p>
      </motion.div>
    </div>
  );
};

export default FixedOmniDesign;