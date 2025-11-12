import { useState, useCallback, useEffect } from 'react';
import { Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';

export interface WritingTone {
  id: string;
  name: string;
  description: string;
  color: string;
}

export interface DocumentSnapshot {
  id: string;
  content: string;
  timestamp: number;
  preview: string;
}

export interface Comment {
  id: string;
  content: string;
  author: string;
  timestamp: number;
  position: number;
  resolved: boolean;
}

export const useRichEditor = () => {
  const [editor, setEditor] = useState<Editor | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [collaborators, setCollaborators] = useState<any[]>([]);
  const [currentTone, setCurrentTone] = useState<WritingTone>({
    id: 'neutral',
    name: 'Neutral',
    description: 'Balanced and clear',
    color: '#6B7280'
  });
  const [documentHistory, setDocumentHistory] = useState<DocumentSnapshot[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [wordCount, setWordCount] = useState(0);
  const [readabilityScore, setReadabilityScore] = useState(0);
  const [seoScore, setSeoScore] = useState(0);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const tones: WritingTone[] = [
    { id: 'casual', name: 'Casual', description: 'Friendly and conversational', color: '#10B981' },
    { id: 'formal', name: 'Formal', description: 'Professional and structured', color: '#3B82F6' },
    { id: 'persuasive', name: 'Persuasive', description: 'Compelling and convincing', color: '#F59E0B' },
    { id: 'technical', name: 'Technical', description: 'Precise and detailed', color: '#8B5CF6' },
    { id: 'creative', name: 'Creative', description: 'Imaginative and expressive', color: '#EC4899' }
  ];

  const initializeEditor = useCallback(() => {
    const editorInstance = new Editor({
      extensions: [
        StarterKit,
        Image,
        Link.configure({
          openOnClick: false,
        }),
        Placeholder.configure({
          placeholder: 'Start writing your masterpiece...',
        }),
      ],
      content: '',
      onUpdate: ({ editor }) => {
        const text = editor.getText();
        setWordCount(text.split(/\s+/).filter(word => word.length > 0).length);
        calculateReadabilityScore(text);
        calculateSEOScore(editor.getHTML());
        autoSave(editor.getHTML());
      },
    });

    setEditor(editorInstance);
    return editorInstance;
  }, []);

  const calculateReadabilityScore = (text: string) => {
    // Simple readability calculation (Flesch Reading Ease approximation)
    const sentences = text.split(/[.!?]+/).length - 1;
    const words = text.split(/\s+/).length;
    const syllables = text.split(/[aeiouAEIOU]/).length - 1;
    
    if (sentences === 0 || words === 0) {
      setReadabilityScore(0);
      return;
    }
    
    const score = 206.835 - (1.015 * (words / sentences)) - (84.6 * (syllables / words));
    setReadabilityScore(Math.max(0, Math.min(100, score)));
  };

  const calculateSEOScore = (html: string) => {
    // Simple SEO score based on structure
    let score = 0;
    const hasH1 = html.includes('<h1>');
    const hasH2 = html.includes('<h2>');
    const hasLinks = html.includes('<a ');
    const wordCount = html.replace(/<[^>]*>/g, '').split(/\s+/).length;
    
    if (hasH1) score += 25;
    if (hasH2) score += 20;
    if (hasLinks) score += 15;
    if (wordCount > 300) score += 20;
    if (wordCount > 600) score += 20;
    
    setSeoScore(score);
  };

  const autoSave = useCallback((content: string) => {
    setIsAutoSaving(true);
    
    // Simulate auto-save delay
    setTimeout(() => {
      localStorage.setItem('omniwrite-draft', content);
      setLastSaved(new Date());
      setIsAutoSaving(false);
      
      // Create snapshot every 30 seconds
      const now = Date.now();
      const lastSnapshot = documentHistory[documentHistory.length - 1];
      if (!lastSnapshot || now - lastSnapshot.timestamp > 30000) {
        const preview = content.replace(/<[^>]*>/g, '').substring(0, 100) + '...';
        const snapshot: DocumentSnapshot = {
          id: `snapshot-${now}`,
          content,
          timestamp: now,
          preview
        };
        setDocumentHistory(prev => [...prev.slice(-9), snapshot]); // Keep last 10 snapshots
      }
    }, 1000);
  }, [documentHistory]);

  const summarizeText = useCallback(() => {
    if (!editor) return;
    
    const text = editor.getText();
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const summary = sentences.slice(0, Math.max(1, Math.floor(sentences.length / 3))).join('. ') + '.';
    
    return summary;
  }, [editor]);

  const expandText = useCallback((selectedText: string) => {
    // Mock expansion - in real app would use AI
    const expansions = [
      `${selectedText} Furthermore, this concept extends beyond the initial scope to encompass additional considerations and implications.`,
      `${selectedText} This idea can be developed further by examining the underlying principles and their practical applications.`,
      `${selectedText} To elaborate on this point, we should consider the broader context and related factors that influence the outcome.`
    ];
    return expansions[Math.floor(Math.random() * expansions.length)];
  }, []);

  const rephraseText = useCallback((selectedText: string, tone: WritingTone) => {
    // Mock rephrasing based on tone
    const rephrasings = {
      casual: `Hey, so basically ${selectedText.toLowerCase()}`,
      formal: `It is important to note that ${selectedText.toLowerCase()}`,
      persuasive: `Consider this: ${selectedText}. This clearly demonstrates the importance of the matter.`,
      technical: `The analysis indicates that ${selectedText.toLowerCase()}`,
      creative: `Imagine this: ${selectedText} - a concept that sparks endless possibilities.`
    };
    return rephrasings[tone.id as keyof typeof rephrasings] || selectedText;
  }, []);

  const generateOutline = useCallback(() => {
    if (!editor) return [];
    
    const html = editor.getHTML();
    const headings = html.match(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/g) || [];
    
    return headings.map((heading, index) => {
      const level = parseInt(heading.match(/<h([1-6])/)?.[1] || '1');
      const text = heading.replace(/<[^>]*>/g, '');
      return {
        id: `heading-${index}`,
        level,
        text,
        position: index
      };
    });
  }, [editor]);

  const addComment = useCallback((content: string, position: number) => {
    const comment: Comment = {
      id: `comment-${Date.now()}`,
      content,
      author: 'Current User',
      timestamp: Date.now(),
      position,
      resolved: false
    };
    setComments(prev => [...prev, comment]);
  }, []);

  const exportDocument = useCallback((format: 'pdf' | 'docx' | 'markdown' | 'html') => {
    if (!editor) return;
    
    const content = editor.getHTML();
    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `document.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  }, [editor]);

  useEffect(() => {
    const savedDraft = localStorage.getItem('omniwrite-draft');
    if (savedDraft && editor) {
      editor.commands.setContent(savedDraft);
    }
  }, [editor]);

  return {
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
  };
};