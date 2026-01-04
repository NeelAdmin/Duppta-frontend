// src/pages/SignUp.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Paper,
  Alert,
  CircularProgress,
  Fade,
  InputAdornment,
  IconButton,
  type ContainerProps,
} from '@mui/material';
import { Person as PersonIcon, Phone as PhoneIcon, Lock as LockIcon, Home as HomeIcon, Visibility, VisibilityOff } from '@mui/icons-material';
import { useRegisterMutation } from '../features/auth/authApi';
import { registerSchema, type RegisterFormData } from '../validations/authSchemas';

const StyledContainer = styled(Container)<ContainerProps>(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
  padding: theme.spacing(3),
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  borderRadius: 16,
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  maxWidth: 440,
  width: '100%',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    background: 'linear-gradient(90deg, #3f51b5 0%, #2196f3 100%)',
  },
}));

const StyledForm = styled('form')(({ theme }) => ({
  width: '100%',
  marginTop: theme.spacing(3),
  '& .MuiTextField-root': {
    marginBottom: theme.spacing(2),
    '& .MuiOutlinedInput-root': {
      borderRadius: 8,
      '& fieldset': {
        borderColor: '#e0e0e0',
      },
      '&:hover fieldset': {
        borderColor: '#3f51b5',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#3f51b5',
      },
    },
  },
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  padding: theme.spacing(1.5),
  borderRadius: 8,
  fontWeight: 600,
  textTransform: 'none',
  fontSize: '1rem',
  letterSpacing: 0.5,
  boxShadow: '0 4px 14px rgba(63, 81, 181, 0.2)',
  '&:hover': {
    boxShadow: '0 6px 20px rgba(63, 81, 181, 0.3)',
  },
}));

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const [registerUser, { isLoading, error, isSuccess }] = useRegisterMutation();
  const [showPassword, setShowPassword] = React.useState(false);

  const errorMessage = error && 'data' in error ? (error.data as { message: string }).message : 'An error occurred during registration';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: yupResolver(registerSchema),
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerUser(data).unwrap();
      // On successful registration, redirect to login
      navigate('/login', {
        state: { message: 'Registration successful! Please sign in.' },
      });
    } catch (err) {
      // Error is already handled by the mutation
    }
  };

  return (
    <StyledContainer component="main" maxWidth={false}>
      <Fade in={true} timeout={500}>
        <StyledPaper elevation={3}>
          <Box textAlign="center" mb={3}>
            <PersonIcon
              color="primary"
              sx={{
                fontSize: 48,
                background: 'rgba(63, 81, 181, 0.1)',
                borderRadius: '50%',
                padding: 1.5,
                marginBottom: 1
              }}
            />
            <Typography component="h1" variant="h4" fontWeight="bold" color="textPrimary" gutterBottom>
              Create Account
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Fill in your details to get started
            </Typography>
          </Box>

          {error && (
            <Fade in={!!error}>
              <Alert
                severity="error"
                sx={{
                  width: '100%',
                  mb: 3,
                  borderRadius: 2,
                  '& .MuiAlert-message': {
                    width: '100%',
                  },
                }}
              >
                {errorMessage}
              </Alert>
            </Fade>
          )}

          {isSuccess && (
            <Fade in={isSuccess}>
              <Alert
                severity="success"
                sx={{
                  width: '100%',
                  mb: 3,
                  borderRadius: 2,
                }}
              >
                Registration successful! Redirecting to login...
              </Alert>
            </Fade>
          )}

          <StyledForm onSubmit={handleSubmit(onSubmit)}>
            <TextField
              fullWidth
              id="name"
              label="Full Name"
              autoComplete="name"
              autoFocus
              error={!!errors.name}
              helperText={errors.name?.message?.toString()}
              variant="outlined"
              {...register('name')}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              id="mobile"
              label="Mobile Number"
              autoComplete="tel"
              error={!!errors.mobile}
              helperText={errors.mobile?.message?.toString()}
              variant="outlined"
              {...register('mobile')}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="new-password"
              error={!!errors.password}
              helperText={errors.password?.message?.toString()}
              variant="outlined"
              {...register('password')}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={togglePasswordVisibility}
                      edge="end"
                      size="large"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              id="address"
              label="Address"
              multiline
              rows={3}
              error={!!errors.address}
              helperText={errors.address?.message?.toString()}
              variant="outlined"
              {...register('address')}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                    <HomeIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{ '& .MuiInputBase-multiline': { alignItems: 'flex-start' } }}
            />

            <SubmitButton
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={isLoading}
              disableElevation
            >
              {isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Sign Up'
              )}
            </SubmitButton>

            <Box mt={3} textAlign="center">
              <Typography variant="body2" color="textSecondary">
                Already have an account?{' '}
                <Link
                  component={RouterLink}
                  to="/login"
                  color="primary"
                  fontWeight={600}
                  underline="hover"
                >
                  Sign In
                </Link>
              </Typography>
            </Box>
          </StyledForm>
        </StyledPaper>
      </Fade>
    </StyledContainer>
  );
};

export default SignUp;