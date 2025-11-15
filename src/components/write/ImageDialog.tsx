import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Image, Upload, Link } from 'lucide-react';

interface ImageDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (src: string, alt?: string) => void;
}

const ImageDialog: React.FC<ImageDialogProps> = ({
  isOpen,
  onClose,
  onInsert
}) => {
  const [url, setUrl] = useState('');
  const [alt, setAlt] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const handleInsertUrl = () => {
    if (url.trim()) {
      onInsert(url.trim(), alt.trim() || undefined);
      handleClose();
    }
  };

  const handleInsertFile = () => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        onInsert(result, alt.trim() || file.name);
        handleClose();
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClose = () => {
    onClose();
    setUrl('');
    setAlt('');
    setFile(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      setFile(selectedFile);
      if (!alt) {
        setAlt(selectedFile.name.replace(/\.[^/.]+$/, ''));
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleInsertUrl();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Image className="w-5 h-5 text-primary" />
            Insert Image
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="url" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="url" className="flex items-center gap-2">
              <Link className="w-4 h-4" />
              URL
            </TabsTrigger>
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Upload
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="url" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="image-url">Image URL</Label>
              <Input
                id="image-url"
                placeholder="https://example.com/image.jpg"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="alt-text">Alt Text</Label>
              <Input
                id="alt-text"
                placeholder="Describe the image"
                value={alt}
                onChange={(e) => setAlt(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button onClick={handleInsertUrl} disabled={!url.trim()}>
                <Image className="w-4 h-4 mr-2" />
                Insert Image
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="upload" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="file-upload">Choose Image</Label>
              <Input
                id="file-upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="cursor-pointer"
              />
              {file && (
                <p className="text-sm text-muted-foreground">
                  Selected: {file.name}
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="alt-text-upload">Alt Text</Label>
              <Input
                id="alt-text-upload"
                placeholder="Describe the image"
                value={alt}
                onChange={(e) => setAlt(e.target.value)}
              />
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button onClick={handleInsertFile} disabled={!file}>
                <Upload className="w-4 h-4 mr-2" />
                Insert Image
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ImageDialog;