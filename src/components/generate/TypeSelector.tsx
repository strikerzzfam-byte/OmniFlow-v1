import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ContentType } from '@/hooks/useOmniGenerate';
import { cn } from '@/lib/utils';

interface TypeSelectorProps {
  contentTypes: ContentType[];
  selectedType: ContentType | null;
  onTypeSelect: (type: ContentType) => void;
}

const TypeSelector: React.FC<TypeSelectorProps> = ({
  contentTypes,
  selectedType,
  onTypeSelect
}) => {
  return (
    <div className="w-80 glass border-r border-glass-border/50 p-6 overflow-y-auto max-h-screen scrollbar-none">
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-2">Content Types</h2>
        <p className="text-sm text-muted-foreground">
          Choose your content format
        </p>
      </div>

      <div className="space-y-3">
        <AnimatePresence>
          {contentTypes.map((type, index) => (
            <motion.div
              key={type.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                className={cn(
                  "p-4 cursor-pointer transition-all hover:bg-muted/50",
                  "border-2 hover:border-primary/50",
                  selectedType?.id === type.id && "border-primary bg-primary/10"
                )}
                onClick={() => onTypeSelect(type)}
              >
                <div className="flex items-start space-x-3">
                  <div className="text-2xl">{type.icon}</div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold mb-1">{type.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {type.description}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {type.templates.slice(0, 2).map(template => (
                        <Badge key={template} variant="secondary" className="text-xs">
                          {template}
                        </Badge>
                      ))}
                      {type.templates.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{type.templates.length - 2}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-8 p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg border border-primary/20"
      >
        <h4 className="font-semibold mb-2 text-primary">✨ Pro Tip</h4>
        <p className="text-sm text-muted-foreground">
          Select a content type to unlock AI-powered generation with multiple variants and smart editing tools.
        </p>
      </motion.div>
    </div>
  );
};

export default TypeSelector;