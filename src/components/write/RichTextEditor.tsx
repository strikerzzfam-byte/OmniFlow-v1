import React, { useEffect, useRef } from 'react';
import { EditorContent } from '@tiptap/react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface RichTextEditorProps {
  editor: any;
  className?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ editor, className }) => {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editor && editorRef.current) {
      editor.commands.focus();
    }
  }, [editor]);

  if (!editor) {
    return (
      <div className="flex items-center justify-center h-full">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <motion.div
      ref={editorRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "relative h-full overflow-hidden",
        "prose prose-lg max-w-none",
        "prose-headings:text-foreground prose-p:text-foreground",
        "prose-strong:text-foreground prose-em:text-foreground",
        "prose-code:text-foreground prose-pre:bg-muted",
        "prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground",
        "prose-a:text-primary prose-a:no-underline hover:prose-a:underline",
        className
      )}
    >
      <EditorContent
        editor={editor}
        className="h-full overflow-y-auto px-8 py-6 focus:outline-none"
        style={{
          minHeight: '100%',
          fontSize: '16px',
          lineHeight: '1.7',
          fontFamily: 'Inter, system-ui, sans-serif'
        }}
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="absolute top-4 right-4 glass rounded-lg p-2 shadow-lg border border-glass-border/50"
        style={{ display: editor.state.selection.empty ? 'none' : 'block' }}
      >
        <div className="flex items-center space-x-1">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={cn(
              "p-1.5 rounded text-xs font-medium transition-colors",
              editor.isActive('bold') ? "bg-primary text-primary-foreground" : "hover:bg-muted"
            )}
          >
            B
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={cn(
              "p-1.5 rounded text-xs font-medium italic transition-colors",
              editor.isActive('italic') ? "bg-primary text-primary-foreground" : "hover:bg-muted"
            )}
          >
            I
          </button>
          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={cn(
              "p-1.5 rounded text-xs font-medium line-through transition-colors",
              editor.isActive('strike') ? "bg-primary text-primary-foreground" : "hover:bg-muted"
            )}
          >
            S
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default RichTextEditor;