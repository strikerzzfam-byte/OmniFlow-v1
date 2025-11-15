import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { useCanvasTools } from '@/hooks/useCanvasTools';

// Components
import ToolsPanel from '@/components/design/ToolsPanel';
import PropertiesBar from '@/components/design/PropertiesBar';
import WorkingCanvasBoard from '@/components/design/WorkingCanvasBoard';
import LayerPanel from '@/components/design/LayerPanel';
import EffectsPanel from '@/components/design/EffectsPanel';
import ExportPanel from '@/components/design/ExportPanel';

// Enhanced TopBar
import { Button } from '@/components/ui/button';
import { 
  Undo, Redo, Download, Upload, Copy, ClipboardPaste, ZoomIn, ZoomOut,
  Grid3X3, Ruler, Layers, Sparkles, Settings, Users, Wifi, WifiOff
} from 'lucide-react';

const EnhancedOmniDesign = () => {
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(false);
  const [connectedUsers, setConnectedUsers] = useState(1);
  const [showLayersPanel, setShowLayersPanel] = useState(true);
  const [showEffectsPanel, setShowEffectsPanel] = useState(false);
  const [showExportPanel, setShowExportPanel] = useState(false);

  const {
    activeTool,
    setActiveTool,
    canvasState,
    shapes,
    initializeCollaboration,
    updateShape,
    deleteShape,
    copyShapes,
    pasteShapes,
    undo,
    redo,
    setZoom,
    toggleGrid,
    toggleRulers,
    selectShape,
    clearSelection,
  } = useCanvasTools();

  useEffect(() => {
    const cleanup = initializeCollaboration();
    
    // Simulate connection status
    setIsConnected(true);
    setConnectedUsers(Math.floor(Math.random() * 5) + 1);
    
    return cleanup;
  }, [initializeCollaboration]);

  const selectedShapes = shapes.filter(s => canvasState.selectedIds.includes(s.id));

  const handleExport = (options: any) => {
    // Implementation would handle actual export
    toast({
      title: "Export completed",
      description: `Design exported as ${options.format.toUpperCase()}`,
    });
    setShowExportPanel(false);
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
          // Select all shapes
          shapes.forEach(shape => selectShape(shape.id, true));
          break;
        case 'Delete':
        case 'Backspace':
          e.preventDefault();
          selectedShapes.forEach(shape => deleteShape(shape.id));
          break;
      }
    }
  }, [selectedShapes, shapes, redo, undo, copyShapes, pasteShapes, selectShape, deleteShape]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedShapes, shapes]);

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-background via-background/95 to-background/90 overflow-hidden">
      {/* Enhanced Top Bar */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="h-16 glass border-b border-glass-border/50 flex items-center justify-between px-6 relative z-50"
      >
        {/* Left - Branding */}
        <div className="flex items-center space-x-4">
          <motion.h1 
            className="text-xl font-bold bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent"
            whileHover={{ scale: 1.05 }}
          >
            OmniDesign
          </motion.h1>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <span>ArcNex Studio</span>
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
            <Button variant="ghost" size="sm" onClick={copyShapes} title="Copy (Ctrl+C)">
              <Copy className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={pasteShapes} title="Paste (Ctrl+V)">
              <ClipboardPaste className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex items-center space-x-1 bg-muted/30 rounded-lg p-1">
            <Button 
              variant={canvasState.grid ? "default" : "ghost"} 
              size="sm" 
              onClick={toggleGrid} 
              title="Toggle Grid"
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button 
              variant={canvasState.rulers ? "default" : "ghost"} 
              size="sm" 
              onClick={toggleRulers} 
              title="Toggle Rulers"
            >
              <Ruler className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex items-center space-x-1 bg-muted/30 rounded-lg p-1">
            <Button 
              variant={showLayersPanel ? "default" : "ghost"} 
              size="sm" 
              onClick={() => setShowLayersPanel(!showLayersPanel)} 
              title="Layers Panel"
            >
              <Layers className="w-4 h-4" />
            </Button>
            <Button 
              variant={showEffectsPanel ? "default" : "ghost"} 
              size="sm" 
              onClick={() => setShowEffectsPanel(!showEffectsPanel)} 
              title="Effects Panel"
            >
              <Sparkles className="w-4 h-4" />
            </Button>
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowExportPanel(true)} 
            className="bg-primary/10 border-primary/30 hover:bg-primary/20"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>

        {/* Right - Status */}
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
            <span className="text-sm text-muted-foreground">
              {isConnected ? 'Connected' : 'Offline'}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">
              {connectedUsers} user{connectedUsers !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Properties Bar */}
      <PropertiesBar
        selectedShapes={selectedShapes}
        onShapeUpdate={updateShape}
        onCopy={copyShapes}
        onDelete={() => selectedShapes.forEach(shape => deleteShape(shape.id))}
      />

      {/* Main Content */}
      <div className="flex-1 flex relative">
        {/* Left Tools Panel */}
        <ToolsPanel
          activeTool={activeTool}
          onToolSelect={setActiveTool}
        />

        {/* Left Layers Panel */}
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
                copyShapes();
              }}
              onClose={() => setShowLayersPanel(false)}
            />
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
            <WorkingCanvasBoard activeTool={activeTool} />
          </motion.div>
        </div>

        {/* Right Effects Panel */}
        <AnimatePresence>
          {showEffectsPanel && (
            <EffectsPanel
              selectedShapes={selectedShapes}
              onShapeUpdate={updateShape}
              onClose={() => setShowEffectsPanel(false)}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Export Panel */}
      <AnimatePresence>
        {showExportPanel && (
          <ExportPanel
            onClose={() => setShowExportPanel(false)}
            onExport={handleExport}
          />
        )}
      </AnimatePresence>

      {/* Floating Action Hints */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="fixed bottom-4 left-4 glass rounded-lg p-3 text-xs text-muted-foreground max-w-xs"
      >
        <p className="font-medium mb-1">Quick Tips:</p>
        <p>• Hold Shift to multi-select</p>
        <p>• Ctrl+Z/Y for undo/redo</p>
        <p>• Ctrl+C/V to copy/paste</p>
        <p>• Mouse wheel to zoom</p>
      </motion.div>
    </div>
  );
};

export default EnhancedOmniDesign;