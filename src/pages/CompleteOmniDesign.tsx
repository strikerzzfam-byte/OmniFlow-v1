import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { useAdvancedCanvasTools } from '@/hooks/useAdvancedCanvasTools';

// Components
import AdvancedToolsPanel from '@/components/design/AdvancedToolsPanel';
import AdvancedPropertyBar from '@/components/design/AdvancedPropertyBar';
import TextEditor from '@/components/design/TextEditor';
import TextPanel from '@/components/design/TextPanel';

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
  const [editingTextId, setEditingTextId] = useState<string | null>(null);
  const [showTextEditor, setShowTextEditor] = useState(false);
  const [selectedTextShape, setSelectedTextShape] = useState<any>(null);
  const [showTextPanel, setShowTextPanel] = useState(false);


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
          onToolSelect={(tool) => {
            setActiveTool(tool);
            setShowTextPanel(tool === 'text');
          }}
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

        {/* Text Panel */}
        <AnimatePresence>
          {showTextPanel && (
            <TextPanel
              onAddText={(textType) => {
                const textStyles = {
                  heading: { text: 'Add a heading', fontSize: 48, fontWeight: 'bold' },
                  subheading: { text: 'Add a subheading', fontSize: 32, fontWeight: '600' },
                  body: { text: 'Add a little bit of body text', fontSize: 16, fontWeight: 'normal' }
                };
                const style = textStyles[textType] || textStyles.heading;
                
                const textId = `text-${Date.now()}-${Math.random()}`;
                const newShape = {
                  id: textId,
                  type: 'text',
                  x: 400,
                  y: 300,
                  width: 300,
                  height: 60,
                  fill: '#FFFFFF',
                  text: style.text,
                  fontSize: style.fontSize,
                  fontWeight: style.fontWeight,
                  fontFamily: 'Inter',
                  textAlign: 'center',
                  lineHeight: 1.2,
                  letterSpacing: 0
                };
                addShape(newShape);
              }}
              onClose={() => setShowTextPanel(false)}
            />
          )}
        </AnimatePresence>

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
        <div className="flex-1 relative overflow-hidden">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full relative"
            style={{
              transform: `scale(${canvasState.zoom}) translate(${canvasState.pan.x}px, ${canvasState.pan.y}px)`,
              transformOrigin: 'center center'
            }}
          >
            {/* Grid */}
            {canvasState.grid && (
              <div 
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: `
                    linear-gradient(to right, #333 1px, transparent 1px),
                    linear-gradient(to bottom, #333 1px, transparent 1px)
                  `,
                  backgroundSize: '20px 20px'
                }}
              />
            )}
            
            {/* Canvas Background */}
            <div className={`w-full h-full bg-[#1a1a1a] relative ${
              activeTool === 'text' ? 'cursor-text' : 
              activeTool === 'select' ? 'cursor-default' : 'cursor-crosshair'
            }`}>

              {/* Render Shapes */}
              {shapes.map((shape) => (
                <div
                  key={shape.id}
                  className={`absolute cursor-pointer transition-all ${
                    canvasState.selectedIds.includes(shape.id) 
                      ? 'ring-2 ring-primary/50' 
                      : ''
                  }`}
                  style={{
                    left: shape.x,
                    top: shape.y,
                    width: shape.width || 100,
                    height: shape.height || 100,
                    transform: `rotate(${shape.rotation || 0}deg)`,
                    opacity: shape.opacity || 1,
                    zIndex: shape.zIndex || 0,
                    display: shape.visible === false ? 'none' : 'block'
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    selectShape(shape.id, e.shiftKey);
                  }}
                >
                  {shape.type === 'rect' && (
                    <div
                      className="w-full h-full"
                      style={{
                        backgroundColor: shape.fill,
                        border: shape.stroke ? `${shape.strokeWidth || 1}px solid ${shape.stroke}` : 'none',
                        borderRadius: shape.borderRadius || 0
                      }}
                    />
                  )}
                  {shape.type === 'circle' && (
                    <div
                      className="w-full h-full rounded-full"
                      style={{
                        backgroundColor: shape.fill,
                        border: shape.stroke ? `${shape.strokeWidth || 1}px solid ${shape.stroke}` : 'none'
                      }}
                    />
                  )}
                  {shape.type === 'polygon' && (
                    <svg className="w-full h-full">
                      <polygon
                        points={shape.points?.join(' ') || '40,0 80,30 65,80 15,80 0,30'}
                        fill={shape.fill}
                        stroke={shape.stroke}
                        strokeWidth={shape.strokeWidth || 0}
                      />
                    </svg>
                  )}
                  {shape.type === 'star' && (
                    <svg className="w-full h-full">
                      <polygon
                        points={shape.points?.join(' ') || '40,0 50,25 80,25 60,45 70,80 40,60 10,80 20,45 0,25 30,25'}
                        fill={shape.fill}
                        stroke={shape.stroke}
                        strokeWidth={shape.strokeWidth || 0}
                      />
                    </svg>
                  )}
                  {shape.type === 'arrow' && (
                    <svg className="w-full h-full">
                      <polygon
                        points={shape.points?.join(' ') || '0,15 70,15 70,5 100,15 70,25 70,15'}
                        fill={shape.fill}
                        stroke={shape.stroke}
                        strokeWidth={shape.strokeWidth || 0}
                      />
                    </svg>
                  )}
                  {shape.type === 'line' && (
                    <div
                      className="w-full"
                      style={{
                        height: shape.strokeWidth || 2,
                        backgroundColor: shape.fill,
                        marginTop: '50%'
                      }}
                    />
                  )}
                  {shape.type === 'text' && (
                    <div className="w-full h-full flex items-center justify-center p-2">
                      {editingTextId === shape.id ? (
                        <textarea
                          value={shape.text || ''}
                          onChange={(e) => updateShape(shape.id, { text: e.target.value })}
                          onBlur={() => setEditingTextId(null)}
                          onKeyDown={(e) => {
                            if (e.key === 'Escape') setEditingTextId(null);
                          }}
                          className="w-full h-full bg-transparent border-2 border-blue-400 outline-none resize-none p-1"
                          style={{
                            fontSize: shape.fontSize || 16,
                            color: shape.fill || '#FFFFFF',
                            fontWeight: shape.fontWeight || 'normal',
                            fontFamily: shape.fontFamily || 'Inter',
                            textAlign: shape.textAlign || 'center',
                            lineHeight: shape.lineHeight || 1.2
                          }}
                          autoFocus
                        />
                      ) : (
                        <div
                          className="w-full h-full flex items-center justify-center cursor-text"
                          style={{
                            fontSize: shape.fontSize || 16,
                            color: shape.fill || '#FFFFFF',
                            fontWeight: shape.fontWeight || 'normal',
                            fontFamily: shape.fontFamily || 'Inter',
                            textAlign: 'center'
                          }}
                          onDoubleClick={(e) => {
                            e.stopPropagation();
                            setEditingTextId(shape.id);
                          }}
                        >
                          {shape.text || 'Click to edit'}
                        </div>
                      )}
                    </div>
                  )}

                </div>
              ))}
              
              {/* Click to add shapes */}
              <div
                className={`absolute inset-0 ${
                  activeTool === 'text' ? 'cursor-text' : 
                  activeTool === 'select' ? 'cursor-default' : 'cursor-crosshair'
                }`}

                onClick={(e) => {
                  if (activeTool === 'pen') return;
                  
                  if (activeTool === 'select') {
                    clearSelection();
                    return;
                  }
                  
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const y = e.clientY - rect.top;
                  
                  if (activeTool === 'rect') {
                    addShape({
                      type: 'rect',
                      x: x - 50,
                      y: y - 25,
                      width: 100,
                      height: 50,
                      fill: '#00B4D8',
                      borderRadius: 4
                    });
                  } else if (activeTool === 'circle') {
                    addShape({
                      type: 'circle',
                      x: x - 40,
                      y: y - 40,
                      width: 80,
                      height: 80,
                      fill: '#9D4EDD'
                    });
                  } else if (activeTool === 'polygon') {
                    addShape({
                      type: 'polygon',
                      x: x - 40,
                      y: y - 40,
                      width: 80,
                      height: 80,
                      fill: '#00B4D8',
                      points: [40, 0, 80, 30, 65, 80, 15, 80, 0, 30]
                    });
                  } else if (activeTool === 'star') {
                    addShape({
                      type: 'star',
                      x: x - 40,
                      y: y - 40,
                      width: 80,
                      height: 80,
                      fill: '#FFD60A',
                      points: [40, 0, 50, 25, 80, 25, 60, 45, 70, 80, 40, 60, 10, 80, 20, 45, 0, 25, 30, 25]
                    });
                  } else if (activeTool === 'arrow') {
                    addShape({
                      type: 'arrow',
                      x: x - 50,
                      y: y - 15,
                      width: 100,
                      height: 30,
                      fill: '#00B4D8',
                      points: [0, 15, 70, 15, 70, 5, 100, 15, 70, 25, 70, 15]
                    });
                  } else if (activeTool === 'line') {
                    addShape({
                      type: 'line',
                      x: x - 50,
                      y: y,
                      width: 100,
                      height: 2,
                      fill: '#F8F9FA',
                      stroke: '#F8F9FA',
                      strokeWidth: 2
                    });
                  } else if (activeTool === 'text') {
                    const textId = `text-${Date.now()}-${Math.random()}`;
                    const newShape = {
                      id: textId,
                      type: 'text',
                      x: x - 75,
                      y: y - 15,
                      width: 200,
                      height: 40,
                      fill: '#FFFFFF',
                      text: 'Add a heading',
                      fontSize: 32,
                      fontWeight: 'bold',
                      fontFamily: 'Inter',
                      textAlign: 'center',
                      lineHeight: 1.2,
                      letterSpacing: 0
                    };
                    addShape(newShape);
                    setTimeout(() => {
                      setSelectedTextShape(newShape);
                      setShowTextEditor(true);
                    }, 100);
                    setActiveTool('select');
                  }
                }}
              />
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

      {/* Text Editor */}
      {showTextEditor && selectedTextShape && (
        <TextEditor
          shape={shapes.find(s => s.id === selectedTextShape.id) || selectedTextShape}
          onUpdate={(updates) => {
            updateShape(selectedTextShape.id, updates);
          }}
          onClose={() => {
            setShowTextEditor(false);
            setSelectedTextShape(null);
          }}
        />
      )}

      {/* Floating Shortcuts */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ delay: 1, duration: 0.3 }}
        className="fixed bottom-4 left-4 glass rounded-lg p-3 text-xs text-[#F8F9FA]/60 max-w-xs"
        style={{
          animation: 'fadeInOut 5s ease-in-out forwards'
        }}
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