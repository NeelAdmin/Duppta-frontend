// src/components/variant/AddVariantDialog.tsx
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
  CircularProgress,
  Typography,
  IconButton
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import { Add as AddIcon } from '@mui/icons-material';
import { useAddVariantMutation } from '../../features/common/variantApi';
import { toast } from 'react-toastify';

interface AddVariantDialogProps {
  open: boolean;
  onClose: () => void;
  designs: any[];
  initialDesignId?: string;
}

const COLOR_OPTIONS = ["red", "black", "green", "blue", "pink", "maroon", "wine"];

const AddVariantDialog: React.FC<AddVariantDialogProps> = ({ 
  open, 
  onClose, 
  designs, 
  initialDesignId = ''
}) => {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    designId: initialDesignId,
    color: ''
  });

  const [addVariant, { isLoading: adding }] = useAddVariantMutation();

  useEffect(() => {
    if (open) {
      setFormData({
        designId: initialDesignId,
        color: ''
      });
    }
  }, [open, initialDesignId]);

  const handleDesignChange = (e: any) => {
    setFormData(prev => ({ ...prev, designId: e.target.value }));
  };

  const handleColorChange = (e: any) => {
    setFormData(prev => ({ ...prev, color: e.target.value }));
  };

  const handleAddVariant = async () => {
    try {
      await addVariant(formData).unwrap();
      toast.success('Variant added successfully!');
      onClose();
      setFormData({ designId: '', color: '' });
    } catch (err) {
      console.error('Error adding variant:', err);
      toast.error('Failed to add variant');
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
          overflow: 'hidden',
        }
      }}
    >
      <DialogTitle sx={{
        background: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        py: 1.5,
        px: 3
      }}>
        <AddIcon sx={{ mr: 1.5, color: 'white' }} />
        <Typography variant="h6" sx={{ flex: 1, fontWeight: 600 }}>
          Add New Variant
        </Typography>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            color: 'white',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)'
            }
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        <Box sx={{ mt: 2 }}>
          <FormControl fullWidth sx={{ mb: 3, '& .MuiInputBase-root': { borderRadius: 1.5 } }}>
            <InputLabel id="design-select-label">Design</InputLabel>
            <Select
              labelId="design-select-label"
              id="design-select"
              value={formData.designId}
              label="Design"
              onChange={handleDesignChange}
            >
              {designs?.map((design: any) => (
                <MenuItem key={design._id} value={design._id}>
                  {design.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ '& .MuiInputBase-root': { borderRadius: 1.5 } }}>
            <InputLabel id="color-select-label">Color</InputLabel>
            <Select
              labelId="color-select-label"
              id="color-select"
              name="color"
              value={formData.color}
              label="Color"
              onChange={handleColorChange}
            >
              {COLOR_OPTIONS.map(color => (
                <MenuItem key={color} value={color}>
                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <Box sx={{ 
                      width: 20, 
                      height: 20, 
                      bgcolor: color, 
                      borderRadius: '50%', 
                      mr: 2, 
                      border: '1px solid',
                      borderColor: 'divider',
                      flexShrink: 0
                    }} />
                    <Typography variant="body1">
                      {color.charAt(0).toUpperCase() + color.slice(1)}
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button 
          onClick={onClose} 
          disabled={adding}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            px: 3,
            py: 0.75,
            [theme.breakpoints.down('sm')]: {
              fontSize: '0.8rem',
              px: 2,
              py: 0.5,
              minWidth: '100px',
            }
          }}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleAddVariant}
          variant="contained"
          color="primary"
          disabled={!formData.designId || !formData.color || adding}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            px: 3,
            py: 0.75,
            boxShadow: 'none',
            background: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
            '&:hover': {
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              background: 'linear-gradient(135deg, #1a2f38 0%, #2a4652 50%, #3a5c6e 100%)',
            },
            '&:disabled': {
              background: '#e0e0e0',
              color: '#a0a0a0',
              boxShadow: 'none'
            },
            [theme.breakpoints.down('sm')]: {
              fontSize: '0.8rem',
              px: 2,
              py: 0.5,
              minWidth: '100px',
            }
          }}
          startIcon={adding ? <CircularProgress size={20} color="inherit" /> : null}
        >
          {adding ? 'Adding...' : 'Add Variant'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddVariantDialog;