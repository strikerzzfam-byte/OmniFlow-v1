import { useEffect, useRef, useState, useCallback } from 'react';
import { Stage, Layer, Rect, Circle, Text, Line, Star, RegularPolygon, Arrow, Transformer, Group } from 'react-konva';
import { KonvaEventObject } from 'konva/lib/Node';
import Konva from 'konva';
import { motion } from 'framer-motion';
import { useCanvasTools, CanvasShape } from '@/hooks/useCanvasTools';

interface EnhancedCanvasBoardProps {
  activeTool: string;
}

const EnhancedCanvasBoard = ({ activeTool }: EnhancedCanvasBoardProps) => {
  const stageRef = useRef<Konva.Stage>(null);
  const transformerRef = useRef<Konva.Transformer>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState<number[]>([]);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);

  const {
    shapes,
    canvasState,
    initializeCollaboration,
    addShape,
    updateShape,
    selectShape,
    clearSelection,
    setZoom,
    setPan,
  } = useCanvasTools();

  useEffect(() => {
    const cleanup = initializeCollaboration();
    return cleanup;
  }, [initializeCollaboration]);

  // Update transformer when selection changes
  useEffect(() => {
    if (!transformerRef.current || !stageRef.current) return;

    const transformer = transformerRef.current;
    const stage = stageRef.current;

    if (canvasState.selectedIds.length === 0) {
      transformer.nodes([]);
    } else {
      const selectedNodes = canvasState.selectedIds
        .map(id => stage.findOne(`#${id}`))
        .filter(Boolean);
      transformer.nodes(selectedNodes);
    }
    
    transformer.getLayer()?.batchDraw();
  }, [canvasState.selectedIds]);

  const createShape = useCallback((x: number, y: number) => {
    const baseProps = {
      x,
      y,
      fill: '#00B4D8',
      stroke: '#0077B6',
      strokeWidth: 2,
      opacity: 1,
    };

    switch (activeTool) {
      case 'rect':
        return { ...baseProps, type: 'rect' as const, width: 100, height: 80 };
      case 'circle':
        return { ...baseProps, type: 'circle' as const, radius: 50, fill: '#9D4EDD', stroke: '#7209B7' };
      case 'triangle':
        return { ...baseProps, type: 'polygon' as const, radius: 50, fill: '#F77F00' };
      case 'polygon':
        return { ...baseProps, type: 'polygon' as const, radius: 50, fill: '#FCBF49' };
      case 'star':
        return { ...baseProps, type: 'star' as const, radius: 40, fill: '#FCBF49', stroke: '#F77F00' };
      case 'text':
        return { 
          ...baseProps, 
          type: 'text' as const, 
          text: 'Double click to edit', 
          fontSize: 16, 
          fontFamily: 'Inter',
          fill: '#F8F9FA',
          stroke: undefined,
          strokeWidth: 0
        };
      case 'line':
        return { ...baseProps, type: 'line' as const, points: [0, 0, 100, 0], stroke: '#F77F00', strokeWidth: 3 };
      case 'arrow':
        return { ...baseProps, type: 'arrow' as const, points: [0, 0, 100, 0], stroke: '#D62828', strokeWidth: 3 };
      default:
        return null;
    }
  }, [activeTool]);

  const handleStageClick = useCallback((e: KonvaEventObject<MouseEvent>) => {
    const clickedOnEmpty = e.target === e.target.getStage();
    
    if (clickedOnEmpty) {
      clearSelection();
      
      if (activeTool !== 'select' && activeTool !== 'pen') {
        const pos = e.target.getStage()?.getPointerPosition();
        if (pos) {
          const shapeData = createShape(pos.x, pos.y);
          if (shapeData) {
            addShape(shapeData);
          }
        }
      }
    }
  }, [activeTool, clearSelection, createShape, addShape]);

  const handleShapeClick = useCallback((e: KonvaEventObject<MouseEvent>, shapeId: string) => {
    e.cancelBubble = true;
    selectShape(shapeId, e.evt.shiftKey);
  }, [selectShape]);

  const handleMouseDown = useCallback((e: KonvaEventObject<MouseEvent>) => {
    if (activeTool === 'pen') {
      setIsDrawing(true);
      const pos = e.target.getStage()?.getPointerPosition();
      if (pos) {
        setCurrentPath([pos.x, pos.y]);
      }
    } else if (activeTool === 'select') {
      const pos = e.target.getStage()?.getPointerPosition();
      if (pos) {
        setDragStart(pos);
      }
    }
  }, [activeTool]);

  const handleMouseMove = useCallback((e: KonvaEventObject<MouseEvent>) => {
    if (activeTool === 'pen' && isDrawing) {
      const stage = e.target.getStage();
      const point = stage?.getPointerPosition();
      if (point) {
        setCurrentPath(prev => [...prev, point.x, point.y]);
      }
    }
  }, [activeTool, isDrawing]);

  const handleMouseUp = useCallback(() => {
    if (activeTool === 'pen' && isDrawing && currentPath.length > 2) {
      addShape({
        type: 'line',
        x: 0,
        y: 0,
        points: currentPath,
        stroke: '#000000',
        strokeWidth: 2,
        fill: 'transparent',
        opacity: 1,
      });
    }
    setIsDrawing(false);
    setCurrentPath([]);
    setDragStart(null);
  }, [activeTool, isDrawing, currentPath, addShape]);

  const handleDragEnd = useCallback((e: KonvaEventObject<DragEvent>, shapeId: string) => {
    updateShape(shapeId, {
      x: e.target.x(),
      y: e.target.y(),
    });
  }, [updateShape]);

  const handleTransformEnd = useCallback((e: any, shapeId: string) => {
    const node = e.target;
    updateShape(shapeId, {
      x: node.x(),
      y: node.y(),
      scaleX: node.scaleX(),
      scaleY: node.scaleY(),
      rotation: node.rotation(),
    });
  }, [updateShape]);

  const renderShape = useCallback((shape: CanvasShape) => {
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
      draggable: !shape.locked && activeTool === 'select',
      visible: shape.visible !== false,
      onClick: (e: KonvaEventObject<MouseEvent>) => handleShapeClick(e, shape.id),
      onDragEnd: (e: KonvaEventObject<DragEvent>) => handleDragEnd(e, shape.id),
      onTransformEnd: (e: any) => handleTransformEnd(e, shape.id),
      shadowColor: shape.shadow?.color,
      shadowBlur: shape.shadow?.blur,
      shadowOffsetX: shape.shadow?.offset.x,
      shadowOffsetY: shape.shadow?.offset.y,
      filters: shape.glow ? [Konva.Filters.Blur] : undefined,
      blurRadius: shape.glow?.blur,
    };

    switch (shape.type) {
      case 'rect':
        return (
          <Rect
            {...commonProps}
            width={shape.width || 100}
            height={shape.height || 80}
          />
        );
      
      case 'circle':
        return (
          <Circle
            {...commonProps}
            radius={shape.radius || 50}
          />
        );
      
      case 'text':
        return (
          <Text
            {...commonProps}
            text={shape.text || 'Text'}
            fontSize={shape.fontSize || 16}
            fontFamily={shape.fontFamily || 'Inter'}
            fontStyle={shape.fontWeight || 'normal'}
          />
        );
      
      case 'line':
        return (
          <Line
            {...commonProps}
            points={shape.points || [0, 0, 100, 0]}
            lineCap="round"
            lineJoin="round"
          />
        );
      
      case 'arrow':
        return (
          <Arrow
            {...commonProps}
            points={shape.points || [0, 0, 100, 0]}
            pointerLength={10}
            pointerWidth={10}
          />
        );
      
      case 'star':
        return (
          <Star
            {...commonProps}
            numPoints={5}
            innerRadius={(shape.radius || 40) * 0.5}
            outerRadius={shape.radius || 40}
          />
        );
      
      case 'polygon':
        return (
          <RegularPolygon
            {...commonProps}
            sides={6}
            radius={shape.radius || 50}
          />
        );
      
      default:
        return null;
    }
  }, [activeTool, handleShapeClick, handleDragEnd, handleTransformEnd]);

  const stageWidth = window.innerWidth - 100;
  const stageHeight = window.innerHeight - 150;

  return (
    <div className="relative w-full h-full bg-background/30 rounded-lg overflow-hidden">
      {/* Grid Background */}
      {canvasState.grid && (
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

      {/* Rulers */}
      {canvasState.rulers && (
        <>
          <div className="absolute top-0 left-8 right-0 h-8 bg-background/80 border-b border-border flex items-end text-xs text-muted-foreground">
            {Array.from({ length: Math.ceil(stageWidth / 50) }, (_, i) => (
              <div key={i} className="w-12 text-center border-l border-border/50">
                {i * 50}
              </div>
            ))}
          </div>
          <div className="absolute top-8 left-0 bottom-0 w-8 bg-background/80 border-r border-border flex flex-col justify-start text-xs text-muted-foreground">
            {Array.from({ length: Math.ceil(stageHeight / 50) }, (_, i) => (
              <div key={i} className="h-12 flex items-center justify-center border-t border-border/50 -rotate-90">
                {i * 50}
              </div>
            ))}
          </div>
        </>
      )}

      {/* Canvas */}
      <div className={`${canvasState.rulers ? 'ml-8 mt-8' : ''}`}>
        <Stage
          ref={stageRef}
          width={stageWidth}
          height={stageHeight}
          scaleX={canvasState.zoom}
          scaleY={canvasState.zoom}
          x={canvasState.pan.x}
          y={canvasState.pan.y}
          onClick={handleStageClick}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          className={`${
            activeTool === 'pen' ? 'cursor-crosshair' : 
            activeTool === 'select' ? 'cursor-default' : 'cursor-crosshair'
          }`}
        >
          <Layer>
            {shapes.map(renderShape)}
            
            {/* Current drawing path */}
            {isDrawing && currentPath.length > 2 && (
              <Line
                points={currentPath}
                stroke="#00B4D8"
                strokeWidth={2}
                lineCap="round"
                lineJoin="round"
                opacity={0.8}
              />
            )}
          </Layer>
          
          {/* Transformer Layer */}
          <Layer>
            <Transformer
              ref={transformerRef}
              boundBoxFunc={(oldBox, newBox) => {
                if (newBox.width < 5 || newBox.height < 5) {
                  return oldBox;
                }
                return newBox;
              }}
              anchorStroke="#00B4D8"
              anchorFill="#00B4D8"
              borderStroke="#00B4D8"
              borderDash={[3, 3]}
            />
          </Layer>
        </Stage>
      </div>

      {/* Zoom Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute bottom-4 right-4 flex items-center gap-2 glass rounded-lg p-2"
      >
        <button
          onClick={() => setZoom(canvasState.zoom * 0.8)}
          className="w-8 h-8 rounded bg-background/50 hover:bg-background/70 flex items-center justify-center text-sm"
        >
          −
        </button>
        <span className="text-sm font-medium px-2">
          {Math.round(canvasState.zoom * 100)}%
        </span>
        <button
          onClick={() => setZoom(canvasState.zoom * 1.2)}
          className="w-8 h-8 rounded bg-background/50 hover:bg-background/70 flex items-center justify-center text-sm"
        >
          +
        </button>
      </motion.div>
    </div>
  );
};

export default EnhancedCanvasBoard;