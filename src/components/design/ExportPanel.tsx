import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { 
  X, Download, Copy, Share2, Image as ImageIcon, 
  FileText, Code, Palette, Settings
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ExportPanelProps {
  onClose: () => void;
  onExport: (options: ExportOptions) => void;
}

interface ExportOptions {
  format: 'png' | 'jpg' | 'svg' | 'pdf' | 'json';
  quality: number;
  scale: number;
  transparent: boolean;
  includeBackground: boolean;
  selectedOnly: boolean;
  width?: number;
  height?: number;
}

const ExportPanel = ({ onClose, onExport }: ExportPanelProps) => {
  const { toast } = useToast();
  const [options, setOptions] = useState<ExportOptions>({
    format: 'png',
    quality: 100,
    scale: 1,
    transparent: false,
    includeBackground: true,
    selectedOnly: false,
  });

  const updateOption = <K extends keyof ExportOptions>(key: K, value: ExportOptions[K]) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  };

  const handleExport = () => {
    onExport(options);
    toast({
      title: "Export started",
      description: `Exporting as ${options.format.toUpperCase()}...`,
    });
  };

  const copyToClipboard = async () => {
    try {
      // Implementation would capture canvas and copy to clipboard
      toast({
        title: "Copied to clipboard",
        description: "Design copied as image to clipboard",
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Could not copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const shareDesign = async () => {
    try {
      // Implementation would generate shareable link
      const shareUrl = `${window.location.origin}/design/shared/${Date.now()}`;
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Share link copied",
        description: "Shareable link copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Share failed",
        description: "Could not generate share link",
        variant: "destructive",
      });
    }
  };

  const formatOptions = [
    { value: 'png', label: 'PNG', icon: ImageIcon, description: 'Best for web, supports transparency' },
    { value: 'jpg', label: 'JPG', icon: ImageIcon, description: 'Smaller file size, no transparency' },
    { value: 'svg', label: 'SVG', icon: Code, description: 'Vector format, scalable' },
    { value: 'pdf', label: 'PDF', icon: FileText, description: 'Print-ready format' },
    { value: 'json', label: 'JSON', icon: Settings, description: 'Design data for import' },
  ];

  const qualityPresets = [
    { value: 50, label: 'Low (50%)' },
    { value: 75, label: 'Medium (75%)' },
    { value: 90, label: 'High (90%)' },
    { value: 100, label: 'Maximum (100%)' },
  ];

  const scalePresets = [
    { value: 0.5, label: '0.5x (Half)' },
    { value: 1, label: '1x (Original)' },
    { value: 2, label: '2x (Double)' },
    { value: 3, label: '3x (Triple)' },
  ];

  return (
    <motion.div
      initial={{ y: 300, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 300, opacity: 0 }}
      className="fixed bottom-0 left-0 right-0 h-96 glass border-t border-glass-border/50 p-6 overflow-y-auto z-50"
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Download className="w-5 h-5 text-primary" />
            Export Design
          </h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Format Selection */}
          <div className="space-y-4">
            <Label className="text-sm font-medium">Export Format</Label>
            <div className="space-y-2">
              {formatOptions.map((format) => (
                <motion.div
                  key={format.value}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    options.format === format.value
                      ? 'bg-primary/20 border-primary'
                      : 'bg-muted/30 border-border hover:bg-muted/50'
                  }`}
                  onClick={() => updateOption('format', format.value as ExportOptions['format'])}
                >
                  <div className="flex items-center gap-3">
                    <format.icon className="w-5 h-5" />
                    <div>
                      <p className="font-medium">{format.label}</p>
                      <p className="text-xs text-muted-foreground">{format.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Quality & Scale Settings */}
          <div className="space-y-6">
            {/* Quality */}
            {(options.format === 'png' || options.format === 'jpg') && (
              <div className="space-y-3">
                <Label className="text-sm font-medium">Quality</Label>
                <Select 
                  value={options.quality.toString()} 
                  onValueChange={(value) => updateOption('quality', Number(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {qualityPresets.map((preset) => (
                      <SelectItem key={preset.value} value={preset.value.toString()}>
                        {preset.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Scale */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Scale</Label>
              <Select 
                value={options.scale.toString()} 
                onValueChange={(value) => updateOption('scale', Number(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {scalePresets.map((preset) => (
                    <SelectItem key={preset.value} value={preset.value.toString()}>
                      {preset.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Custom Dimensions */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Custom Size (optional)</Label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs text-muted-foreground">Width</Label>
                  <Input
                    type="number"
                    placeholder="Auto"
                    value={options.width || ''}
                    onChange={(e) => updateOption('width', e.target.value ? Number(e.target.value) : undefined)}
                    className="h-8"
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Height</Label>
                  <Input
                    type="number"
                    placeholder="Auto"
                    value={options.height || ''}
                    onChange={(e) => updateOption('height', e.target.value ? Number(e.target.value) : undefined)}
                    className="h-8"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Export Options */}
          <div className="space-y-6">
            <div className="space-y-4">
              <Label className="text-sm font-medium">Options</Label>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Transparent background</Label>
                  <Switch
                    checked={options.transparent}
                    onCheckedChange={(checked) => updateOption('transparent', checked)}
                    disabled={options.format === 'jpg'}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Include background</Label>
                  <Switch
                    checked={options.includeBackground}
                    onCheckedChange={(checked) => updateOption('includeBackground', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Selected objects only</Label>
                  <Switch
                    checked={options.selectedOnly}
                    onCheckedChange={(checked) => updateOption('selectedOnly', checked)}
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Quick Actions */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Quick Actions</Label>
              
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={copyToClipboard}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy to Clipboard
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={shareDesign}
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Generate Share Link
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Export Button */}
        <div className="flex justify-end mt-6 pt-6 border-t border-border">
          <Button
            onClick={handleExport}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8"
          >
            <Download className="w-4 h-4 mr-2" />
            Export {options.format.toUpperCase()}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default ExportPanel;