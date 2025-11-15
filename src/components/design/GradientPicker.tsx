import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Minus, Palette } from 'lucide-react';

interface GradientStop {
  offset: number;
  color: string;
}

interface Gradient {
  type: 'linear' | 'radial';
  stops: GradientStop[];
  start: { x: number; y: number };
  end: { x: number; y: number };
}

interface GradientPickerProps {
  gradient?: Gradient;
  onChange: (gradient: Gradient) => void;
  label?: string;
}

const GradientPicker = ({ gradient, onChange, label = "Gradient" }: GradientPickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const defaultGradient: Gradient = {
    type: 'linear',
    stops: [
      { offset: 0, color: '#00B4D8' },
      { offset: 1, color: '#9D4EDD' }
    ],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 0 }
  };

  const currentGradient = gradient || defaultGradient;

  const updateGradient = (updates: Partial<Gradient>) => {
    onChange({ ...currentGradient, ...updates });
  };

  const addStop = () => {
    const newStop: GradientStop = {
      offset: 0.5,
      color: '#FFFFFF'
    };
    updateGradient({
      stops: [...currentGradient.stops, newStop].sort((a, b) => a.offset - b.offset)
    });
  };

  const removeStop = (index: number) => {
    if (currentGradient.stops.length > 2) {
      const newStops = currentGradient.stops.filter((_, i) => i !== index);
      updateGradient({ stops: newStops });
    }
  };

  const updateStop = (index: number, updates: Partial<GradientStop>) => {
    const newStops = currentGradient.stops.map((stop, i) => 
      i === index ? { ...stop, ...updates } : stop
    );
    updateGradient({ stops: newStops.sort((a, b) => a.offset - b.offset) });
  };

  const previewStyle = {
    background: `linear-gradient(90deg, ${currentGradient.stops
      .map(stop => `${stop.color} ${stop.offset * 100}%`)
      .join(', ')})`
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-2 mb-2">
        <Palette className="w-4 h-4" />
        <span className="text-sm font-medium">{label}</span>
      </div>
      
      <Button
        variant="outline"
        className="w-32 h-8 p-1 border-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="w-full h-full rounded" style={previewStyle} />
      </Button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-full left-0 mt-2 p-4 bg-background/95 backdrop-blur-sm border rounded-lg shadow-lg z-50 w-80"
        >
          {/* Gradient Type */}
          <div className="mb-4">
            <label className="text-xs text-muted-foreground mb-2 block">Type</label>
            <Select 
              value={currentGradient.type} 
              onValueChange={(value: 'linear' | 'radial') => updateGradient({ type: value })}
            >
              <SelectTrigger className="h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="linear">Linear</SelectItem>
                <SelectItem value="radial">Radial</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Gradient Preview */}
          <div className="mb-4">
            <div className="h-8 rounded border" style={previewStyle} />
          </div>

          {/* Color Stops */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs text-muted-foreground">Color Stops</label>
              <Button
                variant="ghost"
                size="sm"
                onClick={addStop}
                className="h-6 w-6 p-0"
              >
                <Plus className="w-3 h-3" />
              </Button>
            </div>
            
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {currentGradient.stops.map((stop, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    type="color"
                    value={stop.color}
                    onChange={(e) => updateStop(index, { color: e.target.value })}
                    className="w-8 h-6 p-0 border-0"
                  />
                  <Input
                    type="number"
                    value={Math.round(stop.offset * 100)}
                    onChange={(e) => updateStop(index, { offset: Number(e.target.value) / 100 })}
                    className="w-16 h-6 text-xs"
                    min="0"
                    max="100"
                  />
                  <span className="text-xs text-muted-foreground">%</span>
                  {currentGradient.stops.length > 2 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeStop(index)}
                      className="h-6 w-6 p-0 hover:bg-destructive/20 hover:text-destructive"
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => setIsOpen(false)}
          >
            Apply
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default GradientPicker;