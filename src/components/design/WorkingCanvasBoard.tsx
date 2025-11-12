import { useEffect, useRef, useState, useCallback } from 'react';
import { Stage, Layer, Rect, Circle, Text, Line, Star, RegularPolygon, Transformer } from 'react-konva';
import { KonvaEventObject } from 'konva/lib/Node';
import Konva from 'konva';
import { motion } from 'framer-motion';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';

interface Shape {
  id: string;
  type: 'rect' | 'circle' | 'text' | 'line' | 'star' | 'polygon';
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
}

interface WorkingCanvasBoardProps {
  activeTool: string;
}

const WorkingCanvasBoard = ({ activeTool }: WorkingCanvasBoardProps) => {
  const stageRef = useRef<Konva.Stage>(null);
  const transformerRef = useRef<Konva.Transformer>(null);
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [zoom, setZoom] = useState(1);
  const [grid, setGrid] = useState(false);
  const [rulers, setRulers] = useState(false);
  
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

  const addShape = useCallback((x: number, y: number) => {
    if (!ydocRef.current) return;

    const id = `shape-${Date.now()}-${Math.random()}`;
    let newShape: Shape;

    switch (activeTool) {
      case 'rect':
        newShape = { id, type: 'rect', x, y, width: 100, height: 80, fill: '#00B4D8', stroke: '#0077B6', strokeWidth: 2 };
        break;
      case 'circle':
        newShape = { id, type: 'circle', x, y, radius: 50, fill: '#9D4EDD', stroke: '#7209B7', strokeWidth: 2 };
        break;
      case 'text':
        newShape = { id, type: 'text', x, y, text: 'Text', fill: '#F8F9FA', fontSize: 16 };
        break;
      case 'star':
        newShape = { id, type: 'star', x, y, radius: 40, fill: '#FCBF49', stroke: '#F77F00', strokeWidth: 2 };
        break;
      case 'polygon':
        newShape = { id, type: 'polygon', x, y, radius: 50, fill: '#F77F00', stroke: '#D62828', strokeWidth: 2 };
        break;
      case 'line':
        newShape = { id, type: 'line', x, y, points: [0, 0, 100, 0], stroke: '#F77F00', strokeWidth: 3 };
        break;
      default:
        return;
    }

    const yShapes = ydocRef.current.getArray('shapes');
    yShapes.push([newShape]);
  }, [activeTool]);

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

  const renderShape = (shape: Shape) => {
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
      draggable: activeTool === 'select',
      onClick: (e: KonvaEventObject<MouseEvent>) => handleShapeClick(shape.id, e),
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
      case 'line':
        return <Line {...commonProps} points={shape.points || [0, 0, 100, 0]} lineCap="round" />;
      default:
        return null;
    }
  };

  return (
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
        width={window.innerWidth - 100}
        height={window.innerHeight - 150}
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
  );
};

export default WorkingCanvasBoard;