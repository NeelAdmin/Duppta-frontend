import React, { useState } from 'react';
import {
  Box, Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Typography, TextField, InputAdornment, useTheme,
  TablePagination, CircularProgress
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { useGetAllUsersQuery } from '../features/auth/authApi';

const Users: React.FC = () => {
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch users data
  const { data: usersData, isLoading, isError } = useGetAllUsersQuery({});
  const users:any = usersData?.users || [];

  // Filter users based on search term
  const filteredUsers = users?.filter((user:any) => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.mobile.toString().includes(searchTerm) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle pagination
  const handleChangePage = (event: unknown, newPage: number) => {
    console.log(event);
    
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography color="error">Error loading users. Please try again later.</Typography>
      </Container>
    );
  }

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
            Users Management
          </Typography>
          
          {/* Search Bar */}
          <Box sx={{ mb: 3, maxWidth: 400 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{
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
          </Box>
        </Box>

        {/* Users Table */}
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
                  <TableCell>Name</TableCell>
                  <TableCell>Mobile</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Address</TableCell>
                  <TableCell>Created At</TableCell>
                  <TableCell>Last Updated</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.length > 0 ? (
                  filteredUsers
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((user:any) => (
                      <TableRow key={user._id} hover>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.mobile}</TableCell>
                        <TableCell>
                          <Box 
                            sx={{
                              display: 'inline-block',
                              px: 1.5,
                              py: 0.5,
                              borderRadius: 1,
                              bgcolor: user.role === 'admin' 
                                ? 'rgba(25, 118, 210, 0.12)' 
                                : 'rgba(0, 0, 0, 0.04)',
                              color: user.role === 'admin' 
                                ? theme.palette.primary.main 
                                : 'inherit',
                              fontWeight: 500,
                              fontSize: '0.75rem',
                              textTransform: 'capitalize'
                            }}
                          >
                            {user.role}
                          </Box>
                        </TableCell>
                        <TableCell>{user.address}</TableCell>
                        <TableCell>{formatDate(user.createdAt)}</TableCell>
                        <TableCell>{formatDate(user.updatedAt)}</TableCell>
                      </TableRow>
                    ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                      <Typography color="textSecondary">
                        {searchTerm ? 'No users found matching your search.' : 'No users found.'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          
          {/* Pagination */}
          {filteredUsers.length > 0 && (
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredUsers.length}
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
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default Users;
