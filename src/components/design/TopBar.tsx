import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { RefreshCw, Users, Wifi, WifiOff, Undo, Redo, Download, Upload, Copy, ClipboardPaste, ZoomIn, ZoomOut } from 'lucide-react';

interface TopBarProps {
  isConnected: boolean;
  connectedUsers: number;
  onNewCanvas: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onExport?: () => void;
  onImport?: () => void;
  onCopy?: () => void;
  onPaste?: () => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
}

const TopBar = ({ 
  isConnected, 
  connectedUsers, 
  onNewCanvas,
  onUndo,
  onRedo,
  onExport,
  onImport,
  onCopy,
  onPaste,
  onZoomIn,
  onZoomOut
}: TopBarProps) => {
  return (
    <div className="h-16 glass border-b border-glass-border/50 flex items-center justify-between px-6">
      {/* Left side - Room info */}
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-bold text-gradient">OmniDesign</h1>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <span>Room: omnidesign-room</span>
        </div>
      </div>
      
      {/* Center - Quick Actions */}
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-1 bg-muted/50 rounded-lg p-1">
          <Button variant="ghost" size="sm" onClick={onUndo} title="Undo">
            <Undo className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={onRedo} title="Redo">
            <Redo className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="flex items-center space-x-1 bg-muted/50 rounded-lg p-1">
          <Button variant="ghost" size="sm" onClick={onCopy} title="Copy">
            <Copy className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={onPaste} title="Paste">
            <ClipboardPaste className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="flex items-center space-x-1 bg-muted/50 rounded-lg p-1">
          <Button variant="ghost" size="sm" onClick={onZoomOut} title="Zoom Out">
            <ZoomOut className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={onZoomIn} title="Zoom In">
            <ZoomIn className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="flex items-center space-x-1 bg-muted/50 rounded-lg p-1">
          <Button variant="ghost" size="sm" onClick={onImport} title="Import">
            <Upload className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={onExport} title="Export">
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Right side - Status and actions */}
      <div className="flex items-center space-x-4">
        {/* Connection status */}
        <div className="flex items-center space-x-2">
          <motion.div
            animate={{ scale: isConnected ? [1, 1.2, 1] : 1 }}
            transition={{ duration: 2, repeat: isConnected ? Infinity : 0 }}
          >
            {isConnected ? (
              <Wifi className="w-4 h-4 text-green-500" />
            ) : (
              <WifiOff className="w-4 h-4 text-red-500" />
            )}
          </motion.div>
          <span className="text-sm text-muted-foreground">
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>

        {/* Connected users */}
        <div className="flex items-center space-x-2">
          <Users className="w-4 h-4 text-primary" />
          <span className="text-sm text-muted-foreground">
            {connectedUsers} user{connectedUsers !== 1 ? 's' : ''}
          </span>
        </div>

        {/* New canvas button */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            onClick={onNewCanvas}
            className="bg-primary hover:bg-primary/90 glow-primary"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            New Canvas
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default TopBar;