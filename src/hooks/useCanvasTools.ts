import { useState, useCallback, useRef } from 'react';
import Konva from 'konva';

export type Tool = 'select' | 'rect' | 'circle' | 'polygon' | 'star' | 'arrow' | 'line' | 'text' | 'image' | 'pen';

export interface Shape {
  id: string;
  type: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  rotation?: number;
  scaleX?: number;
  scaleY?: number;
  opacity?: number;
  visible?: boolean;
  locked?: boolean;
  text?: string;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: string;
  textAlign?: string;
  points?: number[];
  borderRadius?: number;
  src?: string;
  filters?: any[];
  shadow?: any;
  zIndex?: number;
}

export interface CanvasState {
  zoom: number;
  pan: { x: number; y: number };
  grid: boolean;
  rulers: boolean;
  snapToGrid: boolean;
  smartGuides: boolean;
  selectedIds: string[];
}

export const useCanvasTools = () => {
  const [activeTool, setActiveTool] = useState<Tool>('select');
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [canvasState, setCanvasState] = useState<CanvasState>({
    zoom: 1,
    pan: { x: 0, y: 0 },
    grid: false,
    rulers: false,
    snapToGrid: false,
    smartGuides: true,
    selectedIds: []
  });
  
  const history = useRef<Shape[][]>([]);
  const historyStep = useRef(0);

  const addShape = useCallback((shape: Partial<Shape>) => {
    const newShape: Shape = {
      id: `shape-${Date.now()}-${Math.random()}`,
      type: 'rect',
      x: 100,
      y: 100,
      width: 100,
      height: 100,
      fill: '#00B4D8',
      stroke: '',
      strokeWidth: 0,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
      opacity: 1,
      visible: true,
      locked: false,
      zIndex: shapes.length,
      ...shape
    };
    
    setShapes(prev => {
      const updated = [...prev, newShape];
      history.current = history.current.slice(0, historyStep.current + 1);
      history.current.push(updated);
      historyStep.current++;
      return updated;
    });
    
    setCanvasState(prev => ({ ...prev, selectedIds: [newShape.id] }));
  }, [shapes.length]);

  const updateShape = useCallback((id: string, updates: Partial<Shape>) => {
    setShapes(prev => {
      const updated = prev.map(shape => 
        shape.id === id ? { ...shape, ...updates } : shape
      );
      history.current = history.current.slice(0, historyStep.current + 1);
      history.current.push(updated);
      historyStep.current++;
      return updated;
    });
  }, []);

  const deleteShape = useCallback((id: string) => {
    setShapes(prev => {
      const updated = prev.filter(shape => shape.id !== id);
      history.current = history.current.slice(0, historyStep.current + 1);
      history.current.push(updated);
      historyStep.current++;
      return updated;
    });
    setCanvasState(prev => ({ 
      ...prev, 
      selectedIds: prev.selectedIds.filter(selectedId => selectedId !== id) 
    }));
  }, []);

  const selectShape = useCallback((id: string, multi = false) => {
    setCanvasState(prev => ({
      ...prev,
      selectedIds: multi 
        ? prev.selectedIds.includes(id)
          ? prev.selectedIds.filter(selectedId => selectedId !== id)
          : [...prev.selectedIds, id]
        : [id]
    }));
  }, []);

  const clearSelection = useCallback(() => {
    setCanvasState(prev => ({ ...prev, selectedIds: [] }));
  }, []);

  const duplicateShape = useCallback((id: string) => {
    const shape = shapes.find(s => s.id === id);
    if (shape) {
      addShape({
        ...shape,
        x: shape.x + 20,
        y: shape.y + 20
      });
    }
  }, [shapes, addShape]);

  const groupShapes = useCallback((ids: string[]) => {
    if (ids.length < 2) return;
    
    const groupShapes = shapes.filter(s => ids.includes(s.id));
    const bounds = groupShapes.reduce((acc, shape) => ({
      minX: Math.min(acc.minX, shape.x),
      minY: Math.min(acc.minY, shape.y),
      maxX: Math.max(acc.maxX, shape.x + (shape.width || 0)),
      maxY: Math.max(acc.maxY, shape.y + (shape.height || 0))
    }), { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity });

    const group: Shape = {
      id: `group-${Date.now()}`,
      type: 'group',
      x: bounds.minX,
      y: bounds.minY,
      width: bounds.maxX - bounds.minX,
      height: bounds.maxY - bounds.minY,
      children: ids,
      zIndex: Math.max(...groupShapes.map(s => s.zIndex || 0))
    };

    setShapes(prev => {
      const updated = [...prev.filter(s => !ids.includes(s.id)), group];
      history.current = history.current.slice(0, historyStep.current + 1);
      history.current.push(updated);
      historyStep.current++;
      return updated;
    });
  }, [shapes]);

  const undo = useCallback(() => {
    if (historyStep.current > 0) {
      historyStep.current--;
      setShapes(history.current[historyStep.current] || []);
    }
  }, []);

  const redo = useCallback(() => {
    if (historyStep.current < history.current.length - 1) {
      historyStep.current++;
      setShapes(history.current[historyStep.current]);
    }
  }, []);

  const setZoom = useCallback((zoom: number) => {
    setCanvasState(prev => ({ ...prev, zoom: Math.max(0.1, Math.min(5, zoom)) }));
  }, []);

  const toggleGrid = useCallback(() => {
    setCanvasState(prev => ({ ...prev, grid: !prev.grid }));
  }, []);

  const toggleRulers = useCallback(() => {
    setCanvasState(prev => ({ ...prev, rulers: !prev.rulers }));
  }, []);

  const toggleSnapToGrid = useCallback(() => {
    setCanvasState(prev => ({ ...prev, snapToGrid: !prev.snapToGrid }));
  }, []);

  const toggleSmartGuides = useCallback(() => {
    setCanvasState(prev => ({ ...prev, smartGuides: !prev.smartGuides }));
  }, []);

  return {
    activeTool,
    setActiveTool,
    shapes,
    canvasState,
    addShape,
    updateShape,
    deleteShape,
    selectShape,
    clearSelection,
    duplicateShape,
    groupShapes,
    undo,
    redo,
    setZoom,
    toggleGrid,
    toggleRulers,
    toggleSnapToGrid,
    toggleSmartGuides
  };
};