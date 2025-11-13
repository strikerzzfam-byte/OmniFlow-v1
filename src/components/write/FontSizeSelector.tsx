import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface FontSizeSelectorProps {
  editor: any;
}

const FontSizeSelector: React.FC<FontSizeSelectorProps> = ({ editor }) => {
  if (!editor) return null;

  const getCurrentSize = () => {
    if (editor.isActive('heading', { level: 1 })) return '32px';
    if (editor.isActive('heading', { level: 2 })) return '24px';
    if (editor.isActive('heading', { level: 3 })) return '20px';
    return '16px';
  };

  const handleSizeChange = (size: string) => {
    const { from, to } = editor.state.selection;
    
    if (from !== to) {
      // If text is selected, wrap it with font size
      const selectedText = editor.state.doc.textBetween(from, to);
      editor.chain().focus().deleteSelection().insertContent(`<span style="font-size: ${size}">${selectedText}</span>`).run();
    } else {
      // If no selection, apply to current block based on size
      if (size === '32px') {
        editor.chain().focus().setHeading({ level: 1 }).run();
      } else if (size === '24px') {
        editor.chain().focus().setHeading({ level: 2 }).run();
      } else if (size === '20px') {
        editor.chain().focus().setHeading({ level: 3 }).run();
      }
    }
  };

  return (
    <Select value={getCurrentSize()} onValueChange={handleSizeChange}>
      <SelectTrigger className="w-20 h-8 text-xs">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="12px">12px</SelectItem>
        <SelectItem value="14px">14px</SelectItem>
        <SelectItem value="16px">16px</SelectItem>
        <SelectItem value="18px">18px</SelectItem>
        <SelectItem value="20px">20px</SelectItem>
        <SelectItem value="24px">24px</SelectItem>
        <SelectItem value="32px">32px</SelectItem>
        <SelectItem value="48px">48px</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default FontSizeSelector;