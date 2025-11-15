import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Hash, ChevronRight, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OutlineItem {
  id: string;
  level: number;
  text: string;
  position: number;
}

interface DocumentOutlineProps {
  outline: OutlineItem[];
  onItemClick?: (item: OutlineItem) => void;
  className?: string;
}

const DocumentOutline: React.FC<DocumentOutlineProps> = ({ 
  outline, 
  onItemClick, 
  className 
}) => {
  const [expandedItems, setExpandedItems] = React.useState<Set<string>>(new Set());

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const getIndentLevel = (level: number) => {
    return Math.max(0, (level - 1) * 16);
  };

  const hasChildren = (item: OutlineItem, index: number) => {
    return outline.slice(index + 1).some(nextItem => nextItem.level > item.level);
  };

  const getVisibleItems = () => {
    const visibleItems: { item: OutlineItem; index: number }[] = [];
    
    for (let i = 0; i < outline.length; i++) {
      const item = outline[i];
      const parentLevel = item.level - 1;
      
      // Check if this item should be visible based on parent expansion
      let shouldShow = true;
      for (let j = i - 1; j >= 0; j--) {
        const prevItem = outline[j];
        if (prevItem.level < item.level) {
          if (prevItem.level === parentLevel && !expandedItems.has(prevItem.id)) {
            shouldShow = false;
            break;
          }
          if (prevItem.level < parentLevel) {
            break;
          }
        }
      }
      
      if (shouldShow) {
        visibleItems.push({ item, index: i });
      }
    }
    
    return visibleItems;
  };

  if (outline.length === 0) {
    return (
      <Card className={cn("p-6 text-center", className)}>
        <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
        <p className="text-muted-foreground">
          Start writing to see your document outline
        </p>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={cn("space-y-1", className)}
    >
      <div className="flex items-center space-x-2 mb-4 px-2">
        <FileText className="w-4 h-4 text-primary" />
        <h3 className="font-semibold text-sm">Document Outline</h3>
      </div>

      <div className="space-y-1">
        {getVisibleItems().map(({ item, index }) => {
          const hasChildItems = hasChildren(item, index);
          const isExpanded = expandedItems.has(item.id);
          
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group"
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onItemClick?.(item)}
                className={cn(
                  "w-full justify-start text-left h-auto py-2 px-2",
                  "hover:bg-muted/50 transition-colors",
                  `pl-${Math.max(2, 2 + getIndentLevel(item.level) / 4)}`
                )}
                style={{ paddingLeft: `${8 + getIndentLevel(item.level)}px` }}
              >
                <div className="flex items-center space-x-2 flex-1 min-w-0">
                  {hasChildItems && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleExpanded(item.id);
                      }}
                      className="p-0.5 hover:bg-muted rounded"
                    >
                      {isExpanded ? (
                        <ChevronDown className="w-3 h-3" />
                      ) : (
                        <ChevronRight className="w-3 h-3" />
                      )}
                    </button>
                  )}
                  
                  <Hash 
                    className={cn(
                      "w-3 h-3 flex-shrink-0",
                      item.level === 1 ? "text-primary" :
                      item.level === 2 ? "text-secondary" :
                      "text-muted-foreground"
                    )} 
                  />
                  
                  <span 
                    className={cn(
                      "truncate text-sm",
                      item.level === 1 ? "font-semibold" :
                      item.level === 2 ? "font-medium" :
                      "font-normal text-muted-foreground"
                    )}
                    title={item.text}
                  >
                    {item.text}
                  </span>
                </div>
              </Button>
            </motion.div>
          );
        })}
      </div>

      {outline.length > 0 && (
        <div className="pt-4 border-t border-glass-border/50 mt-4">
          <div className="text-xs text-muted-foreground px-2">
            {outline.length} heading{outline.length !== 1 ? 's' : ''} found
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default DocumentOutline;