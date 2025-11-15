import { useState, useCallback, useEffect } from 'react';

export interface ContentType {
  id: string;
  name: string;
  icon: string;
  description: string;
  templates: string[];
}

export interface GenerationSettings {
  topic: string;
  tone: 'casual' | 'formal' | 'emotional' | 'humorous' | 'luxury' | 'storytelling';
  audience: string;
  length: 'short' | 'medium' | 'long';
  perspective: '1st' | '2nd' | '3rd';
  style: 'educational' | 'marketing' | 'inspirational' | 'technical' | 'conversational';
}

export interface ContentVariant {
  id: string;
  content: string;
  tone: string;
  length: string;
  timestamp: number;
  seoScore: number;
  readabilityScore: number;
}

export interface ContentSnapshot {
  id: string;
  settings: GenerationSettings;
  variants: ContentVariant[];
  timestamp: number;
  preview: string;
}

export const useOmniGenerate = () => {
  const [selectedType, setSelectedType] = useState<ContentType | null>(null);
  const [settings, setSettings] = useState<GenerationSettings>({
    topic: '',
    tone: 'casual',
    audience: '',
    length: 'medium',
    perspective: '2nd',
    style: 'conversational'
  });
  const [variants, setVariants] = useState<ContentVariant[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [history, setHistory] = useState<ContentSnapshot[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<ContentVariant | null>(null);

  const contentTypes: ContentType[] = [
    {
      id: 'blog',
      name: 'Blog Post',
      icon: '📝',
      description: 'Long-form articles and posts',
      templates: ['How-to Guide', 'Listicle', 'Opinion Piece', 'Tutorial', 'Case Study', 'Review', 'Comparison', 'News Article', 'Interview', 'Research Post']
    },
    {
      id: 'script',
      name: 'Script',
      icon: '🎬',
      description: 'Video and presentation scripts',
      templates: ['YouTube Video', 'Presentation', 'Podcast', 'Commercial', 'Webinar', 'Training Video', 'Product Demo', 'Explainer Video', 'Interview Script', 'Sales Pitch']
    },
    {
      id: 'caption',
      name: 'Caption',
      icon: '💬',
      description: 'Social media captions',
      templates: ['Instagram', 'LinkedIn', 'Facebook', 'Twitter', 'TikTok', 'YouTube Shorts', 'Pinterest', 'Snapchat', 'Stories', 'Reels']
    },
    {
      id: 'adcopy',
      name: 'Ad Copy',
      icon: '🎯',
      description: 'Marketing and advertising copy',
      templates: ['Google Ads', 'Facebook Ads', 'Banner Copy', 'CTA Copy', 'Landing Page', 'PPC Ads', 'Display Ads', 'Video Ads', 'Native Ads', 'Retargeting']
    },
    {
      id: 'product',
      name: 'Product Description',
      icon: '🛍️',
      description: 'E-commerce product descriptions',
      templates: ['Amazon Listing', 'Shopify Product', 'Feature List', 'Benefits Copy', 'Spec Sheet', 'Comparison Chart', 'User Manual', 'FAQ', 'Warranty Info', 'Tech Specs']
    },
    {
      id: 'email',
      name: 'Email',
      icon: '📧',
      description: 'Email marketing and newsletters',
      templates: ['Newsletter', 'Sales Email', 'Welcome Series', 'Follow-up', 'Abandoned Cart', 'Product Launch', 'Event Invite', 'Survey Request', 'Thank You', 'Re-engagement']
    },
    {
      id: 'social',
      name: 'Social Pack',
      icon: '📱',
      description: 'Multi-platform social content',
      templates: ['Cross-Platform', 'Thread Series', 'Story Content', 'Engagement Posts', 'Poll Posts', 'Behind Scenes', 'User Generated', 'Trending Topics', 'Live Updates', 'Community Posts']
    },
    {
      id: 'custom',
      name: 'Custom Template',
      icon: '🎯',
      description: 'Create your own content template',
      templates: ['Blank Template', 'Custom Format', 'Personal Style', 'Brand Template']
    }
  ];

  const generateContent = useCallback(async () => {
    if (!selectedType || !settings.topic) return;

    setIsGenerating(true);
    
    // Simulate AI generation with different variants
    const mockVariants: ContentVariant[] = [
      {
        id: `variant-${Date.now()}-1`,
        content: generateMockContent(settings, 'casual'),
        tone: 'casual',
        length: settings.length,
        timestamp: Date.now(),
        seoScore: Math.floor(Math.random() * 40) + 60,
        readabilityScore: Math.floor(Math.random() * 30) + 70
      },
      {
        id: `variant-${Date.now()}-2`,
        content: generateMockContent(settings, 'formal'),
        tone: 'formal',
        length: settings.length,
        timestamp: Date.now(),
        seoScore: Math.floor(Math.random() * 40) + 60,
        readabilityScore: Math.floor(Math.random() * 30) + 70
      },
      {
        id: `variant-${Date.now()}-3`,
        content: generateMockContent(settings, 'emotional'),
        tone: 'emotional',
        length: settings.length,
        timestamp: Date.now(),
        seoScore: Math.floor(Math.random() * 40) + 60,
        readabilityScore: Math.floor(Math.random() * 30) + 70
      }
    ];

    setTimeout(() => {
      setVariants(mockVariants);
      setSelectedVariant(mockVariants[0]);
      
      // Add to history
      const snapshot: ContentSnapshot = {
        id: `snapshot-${Date.now()}`,
        settings: { ...settings },
        variants: mockVariants,
        timestamp: Date.now(),
        preview: mockVariants[0].content.substring(0, 100) + '...'
      };
      setHistory(prev => [snapshot, ...prev.slice(0, 9)]);
      
      setIsGenerating(false);
    }, 2000);
  }, [selectedType, settings]);

  const generateMockContent = (settings: GenerationSettings, tone: string): string => {
    const templates = {
      blog: {
        casual: `# ${settings.topic}\n\nHey there! Let's dive into ${settings.topic.toLowerCase()}. This is something that's been on my mind lately, and I think you'll find it pretty interesting too.\n\n## Why This Matters\n\nYou know how sometimes you come across something that just clicks? That's exactly what happened when I discovered this approach to ${settings.topic.toLowerCase()}.\n\n## The Game-Changer\n\nHere's the thing - most people think about this all wrong. Instead of focusing on the obvious stuff, try looking at it from this angle...\n\n## What You Can Do Right Now\n\n1. Start with the basics\n2. Build momentum gradually\n3. Track your progress\n\nTrust me, once you get the hang of this, you'll wonder why you didn't start sooner!`,
        formal: `# ${settings.topic}: A Comprehensive Analysis\n\n## Executive Summary\n\nThis document provides a detailed examination of ${settings.topic.toLowerCase()}, offering insights and recommendations based on current industry standards and best practices.\n\n## Introduction\n\nIn today's rapidly evolving landscape, understanding ${settings.topic.toLowerCase()} has become increasingly critical for organizations seeking to maintain competitive advantage.\n\n## Key Findings\n\nOur analysis reveals several important considerations:\n\n- Strategic implementation requires careful planning\n- Resource allocation must align with organizational objectives\n- Measurable outcomes should be established from the outset\n\n## Recommendations\n\nBased on our findings, we recommend a phased approach to implementation, beginning with foundational elements and progressing toward advanced applications.\n\n## Conclusion\n\nThe evidence clearly demonstrates that ${settings.topic.toLowerCase()} represents a significant opportunity for growth and innovation.`,
        emotional: `# The Life-Changing Power of ${settings.topic}\n\n## A Personal Journey\n\nI'll never forget the moment everything changed. It was a Tuesday morning, and I was struggling with the same challenges you might be facing right now.\n\n## The Breakthrough\n\n${settings.topic} wasn't just another solution - it was the missing piece I'd been searching for. The transformation didn't happen overnight, but when it did, it was nothing short of miraculous.\n\n## Your Turn to Shine\n\nI'm sharing this because I believe in you. I believe you have the strength to overcome whatever obstacles you're facing. ${settings.topic} can be your catalyst for change.\n\n## The Path Forward\n\nEvery expert was once a beginner. Every success story started with a single step. Your journey with ${settings.topic.toLowerCase()} begins now.\n\nRemember: You're not just learning about ${settings.topic.toLowerCase()} - you're investing in your future self.`
      },
      caption: {
        casual: `Just discovered something amazing about ${settings.topic.toLowerCase()}! 🤯\n\nHonestly, this changes everything. If you're dealing with this too, you NEED to see this.\n\nWhat's your experience been like? Drop a comment below! 👇\n\n#${settings.topic.replace(/\s+/g, '')} #GameChanger #MustSee`,
        formal: `Exploring the strategic implications of ${settings.topic.toLowerCase()} in today's market.\n\nKey insights:\n✓ Enhanced efficiency\n✓ Improved outcomes\n✓ Sustainable growth\n\nWhat are your thoughts on this approach?\n\n#${settings.topic.replace(/\s+/g, '')} #Strategy #Innovation`,
        emotional: `This hit me right in the feels... 💙\n\n${settings.topic} isn't just a concept - it's a lifeline for so many of us.\n\nTo everyone struggling with this: you're not alone. We're in this together.\n\nShare your story below. Let's support each other! 🤗\n\n#${settings.topic.replace(/\s+/g, '')} #Community #Support #YouMatter`
      }
    };

    const typeTemplates = templates[selectedType?.id as keyof typeof templates] || templates.blog;
    return typeTemplates[tone as keyof typeof typeTemplates] || typeTemplates.casual;
  };

  const smartActions = {
    summarize: (content: string) => content.split('\n').slice(0, 3).join('\n') + '\n\n[Summary generated]',
    expand: (content: string) => content + '\n\n## Additional Details\n\nFurthermore, this concept extends beyond the initial scope...',
    shorten: (content: string) => content.split('\n').slice(0, 5).join('\n'),
    rewrite: (content: string) => content.replace(/\b\w+\b/g, (word) => Math.random() > 0.8 ? `[${word}]` : word),
    addCTA: (content: string) => content + '\n\n## Ready to Get Started?\n\nTake action today and transform your approach!',
    seoOptimize: (content: string) => content.replace(/\n/g, '\n\n**SEO Keywords:** ' + settings.topic.toLowerCase() + '\n'),
  };

  const exportContent = useCallback((format: 'pdf' | 'docx' | 'html' | 'markdown') => {
    if (!selectedVariant) return;
    
    const blob = new Blob([selectedVariant.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `content.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  }, [selectedVariant]);

  const sendToOmniWrite = useCallback(() => {
    if (!selectedVariant) return;
    localStorage.setItem('omniwrite-import', selectedVariant.content);
    // Navigate to OmniWrite would happen here
  }, [selectedVariant]);

  const sendToOmniDesign = useCallback(() => {
    if (!selectedVariant) return;
    const designData = {
      title: settings.topic,
      content: selectedVariant.content.substring(0, 200),
      type: selectedType?.name
    };
    localStorage.setItem('omnidesign-import', JSON.stringify(designData));
    // Navigate to OmniDesign would happen here
  }, [selectedVariant, settings, selectedType]);

  useEffect(() => {
    // Auto-save settings
    localStorage.setItem('omnigenerate-settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    // Load saved settings
    const saved = localStorage.getItem('omnigenerate-settings');
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  }, []);

  return {
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
  };
};