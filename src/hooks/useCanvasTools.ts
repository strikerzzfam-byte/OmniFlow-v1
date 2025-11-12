import { useState, useRef, useCallback } from 'react';

export interface CanvasShape {
  id: string;
  type: 'rect' | 'circle' | 'text' | 'line' | 'polygon' | 'arrow' | 'path' | 'image';
  x: number;
  y: number;
  width?: number;
  height?: number;
  radius?: number;
  points?: number[];
  text?: string;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: string;
  fill: string;
  stroke?: string;
  strokeWidth?: number;
  opacity?: number;
  rotation?: number;
  scaleX?: number;
  scaleY?: number;
  shadow?: {
    blur: number;
    offset: { x: number; y: number };
    color: string;
  };
  glow?: {
    blur: number;
    color: string;
  };
  gradient?: {
    type: 'linear' | 'radial';
    stops: Array<{ offset: number; color: string }>;
    start: { x: number; y: number };
    end: { x: number; y: number };
  };
  locked?: boolean;
  visible?: boolean;
  zIndex?: number;
}

export interface CanvasState {
  zoom: number;
  pan: { x: number; y: number };
  grid: boolean;
  rulers: boolean;
  selectedIds: string[];
  clipboard: CanvasShape[];
}

export const useCanvasTools = () => {
  const [activeTool, setActiveTool] = useState<string>('select');
  const [canvasState, setCanvasState] = useState<CanvasState>({
    zoom: 1,
    pan: { x: 0, y: 0 },
    grid: false,
    rulers: false,
    selectedIds: [],
    clipboard: [],
  });
  const [shapes, setShapes] = useState<CanvasShape[]>([]);
  


  const initializeCollaboration = useCallback(() => {
    const ydoc = new Y.Doc();
    const provider = new WebsocketProvider('ws://localhost:1234', 'omnidesign-room', ydoc);
    const yShapes = ydoc.getArray('shapes');

    ydocRef.current = ydoc;
    providerRef.current = provider;

    const updateShapes = () => {
      const newShapes = yShapes.toArray() as CanvasShape[];
      setShapes(newShapes);
    };

    yShapes.observe(updateShapes);
    updateShapes();

    return () => {
      yShapes.unobserve(updateShapes);
      provider.destroy();
    };
  }, []);

  const addShape = useCallback((shape: Omit<CanvasShape, 'id'>) => {
    if (!ydocRef.current) return;

    const id = `shape-${Date.now()}-${Math.random()}`;
    const newShape: CanvasShape = { ...shape, id, zIndex: shapes.length };
    
    const yShapes = ydocRef.current.getArray('shapes');
    yShapes.push([newShape]);
  }, [shapes.length]);

  const updateShape = useCallback((id: string, updates: Partial<CanvasShape>) => {
    if (!ydocRef.current) return;

    const yShapes = ydocRef.current.getArray('shapes');
    const shapeIndex = shapes.findIndex(s => s.id === id);
    
    if (shapeIndex >= 0) {
      const updatedShape = { ...shapes[shapeIndex], ...updates };
      yShapes.delete(shapeIndex, 1);
      yShapes.insert(shapeIndex, [updatedShape]);
    }
  }, [shapes]);

  const deleteShape = useCallback((id: string) => {
    if (!ydocRef.current) return;

    const yShapes = ydocRef.current.getArray('shapes');
    const shapeIndex = shapes.findIndex(s => s.id === id);
    
    if (shapeIndex >= 0) {
      yShapes.delete(shapeIndex, 1);
      setCanvasState(prev => ({
        ...prev,
        selectedIds: prev.selectedIds.filter(sid => sid !== id),
      }));
    }
  }, [shapes]);

  const selectShape = useCallback((id: string, multi = false) => {
    setCanvasState(prev => ({
      ...prev,
      selectedIds: multi 
        ? prev.selectedIds.includes(id)
          ? prev.selectedIds.filter(sid => sid !== id)
          : [...prev.selectedIds, id]
        : [id],
    }));
  }, []);

  const clearSelection = useCallback(() => {
    setCanvasState(prev => ({ ...prev, selectedIds: [] }));
  }, []);

  const copyShapes = useCallback(() => {
    const selectedShapes = shapes.filter(s => canvasState.selectedIds.includes(s.id));
    setCanvasState(prev => ({ ...prev, clipboard: selectedShapes }));
  }, [shapes, canvasState.selectedIds]);

  const pasteShapes = useCallback(() => {
    if (canvasState.clipboard.length === 0) return;

    canvasState.clipboard.forEach(shape => {
      addShape({
        ...shape,
        x: shape.x + 20,
        y: shape.y + 20,
      });
    });
  }, [canvasState.clipboard, addShape]);

  const undo = useCallback(() => {
    // Simple undo - just clear last shape for now
    if (shapes.length > 0 && ydocRef.current) {
      const yShapes = ydocRef.current.getArray('shapes');
      yShapes.delete(yShapes.length - 1, 1);
    }
  }, [shapes.length]);

  const redo = useCallback(() => {
    // Simple redo - placeholder for now
    console.log('Redo functionality');
  }, []);

  const setZoom = useCallback((zoom: number) => {
    setCanvasState(prev => ({ ...prev, zoom: Math.max(0.1, Math.min(5, zoom)) }));
  }, []);

  const setPan = useCallback((pan: { x: number; y: number }) => {
    setCanvasState(prev => ({ ...prev, pan }));
  }, []);

  const toggleGrid = useCallback(() => {
    setCanvasState(prev => ({ ...prev, grid: !prev.grid }));
  }, []);

  const toggleRulers = useCallback(() => {
    setCanvasState(prev => ({ ...prev, rulers: !prev.rulers }));
  }, []);

  return {
    activeTool,
    setActiveTool,
    canvasState,
    shapes,
    initializeCollaboration,
    addShape,
    updateShape,
    deleteShape,
    selectShape,
    clearSelection,
    copyShapes,
    pasteShapes,
    undo,
    redo,
    setZoom,
    setPan,
    toggleGrid,
    toggleRulers,
  };
};