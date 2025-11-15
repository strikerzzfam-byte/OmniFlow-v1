import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table } from 'lucide-react';

interface TableDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (rows: number, cols: number) => void;
}

const TableDialog: React.FC<TableDialogProps> = ({
  isOpen,
  onClose,
  onInsert
}) => {
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);

  const handleInsert = () => {
    onInsert(rows, cols);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Table className="w-5 h-5 text-primary" />
            Insert Table
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="rows">Rows</Label>
              <Input
                id="rows"
                type="number"
                min="1"
                max="10"
                value={rows}
                onChange={(e) => setRows(Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cols">Columns</Label>
              <Input
                id="cols"
                type="number"
                min="1"
                max="10"
                value={cols}
                onChange={(e) => setCols(Number(e.target.value))}
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleInsert}>
              <Table className="w-4 h-4 mr-2" />
              Insert Table
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TableDialog;