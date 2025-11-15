import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, Palette } from 'lucide-react';

interface TextEditorProps {
  shape: any;
  onUpdate: (updates: any) => void;
  onClose: () => void;
}

const TextEditor = ({ shape, onUpdate, onClose }: TextEditorProps) => {
  const [text, setText] = useState(shape.text || '');
  const [fontSize, setFontSize] = useState(shape.fontSize || 16);
  const [fontFamily, setFontFamily] = useState(shape.fontFamily || 'Inter');
  const [fontWeight, setFontWeight] = useState(shape.fontWeight || 'normal');
  const [fontStyle, setFontStyle] = useState(shape.fontStyle || 'normal');
  const [textDecoration, setTextDecoration] = useState(shape.textDecoration || 'none');
  const [textAlign, setTextAlign] = useState(shape.textAlign || 'left');
  const [color, setColor] = useState(shape.fill || '#FFFFFF');
  const [lineHeight, setLineHeight] = useState(shape.lineHeight || 1.2);
  const [letterSpacing, setLetterSpacing] = useState(shape.letterSpacing || 0);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, []);

  const handleTextChange = (value: string) => {
    setText(value);
    onUpdate({ text: value });
  };

  const handleStyleChange = (property: string, value: any) => {
    const updates = { [property]: value };
    onUpdate(updates);
    
    switch (property) {
      case 'fontSize': setFontSize(value); break;
      case 'fontFamily': setFontFamily(value); break;
      case 'fontWeight': setFontWeight(value); break;
      case 'fontStyle': setFontStyle(value); break;
      case 'textDecoration': setTextDecoration(value); break;
      case 'textAlign': setTextAlign(value); break;
      case 'fill': setColor(value); break;
      case 'lineHeight': setLineHeight(value); break;
      case 'letterSpacing': setLetterSpacing(value); break;
    }
  };

  const fonts = [
    'Inter', 'Arial', 'Helvetica', 'Times New Roman', 'Georgia', 
    'Verdana', 'Trebuchet MS', 'Impact', 'Comic Sans MS', 'Courier New'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-background border rounded-lg p-6 w-96 max-h-[80vh] overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4">Edit Text</h3>
        
        {/* Text Input */}
        <div className="mb-4">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => handleTextChange(e.target.value)}
            className="w-full h-32 p-3 border rounded resize-none"
            style={{
              fontSize,
              fontFamily,
              fontWeight,
              fontStyle,
              textDecoration,
              textAlign: textAlign as any,
              color,
              lineHeight,
              letterSpacing: `${letterSpacing}px`
            }}
            placeholder="Enter your text..."
          />
        </div>

        {/* Font Family */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Font</label>
          <Select value={fontFamily} onValueChange={(value) => handleStyleChange('fontFamily', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {fonts.map(font => (
                <SelectItem key={font} value={font} style={{ fontFamily: font }}>
                  {font}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Font Size */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Size: {fontSize}px</label>
          <Slider
            value={[fontSize]}
            onValueChange={([value]) => handleStyleChange('fontSize', value)}
            min={8}
            max={120}
            step={1}
            className="w-full"
          />
        </div>

        {/* Text Style Buttons */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Style</label>
          <div className="flex gap-2">
            <Button
              variant={fontWeight === 'bold' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleStyleChange('fontWeight', fontWeight === 'bold' ? 'normal' : 'bold')}
            >
              <Bold className="w-4 h-4" />
            </Button>
            <Button
              variant={fontStyle === 'italic' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleStyleChange('fontStyle', fontStyle === 'italic' ? 'normal' : 'italic')}
            >
              <Italic className="w-4 h-4" />
            </Button>
            <Button
              variant={textDecoration === 'underline' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleStyleChange('textDecoration', textDecoration === 'underline' ? 'none' : 'underline')}
            >
              <Underline className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Text Alignment */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Alignment</label>
          <div className="flex gap-2">
            <Button
              variant={textAlign === 'left' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleStyleChange('textAlign', 'left')}
            >
              <AlignLeft className="w-4 h-4" />
            </Button>
            <Button
              variant={textAlign === 'center' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleStyleChange('textAlign', 'center')}
            >
              <AlignCenter className="w-4 h-4" />
            </Button>
            <Button
              variant={textAlign === 'right' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleStyleChange('textAlign', 'right')}
            >
              <AlignRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Color */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Color</label>
          <div className="flex gap-2 items-center">
            <input
              type="color"
              value={color}
              onChange={(e) => handleStyleChange('fill', e.target.value)}
              className="w-12 h-8 rounded border"
            />
            <Input
              value={color}
              onChange={(e) => handleStyleChange('fill', e.target.value)}
              className="flex-1"
              placeholder="#FFFFFF"
            />
          </div>
        </div>

        {/* Line Height */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Line Height: {lineHeight}</label>
          <Slider
            value={[lineHeight]}
            onValueChange={([value]) => handleStyleChange('lineHeight', value)}
            min={0.8}
            max={3}
            step={0.1}
            className="w-full"
          />
        </div>

        {/* Letter Spacing */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Letter Spacing: {letterSpacing}px</label>
          <Slider
            value={[letterSpacing]}
            onValueChange={([value]) => handleStyleChange('letterSpacing', value)}
            min={-5}
            max={20}
            step={0.5}
            className="w-full"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TextEditor;