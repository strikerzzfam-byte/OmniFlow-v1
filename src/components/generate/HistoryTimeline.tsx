import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ContentSnapshot } from '@/hooks/useOmniGenerate';
import { Clock, RotateCcw, Copy, Trash2 } from 'lucide-react';

interface HistoryTimelineProps {
  history: ContentSnapshot[];
  onRestore: (snapshot: ContentSnapshot) => void;
  onDuplicate: (snapshot: ContentSnapshot) => void;
  onDelete: (snapshotId: string) => void;
}

const HistoryTimeline: React.FC<HistoryTimelineProps> = ({
  history,
  onRestore,
  onDuplicate,
  onDelete
}) => {
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return date.toLocaleDateString();
  };

  if (history.length === 0) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">No history yet</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex items-center space-x-2 mb-4">
        <Clock className="w-4 h-4 text-primary" />
        <h4 className="font-semibold">History Timeline</h4>
        <Badge variant="outline" className="text-xs">
          {history.length}
        </Badge>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        <AnimatePresence>
          {history.map((snapshot, index) => (
            <motion.div
              key={snapshot.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="p-3 hover:bg-muted/50 transition-colors group">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <Badge variant="secondary" className="text-xs">
                        {snapshot.settings.tone}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {snapshot.settings.length}
                      </Badge>
                    </div>
                    <p className="text-sm font-medium truncate">
                      {snapshot.settings.topic}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatTime(snapshot.timestamp)}
                    </p>
                  </div>
                  
                  <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRestore(snapshot)}
                      className="h-6 w-6 p-0"
                      title="Restore"
                    >
                      <RotateCcw className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDuplicate(snapshot)}
                      className="h-6 w-6 p-0"
                      title="Duplicate"
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(snapshot.id)}
                      className="h-6 w-6 p-0 text-red-400 hover:text-red-300"
                      title="Delete"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>

                <div className="text-xs text-muted-foreground bg-muted/30 rounded p-2 mt-2">
                  {snapshot.preview}
                </div>

                <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                  <span>{snapshot.variants.length} variants</span>
                  <span>
                    Avg SEO: {Math.round(
                      snapshot.variants.reduce((acc, v) => acc + v.seoScore, 0) / snapshot.variants.length
                    )}%
                  </span>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default HistoryTimeline;