import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useCanvasTools } from '@/hooks/useCanvasTools';

// Components
import ToolsPanel from '@/components/design/ToolsPanel';
import PropertyBar from '@/components/design/PropertyBar';
import CanvasBoard from '@/components/design/CanvasBoard';
import LayerPanel from '@/components/design/LayerPanel';
import SmartAssistant from '@/components/design/SmartAssistant';

// UI Components
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, Download, Undo, Redo, ZoomIn, ZoomOut, 
  Grid3X3, Ruler, Layers, Bot, Save, Share2, 
  Users, Wifi, WifiOff
} from 'lucide-react';

const OmniDesign: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showLayersPanel, setShowLayersPanel] = useState(true);
  const [showSmartAssistant, setShowSmartAssistant] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const [connectedUsers, setConnectedUsers] = useState(1);

  const {
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
    toggleRulers
  } = useCanvasTools();

  const selectedShapes = shapes.filter(s => canvasState.selectedIds.includes(s.id));

  const handleExport = () => {
    toast({
      title: "Export Started",
      description: "Your design is being exported...",
    });
  };

  const handleSave = () => {
    toast({
      title: "Design Saved",
      description: "Your design has been saved successfully.",
    });
  };

  const handleShare = () => {
    toast({
      title: "Share Link Created",
      description: "Design link copied to clipboard.",
    });
  };

  const handleApplySuggestion = (suggestion: any) => {
    toast({
      title: "AI Suggestion Applied",
      description: `Applied ${suggestion.title} to your design`,
    });
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'z':
          e.preventDefault();
          if (e.shiftKey) {
            redo();
          } else {
            undo();
          }
          break;
        case 's':
          e.preventDefault();
          handleSave();
          break;
        case 'a':
          e.preventDefault();
          shapes.forEach(shape => selectShape(shape.id, true));
          break;
        case 'd':
          e.preventDefault();
          selectedShapes.forEach(shape => duplicateShape(shape.id));
          break;
        case 'g':
          e.preventDefault();
          if (selectedShapes.length > 1) {
            groupShapes(selectedShapes.map(s => s.id));
          }
          break;
      }
    }
    
    // Tool shortcuts
    switch (e.key) {
      case 'v':
        setActiveTool('select');
        break;
      case 'r':
        setActiveTool('rect');
        break;
      case 'o':
        setActiveTool('circle');
        break;
      case 't':
        setActiveTool('text');
        break;
      case 'l':
        setActiveTool('line');
        break;
      case 'Delete':
      case 'Backspace':
        e.preventDefault();
        selectedShapes.forEach(shape => deleteShape(shape.id));
        break;
    }
  }, [selectedShapes, shapes, redo, undo, selectShape, deleteShape, duplicateShape, groupShapes, setActiveTool]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-background via-background/95 to-background/90 overflow-hidden">
      {/* Top Bar */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="h-16 glass border-b border-glass-border/50 flex items-center justify-between px-6 relative z-50"
      >
        {/* Left - Navigation & Branding */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/dashboard')}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <motion.div
            whileHover={{ scale: 1.05 }}
          >
            <img src="/omniflow-brand-logo.svg" alt="OmniFlow" className="h-8 w-auto" />
          </motion.div>
          <div className="text-sm text-muted-foreground">
            Untitled Design
          </div>
        </div>

        {/* Center - Quick Actions */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 bg-muted/30 rounded-lg p-1">
            <Button variant="ghost" size="sm" onClick={undo} title="Undo (Ctrl+Z)">
              <Undo className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={redo} title="Redo (Ctrl+Shift+Z)">
              <Redo className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex items-center space-x-1 bg-muted/30 rounded-lg p-1">
            <Button 
              variant={canvasState.grid ? "default" : "ghost"} 
              size="sm" 
              onClick={toggleGrid}
              className={canvasState.grid ? "bg-primary/20 text-primary" : ""}
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button 
              variant={canvasState.rulers ? "default" : "ghost"} 
              size="sm" 
              onClick={toggleRulers}
              className={canvasState.rulers ? "bg-primary/20 text-primary" : ""}
            >
              <Ruler className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex items-center space-x-1 bg-muted/30 rounded-lg p-1">
            <Button 
              variant={showLayersPanel ? "default" : "ghost"} 
              size="sm" 
              onClick={() => setShowLayersPanel(!showLayersPanel)}
              className={showLayersPanel ? "bg-primary/20 text-primary" : ""}
            >
              <Layers className="w-4 h-4" />
            </Button>
            <Button 
              variant={showSmartAssistant ? "default" : "ghost"} 
              size="sm" 
              onClick={() => setShowSmartAssistant(!showSmartAssistant)}
              className={showSmartAssistant ? "bg-gradient-to-r from-primary to-secondary text-white" : ""}
            >
              <Bot className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Right - Actions & Status */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <motion.div
              animate={{ scale: isConnected ? [1, 1.2, 1] : 1 }}
              transition={{ duration: 2, repeat: isConnected ? Infinity : 0 }}
            >
              {isConnected ? (
                <Wifi className="w-4 h-4 text-green-400" />
              ) : (
                <WifiOff className="w-4 h-4 text-red-400" />
              )}
            </motion.div>
            <Users className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">{connectedUsers}</span>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button variant="ghost" size="sm" onClick={handleShare}>
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleExport}
              className="bg-primary/10 border-primary/30 hover:bg-primary/20 text-primary"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Property Bar */}
      <PropertyBar
        selectedShapes={selectedShapes}
        onShapeUpdate={updateShape}
      />

      {/* Main Content */}
      <div className="flex-1 flex relative">
        {/* Left Tools Panel */}
        <ToolsPanel
          activeTool={activeTool}
          onToolSelect={setActiveTool}
          selectedCount={selectedShapes.length}
          onGroup={() => groupShapes(selectedShapes.map(s => s.id))}
          onUngroup={() => {}}
          onAlign={(type) => {}}
          onDuplicate={() => selectedShapes.forEach(s => duplicateShape(s.id))}
          onDelete={() => selectedShapes.forEach(s => deleteShape(s.id))}
        />

        {/* Layers Panel */}
        <AnimatePresence>
          {showLayersPanel && (
            <LayerPanel
              shapes={shapes}
              selectedIds={canvasState.selectedIds}
              onShapeSelect={selectShape}
              onShapeUpdate={updateShape}
              onShapeDelete={deleteShape}
              onShapeCopy={(id) => {
                selectShape(id);
                duplicateShape(id);
              }}
              onClose={() => setShowLayersPanel(false)}
            />
          )}
        </AnimatePresence>

        {/* Canvas */}
        <CanvasBoard
          shapes={shapes}
          canvasState={canvasState}
          activeTool={activeTool}
          onShapeSelect={selectShape}
          onShapeUpdate={updateShape}
          onAddShape={addShape}
          onClearSelection={clearSelection}
        />

        {/* Smart Assistant */}
        <AnimatePresence>
          {showSmartAssistant && (
            <SmartAssistant
              onClose={() => setShowSmartAssistant(false)}
              onApplySuggestion={handleApplySuggestion}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Zoom Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed bottom-4 right-4 flex items-center gap-2 glass rounded-lg p-2"
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setZoom(canvasState.zoom * 0.8)}
          className="w-8 h-8 p-0"
        >
          <ZoomOut className="w-4 h-4" />
        </Button>
        <span className="text-sm font-medium px-2 text-foreground">
          {Math.round(canvasState.zoom * 100)}%
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setZoom(canvasState.zoom * 1.2)}
          className="w-8 h-8 p-0"
        >
          <ZoomIn className="w-4 h-4" />
        </Button>
      </motion.div>

      {/* Keyboard Shortcuts Help */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.3 }}
        className="fixed bottom-4 left-4 glass rounded-lg p-3 text-xs text-muted-foreground max-w-xs"
      >
        <p className="font-medium mb-1 text-primary">Shortcuts:</p>
        <p>V - Select • R - Rectangle • O - Circle • T - Text</p>
        <p>Ctrl+Z/Y - Undo/Redo • Ctrl+D - Duplicate • Ctrl+G - Group</p>
      </motion.div>
    </div>
  );
};

export default OmniDesign;