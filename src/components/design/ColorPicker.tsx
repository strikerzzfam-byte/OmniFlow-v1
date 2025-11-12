import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Palette } from 'lucide-react';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  label?: string;
}

const ColorPicker = ({ color, onChange, label = "Color" }: ColorPickerProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const colorPresets = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
    '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#D7BDE2',
    '#A3E4D7', '#F9E79F', '#FADBD8', '#D5DBDB', '#2C3E50'
  ];

  return (
    <div className="relative">
      <div className="flex items-center gap-2 mb-2">
        <Palette className="w-4 h-4" />
        <span className="text-sm font-medium">{label}</span>
      </div>
      
      <div className="flex gap-2">
        <Button
          variant="outline"
          className="w-12 h-8 p-0 border-2"
          style={{ backgroundColor: color }}
          onClick={() => setIsOpen(!isOpen)}
        />
        <Input
          type="text"
          value={color}
          onChange={(e) => onChange(e.target.value)}
          className="h-8 flex-1"
          placeholder="#000000"
        />
      </div>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-full left-0 mt-2 p-3 bg-background border rounded-lg shadow-lg z-50 w-64"
        >
          <div className="grid grid-cols-5 gap-2 mb-3">
            {colorPresets.map((preset) => (
              <button
                key={preset}
                className="w-10 h-10 rounded border-2 border-border hover:scale-110 transition-transform"
                style={{ backgroundColor: preset }}
                onClick={() => {
                  onChange(preset);
                  setIsOpen(false);
                }}
              />
            ))}
          </div>
          
          <Input
            type="color"
            value={color}
            onChange={(e) => onChange(e.target.value)}
            className="w-full h-10"
          />
          
          <Button
            variant="outline"
            size="sm"
            className="w-full mt-2"
            onClick={() => setIsOpen(false)}
          >
            Close
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default ColorPicker;