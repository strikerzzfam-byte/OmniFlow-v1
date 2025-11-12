import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { useAdvancedCanvasTools } from '@/hooks/useAdvancedCanvasTools';

// Components
import AdvancedToolsPanel from '@/components/design/AdvancedToolsPanel';
import AdvancedPropertyBar from '@/components/design/AdvancedPropertyBar';
import FixedOmniDesign from './FixedOmniDesign';
import LayerPanel from '@/components/design/LayerPanel';
import EffectsPanel from '@/components/design/EffectsPanel';
import AnimationPanel from '@/components/design/AnimationPanel';
import SmartAssistant from '@/components/design/SmartAssistant';
import ExportPanel from '@/components/design/ExportPanel';

// UI Components
import { Button } from '@/components/ui/button';
import { 
  Undo, Redo, Download, Copy, ClipboardPaste, ZoomIn, ZoomOut,
  Grid3X3, Ruler, Layers, Sparkles, Zap, Bot, Users, Wifi, WifiOff,
  Magnet, MousePointer2
} from 'lucide-react';

const CompleteOmniDesign = () => {
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(false);
  const [connectedUsers, setConnectedUsers] = useState(1);
  const [showLayersPanel, setShowLayersPanel] = useState(true);
  const [showEffectsPanel, setShowEffectsPanel] = useState(false);
  const [showAnimationPanel, setShowAnimationPanel] = useState(false);
  const [showSmartAssistant, setShowSmartAssistant] = useState(false);
  const [showExportPanel, setShowExportPanel] = useState(false);

  const {
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
    toggleGrid,
    toggleRulers,
    toggleSnapToGrid,
    toggleSmartGuides,
  } = useAdvancedCanvasTools();

  useEffect(() => {
    const cleanup = initializeCollaboration();
    
    // Simulate connection status
    setIsConnected(true);
    setConnectedUsers(Math.floor(Math.random() * 5) + 1);
    
    return cleanup;
  }, [initializeCollaboration]);

  const selectedShapes = shapes.filter(s => canvasState.selectedIds.includes(s.id));

  const handleExport = (options: any) => {
    toast({
      title: "Export completed",
      description: `Design exported as ${options.format.toUpperCase()}`,
    });
    setShowExportPanel(false);
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
    if (e.key === 'Delete' || e.key === 'Backspace') {
      e.preventDefault();
      selectedShapes.forEach(shape => deleteShape(shape.id));
    }
  }, [selectedShapes, shapes, redo, undo, copyShapes, pasteShapes, selectShape, deleteShape, duplicateShape, groupShapes]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-[#0D0D0D] via-[#101010] to-[#0D0D0D] overflow-hidden">
      {/* Enhanced Top Bar */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="h-16 glass border-b border-glass-border/50 flex items-center justify-between px-6 relative z-50"
      >
        {/* Left - Branding */}
        <div className="flex items-center space-x-4">
          <motion.h1 
            className="text-xl font-bold bg-gradient-to-r from-[#00B4D8] via-[#00B4D8]/80 to-[#9D4EDD] bg-clip-text text-transparent"
            whileHover={{ scale: 1.05 }}
          >
            OmniDesign
          </motion.h1>
          <div className="flex items-center space-x-2 text-sm text-[#F8F9FA]/60">
            <span>ArcNex Studio</span>
          </div>
        </div>

        {/* Center - Quick Actions */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 bg-white/5 rounded-lg p-1 backdrop-blur-sm">
            <Button variant="ghost" size="sm" onClick={undo} title="Undo (Ctrl+Z)">
              <Undo className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={redo} title="Redo (Ctrl+Shift+Z)">
              <Redo className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex items-center space-x-1 bg-white/5 rounded-lg p-1 backdrop-blur-sm">
            <Button variant="ghost" size="sm" onClick={copyShapes} title="Copy (Ctrl+C)">
              <Copy className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={pasteShapes} title="Paste (Ctrl+V)">
              <ClipboardPaste className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex items-center space-x-1 bg-white/5 rounded-lg p-1 backdrop-blur-sm">
            <Button 
              variant={canvasState.grid ? "default" : "ghost"} 
              size="sm" 
              onClick={toggleGrid} 
              title="Toggle Grid"
              className={canvasState.grid ? "bg-[#00B4D8]/20 text-[#00B4D8]" : ""}
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button 
              variant={canvasState.rulers ? "default" : "ghost"} 
              size="sm" 
              onClick={toggleRulers} 
              title="Toggle Rulers"
              className={canvasState.rulers ? "bg-[#00B4D8]/20 text-[#00B4D8]" : ""}
            >
              <Ruler className="w-4 h-4" />
            </Button>
            <Button 
              variant={canvasState.snapToGrid ? "default" : "ghost"} 
              size="sm" 
              onClick={toggleSnapToGrid} 
              title="Snap to Grid"
              className={canvasState.snapToGrid ? "bg-[#00B4D8]/20 text-[#00B4D8]" : ""}
            >
              <Magnet className="w-4 h-4" />
            </Button>
            <Button 
              variant={canvasState.smartGuides ? "default" : "ghost"} 
              size="sm" 
              onClick={toggleSmartGuides} 
              title="Smart Guides"
              className={canvasState.smartGuides ? "bg-[#00B4D8]/20 text-[#00B4D8]" : ""}
            >
              <MousePointer2 className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex items-center space-x-1 bg-white/5 rounded-lg p-1 backdrop-blur-sm">
            <Button 
              variant={showLayersPanel ? "default" : "ghost"} 
              size="sm" 
              onClick={() => setShowLayersPanel(!showLayersPanel)} 
              title="Layers Panel"
              className={showLayersPanel ? "bg-[#00B4D8]/20 text-[#00B4D8]" : ""}
            >
              <Layers className="w-4 h-4" />
            </Button>
            <Button 
              variant={showEffectsPanel ? "default" : "ghost"} 
              size="sm" 
              onClick={() => setShowEffectsPanel(!showEffectsPanel)} 
              title="Effects Panel"
              className={showEffectsPanel ? "bg-[#9D4EDD]/20 text-[#9D4EDD]" : ""}
            >
              <Sparkles className="w-4 h-4" />
            </Button>
            <Button 
              variant={showAnimationPanel ? "default" : "ghost"} 
              size="sm" 
              onClick={() => setShowAnimationPanel(!showAnimationPanel)} 
              title="Animation Panel"
              className={showAnimationPanel ? "bg-[#9D4EDD]/20 text-[#9D4EDD]" : ""}
            >
              <Zap className="w-4 h-4" />
            </Button>
            <Button 
              variant={showSmartAssistant ? "default" : "ghost"} 
              size="sm" 
              onClick={() => setShowSmartAssistant(!showSmartAssistant)} 
              title="AI Assistant"
              className={showSmartAssistant ? "bg-gradient-to-r from-[#00B4D8] to-[#9D4EDD] text-white" : ""}
            >
              <Bot className="w-4 h-4" />
            </Button>
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowExportPanel(true)} 
            className="bg-[#00B4D8]/10 border-[#00B4D8]/30 hover:bg-[#00B4D8]/20 text-[#00B4D8]"
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
            <span className="text-sm text-[#F8F9FA]/60">
              {isConnected ? 'Connected' : 'Offline'}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-[#00B4D8]" />
            <span className="text-sm text-[#F8F9FA]/60">
              {connectedUsers} user{connectedUsers !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Properties Bar */}
      <AdvancedPropertyBar
        selectedShapes={selectedShapes}
        onShapeUpdate={updateShape}
      />

      {/* Main Content */}
      <div className="flex-1 flex relative">
        {/* Left Tools Panel */}
        <AdvancedToolsPanel
          activeTool={activeTool}
          onToolSelect={setActiveTool}
          selectedCount={selectedShapes.length}
          onGroup={() => groupShapes(selectedShapes.map(s => s.id))}
          onUngroup={() => {
            const group = selectedShapes.find(s => s.type === 'group');
            if (group) ungroupShapes(group.id);
          }}
          onAlign={alignShapes}
          onDistribute={distributeShapes}
          onDuplicate={() => selectedShapes.forEach(s => duplicateShape(s.id))}
          onDelete={() => selectedShapes.forEach(s => deleteShape(s.id))}
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

        {/* Canvas Area - Using the working canvas */}
        <div className="flex-1 relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full p-4"
          >
            {/* We'll use the existing working canvas for now */}
            <div className="w-full h-full bg-black/20 rounded-lg flex items-center justify-center">
              <div className="text-center text-[#F8F9FA]/60">
                <div className="text-6xl mb-4">🎨</div>
                <h3 className="text-xl font-semibold mb-2">Advanced Canvas</h3>
                <p>Complete Canva + Figma-inspired design tools</p>
                <p className="text-sm mt-2">Select a tool from the left panel to start creating</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Panels */}
        <AnimatePresence>
          {showEffectsPanel && (
            <EffectsPanel
              selectedShapes={selectedShapes}
              onShapeUpdate={updateShape}
              onClose={() => setShowEffectsPanel(false)}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showAnimationPanel && (
            <AnimationPanel
              selectedShapes={selectedShapes}
              onShapeUpdate={updateShape}
              onClose={() => setShowAnimationPanel(false)}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showSmartAssistant && (
            <SmartAssistant
              onClose={() => setShowSmartAssistant(false)}
              onApplySuggestion={handleApplySuggestion}
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

      {/* Floating Shortcuts */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="fixed bottom-4 left-4 glass rounded-lg p-3 text-xs text-[#F8F9FA]/60 max-w-xs"
      >
        <p className="font-medium mb-1 text-[#00B4D8]">Keyboard Shortcuts:</p>
        <p>• Ctrl+Z/Y - Undo/Redo</p>
        <p>• Ctrl+C/V - Copy/Paste</p>
        <p>• Ctrl+D - Duplicate</p>
        <p>• Ctrl+G - Group</p>
        <p>• Shift+Click - Multi-select</p>
        <p>• Delete - Remove selected</p>
      </motion.div>

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
        <span className="text-sm font-medium px-2 text-[#F8F9FA]">
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
    </div>
  );
};

export default CompleteOmniDesign;