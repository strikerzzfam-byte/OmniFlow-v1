import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  Bold, Italic, Underline, Strikethrough, Code, Link, 
  List, ListOrdered, Quote, Image, Heading1, 
  Heading2, Heading3, AlignLeft, AlignCenter, AlignRight,
  Undo, Redo, Save, Download
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface WritingToolbarProps {
  editor: any;
  onSave?: () => void;
  onExport?: () => void;
  className?: string;
}

const WritingToolbar: React.FC<WritingToolbarProps> = ({ 
  editor, 
  onSave, 
  onExport, 
  className 
}) => {
  if (!editor) return null;

  const toolGroups = [
    {
      name: 'History',
      tools: [
        { icon: Undo, action: () => editor.chain().focus().undo().run(), active: false, title: 'Undo' },
        { icon: Redo, action: () => editor.chain().focus().redo().run(), active: false, title: 'Redo' }
      ]
    },
    {
      name: 'Headings',
      tools: [
        { icon: Heading1, action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(), active: editor.isActive('heading', { level: 1 }), title: 'Heading 1' },
        { icon: Heading2, action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), active: editor.isActive('heading', { level: 2 }), title: 'Heading 2' },
        { icon: Heading3, action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(), active: editor.isActive('heading', { level: 3 }), title: 'Heading 3' }
      ]
    },
    {
      name: 'Formatting',
      tools: [
        { icon: Bold, action: () => editor.chain().focus().toggleBold().run(), active: editor.isActive('bold'), title: 'Bold' },
        { icon: Italic, action: () => editor.chain().focus().toggleItalic().run(), active: editor.isActive('italic'), title: 'Italic' },
        { icon: Strikethrough, action: () => editor.chain().focus().toggleStrike().run(), active: editor.isActive('strike'), title: 'Strikethrough' },
        { icon: Code, action: () => editor.chain().focus().toggleCode().run(), active: editor.isActive('code'), title: 'Code' }
      ]
    },
    {
      name: 'Lists',
      tools: [
        { icon: List, action: () => editor.chain().focus().toggleBulletList().run(), active: editor.isActive('bulletList'), title: 'Bullet List' },
        { icon: ListOrdered, action: () => editor.chain().focus().toggleOrderedList().run(), active: editor.isActive('orderedList'), title: 'Ordered List' },
        { icon: Quote, action: () => editor.chain().focus().toggleBlockquote().run(), active: editor.isActive('blockquote'), title: 'Quote' }
      ]
    },
    {
      name: 'Insert',
      tools: [
        { icon: Link, action: () => {
          const url = window.prompt('Enter URL:');
          if (url) editor.chain().focus().setLink({ href: url }).run();
        }, active: editor.isActive('link'), title: 'Link' },
        { icon: Image, action: () => {
          const url = window.prompt('Enter image URL:');
          if (url) editor.chain().focus().setImage({ src: url }).run();
        }, active: false, title: 'Image' },
        { icon: Code, action: () => editor.chain().focus().toggleCodeBlock().run(), active: editor.isActive('codeBlock'), title: 'Code Block' }
      ]
    }
  ];

  return (
    <motion.div
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={cn(
        "glass border-b border-glass-border/50 p-3",
        "flex items-center justify-between",
        className
      )}
    >
      <div className="flex items-center space-x-4">
        {toolGroups.map((group, groupIndex) => (
          <div key={group.name} className="flex items-center space-x-1">
            {group.tools.map((tool, toolIndex) => {
              const Icon = tool.icon;
              return (
                <Button
                  key={`${group.name}-${toolIndex}`}
                  variant={tool.active ? "default" : "ghost"}
                  size="sm"
                  onClick={tool.action}
                  title={tool.title}
                  className={cn(
                    "h-8 w-8 p-0",
                    tool.active && "bg-primary/20 text-primary border-primary/30"
                  )}
                >
                  <Icon className="w-4 h-4" />
                </Button>
              );
            })}
            {groupIndex < toolGroups.length - 1 && (
              <div className="w-px h-6 bg-border mx-2" />
            )}
          </div>
        ))}
      </div>

      <div className="flex items-center space-x-2">
        {onSave && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onSave}
            className="text-muted-foreground hover:text-foreground"
          >
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
        )}
        {onExport && (
          <Button
            variant="outline"
            size="sm"
            onClick={onExport}
            className="bg-primary/10 border-primary/30 hover:bg-primary/20"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        )}
      </div>
    </motion.div>
  );
};

export default WritingToolbar;