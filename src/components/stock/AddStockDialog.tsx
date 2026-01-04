// src/components/stock/AddStockDialog.tsx
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  CircularProgress,
} from '@mui/material';

interface AddStockDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  designs: any[];
  variants: any[];
  loading: boolean;
}

const AddStockDialog: React.FC<AddStockDialogProps> = ({ 
  open, 
  onClose, 
  onSubmit, 
  designs, 
  variants, 
  loading 
}) => {
  const [form, setForm] = useState({
    designId: "",
    varientId: "",
    meter: "",
    unit: 0,
  });

  useEffect(() => {
    if (open) {
      setForm({
        designId: "",
        varientId: "",
        meter: "",
        unit: 0,
      });
    }
  }, [open]);

  const selectedDesign = designs?.find(d => d._id === form.designId);
  const filteredVariants = variants?.find(v => v.designName === selectedDesign?.name)?.varients || [];

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    if (!name) return;

    if (name === "meter") {
      const meterVal = parseFloat(value as string) || 0;
      const unitVal = parseFloat((meterVal / 2.3).toFixed(2));
      setForm(prev => ({ ...prev, meter: value as string, unit: unitVal }));
      return;
    }

    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSubmit({
      ...form,
      meter: parseFloat(form.meter),
      unit: form.unit,
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Add Stock</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} mt={2}>
          <FormControl fullWidth>
            <InputLabel>Design</InputLabel>
            <Select
              name="designId"
              value={form.designId}
              onChange={handleChange}
              label="Design"
            >
              {designs.map((d) => (
                <MenuItem key={d._id} value={d._id}>
                  {d.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Variant</InputLabel>
            <Select
              name="varientId"
              value={form.varientId}
              onChange={handleChange}
              disabled={!form.designId}
              label="Variant"
            >
              {filteredVariants.map((v: any) => (
                <MenuItem key={v._id} value={v._id}>
                  {v.color}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            name="meter"
            label="Meter"
            type="number"
            value={form.meter}
            onChange={handleChange}
          />

          <TextField name="unit" label="Unit" value={form.unit} disabled />
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!form.designId || !form.varientId || !form.meter || loading}
        >
          {loading ? <CircularProgress size={22} /> : "Add"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddStockDialog;