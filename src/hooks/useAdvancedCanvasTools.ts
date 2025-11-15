import { useState, useRef, useCallback } from 'react';

export interface AdvancedShape {
  id: string;
  type: 'rect' | 'circle' | 'polygon' | 'star' | 'arrow' | 'line' | 'path' | 'text' | 'image' | 'group';
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
  textAlign?: string;
  lineHeight?: number;
  letterSpacing?: number;
  fill: string;
  stroke?: string;
  strokeWidth?: number;
  borderRadius?: number;
  opacity?: number;
  rotation?: number;
  scaleX?: number;
  scaleY?: number;
  skewX?: number;
  skewY?: number;
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
  filters?: {
    blur?: number;
    brightness?: number;
    contrast?: number;
    saturation?: number;
  };
  animation?: {
    type: 'fade' | 'slide' | 'scale' | 'rotate';
    duration: number;
    delay: number;
    repeat: boolean;
  };
  locked?: boolean;
  visible?: boolean;
  zIndex?: number;
  groupId?: string;
  children?: string[];
}

export interface CanvasState {
  zoom: number;
  pan: { x: number; y: number };
  grid: boolean;
  rulers: boolean;
  snapToGrid: boolean;
  smartGuides: boolean;
  selectedIds: string[];
  clipboard: AdvancedShape[];
  groups: Array<{ id: string; name: string; children: string[] }>;
}

