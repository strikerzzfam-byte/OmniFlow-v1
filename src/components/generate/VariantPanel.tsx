import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { ContentVariant } from '@/hooks/useOmniGenerate';
import { 
  Copy, Edit3, RotateCcw, Expand, Shrink, Zap, 
  Target, TrendingUp, Eye, Download, Send, Palette
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface VariantPanelProps {
  variants: ContentVariant[];
  selectedVariant: ContentVariant | null;
  onVariantSelect: (variant: ContentVariant) => void;
  onSmartAction: (action: string, content: string) => string;
  onExport: (format: string) => void;
  onSendToOmniWrite: () => void;
  onSendToOmniDesign: () => void;
}

const VariantPanel: React.FC<VariantPanelProps> = ({
  variants,
  selectedVariant,
  onVariantSelect,
  onSmartAction,
  onExport,
  onSendToOmniWrite,
  onSendToOmniDesign
}) => {
  const [editMode, setEditMode] = useState(false);
  const [editContent, setEditContent] = useState('');

  const smartActions = [
    { id: 'summarize', name: 'Summarize', icon: Shrink, color: '#10B981' },
    { id: 'expand', name: 'Expand', icon: Expand, color: '#3B82F6' },
    { id: 'rewrite', name: 'Rewrite', icon: RotateCcw, color: '#8B5CF6' },
    { id: 'addCTA', name: 'Add CTA', icon: Target, color: '#F59E0B' },
    { id: 'seoOptimize', name: 'SEO Boost', icon: TrendingUp, color: '#EF4444' }
  ];

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const handleEdit = () => {
    if (editMode) {
      // Save changes
      setEditMode(false);
    } else {
      setEditContent(selectedVariant?.content || '');
      setEditMode(true);
    }
  };

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  return (
    <div className="w-[500px] glass border-l border-glass-border/50 flex flex-col max-h-screen overflow-hidden scrollbar-none">
      {/* Header */}
      <div className="p-4 border-b border-glass-border/50">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">Output & Variations</h3>
          <Badge variant="outline" className="text-xs">
            {variants.length} variants
          </Badge>
        </div>

        {/* Variant Tabs */}
        {variants.length > 0 && (
          <div className="flex space-x-1 bg-muted/30 rounded-lg p-1">
            {variants.map((variant, index) => (
              <Button
                key={variant.id}
                variant={selectedVariant?.id === variant.id ? "default" : "ghost"}
                size="sm"
                onClick={() => onVariantSelect(variant)}
                className="flex-1 text-xs"
              >
                {variant.tone.charAt(0).toUpperCase() + variant.tone.slice(1)}
              </Button>
            ))}
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto max-h-full scrollbar-none">
        {selectedVariant ? (
          <div className="p-4 space-y-4">
            {/* Scores */}
            <div className="grid grid-cols-2 gap-3">
              <Card className="p-3 bg-muted/30">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-muted-foreground">SEO Score</span>
                  <TrendingUp className="w-3 h-3 text-muted-foreground" />
                </div>
                <div className={`text-lg font-bold ${getScoreColor(selectedVariant.seoScore)}`}>
                  {selectedVariant.seoScore}%
                </div>
              </Card>

              <Card className="p-3 bg-muted/30">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-muted-foreground">Readability</span>
                  <Eye className="w-3 h-3 text-muted-foreground" />
                </div>
                <div className={`text-lg font-bold ${getScoreColor(selectedVariant.readabilityScore)}`}>
                  {selectedVariant.readabilityScore}%
                </div>
              </Card>
            </div>

            {/* Content Editor */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Generated Content</span>
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(selectedVariant.content)}
                    className="h-8 w-8 p-0"
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleEdit}
                    className="h-8 w-8 p-0"
                  >
                    <Edit3 className="w-3 h-3" />
                  </Button>
                </div>
              </div>

              {editMode ? (
                <Textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="min-h-[300px] text-sm"
                />
              ) : (
                <div className="p-3 bg-muted/20 rounded-lg border min-h-[300px] max-h-[400px] overflow-y-auto text-sm whitespace-pre-wrap scrollbar-none">
                  {selectedVariant.content}
                </div>
              )}
            </div>

            {/* Smart Actions */}
            <div className="space-y-3">
              <span className="text-sm font-medium">Smart Actions</span>
              <div className="grid grid-cols-2 gap-2">
                {smartActions.map(action => {
                  const Icon = action.icon;
                  return (
                    <Button
                      key={action.id}
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const result = onSmartAction(action.id, selectedVariant.content);
                        // Update content with result
                      }}
                      className="justify-start text-xs"
                    >
                      <Icon className="w-3 h-3 mr-1" style={{ color: action.color }} />
                      {action.name}
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* OmniBridge Integration */}
            <div className="space-y-3">
              <span className="text-sm font-medium">OmniBridge</span>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onSendToOmniWrite}
                  className="w-full justify-start"
                >
                  <Edit3 className="w-4 h-4 mr-2 text-primary" />
                  Edit in OmniWrite
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onSendToOmniDesign}
                  className="w-full justify-start"
                >
                  <Palette className="w-4 h-4 mr-2 text-secondary" />
                  Design in OmniDesign
                </Button>
              </div>
            </div>

            {/* Export Options */}
            <div className="space-y-3">
              <span className="text-sm font-medium">Export</span>
              <div className="grid grid-cols-2 gap-2">
                {['PDF', 'DOCX', 'HTML', 'MD'].map(format => (
                  <Button
                    key={format}
                    variant="outline"
                    size="sm"
                    onClick={() => onExport(format.toLowerCase())}
                    className="text-xs"
                  >
                    <Download className="w-3 h-3 mr-1" />
                    {format}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full p-8 text-center">
            <div>
              <Zap className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">
                Generate content to see variations and smart editing tools
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VariantPanel;