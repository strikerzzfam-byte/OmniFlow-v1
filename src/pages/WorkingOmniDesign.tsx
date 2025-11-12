import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  Undo, Redo, Download, Grid3X3, Ruler, Layers, Sparkles, Users, Wifi
} from 'lucide-react';

import ToolsPanel from '@/components/design/ToolsPanel';
import WorkingCanvasBoard from '@/components/design/WorkingCanvasBoard';

const WorkingOmniDesign = () => {
  const [activeTool, setActiveTool] = useState('select');
  const [showLayersPanel, setShowLayersPanel] = useState(true);
  const [showEffectsPanel, setShowEffectsPanel] = useState(false);

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-background via-background/95 to-background/90 overflow-hidden">
      {/* Top Bar */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="h-16 glass border-b border-glass-border/50 flex items-center justify-between px-6"
      >
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent">
            OmniDesign
          </h1>
          <span className="text-sm text-muted-foreground">ArcNex Studio</span>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 bg-muted/30 rounded-lg p-1">
            <Button variant="ghost" size="sm" title="Undo">
              <Undo className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" title="Redo">
              <Redo className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex items-center space-x-1 bg-muted/30 rounded-lg p-1">
            <Button variant="ghost" size="sm" title="Grid">
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" title="Rulers">
              <Ruler className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex items-center space-x-1 bg-muted/30 rounded-lg p-1">
            <Button 
              variant={showLayersPanel ? "default" : "ghost"} 
              size="sm" 
              onClick={() => setShowLayersPanel(!showLayersPanel)}
            >
              <Layers className="w-4 h-4" />
            </Button>
            <Button 
              variant={showEffectsPanel ? "default" : "ghost"} 
              size="sm" 
              onClick={() => setShowEffectsPanel(!showEffectsPanel)}
            >
              <Sparkles className="w-4 h-4" />
            </Button>
          </div>
          
          <Button variant="outline" size="sm" className="bg-primary/10 border-primary/30">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Wifi className="w-4 h-4 text-green-400" />
            <span className="text-sm text-muted-foreground">Connected</span>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">1 user</span>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex">
        <ToolsPanel
          activeTool={activeTool}
          onToolSelect={setActiveTool}
        />

        <div className="flex-1 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full"
          >
            <WorkingCanvasBoard activeTool={activeTool} />
          </motion.div>
        </div>
      </div>

      {/* Quick Tips */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="fixed bottom-4 left-4 glass rounded-lg p-3 text-xs text-muted-foreground max-w-xs"
      >
        <p className="font-medium mb-1">Quick Tips:</p>
        <p>• Select tool to move shapes</p>
        <p>• Click tools to draw shapes</p>
        <p>• Shift+click to multi-select</p>
        <p>• Zoom with +/- buttons</p>
      </motion.div>
    </div>
  );
};

export default WorkingOmniDesign;