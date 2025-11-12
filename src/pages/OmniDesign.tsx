import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { useToast } from "@/hooks/use-toast";
import CanvasBoard from "@/components/design/CanvasBoard";
import Toolbar from "@/components/design/Toolbar";
import CursorPresence from "@/components/design/CursorPresence";
import TopBar from "@/components/design/TopBar";
import PropertiesPanel from "@/components/design/PropertiesPanel";
import LayersPanel from "@/components/design/LayersPanel";
import AnimationPanel from "@/components/design/AnimationPanel";

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
  const [showAnimationPanel, setShowAnimationPanel] = useState(false);
  const { toast } = useToast();
  
  const ydocRef = useRef<Y.Doc | null>(null);
  const providerRef = useRef<WebsocketProvider | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const panelsRef = useRef<HTMLDivElement>(null);

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

    // GSAP entrance animations
    const tl = gsap.timeline();
    tl.from(toolbarRef.current, { x: -100, opacity: 0, duration: 0.6, ease: "power2.out" })
      .from(canvasRef.current, { scale: 0.9, opacity: 0, duration: 0.8, ease: "power2.out" }, "-=0.4")
      .from(panelsRef.current, { x: 100, opacity: 0, duration: 0.6, ease: "power2.out" }, "-=0.6");

    return () => {
      provider.destroy();
    };
  }, []);

  const handleShapeAdd = (shape: Shape) => {
    // GSAP animation for new shape
    gsap.from(`[data-shape-id="${shape.id}"]`, {
      scale: 0,
      rotation: 360,
      duration: 0.5,
      ease: "back.out(1.7)"
    });
    
    toast({
      title: "Shape added",
      description: `${shape.type} added to canvas`,
    });
  };

  const handleClearCanvas = () => {
    if (ydocRef.current) {
      // GSAP animation for clearing canvas
      gsap.to(".canvas-shape", {
        scale: 0,
        opacity: 0,
        duration: 0.3,
        stagger: 0.05,
        ease: "power2.in",
        onComplete: () => {
          const yShapes = ydocRef.current!.getArray('shapes');
          yShapes.delete(0, yShapes.length);
        }
      });
      
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

  const handleAnimationPlay = (animationType: string, shape: Shape, duration: number) => {
    // This will be passed to CanvasBoard to handle Konva animations
    if (canvasRef.current) {
      const event = new CustomEvent('playAnimation', {
        detail: { animationType, shape, duration }
      });
      canvasRef.current.dispatchEvent(event);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      <TopBar 
        isConnected={isConnected}
        connectedUsers={connectedUsers}
        onNewCanvas={handleNewCanvas}
      />
      
      <div className="flex-1 flex">
        <div ref={toolbarRef}>
          <Toolbar 
            selectedTool={selectedTool}
            onToolSelect={setSelectedTool}
            onClearCanvas={handleClearCanvas}
            onToggleProperties={() => setShowPropertiesPanel(!showPropertiesPanel)}
            onToggleLayers={() => setShowLayersPanel(!showLayersPanel)}
            onToggleAnimation={() => setShowAnimationPanel(!showAnimationPanel)}
          />
        </div>
        
        <div className="flex-1 relative" ref={canvasRef}>
          <CanvasBoard 
            selectedTool={selectedTool}
            onShapeAdd={handleShapeAdd}
            onShapeSelect={setSelectedShape}
            selectedShape={selectedShape}
            onAnimationPlay={handleAnimationPlay}
            onShapeUpdate={setSelectedShape}
          />
        </div>
        
        <div ref={panelsRef} className="flex">
          {showLayersPanel && (
            <LayersPanel 
              onClose={() => setShowLayersPanel(false)}
              selectedShape={selectedShape}
              onShapeSelect={(shape) => {
                setSelectedShape(shape);
                // Also select the shape on the canvas
                if (shape) {
                  const event = new CustomEvent('selectShape', {
                    detail: { shapeId: shape.id }
                  });
                  canvasRef.current?.dispatchEvent(event);
                }
              }}
            />
          )}
          
          {showAnimationPanel && (
            <AnimationPanel 
              selectedShape={selectedShape}
              onClose={() => setShowAnimationPanel(false)}
              onAnimationPlay={handleAnimationPlay}
            />
          )}
          
          {showPropertiesPanel && selectedShape && (
            <PropertiesPanel 
              shape={selectedShape}
              onShapeUpdate={(updatedShape) => {
                setSelectedShape(updatedShape);
                // Also update the shape in the canvas
                const event = new CustomEvent('updateShape', {
                  detail: { shape: updatedShape }
                });
                canvasRef.current?.dispatchEvent(event);
              }}
              onClose={() => setShowPropertiesPanel(false)}
            />
          )}
        </div>
      </div>
      
      <CursorPresence 
        ydoc={ydocRef.current}
        provider={providerRef.current}
      />
    </div>
  );
};

export default OmniDesign;
