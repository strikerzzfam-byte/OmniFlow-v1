import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { useToast } from "@/hooks/use-toast";
import CanvasBoard from "@/components/design/CanvasBoard";
import Toolbar from "@/components/design/Toolbar";
import CursorPresence from "@/components/design/CursorPresence";
import TopBar from "@/components/design/TopBar";
import PropertiesPanel from "@/components/design/PropertiesPanel";
import LayersPanel from "@/components/design/LayersPanel";

interface Shape {
  id: string;
  type: 'rect' | 'circle' | 'text' | 'line' | 'arrow' | 'star' | 'image';
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
  fontFamily?: string;
  rotation?: number;
  scaleX?: number;
  scaleY?: number;
  opacity?: number;
  points?: number[];
  src?: string;
}

const OmniDesign = () => {
  const [selectedTool, setSelectedTool] = useState("select");
  const [isConnected, setIsConnected] = useState(false);
  const [connectedUsers, setConnectedUsers] = useState(1);
  const [selectedShape, setSelectedShape] = useState<Shape | null>(null);
  const [showPropertiesPanel, setShowPropertiesPanel] = useState(true);
  const [showLayersPanel, setShowLayersPanel] = useState(true);
  const { toast } = useToast();
  
  const ydocRef = useRef<Y.Doc | null>(null);
  const providerRef = useRef<WebsocketProvider | null>(null);

  useEffect(() => {
    const ydoc = new Y.Doc();
    const provider = new WebsocketProvider('ws://localhost:1234', 'omnidesign-room', ydoc);
    
    ydocRef.current = ydoc;
    providerRef.current = provider;

    provider.on('status', (event: any) => {
      setIsConnected(event.status === 'connected');
    });

    provider.awareness.on('change', () => {
      setConnectedUsers(provider.awareness.getStates().size);
    });

    return () => {
      provider.destroy();
    };
  }, []);

  const handleShapeAdd = (shape: Shape) => {
    toast({
      title: "Shape added",
      description: `${shape.type} added to canvas`,
    });
  };

  const handleClearCanvas = () => {
    if (ydocRef.current) {
      const yShapes = ydocRef.current.getArray('shapes');
      yShapes.delete(0, yShapes.length);
      toast({
        title: "Canvas cleared",
        description: "All shapes have been removed",
      });
    }
  };

  const handleNewCanvas = () => {
    handleClearCanvas();
    toast({
      title: "New canvas",
      description: "Started with a fresh canvas",
    });
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      <TopBar 
        isConnected={isConnected}
        connectedUsers={connectedUsers}
        onNewCanvas={handleNewCanvas}
      />
      
      <div className="flex-1 flex">
        <Toolbar 
          selectedTool={selectedTool}
          onToolSelect={setSelectedTool}
          onClearCanvas={handleClearCanvas}
          onToggleProperties={() => setShowPropertiesPanel(!showPropertiesPanel)}
          onToggleLayers={() => setShowLayersPanel(!showLayersPanel)}
        />
        
        <div className="flex-1 relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full"
          >
            <CanvasBoard 
              selectedTool={selectedTool}
              onShapeAdd={handleShapeAdd}
              onShapeSelect={setSelectedShape}
              selectedShape={selectedShape}
            />
          </motion.div>
        </div>
        
        {showLayersPanel && (
          <LayersPanel 
            onClose={() => setShowLayersPanel(false)}
            selectedShape={selectedShape}
            onShapeSelect={setSelectedShape}
          />
        )}
        
        {showPropertiesPanel && selectedShape && (
          <PropertiesPanel 
            shape={selectedShape}
            onShapeUpdate={setSelectedShape}
            onClose={() => setShowPropertiesPanel(false)}
          />
        )}
      </div>
      
      <CursorPresence 
        ydoc={ydocRef.current}
        provider={providerRef.current}
      />
    </div>
  );
};

export default OmniDesign;
