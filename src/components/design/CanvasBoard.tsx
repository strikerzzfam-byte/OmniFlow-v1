import { useEffect, useRef, useState, useCallback } from 'react';
import { Stage, Layer, Rect, Circle, Text, Line, Star, RegularPolygon, Arrow, Transformer, Group } from 'react-konva';
import { KonvaEventObject } from 'konva/lib/Node';
import Konva from 'konva';
import { motion } from 'framer-motion';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { useCanvasTools, CanvasShape } from '@/hooks/useCanvasTools';

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
}

interface CanvasBoardProps {
  selectedTool: string;
  onShapeAdd: (shape: Shape) => void;
  onShapeSelect: (shape: Shape | null) => void;
  selectedShape: Shape | null;
  onAnimationPlay?: (animationType: string, shape: Shape, duration: number) => void;
  onShapeUpdate?: (shape: Shape) => void;
}

const CanvasBoard = ({ selectedTool, onShapeAdd, onShapeSelect, selectedShape, onAnimationPlay, onShapeUpdate }: CanvasBoardProps) => {
  const stageRef = useRef<any>(null);
  const transformerRef = useRef<any>(null);
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState<number[]>([]);
  const [editingText, setEditingText] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState('');
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

  const addShape = (x: number, y: number) => {
    if (!ydocRef.current) return;

    const yShapes = ydocRef.current.getArray('shapes');
    const id = `shape-${Date.now()}-${Math.random()}`;
    
    let newShape: Shape;
    
    switch (selectedTool) {
      case 'rect':
        newShape = { id, type: 'rect', x, y, width: 100, height: 80, fill: '#00B4D8', stroke: '#0077B6', strokeWidth: 2 };
        break;
      case 'circle':
        newShape = { id, type: 'circle', x, y, radius: 50, fill: '#9D4EDD', stroke: '#7209B7', strokeWidth: 2 };
        break;
      case 'text':
        newShape = { id, type: 'text', x, y, text: 'Double click to edit', fill: '#F8F9FA', fontSize: 16, fontFamily: 'Inter' };
        break;
      case 'line':
        newShape = { id, type: 'line', x, y, points: [0, 0, 100, 0], stroke: '#F77F00', strokeWidth: 3 };
        break;
      case 'arrow':
        newShape = { id, type: 'arrow', x, y, points: [0, 0, 100, 0], stroke: '#D62828', strokeWidth: 3, fill: '#D62828' };
        break;
      case 'star':
        newShape = { id, type: 'star', x, y, radius: 40, fill: '#FCBF49', stroke: '#F77F00', strokeWidth: 2 };
        break;
      case 'image':
        newShape = { id, type: 'image', x, y, width: 100, height: 100, src: 'https://via.placeholder.com/100' };
        break;
      case 'pen':
        newShape = { id, type: 'line', x: 0, y: 0, points: [x, y], stroke: '#000000', strokeWidth: 2 };
        break;
      default:
        return;
    }

    yShapes.push([newShape]);
    onShapeAdd(newShape);
  };

  const updateShape = (id: string, attrs: Partial<Shape>) => {
    if (!ydocRef.current) return;

    const yShapes = ydocRef.current.getArray('shapes');
    const shapeIndex = shapes.findIndex(s => s.id === id);
    
    if (shapeIndex >= 0) {
      const updatedShape = { ...shapes[shapeIndex], ...attrs };
      yShapes.delete(shapeIndex, 1);
      yShapes.insert(shapeIndex, [updatedShape]);
    }
  };

  const handleStageClick = (e: KonvaEventObject<MouseEvent>) => {
    if (e.target === e.target.getStage()) {
      setSelectedId(null);
      onShapeSelect(null);
      if (selectedTool !== 'select' && selectedTool !== 'pen') {
        const pos = e.target.getStage()?.getPointerPosition();
        if (pos) addShape(pos.x, pos.y);
      }
    }
  };
  
  const handleMouseDown = (e: KonvaEventObject<MouseEvent>) => {
    if (selectedTool === 'pen') {
      setIsDrawing(true);
      const pos = e.target.getStage()?.getPointerPosition();
      if (pos) {
        setCurrentPath([pos.x, pos.y]);
      }
    }
  };
  
  const handleMouseMove = (e: KonvaEventObject<MouseEvent>) => {
    if (!isDrawing || selectedTool !== 'pen') return;
    
    const stage = e.target.getStage();
    const point = stage?.getPointerPosition();
    if (point) {
      setCurrentPath(prev => [...prev, point.x, point.y]);
    }
  };
  
  const handleMouseUp = () => {
    if (isDrawing && selectedTool === 'pen' && currentPath.length > 2) {
      const id = `shape-${Date.now()}-${Math.random()}`;
      const newShape: Shape = {
        id,
        type: 'line',
        x: 0,
        y: 0,
        points: currentPath,
        stroke: '#000000',
        strokeWidth: 2,
        fill: 'transparent'
      };
      
      if (ydocRef.current) {
        const yShapes = ydocRef.current.getArray('shapes');
        yShapes.push([newShape]);
        onShapeAdd(newShape);
      }
    }
    setIsDrawing(false);
    setCurrentPath([]);
  };
  
  const handleShapeClick = (shape: Shape) => {
    setSelectedId(shape.id);
    onShapeSelect(shape);
  };

  const handleTextDoubleClick = (shape: Shape) => {
    if (shape.type === 'text') {
      setEditingText(shape.id);
      setEditingValue(shape.text || '');
    }
  };

  const handleTextSubmit = () => {
    if (editingText && editingValue.trim()) {
      updateShape(editingText, { text: editingValue.trim() });
    }
    setEditingText(null);
    setEditingValue('');
  };

  const handleTextCancel = () => {
    setEditingText(null);
    setEditingValue('');
  };

  useEffect(() => {
    if (selectedId && transformerRef.current) {
      const stage = stageRef.current;
      const selectedNode = stage.findOne(`#${selectedId}`);
      if (selectedNode) {
        transformerRef.current.nodes([selectedNode]);
        transformerRef.current.getLayer().batchDraw();
      }
    }
  }, [selectedId]);

  const playKonvaAnimation = (animationType: string, shape: Shape, duration: number) => {
    const stage = stageRef.current;
    if (!stage) return;

    const node = stage.findOne(`#${shape.id}`);
    if (!node) return;

    const originalProps = {
      x: node.x(),
      y: node.y(),
      scaleX: node.scaleX(),
      scaleY: node.scaleY(),
      rotation: node.rotation(),
      opacity: node.opacity()
    };

    switch (animationType) {
      case "fadeIn":
        node.opacity(0);
        node.to({ opacity: originalProps.opacity, duration });
        break;
      case "slideIn":
        node.x(originalProps.x - 100);
        node.to({ x: originalProps.x, duration });
        break;
      case "scaleUp":
        node.scaleX(0);
        node.scaleY(0);
        node.to({ scaleX: originalProps.scaleX, scaleY: originalProps.scaleY, duration });
        break;
      case "rotate":
        node.to({ rotation: originalProps.rotation + 360, duration });
        break;
      case "bounce":
        node.to({
          y: originalProps.y - 20,
          duration: duration / 2,
          onFinish: () => {
            node.to({ y: originalProps.y, duration: duration / 2 });
          }
        });
        break;
    }
  };

  useEffect(() => {
    const handleAnimationEvent = (event: any) => {
      const { animationType, shape, duration } = event.detail;
      playKonvaAnimation(animationType, shape, duration);
    };

    const handleShapeUpdateEvent = (event: any) => {
      const { shape } = event.detail;
      updateShape(shape.id, shape);
    };

    const handleSelectShapeEvent = (event: any) => {
      const { shapeId } = event.detail;
      setSelectedId(shapeId);
      const shape = shapes.find(s => s.id === shapeId);
      if (shape) {
        onShapeSelect(shape);
      }
    };

    const canvasElement = stageRef.current?.container();
    if (canvasElement) {
      canvasElement.addEventListener('playAnimation', handleAnimationEvent);
      canvasElement.addEventListener('updateShape', handleShapeUpdateEvent);
      canvasElement.addEventListener('selectShape', handleSelectShapeEvent);
      return () => {
        canvasElement.removeEventListener('playAnimation', handleAnimationEvent);
        canvasElement.removeEventListener('updateShape', handleShapeUpdateEvent);
        canvasElement.removeEventListener('selectShape', handleSelectShapeEvent);
      };
    }
  }, []);

  const handleDragEnd = (e: KonvaEventObject<DragEvent>, id: string) => {
    updateShape(id, { x: e.target.x(), y: e.target.y() });
  };

  return (
    <div className="w-full h-full bg-background/50 rounded-lg overflow-hidden">
      <Stage
        ref={stageRef}
        width={window.innerWidth - 300}
        height={window.innerHeight - 100}
        onClick={handleStageClick}
        onMouseDown={handleMouseDown}
        onMousemove={handleMouseMove}
        onMouseup={handleMouseUp}
        className={selectedTool === 'pen' ? 'cursor-crosshair' : 'cursor-default'}
      >
        <Layer>
          {shapes.map((shape) => {
            const isSelected = shape.id === selectedId;
            const commonProps = {
              key: shape.id,
              id: shape.id,
              draggable: true,
              onClick: () => handleShapeClick(shape),
              onDragEnd: (e: any) => handleDragEnd(e, shape.id),
              rotation: shape.rotation || 0,
              scaleX: shape.scaleX || 1,
              scaleY: shape.scaleY || 1,
              opacity: shape.opacity || 1,
              className: 'canvas-shape',
            };
            
            if (shape.type === 'rect') {
              return (
                <Rect
                  {...commonProps}
                  x={shape.x}
                  y={shape.y}
                  width={shape.width}
                  height={shape.height}
                  fill={shape.fill}
                  stroke={shape.stroke}
                  strokeWidth={shape.strokeWidth}
                />
              );
            }
            
            if (shape.type === 'circle') {
              return (
                <Circle
                  {...commonProps}
                  x={shape.x}
                  y={shape.y}
                  radius={shape.radius}
                  fill={shape.fill}
                  stroke={shape.stroke}
                  strokeWidth={shape.strokeWidth}
                />
              );
            }
            
            if (shape.type === 'text') {
              return (
                <Text
                  {...commonProps}
                  x={shape.x}
                  y={shape.y}
                  text={shape.text}
                  fill={shape.fill}
                  fontSize={shape.fontSize || 16}
                  fontFamily={shape.fontFamily || 'Inter'}
                  onDblClick={() => handleTextDoubleClick(shape)}
                />
              );
            }
            
            if (shape.type === 'line') {
              return (
                <Line
                  {...commonProps}
                  x={shape.x}
                  y={shape.y}
                  points={shape.points}
                  stroke={shape.stroke}
                  strokeWidth={shape.strokeWidth}
                  lineCap="round"
                />
              );
            }
            
            if (shape.type === 'arrow') {
              return (
                <Line
                  {...commonProps}
                  x={shape.x}
                  y={shape.y}
                  points={shape.points}
                  stroke={shape.stroke}
                  strokeWidth={shape.strokeWidth}
                  lineCap="round"
                  fill={shape.fill}
                  pointerLength={10}
                  pointerWidth={10}
                />
              );
            }
            
            if (shape.type === 'star') {
              return (
                <Star
                  {...commonProps}
                  x={shape.x}
                  y={shape.y}
                  numPoints={5}
                  innerRadius={shape.radius ? shape.radius * 0.5 : 20}
                  outerRadius={shape.radius || 40}
                  fill={shape.fill}
                  stroke={shape.stroke}
                  strokeWidth={shape.strokeWidth}
                />
              );
            }
            
            return null;
          })}
          
          {/* Current drawing path */}
          {isDrawing && currentPath.length > 2 && (
            <Line
              points={currentPath}
              stroke="#000000"
              strokeWidth={2}
              lineCap="round"
              lineJoin="round"
            />
          )}
          
          {selectedId && (
            <Transformer
              ref={transformerRef}
              boundBoxFunc={(oldBox, newBox) => {
                if (newBox.width < 5 || newBox.height < 5) {
                  return oldBox;
                }
                return newBox;
              }}
            />
          )}
        </Layer>
      </Stage>
      
      {/* Text Editing Overlay */}
      {editingText && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className="bg-background border rounded-lg p-4 shadow-lg min-w-80">
            <h3 className="font-semibold mb-3">Edit Text</h3>
            <textarea
              value={editingValue}
              onChange={(e) => setEditingValue(e.target.value)}
              className="w-full h-24 p-2 border rounded resize-none focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter text..."
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.ctrlKey) {
                  handleTextSubmit();
                } else if (e.key === 'Escape') {
                  handleTextCancel();
                }
              }}
            />
            <div className="flex justify-end gap-2 mt-3">
              <button
                onClick={handleTextCancel}
                className="px-3 py-1 text-sm border rounded hover:bg-muted"
              >
                Cancel
              </button>
              <button
                onClick={handleTextSubmit}
                className="px-3 py-1 text-sm bg-primary text-primary-foreground rounded hover:bg-primary/90"
              >
                Save
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Press Ctrl+Enter to save, Esc to cancel
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CanvasBoard;