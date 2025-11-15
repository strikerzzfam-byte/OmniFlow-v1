import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { useRichEditor } from '@/hooks/useRichEditor';
import { useNavigate } from 'react-router-dom';
import RichTextEditor from '@/components/write/RichTextEditor';
import WritingToolbar from '@/components/write/WritingToolbar';
import WritingAssistant from '@/components/write/WritingAssistant';
import DocumentOutline from '@/components/write/DocumentOutline';
import TemplateLibrary from '@/components/write/TemplateLibrary';
import WordCountTracker from '@/components/write/WordCountTracker';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  PanelLeftOpen, PanelLeftClose, PanelRightOpen, PanelRightClose,
  Save, Clock, Wifi, WifiOff, Users, Command, FileText,
  Download, Upload, Settings, Sparkles, ArrowLeft
} from 'lucide-react';

const OmniWrite = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showOutline, setShowOutline] = useState(true);
  const [showAssistant, setShowAssistant] = useState(true);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [showTemplateLibrary, setShowTemplateLibrary] = useState(false);

  const {
    editor,
    initializeEditor,
    isConnected,
    collaborators,
    currentTone,
    setCurrentTone,
    tones,
    documentHistory,
    comments,
    wordCount,
    readingTime,
    readabilityScore,
    seoScore,
    isAutoSaving,
    lastSaved,
    summarizeText,
    expandText,
    rephraseText,
    generateOutline,
    addComment,
    exportDocument
  } = useRichEditor();

  useEffect(() => {
    const editorInstance = initializeEditor();
    
    // Ensure editor is focused after initialization
    setTimeout(() => {
      if (editorInstance) {
        editorInstance.commands.focus();
      }
    }, 100);
    
    return () => {
      if (editorInstance) {
        editorInstance.destroy();
      }
    };
  }, [initializeEditor]);

  const handleSave = useCallback(() => {
    if (editor) {
      const content = editor.getHTML();
      localStorage.setItem('omniwrite-document', content);
      toast({
        title: "Document saved",
        description: "Your work has been saved locally",
      });
    }
  }, [editor, toast]);

  const handleExport = useCallback(() => {
    exportDocument('html');
    toast({
      title: "Document exported",
      description: "Your document has been downloaded",
    });
  }, [exportDocument, toast]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      setIsCommandPaletteOpen(true);
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      handleSave();
    }
  }, [handleSave]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const outline = generateOutline();

  const handleOutlineItemClick = (item: any) => {
    if (editor) {
      // Find and scroll to the heading
      const headings = editor.view.dom.querySelectorAll('h1, h2, h3, h4, h5, h6');
      const targetHeading = Array.from(headings).find(h => h.textContent === item.text);
      if (targetHeading) {
        targetHeading.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-background via-background/95 to-background/90 overflow-x-hidden">
      {/* Top Bar */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="h-16 glass border-b border-glass-border/50 flex items-center justify-between px-2 sm:px-4 lg:px-6 relative z-50 flex-shrink-0"
      >
        {/* Left - Branding & Navigation */}
        <div className="flex items-center space-x-2 lg:space-x-4">
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
          <Badge variant="outline" className="text-xs hidden sm:block">
            Intelligent Writing Assistant
          </Badge>
        </div>

        {/* Center - Document Status */}
        <div className="hidden md:flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <FileText className="w-4 h-4" />
            <span>{wordCount.toLocaleString()} words</span>
          </div>
          
          <div className="flex items-center space-x-2 text-sm">
            {isAutoSaving ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Save className="w-4 h-4 text-primary" />
              </motion.div>
            ) : (
              <Save className="w-4 h-4 text-muted-foreground" />
            )}
            <span className="text-muted-foreground">
              {lastSaved ? `Saved ${lastSaved.toLocaleTimeString()}` : 'Not saved'}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {isConnected ? (
              <Wifi className="w-4 h-4 text-green-400" />
            ) : (
              <WifiOff className="w-4 h-4 text-red-400" />
            )}
            <Users className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {collaborators.length + 1} writer{collaborators.length !== 0 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Right - Actions */}
        <div className="flex items-center space-x-1 lg:space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowOutline(!showOutline)}
            title="Toggle Outline"
          >
            {showOutline ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4" />}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAssistant(!showAssistant)}
            title="Toggle Assistant"
          >
            {showAssistant ? <PanelRightClose className="w-4 h-4" /> : <PanelRightOpen className="w-4 h-4" />}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCommandPaletteOpen(true)}
            title="Command Palette (Ctrl+K)"
          >
            <Command className="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowTemplateLibrary(true)}
            title="Template Library"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Templates
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            className="bg-primary/10 border-primary/30 hover:bg-primary/20"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </motion.div>

      {/* Toolbar */}
      <div className="flex-shrink-0 overflow-x-auto">
        <WritingToolbar
          editor={editor}
          onSave={handleSave}
          onExport={handleExport}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden min-h-0">
        {/* Left Outline Panel */}
        <AnimatePresence>
          {showOutline && (
            <motion.div
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              className="w-80 glass border-r border-glass-border/50 p-4 overflow-y-auto flex-shrink-0 hidden xl:block"
            >
              <DocumentOutline
                outline={outline}
                onItemClick={handleOutlineItemClick}
              />
              
              <WordCountTracker
                wordCount={wordCount}
                readingTime={readingTime}
                className="mt-4"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Editor Area */}
        <div className="flex-1 relative min-w-0 overflow-hidden">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full overflow-hidden"
          >
            <RichTextEditor
              editor={editor}
              className="h-full w-full"
            />
          </motion.div>

          {/* Floating Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-4 left-4 glass rounded-lg p-3 shadow-lg border border-glass-border/50"
          >
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1">
                <span className="text-muted-foreground">Readability:</span>
                <span className={`font-medium ${
                  readabilityScore >= 80 ? 'text-green-400' : 
                  readabilityScore >= 60 ? 'text-yellow-400' : 'text-red-400'
                }`}>
                  {Math.round(readabilityScore)}%
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-muted-foreground">SEO:</span>
                <span className={`font-medium ${
                  seoScore >= 80 ? 'text-green-400' : 
                  seoScore >= 60 ? 'text-yellow-400' : 'text-red-400'
                }`}>
                  {seoScore}%
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Assistant Panel */}
        <AnimatePresence>
          {showAssistant && (
            <>
              {/* Desktop: Fixed sidebar */}
              <div className="hidden xl:block w-80 flex-shrink-0">
                <WritingAssistant
                  editor={editor}
                  currentTone={currentTone}
                  tones={tones}
                  onToneChange={setCurrentTone}
                  onSummarize={summarizeText}
                  onExpand={expandText}
                  onRephrase={rephraseText}
                  wordCount={wordCount}
                  readabilityScore={readabilityScore}
                  seoScore={seoScore}
                />
              </div>
              
              {/* Mobile/Tablet: Overlay drawer */}
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                className="xl:hidden fixed inset-y-0 right-0 w-80 max-w-[90vw] z-50 bg-background/95 backdrop-blur-sm border-l border-glass-border/50"
              >
                <WritingAssistant
                  editor={editor}
                  currentTone={currentTone}
                  tones={tones}
                  onToneChange={setCurrentTone}
                  onSummarize={summarizeText}
                  onExpand={expandText}
                  onRephrase={rephraseText}
                  wordCount={wordCount}
                  readabilityScore={readabilityScore}
                  seoScore={seoScore}
                />
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Template Library */}
      <AnimatePresence>
        {showTemplateLibrary && (
          <TemplateLibrary
            onTemplateSelect={(template) => {
              if (editor) {
                editor.commands.setContent(template.content);
                setShowTemplateLibrary(false);
                toast({
                  title: "Template applied",
                  description: `${template.title} template has been loaded`,
                });
              }
            }}
            onClose={() => setShowTemplateLibrary(false)}
          />
        )}
      </AnimatePresence>

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
                  { label: 'Save Document', shortcut: 'Ctrl+S', action: handleSave },
                  { label: 'Export Document', shortcut: 'Ctrl+E', action: handleExport },
                  { label: 'Open Templates', shortcut: '', action: () => setShowTemplateLibrary(true) },
                  { label: 'Summarize Text', shortcut: '', action: summarizeText },
                  { label: 'Toggle Outline', shortcut: '', action: () => setShowOutline(!showOutline) },
                  { label: 'Toggle Assistant', shortcut: '', action: () => setShowAssistant(!showAssistant) }
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

export default OmniWrite;