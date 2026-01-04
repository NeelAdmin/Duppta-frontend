import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
  useTheme,
  CircularProgress
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useGetDashboardStockQuery } from '../features/common/stockApi';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const Dashboard: React.FC = () => {
  const theme = useTheme();
  const [fromDate, setFromDate] = useState<Date | null>(new Date('2025-01-01'));
  const [toDate, setToDate] = useState<Date | null>(new Date('2025-12-31'));

  const { data: dashboardData, isLoading, isError } = useGetDashboardStockQuery({
    fromDate: fromDate?.toISOString().split('T')[0] || '2025-01-01',
    toDate: toDate?.toISOString().split('T')[0] || '2025-12-31'
  });

  const calculateTotals = () => {
    if (!dashboardData?.data) return { totalMeters: 0, totalUnits: 0, totalDesigns: 0 };
    let totalMeters = 0;
    let totalUnits = 0;
    dashboardData.data.forEach(item => {
      item.variant.forEach(v => {
        totalMeters += v.meter;
        totalUnits += v.unit;
      });
    });
    return {
      totalMeters: Math.round(totalMeters * 100) / 100,
      totalUnits: Math.round(totalUnits * 100) / 100,
      totalDesigns: dashboardData.data.length
    };
  };

  const { totalMeters, totalUnits, totalDesigns } = calculateTotals();

  const prepareChartData = () => {
    if (!dashboardData?.data) return { byColor: [], byDesign: [] };
    const colorMap = new Map<string, { meters: number; units: number }>();
    const designData = dashboardData.data.map(design => ({
      name: design.design,
      meters: design.variant.reduce((sum, v) => sum + v.meter, 0),
      units: design.variant.reduce((sum, v) => sum + v.unit, 0)
    })).sort((a, b) => b.meters - a.meters).slice(0, 5);

    dashboardData.data.forEach(design => {
      design.variant.forEach(variant => {
        const current = colorMap.get(variant.color) || { meters: 0, units: 0 };
        colorMap.set(variant.color, {
          meters: current.meters + variant.meter,
          units: current.units + variant.unit
        });
      });
    });

    const colorData = Array.from(colorMap.entries()).map(([color, data]) => ({
      name: color,
      meters: Math.round(data.meters * 100) / 100,
      units: Math.round(data.units * 100) / 100
    }));

    return { byColor: colorData, byDesign: designData };
  };

  const { byColor, byDesign } = prepareChartData();

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box sx={{ p: 4, m: 3, bgcolor: '#fff5f5', borderRadius: 2, border: '1px solid #feb2b2' }}>
        <Typography color="error">Error loading dashboard data. Please try again later.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{
      p: { xs: 1.5, sm: 3 },
      width: '100%',
      boxSizing: 'border-box',
      '& .MuiTypography-h4': {
        fontSize: { xs: '1.5rem', sm: '2.125rem' },
      },
      '& .MuiTypography-h6': {
        fontSize: { xs: '1rem', sm: '1.25rem' },
      },
      '& .MuiTableCell-root': {
        py: { xs: 1, sm: 1.5 },
        fontSize: { xs: '0.8rem', sm: '0.875rem' },
      },
      '& .recharts-legend-item-text': {
        fontSize: { xs: '0.75rem', sm: '0.875rem' },
      },
      '& .recharts-cartesian-axis-tick text': {
        fontSize: { xs: '0.7rem', sm: '0.75rem' },
      },
    }}>
      {/* HEADER SECTION */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'stretch', sm: 'center' },
          mb: { xs: 2, sm: 4 },
          gap: 2,
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 'bold',
            fontSize: { xs: '1.5rem', sm: '2.125rem' },
            whiteSpace: 'nowrap',
          }}
        >
          Dashboard
        </Typography>

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            ml: { sm: 'auto' },      // 🔑 THIS is the key
            width: { xs: '100%', sm: 'auto' },
          }}
        >
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            {/* <DatePicker
              label="From Date"
              value={fromDate}
              onChange={setFromDate}
              renderInput={(params:any) => <TextField {...params} size="small" />}
            />
            <DatePicker
              label="To Date"
              value={toDate}
              onChange={setToDate}
              renderInput={(params:any) => <TextField {...params} size="small" />}
            /> */}
            <DatePicker
              label="From Date"
              value={fromDate}
              onChange={(newValue) => setFromDate(newValue)}
              slotProps={{
                textField: {
                  size: 'small',
                  fullWidth: true
                }
              }}
            />
            <DatePicker
              label="To Date"
              value={toDate}
              onChange={(newValue) => setToDate(newValue)}
              slotProps={{
                textField: {
                  size: 'small',
                  fullWidth: true
                }
              }}
            />
          </LocalizationProvider>
        </Box>
      </Box>


      {/* SUMMARY CARDS SECTION */}
      <Box
        sx={{
          display: 'flex',
          gap: 3,
          mb: 4,
          flexWrap: 'wrap',
          width: '100%',
        }}
      >
        {[
          { label: 'Total Meters', value: totalMeters.toLocaleString() },
          { label: 'Total Units', value: totalUnits.toLocaleString() },
          { label: 'Total Designs', value: totalDesigns },
        ].map((item, index) => (
          <Box
            key={index}
            sx={{
              flex: {
                xs: '1 1 calc(50% - 16px)', // 🔑 3 cards per row on mobile
                sm: '1 1 220px',               // normal behavior on larger screens
              },
              maxWidth: {
                xs: 'calc(50% - 16px)',
                sm: 'none',
              },
            }}
          >
            <Card sx={{ borderRadius: 2, boxShadow: 3, height: '100%' }}>
              <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
                <Typography
                  variant="overline"
                  sx={{
                    fontWeight: 'bold',
                    fontSize: { xs: '0.6rem', sm: '0.75rem' }, // 🔽 smaller on mobile
                    lineHeight: 1.2,
                  }}
                  color="text.secondary"
                >
                  {item.label}
                </Typography>

                <Typography
                  sx={{
                    fontSize: { xs: '1.2rem', sm: '2rem' }, // 🔽 smaller on mobile
                    fontWeight: 600,
                    lineHeight: 1.1,
                  }}
                >
                  {item.value}
                </Typography>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>


      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 3,
          width: '100%',
          mb: 4,
        }}
      >
        {/* Card 1 */}
        <Box
          sx={{
            flex: '1 1 480px', // grow | shrink | min-width
            minWidth: 0,       // VERY important for charts
          }}
        >
          <Paper sx={{
            p: { xs: 1.5, sm: 3 },
            borderRadius: 2,
            height: { xs: 350, sm: 450 },
            boxShadow: 2
          }}>
            <Typography variant="h6" gutterBottom>
              Stock by Color
            </Typography>

            <ResponsiveContainer width="100%" height="90%">
              <BarChart data={byColor}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="meters"
                  name="Meters"
                  fill={theme.palette.primary.main}
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="units"
                  name="Units"
                  fill={theme.palette.secondary.main}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Box>

        {/* Card 2 */}
        <Box
          sx={{
            flex: '1 1 480px',
            minWidth: 0,
          }}
        >
          <Paper sx={{
            p: { xs: 1.5, sm: 3 },
            borderRadius: 2,
            height: { xs: 350, sm: 450 },
            boxShadow: 2
          }}>
            <Typography variant="h6" gutterBottom>
              Top Designs by Meters
            </Typography>

            <ResponsiveContainer width="100%" height="90%">
              <PieChart>
                <Pie
                  data={byDesign}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="meters"
                  nameKey="name"
                  label={({ name, percent }) =>
                    `${name} (${(percent ? percent * 100 : 0).toFixed(0)}%)`
                  }
                >
                  {byDesign.map((_, index) => (
                    <Cell
                      key={index}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Box>
      </Box>



      {/* TABLE SECTION */}
      <Box sx={{ p: { xs: 1.5, sm: 1 }, }}>
        <Typography variant="h6" sx={{ fontSize: { xs: '1rem', sm: '1.25rem' }, fontWeight: 600 }}>Detailed Stock Summary</Typography>
      </Box>
      <Paper sx={{ width: '100%', borderRadius: 2, boxShadow: 2, overflow: 'hidden', mt: { xs: 2, sm: 3 } }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table>
            <TableHead>
              <TableRow sx={{
                background: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
                position: 'relative',
                overflow: 'hidden',
              }}>
                <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Design</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Color</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold', color: 'white' }}>Meters</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold', color: 'white' }}>Units</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dashboardData?.data.flatMap(design =>
                design.variant.map((variant, idx) => (
                  <TableRow key={`${design.design}-${variant.color}-${idx}`} hover>
                    <TableCell>{design.design}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: variant.color, border: '1px solid #ccc' }} />
                        {variant.color}
                      </Box>
                    </TableCell>
                    <TableCell align="right">{variant.meter.toLocaleString()}</TableCell>
                    <TableCell align="right">{variant.unit.toLocaleString()}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default Dashboard;