// src/components/designs/DesignForm.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { designSchema } from '../../validations/designSchemas';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  CircularProgress,
  useTheme,
  Paper,
  InputAdornment,
  IconButton,
  Typography,
} from '@mui/material';
import {
  Close as CloseIcon,
  Category as CategoryIcon,
  AttachMoney as MoneyIcon,

} from '@mui/icons-material';

interface DesignFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  isLoading: boolean;
  initialValues?: any;
  isEdit?: boolean;
}

export const DesignForm: React.FC<DesignFormProps> = ({
  open,
  onClose,
  onSubmit,
  isLoading,
  initialValues = { name: '', ratePerUnit: 0, ratePerMeter: 0 },
  isEdit = false,
}) => {
  const theme = useTheme();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(designSchema),
    defaultValues: initialValues,
  });


  const handleFormSubmit = async (data: any) => {
    const formData = {
      ...data,
      ratePerUnit: Number(data.ratePerUnit),
      ratePerMeter: Number(data.ratePerMeter),
    };
    await onSubmit(formData);
    if (!isEdit) {
      reset();
    }
  };

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
        <CategoryIcon sx={{ mr: 1.5, color: 'white' }} />
        <Typography variant="h6" sx={{ flex: 1, fontWeight: 600 }}>
          {isEdit ? 'Edit Design' : 'Add New Design'}
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
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent sx={{ p: 3 }}>
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            '& > *:not(:last-child)': {
              mb: 2
            }
          }}>
            <Paper elevation={0} sx={{ bgcolor: 'background.default', borderRadius: 2 }}>
              <TextField
                {...register('name')}
                label="Design Name"
                variant="outlined"
                fullWidth
                margin="normal"
                error={!!errors.name}
                helperText={errors.name?.message?.toString()}
                disabled={isLoading}
                sx={inputStyle}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CategoryIcon sx={{ color: '#2c5364' }} />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                {...register('ratePerUnit')}
                label="Rate per Unit (₹)"
                type="number"
                variant="outlined"
                fullWidth
                margin="normal"
                error={!!errors.ratePerUnit}
                helperText={errors.ratePerUnit?.message?.toString()}
                disabled={isLoading}
                inputProps={{ step: '0.01', min: 0 }}
                sx={inputStyle}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MoneyIcon sx={{ color: '#2c5364' }} />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                {...register('ratePerMeter')}
                label="Rate per Meter (₹)"
                type="number"
                variant="outlined"
                fullWidth
                margin="normal"
                error={!!errors.ratePerMeter}
                helperText={errors.name?.message?.toString()}
                disabled={isLoading}
                inputProps={{ step: '0.01', min: 0 }}
                sx={inputStyle}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MoneyIcon sx={{ color: '#2c5364' }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Paper>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button onClick={onClose} disabled={isLoading} sx={{
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
          }}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isLoading}
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
            startIcon={isLoading ? <CircularProgress size={20} /> : null}
          >
            {isLoading
              ? 'Saving...'
              : isEdit
                ? 'Update Design'
                : 'Add Design'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};