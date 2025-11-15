import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Type, Wand2, X } from 'lucide-react';

interface TextPanelProps {
  onAddText: (textType: string) => void;
  onClose: () => void;
}

const TextPanel = ({ onAddText, onClose }: TextPanelProps) => {
  const textStyles = [
    { id: 'heading', text: 'Add a heading', fontSize: 48, fontWeight: 'bold' },
    { id: 'subheading', text: 'Add a subheading', fontSize: 32, fontWeight: '600' },
    { id: 'body', text: 'Add a little bit of body text', fontSize: 16, fontWeight: 'normal' }
  ];

  return (
    <motion.div
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -300, opacity: 0 }}
      className="w-80 h-full glass border-r border-glass-border/50 flex flex-col bg-background/95 backdrop-blur-xl"
    >
      {/* Header */}
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Text</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search fonts and combinations"
            className="pl-10 bg-background/50"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Add Text Box Button */}
        <Button
          onClick={() => onAddText('heading')}
          className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
        >
          <Type className="w-5 h-5 mr-2" />
          Add a text box
        </Button>

        {/* Magic Write */}
        <Button
          variant="outline"
          className="w-full h-12 border-dashed border-2 hover:bg-muted/50"
        >
          <Wand2 className="w-5 h-5 mr-2" />
          Magic Write
        </Button>

        {/* Brand Fonts */}
        <div className="p-4 border border-dashed border-border/50 rounded-lg text-center text-muted-foreground">
          <div className="text-sm">Add your brand fonts</div>
        </div>

        {/* Default Text Styles */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-foreground">Default text styles</h3>
          
          {textStyles.map((style) => (
            <motion.div
              key={style.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="p-4 border border-border/30 rounded-lg cursor-pointer hover:border-primary/50 hover:bg-muted/30 transition-all"
              onClick={() => onAddText(style.id)}
            >
              <div
                style={{
                  fontSize: Math.min(style.fontSize, 24),
                  fontWeight: style.fontWeight,
                  color: '#F8F9FA',
                  lineHeight: 1.2
                }}
              >
                {style.text}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Dynamic Text */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-foreground">Dynamic text</h3>
          
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="p-4 border border-border/30 rounded-lg cursor-pointer hover:border-primary/50 hover:bg-muted/30 transition-all flex items-center"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded flex items-center justify-center text-white font-bold mr-3">
              1
            </div>
            <div>
              <div className="font-medium text-foreground">Page numbers</div>
              <div className="text-sm text-muted-foreground">Auto-updating page numbers</div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default TextPanel;