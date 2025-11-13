import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { useOmniGenerate } from '@/hooks/useOmniGenerate';
import { useNavigate } from 'react-router-dom';
import TypeSelector from '@/components/generate/TypeSelector';
import PromptStudio from '@/components/generate/PromptStudio';
import VariantPanel from '@/components/generate/VariantPanel';
import HistoryTimeline from '@/components/generate/HistoryTimeline';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, Command, History, Wifi, WifiOff, 
  Users, Save, Settings, Zap, PanelLeftOpen, 
  PanelLeftClose, Clock, ArrowLeft
} from 'lucide-react';

const OmniGenerate = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showHistory, setShowHistory] = useState(false);
  const [isConnected] = useState(true);
  const [collaborators] = useState(2);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  const {
    contentTypes,
    selectedType,
    setSelectedType,
    settings,
    setSettings,
    variants,
    selectedVariant,
    setSelectedVariant,
    isGenerating,
    history,
    generateContent,
    smartActions,
    exportContent,
    sendToOmniWrite,
    sendToOmniDesign
  } = useOmniGenerate();

  const handleSmartAction = useCallback((action: string, content: string) => {
    const result = smartActions[action as keyof typeof smartActions](content);
    toast({
      title: "Content updated",
      description: `Applied ${action} transformation`,
    });
    return result;
  }, [smartActions, toast]);

  const handleExport = useCallback((format: string) => {
    exportContent(format as any);
    toast({
      title: "Export completed",
      description: `Content exported as ${format.toUpperCase()}`,
    });
  }, [exportContent, toast]);

  const handleSendToOmniWrite = useCallback(() => {
    sendToOmniWrite();
    toast({
      title: "Sent to OmniWrite",
      description: "Content is ready for advanced editing",
    });
  }, [sendToOmniWrite, toast]);

  const handleSendToOmniDesign = useCallback(() => {
    sendToOmniDesign();
    toast({
      title: "Sent to OmniDesign",
      description: "Ready to create visuals and graphics",
    });
  }, [sendToOmniDesign, toast]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'g') {
      e.preventDefault();
      setIsCommandPaletteOpen(true);
    }
  }, []);

  React.useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background/95 to-background/90 overflow-auto scrollbar-none">
      {/* Top Bar */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="h-16 glass border-b border-glass-border/50 flex items-center justify-between px-6 relative z-50"
      >
        {/* Left - Branding */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/dashboard')}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <motion.h1 
            className="text-xl font-bold bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent"
            whileHover={{ scale: 1.05 }}
          >
            OmniGenerate
          </motion.h1>
          <Badge variant="outline" className="text-xs">
            AI Content Studio
          </Badge>
        </div>

        {/* Center - Status */}
        <div className="flex items-center space-x-4">
          {selectedType && (
            <div className="flex items-center space-x-2 text-sm">
              <span className="text-2xl">{selectedType.icon}</span>
              <span className="text-muted-foreground">{selectedType.name}</span>
            </div>
          )}
          
          {isGenerating && (
            <div className="flex items-center space-x-2 text-sm text-primary">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Zap className="w-4 h-4" />
              </motion.div>
              <span>Generating...</span>
            </div>
          )}
        </div>

        {/* Right - Actions */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            {isConnected ? (
              <Wifi className="w-4 h-4 text-green-400" />
            ) : (
              <WifiOff className="w-4 h-4 text-red-400" />
            )}
            <Users className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {collaborators + 1} user{collaborators !== 0 ? 's' : ''}
            </span>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowHistory(!showHistory)}
            title="History Timeline"
          >
            {showHistory ? <PanelLeftClose className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCommandPaletteOpen(true)}
            title="Command Palette (Ctrl+G)"
          >
            <Command className="w-4 h-4" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="bg-primary/10 border-primary/30 hover:bg-primary/20"
          >
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex relative">
        {/* History Timeline (Collapsible) */}
        <AnimatePresence>
          {showHistory && (
            <motion.div
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              className="w-80 glass border-r border-glass-border/50 overflow-y-auto"
            >
              <HistoryTimeline
                history={history}
                onRestore={(snapshot) => {
                  setSettings(snapshot.settings);
                  setVariants(snapshot.variants);
                  setSelectedVariant(snapshot.variants[0]);
                  toast({
                    title: "Snapshot restored",
                    description: "Previous generation has been restored",
                  });
                }}
                onDuplicate={(snapshot) => {
                  setSettings(snapshot.settings);
                  toast({
                    title: "Settings duplicated",
                    description: "Ready to generate new variations",
                  });
                }}
                onDelete={(id) => {
                  // Remove from history
                  toast({
                    title: "Snapshot deleted",
                    description: "History item has been removed",
                  });
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Left - Type Selector */}
        <TypeSelector
          contentTypes={contentTypes}
          selectedType={selectedType}
          onTypeSelect={setSelectedType}
        />

        {/* Center - Prompt Studio */}
        <PromptStudio
          settings={settings}
          onSettingsChange={setSettings}
          onGenerate={generateContent}
          isGenerating={isGenerating}
        />

        {/* Right - Variant Panel */}
        <VariantPanel
          variants={variants}
          selectedVariant={selectedVariant}
          onVariantSelect={setSelectedVariant}
          onSmartAction={handleSmartAction}
          onExport={handleExport}
          onSendToOmniWrite={handleSendToOmniWrite}
          onSendToOmniDesign={handleSendToOmniDesign}
        />
      </div>

      {/* Command Palette */}
      <AnimatePresence>
        {isCommandPaletteOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-20"
            onClick={() => setIsCommandPaletteOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass rounded-lg p-4 w-96 max-w-[90vw]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center space-x-2 mb-4">
                <Command className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">Command Palette</h3>
              </div>
              
              <div className="space-y-2">
                {[
                  { label: 'Generate Content', shortcut: 'Ctrl+G', action: generateContent },
                  { label: 'Toggle History', shortcut: '', action: () => setShowHistory(!showHistory) },
                  { label: 'Send to OmniWrite', shortcut: '', action: handleSendToOmniWrite },
                  { label: 'Send to OmniDesign', shortcut: '', action: handleSendToOmniDesign },
                  { label: 'Export as PDF', shortcut: '', action: () => handleExport('pdf') }
                ].map((command, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    className="w-full justify-between"
                    onClick={() => {
                      command.action();
                      setIsCommandPaletteOpen(false);
                    }}
                  >
                    <span>{command.label}</span>
                    {command.shortcut && (
                      <Badge variant="outline" className="text-xs">
                        {command.shortcut}
                      </Badge>
                    )}
                  </Button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OmniGenerate;