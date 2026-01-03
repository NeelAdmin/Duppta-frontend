// src/pages/StockManagement.tsx
import React, { useMemo, useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Typography,
  InputAdornment,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Chip,
  alpha,
  useTheme,
} from "@mui/material";

import {
  Add as AddIcon,
  Search as SearchIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from "@mui/icons-material";

import { toast } from "react-toastify";

import {
  useGetStocksQuery,
  useAddStockMutation,
  useUpdateStockMutation,
  useDeleteStockMutation,
} from "../features/common/stockApi";

import { useGetDesignsQuery } from "../features/common/designApi";
import { useGetVariantsQuery } from "../features/common/variantApi";
import { ConfirmationDialog } from "../components/common/ConfirmationDialog";
import { useGetAllUsersQuery } from "../features/auth/authApi";


import AddStockDialog from '../components/stock/AddStockDialog.tsx';
import UpdateStockDialog from '../components/stock/UpdateStockDialog.tsx';

// Map of color names to their corresponding hex values
const colorMap: Record<string, string> = {
  'red': '#f44336',
  'pink': '#e91e63',
  'purple': '#9c27b0',
  'deep purple': '#673ab7',
  'indigo': '#3f51b5',
  'blue': '#2196f3',
  'light blue': '#03a9f4',
  'cyan': '#00bcd4',
  'teal': '#009688',
  'green': '#4caf50',
  'light green': '#8bc34a',
  'lime': '#cddc39',
  'yellow': '#ffeb3b',
  'amber': '#ffc107',
  'orange': '#ff9800',
  'deep orange': '#ff5722',
  'brown': '#795548',
  'grey': '#9e9e9e',
  'blue grey': '#607d8b',
  'black': '#000000',
  'white': '#ffffff',
};

// Function to get color from color name
const getColorFromName = (colorName: string) => {
  if (!colorName) return '#e0e0e0';
  const lowerColor = colorName.toLowerCase();
  return colorMap[lowerColor] || '#e0e0e0'; // Default to light gray if color not found
};

const StockManagement = () => {
  const theme = useTheme();
  const [search, setSearch] = useState("");
  const [selectedStock, setSelectedStock] = useState(null);

  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  // API Calls
  const { data: stocksData, isLoading, isError } = useGetStocksQuery();
  const { data: designsData } = useGetDesignsQuery();
  const { data: variantsData } = useGetVariantsQuery();
  const { data: usersData } = useGetAllUsersQuery();

  console.log(usersData);


  const [addStock, { isLoading: loadingAdd }] = useAddStockMutation();
  const [updateStock, { isLoading: loadingUpdate }] = useUpdateStockMutation();
  const [deleteStock] = useDeleteStockMutation();

  const designs = designsData?.design || [];
  const variantsGrouped = variantsData?.varient || [];

  const users = usersData?.users || [];


  const filteredStocks = useMemo(() => {
    const allStocks = stocksData?.stock || [];

    if (!search) return allStocks;

    return allStocks.filter((s: any) => {
      const design = s.design;
      const variant = s.varient;

      return (
        design?.name?.toLowerCase().includes(search.toLowerCase()) ||
        variant?.color?.toLowerCase().includes(search.toLowerCase()) ||
        String(s.meter).includes(search) ||
        String(s.unit).includes(search)
      );
    });
  }, [search, stocksData]);


  /* -------------------------------------
      CRUD Handlers
  ---------------------------------------*/
  const handleAdd = async (data: any) => {
    try {
      await addStock(data).unwrap();
      toast.success("Stock Added!");
      setAddOpen(false);
    } catch {
      toast.error("Failed to add stock");
    }
  };

  const handleUpdate = async (data: any) => {
    try {
      await updateStock(data).unwrap();
      toast.success("Stock Updated!");
      setEditOpen(false);
      setSelectedStock(null);
    } catch {
      toast.error("Failed to update stock");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteStock((selectedStock as any)._id).unwrap();
      toast.success("Stock Deleted!");
      setDeleteOpen(false);
      setSelectedStock(null);
    } catch {
      toast.error("Delete Failed");
    }
  };

  /* -------------------------------------
      Render
  ---------------------------------------*/
  return (
    <Container maxWidth="lg" sx={{ px: { xs: 1, sm: 2 }, py: { xs: 1, sm: 3 } }}>
      <Box sx={{ width: '100%', overflowX: 'auto' }}>
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 600, 
              fontSize: { xs: '1.5rem', sm: '2.125rem' },
              mb: 2
            }}
          >
            Stock Management
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
              placeholder="Search by design, color, or meter..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
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
          
          <Tooltip title="Add Stock">
            <IconButton 
              onClick={() => setAddOpen(true)}
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
              <AddIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

        {/* Table */}
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
            '& .MuiTableCell-root': {
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              px: { xs: 1, sm: 2 },
              py: { xs: 0.75, sm: 1 },
              fontSize: { xs: '0.8rem', sm: '0.875rem' }
            },
            '& .MuiTableCell-head': {
              whiteSpace: 'nowrap',
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              px: { xs: 1, sm: 2 },
            }
          }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{
                background: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
                position: 'relative',
                overflow: 'hidden',
               
              }}>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Design</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Variant</TableCell>
                <TableCell align="right" sx={{ color: 'white', fontWeight: 600 }}>Meter</TableCell>
                <TableCell align="right" sx={{ color: 'white', fontWeight: 600 }}>Unit</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Cut By</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Fit By</TableCell>
                <TableCell align="right" sx={{ color: 'white', fontWeight: 600 }}>Rate/m</TableCell>
                <TableCell align="right"sx={{ color: 'white', fontWeight: 600 }}>Rate/unit</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : isError ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    Error loading stocks
                  </TableCell>
                </TableRow>
              ) : filteredStocks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No stock found
                  </TableCell>
                </TableRow>
              ) : (
                filteredStocks.map((s: any) => {
                  const design = s.design;
                  const variant = s.varient;

                  return (
                    <TableRow 
                      key={s._id}
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
                      <TableCell sx={{ fontWeight: 500 }}>{design?.name || '-'}</TableCell>
                      <TableCell>
                        <Chip
                          label={variant?.color || '-'}
                          size="small"
                          sx={{
                            backgroundColor: getColorFromName(variant?.color || ''),
                            color: theme.palette.getContrastText(getColorFromName(variant?.color || '#e0e0e0')),
                            fontWeight: 500,
                            borderRadius: 1,
                            minWidth: 80,
                            justifyContent: 'center',
                            textTransform: 'capitalize',
                            '& .MuiChip-label': {
                              px: 1,
                            },
                          }}
                        />
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 500 }}>{s.meter || '-'}</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 500 }}>{s.unit || '-'}</TableCell>
                      <TableCell>{users.find((u: any) => u._id === s.cutBy)?.name || '-'}</TableCell>
                      <TableCell>{users.find((u: any) => u._id === s.fitBy)?.name || '-'}</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 500, color: theme.palette.primary.main }}>
                        {s.ratePerMeterWithMeter ? `₹${s.ratePerMeterWithMeter}` : '-'}
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 500, color: theme.palette.primary.main }}>
                        {s.ratePerUnitWithUnit ? `₹${s.ratePerUnitWithUnit}` : '-'}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <IconButton
                            size="small"
                            onClick={() => {
                              setSelectedStock(s);
                              setEditOpen(true);
                            }}
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
                            onClick={() => {
                              setSelectedStock(s);
                              setDeleteOpen(true);
                            }}
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
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
        </Box>

        {/* Add Dialog */}
        <AddStockDialog
          open={addOpen}
          onClose={() => setAddOpen(false)}
          onSubmit={handleAdd}
          designs={designs}
          variants={variantsGrouped}
          loading={loadingAdd}
        />

        {/* Edit Dialog */}
        {selectedStock && (
          <UpdateStockDialog
            open={editOpen}
            onClose={() => {
              setEditOpen(false);
              setSelectedStock(null);
            }}
            onSubmit={handleUpdate}
            stock={selectedStock}
            designs={designs}
            variants={variantsGrouped}
            users={usersData?.users || []}
            loading={loadingUpdate}
          />
        )}

        {/* Delete Dialog */}
        <ConfirmationDialog
          open={deleteOpen}
          title="Delete Stock"
          description="Are you sure you want to delete this stock?"
          confirmText="Delete"
          onConfirm={handleDelete}
          onCancel={() => {
            setDeleteOpen(false);
            setSelectedStock(null);
          }}
        />
      </Box>
    </Container>
  );
};

export default StockManagement;
