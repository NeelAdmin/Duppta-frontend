import React, { useState } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  TablePagination,
  InputAdornment,
  Chip,
  useTheme,
  alpha
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useGetUserWorkQuery } from '../features/common/stockApi';

const MyWork = () => {
  const theme = useTheme();
  const { data, isLoading, error } = useGetUserWorkQuery();
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const user = JSON.parse(localStorage.getItem('user') || '{}'); // Get current user

  const handleChangePage = (event: unknown, newPage: number) => {
    console.log(event);
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Check if current user is a fitter or cutter
  const isFitter = (stock: any) => stock.fitBy?._id === user._id;
  const isCutter = (stock: any) => stock.cutBy?._id === user._id;

  const filteredStocks = data?.stock?.filter((stock: any) => 
    (isFitter(stock) || isCutter(stock)) && (
      stock.designId.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stock.varientId.color.toLowerCase().includes(searchTerm.toLowerCase())
    )
  ) || [];

  if (isLoading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">Error loading your work data</Typography>;

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
    const lowerColor = colorName.toLowerCase();
    return colorMap[lowerColor] || '#e0e0e0'; // Default to light gray if color not found
  };

  return (
    <Box sx={{ width: '100%', overflow: 'hidden' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>My Work</Typography>
        <TextField
          variant="outlined"
          placeholder="Search by design or color..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ 
            width: '100%',
            maxWidth: 500,
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              height: 40,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
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
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <TableContainer 
        component={Paper} 
        elevation={0}
        sx={{
          width: '100%',
          borderRadius: 2,
          border: `1px solid ${theme.palette.divider}`,
          overflowX: 'auto',
          '& .MuiTable-root': {
            minWidth: '100%',
            tableLayout: 'fixed',
          },
          '& .MuiTableCell-root': {
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          },
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ background: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)', }}>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>Design</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>Color</TableCell>
              <TableCell align="right" sx={{ color: 'white', fontWeight: 600 }}>
                {isFitter(filteredStocks[0]) ? 'Unit' : 'Meter'}
              </TableCell>
              {isFitter(filteredStocks[0]) && (
                <TableCell align="right" sx={{ color: 'white', fontWeight: 600 }}>Rate per Unit (₹)</TableCell>
              )}
              {isCutter(filteredStocks[0]) && (
                <TableCell align="right" sx={{ color: 'white', fontWeight: 600 }}>Rate per Meter (₹)</TableCell>
              )}
              <TableCell align="right" sx={{ color: 'white', fontWeight: 600 }}>Total (₹)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredStocks
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((stock: any) => (
                <TableRow 
                  key={stock._id} 
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
                  <TableCell sx={{ fontWeight: 500 }}>{stock.designId.name}</TableCell>
                  <TableCell>
                    <Chip 
                      label={stock.varientId.color}
                      size="small"
                      sx={{
                        backgroundColor: getColorFromName(stock.varientId.color),
                        color: theme.palette.getContrastText(getColorFromName(stock.varientId.color)),
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
                  {isFitter(stock) && (
                    <TableCell align="right">{stock.ratePerUnitWithUnit?.toFixed(2)}</TableCell>
                  )}
                  {isCutter(stock) && (
                    <TableCell align="right">{stock.ratePerMeterWithMeter?.toFixed(2)}</TableCell>
                  )}
                  <TableCell align="right">
                    {isFitter(stock) ? stock.unit?.toFixed(2) : stock.meter?.toFixed(2)}
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 500, color: theme.palette.primary.main }}>
                    ₹{isFitter(stock) 
                      ? stock.ratePerUnitWithUnit?.toFixed(2)
                      : stock.ratePerMeterWithMeter?.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredStocks.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{
            '& .MuiTablePagination-toolbar': {
              justifyContent: 'flex-start',
              pl: 2,
            },
            '& .MuiTablePagination-displayedRows': {
              margin: '0',
            },
            borderTop: `1px solid ${theme.palette.divider}`,
          }}
        />
      </TableContainer>
    </Box>
  );
};

export default MyWork;