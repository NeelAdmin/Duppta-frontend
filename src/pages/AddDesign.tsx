import React, { useState } from 'react';
import { useGetDesignsQuery, useAddDesignMutation, useUpdateDesignMutation, useDeleteDesignMutation } from '../features/common/designApi';
import { DesignForm } from '../components/designs/DesignForm';
import { toast } from 'react-toastify';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Box,
  Typography,
  CircularProgress,
  TablePagination,
  Container,
  InputAdornment,
  IconButton,
  Tooltip,
} from '@mui/material';
import { Search as SearchIcon, Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { ConfirmationDialog } from '../components/common/ConfirmationDialog';
import { alpha, useTheme } from '@mui/material/styles';

interface Design {
  _id?: string;
  name: string;
  ratePerUnit: number | string;
  ratePerMeter: number | string;
}

export default function Designs() {
  const { data: designs, isLoading, isError } = useGetDesignsQuery();
  const [addDesign, { isLoading: adding }] = useAddDesignMutation();
  const [updateDesign] = useUpdateDesignMutation();
  const [deleteDesign] = useDeleteDesignMutation();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedDesign, setSelectedDesign] = useState<Design | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const theme = useTheme();

  const handleChangePage = (event: unknown, newPage: number) => {
    console.log(event);
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDesign(null);
    setIsEditMode(false);
  };

  const handleEditClick = (design: Design) => {
    setSelectedDesign(design);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (design: Design) => {
    setSelectedDesign(design);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedDesign?._id) return;
try {
      await deleteDesign(selectedDesign._id).unwrap();
      // await refetch();
      setIsDeleteDialogOpen(false);
      setSelectedDesign(null);
      toast.success('Design deleted successfully!');
    } catch (error) {
      console.error('Failed to delete design:', error);
      toast.error('Failed to delete design. Please try again.');
    }
  };

  const handleFormSubmit = async (data: any) => {
     try {
      if (isEditMode && selectedDesign?._id) {
        await updateDesign({ id: selectedDesign._id, ...data }).unwrap();
        toast.success('Design updated successfully!');
      } else {
        await addDesign(data).unwrap();
        toast.success('Design added successfully!');
      }
      // await refetch();
      handleCloseModal();
    } catch (error) {
      console.error(`Failed to ${isEditMode ? 'update' : 'add'} design:`, error);
      toast.error(`Failed to ${isEditMode ? 'update' : 'add'} design. Please try again.`);
    }
  };

  const filteredDesigns = designs?.design?.filter((design: Design) =>
    design.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <Container maxWidth="lg" sx={{ px: { xs: 1, sm: 2 }, py: { xs: 1, sm: 3 } }}>
      <Box sx={{ width: '100%', overflowX: 'auto' }}>
        <Box sx={{ mb: 3 }}>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 600, 
              fontSize: { xs: '1.5rem', sm: '2.125rem' },
              mb: 2
            }}
          >
            Designs Management
          </Typography>
          
          {/* Search and Add Button Row */}
          <Box sx={{ 
            display: 'flex', 
            gap: 2,
            alignItems: 'center',
            mb: 3
          }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search designs..."
              value={searchTerm}
              onChange={handleSearch}
              sx={{
                flex: 1,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  height: { xs: 36, sm: 40 },
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                  '& fieldset': {
                    borderColor: 'transparent',
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
                    <SearchIcon color="action" fontSize={window.innerWidth < 600 ? 'small' : 'medium'} />
                  </InputAdornment>
                ),
              }}
              size="small"
            />
            
            <Tooltip title="Add Design">
              <IconButton 
                onClick={handleOpenModal}
                sx={{ 
                  bgcolor: 'primary.main',
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  },
                  width: { xs: 30, sm: 40 },
                  height: { xs: 30, sm: 40 },
                  flexShrink: 0
                }}
              >
                <AddIcon fontSize={window.innerWidth < 600 ? 'small' : 'medium'} />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {isLoading ? (
          <TableRow>
            <TableCell colSpan={5} align="center">
              <CircularProgress />
            </TableCell>
          </TableRow>
        ) : isError ? (
          <TableRow>
            <TableCell colSpan={5} align="center">
              Error loading designs. Please try again later.
            </TableCell>
          </TableRow>
        ) : (
          <>
            <Box sx={{ width: '100%', overflow: 'auto', WebkitOverflowScrolling: 'touch' }}>
              <TableContainer
                component={Paper}
                elevation={0}
                sx={{
                  minWidth: 'max-content',
                  borderRadius: 2,
                  border: `1px solid ${theme.palette.divider}`,
                  '& .MuiTable-root': {
                    minWidth: '100%',
                    tableLayout: 'auto',
                  },
                  '& .MuiTableHead-root': {
                    '& .MuiTableRow-root': {
                      background: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
                      '& .MuiTableCell-root': {
                        fontWeight: 600,
                        color: 'white',
                        whiteSpace: 'nowrap',
                        px: { xs: 1, sm: 2 },
                        py: { xs: 1, sm: 1.5 },
                        fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      },
                    },
                  },
                  '& .MuiTableBody-root': {
                    '& .MuiTableCell-root': {
                      px: { xs: 1, sm: 2 },
                      py: { xs: 0.75, sm: 1 },
                      fontSize: { xs: '0.8rem', sm: '0.875rem' }
                    },
                  },
                }}
              >
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ color: 'white', fontWeight: 600 }}>#</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 600 }}>Design Name</TableCell>
                      <TableCell align="right" sx={{ color: 'white', fontWeight: 600 }}>Rate/Unit (₹)</TableCell>
                      <TableCell align="right" sx={{ color: 'white', fontWeight: 600 }}>Rate/Meter (₹)</TableCell>
                      <TableCell align="center" sx={{ color: 'white', fontWeight: 600 }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredDesigns.length > 0 ? (
                      filteredDesigns
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((design: Design, index: number) => (
                          <TableRow
                            key={index}
                            hover
                            sx={{
                              '&:hover': {
                                backgroundColor: alpha(theme.palette.primary.main, 0.04),
                              },
                              '&:last-child td': {
                                borderBottom: 'none',
                              },
                            }}
                          >
                            <TableCell sx={{ fontWeight: 500 }}>{page * rowsPerPage + index + 1}</TableCell>
                            <TableCell sx={{ fontWeight: 500 }}>{design.name}</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 500, color: theme.palette.primary.main }}>
                              {Number(design.ratePerUnit).toLocaleString('en-IN', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </TableCell>
                            <TableCell align="right" sx={{ fontWeight: 500, color: theme.palette.primary.main }}>
                              {Number(design.ratePerMeter).toLocaleString('en-IN', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                                <IconButton
                                  size="small"
                                  onClick={() => handleEditClick(design)}
                                  sx={{
                                    backgroundColor: alpha(theme.palette.primary.main, 0.08),
                                    '&:hover': {
                                      backgroundColor: alpha(theme.palette.primary.main, 0.15),
                                    },
                                  }}
                                >
                                  <EditIcon fontSize="small" color="warning" />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  onClick={() => handleDeleteClick(design)}
                                  sx={{
                                    backgroundColor: alpha(theme.palette.error.main, 0.08),
                                    '&:hover': {
                                      backgroundColor: alpha(theme.palette.error.main, 0.15),
                                    },
                                  }}
                                >
                                  <DeleteIcon fontSize="small" color="error" />
                                </IconButton>
                              </Box>
                            </TableCell>
                          </TableRow>
                        ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                          <Typography color="textSecondary">
                            {searchTerm ? 'No matching designs found' : 'No designs available'}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredDesigns.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                sx={{ 
                  '& .MuiTablePagination-toolbar': {
                    flexWrap: 'wrap',
                    gap: 1,
                    '& .MuiTablePagination-actions': {
                      marginLeft: 0,
                      marginRight: 0,
                    },
                    '& .MuiTablePagination-displayedRows': {
                      margin: 0,
                    }
                  }
                }}
              />
            </Box>

            <ConfirmationDialog
              open={isDeleteDialogOpen}
              title="Delete Design"
              description={`Are you sure you want to delete "${selectedDesign?.name}"? This action cannot be undone.`}
              onConfirm={handleDeleteConfirm}
              onCancel={() => {
                setIsDeleteDialogOpen(false);
                setSelectedDesign(null);
              }}
              confirmText="Delete"
              loading={isLoading}
            />

            <DesignForm
              open={isModalOpen}
              onClose={handleCloseModal}
              onSubmit={handleFormSubmit}
              isLoading={adding}
              initialValues={isEditMode ? selectedDesign : undefined}
              isEdit={isEditMode}
            />
          </>
        )}
      </Box>
    </Container>
  );
}
