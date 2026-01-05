// src/pages/VariantManagement.tsx
import React, { useState, useMemo } from 'react';
import {
  Box, Button, Container, TextField, 
  Paper, Typography, InputAdornment,
  CircularProgress, IconButton, Grid, alpha, useTheme
} from '@mui/material';
import {
  Add as AddIcon, Search as SearchIcon, Delete as DeleteIcon
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { useGetVariantsQuery, useDeleteVariantMutation } from '../features/common/variantApi';
import { useGetDesignsQuery } from '../features/common/designApi';
import { ConfirmationDialog } from '../components/common/ConfirmationDialog';
import AddVariantDialog from '../components/varient/AddVariantDialog';
import { Chip } from '@mui/material';


const VariantManagement: React.FC = () => {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [formData, setFormData] = useState({ designId: '', color: '' });

  // API hooks
  const { data: variantsResponse, isLoading, isError } = useGetVariantsQuery();
  const { data: designsResponse } = useGetDesignsQuery();
  const [deleteVariant, { isLoading: deleting }] = useDeleteVariantMutation();

  // Normalized arrays from API shape
  const grouped = variantsResponse?.varient ?? [];
  console.log(grouped);
  
  const designsList = designsResponse?.design ?? [];

  // Filtering: keep groups where designName or any variant color matches search
  const filteredGroups = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return grouped;

    return grouped.filter((group: any) => {
      const designMatches = (group.designName || '').toLowerCase().includes(q);
      const variantMatches = (group.varients || []).some((v: any) =>
        (v.color || '').toLowerCase().includes(q)
      );
      return designMatches || variantMatches;
    });
  }, [grouped, searchTerm]);

 

  const confirmDeleteVariant = (variant: any) => {
    setSelectedVariant(variant);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteVariant = async () => {
    if (!selectedVariant) return;
    try {
      await deleteVariant(selectedVariant._id).unwrap();
      toast.success('Variant deleted successfully!');
      setIsDeleteDialogOpen(false);
      setSelectedVariant(null);
    } catch (err) {
      console.error('Error deleting variant:', err);
      toast.error('Failed to delete variant');
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 3,
          flexWrap: 'wrap',
          gap: 2
        }}>
          <Typography variant="h4" sx={{ fontWeight: 600, fontSize: { xs: '1.5rem', sm: '2.125rem' } }}>Variant Management</Typography>
          <TextField
            variant="outlined"
            placeholder="Search designs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="small"
            sx={{
              width: 280,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                height: 40,
                '& fieldset': {
                  borderColor: 'transparent',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                },
                '&:hover fieldset': {
                  borderColor: theme.palette.primary.main,
                },
                '&.Mui-focused fieldset': {
                  borderColor: theme.palette.primary.main,
                },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress />
          </Box>
        ) : isError ? (
          <Paper sx={{ p: 3, textAlign: 'center', bgcolor: '#fff5f5' }}>
            <Typography color="error">Error loading variants. Please try again later.</Typography>
          </Paper>
        ) : filteredGroups.length === 0 ? (
          <Paper 
            elevation={0} 
            sx={{ 
              p: 4, 
              textAlign: 'center',
              borderRadius: 2,
              border: `1px dashed ${theme.palette.divider}`,
              bgcolor: theme.palette.background.paper
            }}
          >
            <Typography variant="h6" color="textSecondary" gutterBottom>
              {searchTerm ? 'No matching variants found' : 'No variants available'}
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
              {searchTerm ? 'Try a different search term' : 'Add your first variant to get started'}
            </Typography>
            {!searchTerm && (
              <Button 
                variant="outlined" 
                color="primary"
                startIcon={<AddIcon />}
                onClick={() => setIsAddDialogOpen(true)}
                sx={{ mt: 1 }}
              >
                Add Variant
              </Button>
            )}
          </Paper>
        ) : (
          <Grid container spacing={2}>
            {filteredGroups.map((group: any) => (
          <Grid size={{xs:12, sm:6}} key={group.designName}>
                <Paper 
                  elevation={0}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 2,
                    border: `1px solid ${theme.palette.divider}`,
                    overflow: 'hidden',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: theme.shadows[3],
                    },
                  }}
                >
                  <Box 
                    sx={{ 
                      p: 2, 
                      borderBottom: `1px solid ${theme.palette.divider}`,
                      bgcolor: alpha(theme.palette.primary.main, 0.02),
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Typography 
                      variant="subtitle1" 
                      sx={{ 
                        fontWeight: 600,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        pr: 1,
                      }}
                      title={group.designName}
                    >
                      {group.designName}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip 
                        label={group.varients?.length || 0}
                        size="small"
                        color="primary"
                        variant="outlined"
                        sx={{ 
                          height: 22, 
                          minWidth: 22,
                          '& .MuiChip-label': { px: 0.5 } 
                        }}
                      />
                      <IconButton
                        size="small"
                        onClick={() => {
                          const found = designsList.find((d: any) => d.name === group.designName);
                          setFormData({ designId: found?._id ?? '', color: '' });
                          setIsAddDialogOpen(true);
                        }}
                        sx={{
                          width: 28,
                          height: 28,
                          color: theme.palette.primary.main,
                          '&:hover': {
                            backgroundColor: alpha(theme.palette.primary.main, 0.08),
                          },
                        }}
                        aria-label="add variant"
                      >
                        <AddIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                  
                  <Box 
                    sx={{ 
                      p: 2, 
                      flexGrow: 1,
                      overflowY: 'auto',
                      maxHeight: 200,
                      '&::-webkit-scrollbar': {
                        width: '4px',
                      },
                      '&::-webkit-scrollbar-thumb': {
                        backgroundColor: theme.palette.action.hover,
                        borderRadius: '4px',
                      },
                    }}
                  >
                    {group.varients?.length > 0 ? (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {group.varients.map((v: any, index: number) => (
                          <Chip
                            key={index}
                            label={v.color}
                            size="small"
                            sx={{
                              height: 24,
                              '& .MuiChip-label': { 
                                pl: 0.75, 
                                pr: 0.5,
                                textTransform: 'capitalize',
                              },
                              '& .MuiChip-deleteIcon': {
                                color: theme.palette.error.main,
                                opacity: 0.7,
                                '&:hover': {
                                  opacity: 1,
                                },
                              },
                            }}
                            onDelete={(e) => {
                              e.stopPropagation();
                              confirmDeleteVariant(v);
                            }}
                            deleteIcon={<DeleteIcon fontSize="small" />}
                            avatar={
                              <Box 
                                sx={{
                                  width: 14,
                                  height: 14,
                                  borderRadius: '50%',
                                  bgcolor: v.color,
                                  border: `1px solid ${theme.palette.divider}`,
                                  ml: 0.5,
                                }}
                              />
                            }
                          />
                        ))}
                      </Box>
                    ) : (
                      <Box 
                        sx={{ 
                          display: 'flex', 
                          flexDirection: 'column', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          height: '100%',
                          py: 2,
                        }}
                      >
                        <Typography 
                          variant="body2" 
                          color="textSecondary"
                          align="center"
                          sx={{ mb: 1 }}
                        >
                          No variants yet
                        </Typography>
                        <Button 
                          size="small" 
                          variant="outlined"
                          startIcon={<AddIcon />}
                          onClick={() => {
                            const found = designsList.find((d: any) => d.name === group.designName);
                            setFormData({ designId: found?._id ?? '', color: '' });
                            setIsAddDialogOpen(true);
                          }}
                          sx={{
                            textTransform: 'none',
                            fontSize: '0.75rem',
                            py: 0.25,
                            px: 1.5,
                          }}
                        >
                          Add Variant
                        </Button>
                      </Box>
                    )}
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Add Variant Dialog */}
        <AddVariantDialog
          open={isAddDialogOpen}
          onClose={() => setIsAddDialogOpen(false)}
          designs={designsList}
          initialDesignId={formData.designId}
        />

        {/* Delete Confirmation Dialog */}
        <ConfirmationDialog
          open={isDeleteDialogOpen}
          title="Delete Variant"
          description={`Are you sure you want to delete variant "${selectedVariant?.color}"?`}
          onConfirm={handleDeleteVariant}
          onCancel={() => { setIsDeleteDialogOpen(false); setSelectedVariant(null); }}
          confirmText="Delete"
          loading={deleting}
        />
      </Box>
    </Container>
  );
};

export default VariantManagement;

