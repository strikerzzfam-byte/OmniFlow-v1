import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { FileText, Target, Clock } from 'lucide-react';

interface WordCountTrackerProps {
  wordCount: number;
  targetWords?: number;
  readingTime: number;
  className?: string;
}

const WordCountTracker: React.FC<WordCountTrackerProps> = ({
  wordCount,
  targetWords = 1000,
  readingTime,
  className
}) => {
  const progress = Math.min((wordCount / targetWords) * 100, 100);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={className}
    >
      <Card className="p-4 bg-muted/30">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Progress</span>
            </div>
            <span className="text-sm text-muted-foreground">
              {wordCount}/{targetWords} words
            </span>
          </div>
          
          <Progress value={progress} className="h-2" />
          
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Target className="w-3 h-3" />
              <span>{Math.round(progress)}% complete</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>{readingTime} min read</span>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default WordCountTracker;