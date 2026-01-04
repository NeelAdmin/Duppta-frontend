// src/components/stock/UpdateStockDialog.tsx
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
  IconButton,
  Typography,
  useTheme,
  Paper,
  InputAdornment
} from '@mui/material';
import {
  Close as CloseIcon,
  Edit as EditIcon,
  Straighten as MeterIcon,
  Category as CategoryIcon,
  Palette as PaletteIcon,
  Person as PersonIcon,
  Checkroom as UnitIcon
} from '@mui/icons-material';

interface UpdateStockDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  stock: any;
  designs: any[];
  variants: any[];
  users: any[];
  loading: boolean;
}

const UpdateStockDialog: React.FC<UpdateStockDialogProps> = ({
  open,
  onClose,
  onSubmit,
  stock,
  designs,
  variants,
  users,
  loading
}) => {
  const theme = useTheme();
  const [form, setForm] = useState({
    designId: "",
    varientId: "",
    meter: "",
    unit: 0,
    cutBy: "",
    fitBy: "",
  });

  const inputStyle = {
    '& .MuiOutlinedInput-root': {
      borderRadius: 2,
      '&:hover fieldset': {
        borderColor: theme.palette.primary.main,
      },
      '&.Mui-focused fieldset': {
        borderColor: theme.palette.primary.main,
      },
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: theme.palette.primary.main,
    },
    mb: 2,
  };

  useEffect(() => {
    if (open && stock) {
      console.log('Current stock data:', stock);
      setForm({
        designId: stock.design?._id || "",
        varientId: stock.varient?._id || "",
        meter: stock.meter,
        unit: stock.unit,
        cutBy: stock.cutBy || "",
        fitBy: stock.fitBy || "",
      });
    } else if (!open) {
      setForm({
        designId: "",
        varientId: "",
        meter: "",
        unit: 0,
        cutBy: "",
        fitBy: "",
      });
    }
  }, [open, stock]);

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
      _id: stock._id,
      meter: parseFloat(form.meter),
      unit: form.unit,
    });
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
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
        <EditIcon sx={{ mr: 1.5 }} />
        <Typography variant="h6" sx={{ flex: 1, fontWeight: 600 }}>
          Update Stock
        </Typography>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{ color: 'white' }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          '& > *:not(:last-child)': {
            mb: 2
          }
        }}>
          {/* Design Details Section */}
          <Paper elevation={0} sx={{ pt: 2, bgcolor: 'background.default', borderRadius: 2 }}>
            <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
              <CategoryIcon sx={{ fontSize: 18, mr: 1, color: '#2c5364' }} />
              Design Details
            </Typography>

            <FormControl fullWidth sx={inputStyle}>
              <InputLabel>Design</InputLabel>
              <Select
                name="designId"
                value={form.designId}
                onChange={handleChange}
                label="Design"
                variant="outlined"
                size="small"
              >
                {designs.map((d) => (
                  <MenuItem key={d._id} value={d._id}>
                    {d.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth sx={inputStyle}>
              <InputLabel>Variant</InputLabel>
              <Select
                name="varientId"
                value={form.varientId}
                onChange={handleChange}
                disabled={!form.designId}
                label="Variant"
                variant="outlined"
                size="small"
                startAdornment={
                  <InputAdornment position="start">
                    <PaletteIcon sx={{ fontSize: 18, mr: 1, color: '#2c5364' }} />
                  </InputAdornment>
                }
              >
                {filteredVariants.map((v: any) => (
                  <MenuItem key={v._id} value={v._id}>
                    {v.color}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Paper>
          {/* Measurements Section */}
          <Paper elevation={0} sx={{ bgcolor: 'background.default', borderRadius: 2 }}>
            <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
              <MeterIcon sx={{ fontSize: 18, mr: 1, color: '#2c5364' }} />
              Measurements
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                name="meter"
                label="Meter"
                type="number"
                value={form.meter}
                onChange={handleChange}
                fullWidth
                size="small"
                sx={inputStyle}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MeterIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                name="unit"
                label="Unit"
                value={form.unit}
                onChange={handleChange}
                fullWidth
                size="small"
                sx={inputStyle}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <UnitIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          </Paper>
          {/* Assignment Section */}
          <Paper elevation={0} sx={{ bgcolor: 'background.default', borderRadius: 2 }}>
            <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
              <PersonIcon sx={{ fontSize: 18, mr: 1, color: '#2c5364' }} />
              Assignment (Optional)
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl fullWidth sx={inputStyle}>
                <InputLabel>Cut By</InputLabel>
                <Select
                  name="cutBy"
                  value={form.cutBy}
                  onChange={handleChange}
                  label="Cut By"
                  size="small"
                >
                  <MenuItem value=""><em>None</em></MenuItem>
                  {users?.map((user) => (
                    <MenuItem key={user._id} value={user._id}>
                      {user.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth sx={inputStyle}>
                <InputLabel>Fit By</InputLabel>
                <Select
                  name="fitBy"
                  value={form.fitBy}
                  onChange={handleChange}
                  label="Fit By"
                  size="small"
                >
                  <MenuItem value=""><em>None</em></MenuItem>
                  {users?.map((user) => (
                    <MenuItem key={user._id} value={user._id}>
                      {user.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Paper>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button
          onClick={onClose}
          variant="outlined"
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
          variant="contained"
          onClick={handleSubmit}
          disabled={!form.designId || !form.varientId || loading}
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
              color: '#a0a0a0'
            },
            [theme.breakpoints.down('sm')]: {
              fontSize: '0.8rem',
              px: 2,
              py: 0.5,
              minWidth: '100px',
            }
          }}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
        >
          {loading ? 'Updating...' : 'Update'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateStockDialog;