import { Input } from '@/components/ui/input';

interface SimpleColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  label?: string;
}

const SimpleColorPicker = ({ color, onChange, label }: SimpleColorPickerProps) => {
  return (
    <div className="flex items-center gap-2">
      {label && <span className="text-xs text-muted-foreground">{label}</span>}
      <Input
        type="color"
        value={color}
        onChange={(e) => onChange(e.target.value)}
        className="w-12 h-8 p-0 border-0"
      />
    </div>
  );
};

export default SimpleColorPicker;