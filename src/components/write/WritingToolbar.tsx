import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import LinkDialog from './LinkDialog';
import ImageDialog from './ImageDialog';
import TableDialog from './TableDialog';
import FontSizeSelector from './FontSizeSelector';
import { 
  Bold, Italic, Underline, Strikethrough, Code, Link, 
  List, ListOrdered, Quote, Image, Heading1, 
  Heading2, Heading3, AlignLeft, AlignCenter, AlignRight,
  Undo, Redo, Save, Download, Table, Minus, Subscript,
  Superscript, Palette, Type, Hash, RotateCcw, CheckSquare, ChevronDown, Sun, Moon
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [showTableDialog, setShowTableDialog] = useState(false);
  const { theme, setTheme } = useTheme();
  
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
      name: 'Formatting',
      tools: [
        { icon: Bold, action: () => editor.chain().focus().toggleBold().run(), active: editor.isActive('bold'), title: 'Bold' },
        { icon: Italic, action: () => editor.chain().focus().toggleItalic().run(), active: editor.isActive('italic'), title: 'Italic' },
        { icon: Underline, action: () => editor.chain().focus().toggleUnderline().run(), active: editor.isActive('underline'), title: 'Underline' },
        { icon: Strikethrough, action: () => editor.chain().focus().toggleStrike().run(), active: editor.isActive('strike'), title: 'Strikethrough' },
        { icon: Code, action: () => editor.chain().focus().toggleCode().run(), active: editor.isActive('code'), title: 'Code' },
        { icon: Subscript, action: () => editor.chain().focus().toggleSubscript().run(), active: editor.isActive('subscript'), title: 'Subscript' },
        { icon: Superscript, action: () => editor.chain().focus().toggleSuperscript().run(), active: editor.isActive('superscript'), title: 'Superscript' },
        { icon: RotateCcw, action: () => editor.chain().focus().clearNodes().unsetAllMarks().run(), active: false, title: 'Clear Formatting' }
      ]
    },
    {
      name: 'Lists',
      tools: [
        { icon: List, action: () => editor.chain().focus().toggleBulletList().run(), active: editor.isActive('bulletList'), title: 'Bullet List' },
        { icon: ListOrdered, action: () => editor.chain().focus().toggleOrderedList().run(), active: editor.isActive('orderedList'), title: 'Ordered List' },
        { icon: CheckSquare, action: () => editor.chain().focus().toggleTaskList().run(), active: editor.isActive('taskList'), title: 'Task List' },
        { icon: Quote, action: () => editor.chain().focus().toggleBlockquote().run(), active: editor.isActive('blockquote'), title: 'Quote' }
      ]
    },
    {
      name: 'Alignment',
      tools: [
        { icon: AlignLeft, action: () => editor.chain().focus().setTextAlign('left').run(), active: editor.isActive({ textAlign: 'left' }), title: 'Align Left' },
        { icon: AlignCenter, action: () => editor.chain().focus().setTextAlign('center').run(), active: editor.isActive({ textAlign: 'center' }), title: 'Align Center' },
        { icon: AlignRight, action: () => editor.chain().focus().setTextAlign('right').run(), active: editor.isActive({ textAlign: 'right' }), title: 'Align Right' }
      ]
    },
    {
      name: 'Insert',
      tools: [
        { icon: Link, action: () => setShowLinkDialog(true), active: editor.isActive('link'), title: 'Link' },
        { icon: Image, action: () => setShowImageDialog(true), active: false, title: 'Image' },
        { icon: Table, action: () => setShowTableDialog(true), active: false, title: 'Table' },
        { icon: Minus, action: () => editor.chain().focus().setHorizontalRule().run(), active: false, title: 'Horizontal Rule' },
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
        {/* Text Size Selector */}
        <Select
          value={editor.isActive('heading', { level: 1 }) ? 'h1' : 
                 editor.isActive('heading', { level: 2 }) ? 'h2' : 
                 editor.isActive('heading', { level: 3 }) ? 'h3' : 'p'}
          onValueChange={(value) => {
            if (value === 'h1') editor.chain().focus().setHeading({ level: 1 }).run();
            else if (value === 'h2') editor.chain().focus().setHeading({ level: 2 }).run();
            else if (value === 'h3') editor.chain().focus().setHeading({ level: 3 }).run();
            else editor.chain().focus().setParagraph().run();
          }}
        >
          <SelectTrigger className="w-24 h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="p">Normal</SelectItem>
            <SelectItem value="h1">H1</SelectItem>
            <SelectItem value="h2">H2</SelectItem>
            <SelectItem value="h3">H3</SelectItem>
          </SelectContent>
        </Select>
        
        <FontSizeSelector editor={editor} />
        
        <div className="w-px h-6 bg-border" />
        
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
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="text-muted-foreground hover:text-foreground"
          title="Toggle Theme"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </Button>
        
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
      
      <LinkDialog
        isOpen={showLinkDialog}
        onClose={() => setShowLinkDialog(false)}
        onInsert={(url, text) => {
          if (text) {
            editor.chain().focus().insertContent(`<a href="${url}">${text}</a>`).run();
          } else {
            editor.chain().focus().setLink({ href: url }).run();
          }
        }}
      />
      
      <ImageDialog
        isOpen={showImageDialog}
        onClose={() => setShowImageDialog(false)}
        onInsert={(src, alt) => {
          editor.chain().focus().setImage({ src, alt }).run();
        }}
      />
      
      <TableDialog
        isOpen={showTableDialog}
        onClose={() => setShowTableDialog(false)}
        onInsert={(rows, cols) => {
          const tableHTML = `<table><tbody>${Array(rows).fill(0).map(() => 
            `<tr>${Array(cols).fill(0).map(() => '<td></td>').join('')}</tr>`
          ).join('')}</tbody></table>`;
          editor.chain().focus().insertContent(tableHTML).run();
        }}
      />
    </motion.div>
  );
};

export default WritingToolbar;