import React, { useRef, useEffect, useState } from 'react';
import { Stage, Layer, Rect, Circle, Text, Star, Arrow, Line, Image as KonvaImage } from 'react-konva';
import { motion } from 'framer-motion';
import { Shape, CanvasState } from '@/hooks/useCanvasTools';
import Konva from 'konva';

interface CanvasBoardProps {
  shapes: Shape[];
  canvasState: CanvasState;
  activeTool: string;
  onShapeSelect: (id: string, multi?: boolean) => void;
  onShapeUpdate: (id: string, updates: Partial<Shape>) => void;
  onAddShape: (shape: Partial<Shape>) => void;
  onClearSelection: () => void;
}

const CanvasBoard: React.FC<CanvasBoardProps> = ({
  shapes,
  canvasState,
  activeTool,
  onShapeSelect,
  onShapeUpdate,
  onAddShape,
  onClearSelection
}) => {
  const stageRef = useRef<Konva.Stage>(null);
  const [stageSize, setStageSize] = useState({ width: 800, height: 600 });

  useEffect(() => {
    const updateSize = () => {
      const container = stageRef.current?.container();
      if (container) {
        setStageSize({
          width: container.offsetWidth,
          height: container.offsetHeight
        });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const handleStageClick = (e: any) => {
    if (e.target === e.target.getStage()) {
      if (activeTool === 'select') {
        onClearSelection();
        return;
      }

      const pos = e.target.getStage().getPointerPosition();
      const newShape: Partial<Shape> = {
        x: pos.x,
        y: pos.y
      };

      switch (activeTool) {
        case 'rect':
          onAddShape({
            ...newShape,
            type: 'rect',
            width: 100,
            height: 60,
            fill: '#00B4D8'
          });
          break;
        case 'circle':
          onAddShape({
            ...newShape,
            type: 'circle',
            width: 80,
            height: 80,
            fill: '#9D4EDD'
          });
          break;
        case 'text':
          onAddShape({
            ...newShape,
            type: 'text',
            text: 'Double click to edit',
            fontSize: 24,
            fill: '#F8F9FA',
            fontFamily: 'Inter'
          });
          break;
        case 'star':
          onAddShape({
            ...newShape,
            type: 'star',
            width: 80,
            height: 80,
            fill: '#FFD60A'
          });
          break;
        case 'line':
          onAddShape({
            ...newShape,
            type: 'line',
            points: [0, 0, 100, 0],
            stroke: '#F8F9FA',
            strokeWidth: 2
          });
          break;
      }
    }
  };

  const renderShape = (shape: Shape) => {
    const isSelected = canvasState.selectedIds.includes(shape.id);
    const commonProps = {
      key: shape.id,
      x: shape.x,
      y: shape.y,
      rotation: shape.rotation || 0,
      scaleX: shape.scaleX || 1,
      scaleY: shape.scaleY || 1,
      opacity: shape.opacity || 1,
      visible: shape.visible !== false,
      draggable: !shape.locked && activeTool === 'select',
      onClick: (e: any) => {
        e.cancelBubble = true;
        onShapeSelect(shape.id, e.evt.shiftKey);
      },
      onDragEnd: (e: any) => {
        onShapeUpdate(shape.id, {
          x: e.target.x(),
          y: e.target.y()
        });
      },
      onTransformEnd: (e: any) => {
        const node = e.target;
        const scaleX = node.scaleX();
        const scaleY = node.scaleY();
        
        onShapeUpdate(shape.id, {
          x: node.x(),
          y: node.y(),
          rotation: node.rotation(),
          scaleX,
          scaleY,
          width: Math.max(5, node.width() * scaleX),
          height: Math.max(5, node.height() * scaleY)
        });
        
        node.scaleX(1);
        node.scaleY(1);
      },
      stroke: isSelected ? '#00B4D8' : shape.stroke,
      strokeWidth: isSelected ? 2 : (shape.strokeWidth || 0)
    };

    switch (shape.type) {
      case 'rect':
        return (
          <Rect
            {...commonProps}
            width={shape.width || 100}
            height={shape.height || 60}
            fill={shape.fill}
            cornerRadius={shape.borderRadius || 0}
          />
        );
      
      case 'circle':
        return (
          <Circle
            {...commonProps}
            radius={(shape.width || 80) / 2}
            fill={shape.fill}
          />
        );
      
      case 'text':
        return (
          <Text
            {...commonProps}
            text={shape.text || 'Text'}
            fontSize={shape.fontSize || 24}
            fontFamily={shape.fontFamily || 'Inter'}
            fontStyle={shape.fontWeight || 'normal'}
            fill={shape.fill}
            align={shape.textAlign || 'left'}
            onDblClick={() => {
              // Handle text editing
              const textNode = stageRef.current?.findOne(`#${shape.id}`);
              if (textNode) {
                textNode.hide();
                // Create textarea for editing
              }
            }}
          />
        );
      
      case 'star':
        return (
          <Star
            {...commonProps}
            numPoints={5}
            innerRadius={(shape.width || 80) / 4}
            outerRadius={(shape.width || 80) / 2}
            fill={shape.fill}
          />
        );
      
      case 'line':
        return (
          <Line
            {...commonProps}
            points={shape.points || [0, 0, 100, 0]}
            stroke={shape.stroke || shape.fill}
            strokeWidth={shape.strokeWidth || 2}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex-1 relative overflow-hidden bg-[#1a1a1a]"
    >
      {/* Grid Background */}
      {canvasState.grid && (
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(to right, #333 1px, transparent 1px),
              linear-gradient(to bottom, #333 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px',
            transform: `scale(${canvasState.zoom}) translate(${canvasState.pan.x}px, ${canvasState.pan.y}px)`
          }}
        />
      )}

      {/* Rulers */}
      {canvasState.rulers && (
        <>
          {/* Horizontal Ruler */}
          <div className="absolute top-0 left-16 right-0 h-4 bg-black/50 border-b border-gray-600">
            {Array.from({ length: Math.ceil(stageSize.width / 50) }, (_, i) => (
              <div
                key={i}
                className="absolute top-0 h-full border-l border-gray-500"
                style={{ left: i * 50 }}
              >
                <span className="text-xs text-gray-400 ml-1">{i * 50}</span>
              </div>
            ))}
          </div>
          
          {/* Vertical Ruler */}
          <div className="absolute top-4 left-0 bottom-0 w-16 bg-black/50 border-r border-gray-600">
            {Array.from({ length: Math.ceil(stageSize.height / 50) }, (_, i) => (
              <div
                key={i}
                className="absolute left-0 w-full border-t border-gray-500"
                style={{ top: i * 50 }}
              >
                <span className="text-xs text-gray-400 ml-1 rotate-90 origin-left">{i * 50}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Konva Stage */}
      <Stage
        ref={stageRef}
        width={stageSize.width}
        height={stageSize.height}
        scaleX={canvasState.zoom}
        scaleY={canvasState.zoom}
        x={canvasState.pan.x}
        y={canvasState.pan.y}
        onClick={handleStageClick}
        onWheel={(e) => {
          e.evt.preventDefault();
          const scaleBy = 1.1;
          const stage = e.target.getStage();
          const oldScale = stage.scaleX();
          const pointer = stage.getPointerPosition();
          
          const mousePointTo = {
            x: (pointer.x - stage.x()) / oldScale,
            y: (pointer.y - stage.y()) / oldScale
          };
          
          const newScale = e.evt.deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy;
          
          stage.scale({ x: newScale, y: newScale });
          
          const newPos = {
            x: pointer.x - mousePointTo.x * newScale,
            y: pointer.y - mousePointTo.y * newScale
          };
          
          stage.position(newPos);
        }}
      >
        <Layer>
          {shapes
            .filter(shape => shape.visible !== false)
            .sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0))
            .map(renderShape)}
        </Layer>
      </Stage>

      {/* Canvas Info */}
      <div className="absolute bottom-4 left-4 glass rounded-lg px-3 py-2 text-xs text-muted-foreground">
        Zoom: {Math.round(canvasState.zoom * 100)}% | Objects: {shapes.length}
      </div>
    </motion.div>
  );
};

export default CanvasBoard;