export const useAdvancedCanvasTools = () => {
  const [activeTool, setActiveTool] = useState<string>('select');
  const [canvasState, setCanvasState] = useState<CanvasState>({
    zoom: 1,
    pan: { x: 0, y: 0 },
    grid: false,
    rulers: false,
    snapToGrid: true,
    smartGuides: true,
    selectedIds: [],
    clipboard: [],
    groups: [],
  });
  const [shapes, setShapes] = useState<AdvancedShape[]>([]);
  const [history, setHistory] = useState<AdvancedShape[][]>([[]]);
  const [historyIndex, setHistoryIndex] = useState(0);
  


  const initializeCollaboration = useCallback(() => {
    // Disabled WebSocket collaboration to prevent connection errors
    return () => {};
  }, []);

  const saveToHistory = useCallback(() => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push([...shapes]);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [shapes, history, historyIndex]);

  const addShape = useCallback((shape: Omit<AdvancedShape, 'id'>) => {
    const id = `shape-${Date.now()}-${Math.random()}`;
    const newShape: AdvancedShape = { 
      ...shape, 
      id, 
      zIndex: shapes.length,
      visible: true,
      locked: false 
    };
    
    setShapes(prev => [...prev, newShape]);
    saveToHistory();
  }, [shapes.length, saveToHistory]);

  const updateShape = useCallback((id: string, updates: Partial<AdvancedShape>) => {
    setShapes(prev => prev.map(shape => 
      shape.id === id ? { ...shape, ...updates } : shape
    ));
    saveToHistory();
  }, [saveToHistory]);

  const deleteShape = useCallback((id: string) => {
    setShapes(prev => prev.filter(shape => shape.id !== id));
    setCanvasState(prev => ({
      ...prev,
      selectedIds: prev.selectedIds.filter(sid => sid !== id),
    }));
    saveToHistory();
  }, [saveToHistory]);

  const duplicateShape = useCallback((id: string) => {
    const shape = shapes.find(s => s.id === id);
    if (!shape) return;

    addShape({
      ...shape,
      x: shape.x + 20,
      y: shape.y + 20,
    });
  }, [shapes, addShape]);

  const groupShapes = useCallback((shapeIds: string[]) => {
    if (shapeIds.length < 2) return;

    const groupId = `group-${Date.now()}`;
    const group: AdvancedShape = {
      id: groupId,
      type: 'group',
      x: 0,
      y: 0,
      fill: 'transparent',
      children: shapeIds,
      visible: true,
      locked: false,
    };

    // Calculate group bounds
    const groupShapes = shapes.filter(s => shapeIds.includes(s.id));
    const bounds = {
      left: Math.min(...groupShapes.map(s => s.x)),
      top: Math.min(...groupShapes.map(s => s.y)),
      right: Math.max(...groupShapes.map(s => s.x + (s.width || 0))),
      bottom: Math.max(...groupShapes.map(s => s.y + (s.height || 0))),
    };

    group.x = bounds.left;
    group.y = bounds.top;
    group.width = bounds.right - bounds.left;
    group.height = bounds.bottom - bounds.top;

    addShape(group);
    
    // Update children to reference group
    shapeIds.forEach(id => {
      updateShape(id, { groupId });
    });

    setCanvasState(prev => ({
      ...prev,
      groups: [...prev.groups, { id: groupId, name: `Group ${prev.groups.length + 1}`, children: shapeIds }],
      selectedIds: [groupId],
    }));
  }, [shapes, addShape, updateShape]);

  const ungroupShapes = useCallback((groupId: string) => {
    const group = shapes.find(s => s.id === groupId);
    if (!group || group.type !== 'group') return;

    // Remove group reference from children
    group.children?.forEach(id => {
      updateShape(id, { groupId: undefined });
    });

    deleteShape(groupId);
    
    setCanvasState(prev => ({
      ...prev,
      groups: prev.groups.filter(g => g.id !== groupId),
      selectedIds: group.children || [],
    }));
  }, [shapes, updateShape, deleteShape]);

  const alignShapes = useCallback((alignment: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') => {
    const selectedShapes = shapes.filter(s => canvasState.selectedIds.includes(s.id));
    if (selectedShapes.length < 2) return;

    const bounds = {
      left: Math.min(...selectedShapes.map(s => s.x)),
      top: Math.min(...selectedShapes.map(s => s.y)),
      right: Math.max(...selectedShapes.map(s => s.x + (s.width || 0))),
      bottom: Math.max(...selectedShapes.map(s => s.y + (s.height || 0))),
    };

    selectedShapes.forEach(shape => {
      let updates: Partial<AdvancedShape> = {};

      switch (alignment) {
        case 'left':
          updates.x = bounds.left;
          break;
        case 'center':
          updates.x = bounds.left + (bounds.right - bounds.left) / 2 - (shape.width || 0) / 2;
          break;
        case 'right':
          updates.x = bounds.right - (shape.width || 0);
          break;
        case 'top':
          updates.y = bounds.top;
          break;
        case 'middle':
          updates.y = bounds.top + (bounds.bottom - bounds.top) / 2 - (shape.height || 0) / 2;
          break;
        case 'bottom':
          updates.y = bounds.bottom - (shape.height || 0);
          break;
      }

      updateShape(shape.id, updates);
    });
  }, [shapes, canvasState.selectedIds, updateShape]);

  const distributeShapes = useCallback((direction: 'horizontal' | 'vertical') => {
    const selectedShapes = shapes.filter(s => canvasState.selectedIds.includes(s.id));
    if (selectedShapes.length < 3) return;

    selectedShapes.sort((a, b) => direction === 'horizontal' ? a.x - b.x : a.y - b.y);

    const first = selectedShapes[0];
    const last = selectedShapes[selectedShapes.length - 1];
    const totalSpace = direction === 'horizontal' 
      ? (last.x + (last.width || 0)) - first.x
      : (last.y + (last.height || 0)) - first.y;

    const spacing = totalSpace / (selectedShapes.length - 1);

    selectedShapes.forEach((shape, index) => {
      if (index === 0 || index === selectedShapes.length - 1) return;

      const updates: Partial<AdvancedShape> = {};
      if (direction === 'horizontal') {
        updates.x = first.x + spacing * index;
      } else {
        updates.y = first.y + spacing * index;
      }

      updateShape(shape.id, updates);
    });
  }, [shapes, canvasState.selectedIds, updateShape]);

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
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      const previousState = history[newIndex];
      setShapes(previousState);
      setHistoryIndex(newIndex);
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      const nextState = history[newIndex];
      setShapes(nextState);
      setHistoryIndex(newIndex);
    }
  }, [history, historyIndex]);

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

  const toggleSnapToGrid = useCallback(() => {
    setCanvasState(prev => ({ ...prev, snapToGrid: !prev.snapToGrid }));
  }, []);

  const toggleSmartGuides = useCallback(() => {
    setCanvasState(prev => ({ ...prev, smartGuides: !prev.smartGuides }));
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
    duplicateShape,
    groupShapes,
    ungroupShapes,
    alignShapes,
    distributeShapes,
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
    toggleSnapToGrid,
    toggleSmartGuides,
  };
};