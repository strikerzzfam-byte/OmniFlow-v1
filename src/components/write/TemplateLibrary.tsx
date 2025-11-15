import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  FileText, Search, Sparkles, Mail, Globe, 
  ShoppingBag, BookOpen, Megaphone, Users, 
  TrendingUp, Coffee, Heart, Zap
} from 'lucide-react';

interface Template {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: React.ComponentType<any>;
  content: string;
  tags: string[];
}

interface TemplateLibraryProps {
  onTemplateSelect: (template: Template) => void;
  onClose: () => void;
}

const TemplateLibrary: React.FC<TemplateLibraryProps> = ({ onTemplateSelect, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const templates: Template[] = [
    {
      id: 'blog-post',
      title: 'Blog Post',
      description: 'Engaging blog post with introduction, body, and conclusion',
      category: 'content',
      icon: FileText,
      tags: ['seo', 'engagement', 'storytelling'],
      content: `# Your Compelling Blog Title

## Introduction
Hook your readers with an engaging opening that addresses their pain point or curiosity.

## Main Content
### Key Point 1
Elaborate on your first main point with examples and evidence.

### Key Point 2
Develop your second key argument with supporting details.

### Key Point 3
Present your final point that ties everything together.

## Conclusion
Summarize your key points and provide a clear call-to-action for your readers.

---
*What are your thoughts on this topic? Share in the comments below!*`
    },
    {
      id: 'email-newsletter',
      title: 'Email Newsletter',
      description: 'Professional newsletter template with sections and CTAs',
      category: 'marketing',
      icon: Mail,
      tags: ['email', 'newsletter', 'engagement'],
      content: `# Weekly Newsletter - [Date]

## 👋 Hello [Name],

Welcome to this week's edition of our newsletter!

## 🔥 This Week's Highlights

### Feature Story
Brief description of your main story or announcement.

### Quick Updates
- Update 1: Brief description
- Update 2: Brief description  
- Update 3: Brief description

## 📚 Recommended Reading
**[Article Title]** - Brief description of why this is worth reading.

## 🎯 Call to Action
[Your main CTA - could be to visit your website, try a product, etc.]

---
Thanks for reading! Reply to this email with your thoughts.

Best regards,
[Your Name]`
    },
    {
      id: 'product-description',
      title: 'Product Description',
      description: 'Compelling product copy that converts browsers to buyers',
      category: 'ecommerce',
      icon: ShoppingBag,
      tags: ['sales', 'conversion', 'features'],
      content: `# [Product Name] - [Key Benefit]

## Transform Your [Problem] with [Solution]

**The Problem:** Describe the pain point your product solves.

**The Solution:** Introduce your product as the perfect solution.

## Key Features & Benefits

### ✨ Feature 1
How this feature benefits the customer.

### 🚀 Feature 2  
The value this brings to their life.

### 💎 Feature 3
Why this makes your product special.

## What's Included
- Item 1
- Item 2
- Item 3

## Customer Reviews
> "This product changed my life!" - Happy Customer

## Get Yours Today
**Special Offer:** [Discount/Bonus]
**Price:** $[Amount]

[Order Now Button]`
    },
    {
      id: 'how-to-guide',
      title: 'How-To Guide',
      description: 'Step-by-step tutorial that educates and engages',
      category: 'educational',
      icon: BookOpen,
      tags: ['tutorial', 'education', 'step-by-step'],
      content: `# How to [Achieve Desired Outcome]

## Introduction
Explain what readers will learn and why it's valuable.

## What You'll Need
- Requirement 1
- Requirement 2
- Requirement 3

## Step-by-Step Instructions

### Step 1: [Action]
Detailed explanation of the first step with tips.

### Step 2: [Action]
Clear instructions for the second step.

### Step 3: [Action]
Continue with remaining steps...

## Pro Tips
- 💡 Tip 1: Expert advice
- 💡 Tip 2: Common mistake to avoid
- 💡 Tip 3: Advanced technique

## Conclusion
Summarize what they've accomplished and next steps.

## Troubleshooting
**Problem:** Common issue
**Solution:** How to fix it`
    },
    {
      id: 'social-media-post',
      title: 'Social Media Post',
      description: 'Engaging social content with hashtags and CTAs',
      category: 'social',
      icon: Megaphone,
      tags: ['social', 'engagement', 'viral'],
      content: `🔥 [Attention-grabbing opening]

[Main message that provides value, entertainment, or insight]

Key points:
✅ Point 1
✅ Point 2  
✅ Point 3

[Call to action - ask a question, encourage sharing, etc.]

#hashtag1 #hashtag2 #hashtag3 #hashtag4 #hashtag5

---
💬 What's your experience with this? Share below!
🔄 Repost if you found this helpful
❤️ Save for later`
    },
    {
      id: 'landing-page',
      title: 'Landing Page Copy',
      description: 'High-converting landing page with clear value proposition',
      category: 'marketing',
      icon: Globe,
      tags: ['conversion', 'sales', 'landing'],
      content: `# [Compelling Headline That Addresses Main Benefit]

## Subheadline that elaborates on the promise

### The Problem
Describe the pain point your audience faces daily.

### The Solution  
Introduce your product/service as the perfect solution.

## Why Choose Us?

### 🎯 Benefit 1
Explanation of key benefit

### 🚀 Benefit 2
Another compelling reason

### 💎 Benefit 3
Final convincing point

## Social Proof
> "Testimonial from satisfied customer" - Customer Name, Title

## Pricing
**Special Launch Price:** $[Amount]
~~Regular Price: $[Higher Amount]~~

## Get Started Today
[Call-to-Action Button]

**30-Day Money-Back Guarantee**`
    }
  ];

  const categories = [
    { id: 'all', name: 'All Templates', icon: Sparkles },
    { id: 'content', name: 'Content', icon: FileText },
    { id: 'marketing', name: 'Marketing', icon: TrendingUp },
    { id: 'ecommerce', name: 'E-commerce', icon: ShoppingBag },
    { id: 'educational', name: 'Educational', icon: BookOpen },
    { id: 'social', name: 'Social Media', icon: Users }
  ];

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="glass rounded-lg w-full max-w-4xl max-h-[80vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-glass-border/50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-bold">Template Library</h2>
            </div>
            <Button variant="ghost" onClick={onClose}>
              ✕
            </Button>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {categories.map(category => {
              const Icon = category.icon;
              return (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className="flex items-center space-x-1"
                >
                  <Icon className="w-4 h-4" />
                  <span>{category.name}</span>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Templates Grid */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnimatePresence>
              {filteredTemplates.map((template, index) => {
                const Icon = template.icon;
                return (
                  <motion.div
                    key={template.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card 
                      className="p-4 cursor-pointer transition-all hover:bg-muted/50 hover:scale-105"
                      onClick={() => onTemplateSelect(template)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Icon className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold mb-1">{template.title}</h3>
                          <p className="text-sm text-muted-foreground mb-3">
                            {template.description}
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {template.tags.map(tag => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {filteredTemplates.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No templates found matching your search.</p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TemplateLibrary;