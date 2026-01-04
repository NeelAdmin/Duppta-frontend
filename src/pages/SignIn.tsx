// src/pages/SignIn.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { type FetchBaseQueryError } from '@reduxjs/toolkit/query';
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
import { Lock as LockIcon, Phone as PhoneIcon, Visibility, VisibilityOff } from '@mui/icons-material';
import { useLoginMutation } from '../features/auth/authApi';
import { setCredentials } from '../features/auth/authSlice';
import { loginSchema, type LoginFormData } from '../validations/authSchemas';
import { useDispatch } from 'react-redux';

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

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [login, { isLoading, error }] = useLoginMutation();
  const [showPassword, setShowPassword] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const errorMessage =
    (error as FetchBaseQueryError)?.data &&
    typeof (error as any).data?.message === 'string'
      ? (error as any).data.message
      : 'Login failed';

  const onSubmit = async (data: LoginFormData) => {
    try {
      const result = await login({
        mobile: data.mobile,
        password: data.password,
      }).unwrap();

      dispatch(
        setCredentials({
          user: result.user,
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
        })
      );

      navigate('/dashboard');
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  return (
    <StyledContainer component="main" maxWidth={false}>
      <Fade in={true} timeout={500}>
        <StyledPaper elevation={3}>
          <Box textAlign="center" mb={3}>
            <LockIcon
              color="primary"
              sx={{
                fontSize: 48,
                background: 'rgba(63, 81, 181, 0.1)',
                borderRadius: '50%',
                padding: 1.5,
                marginBottom: 1,
              }}
            />
            <Typography component="h1" variant="h4" fontWeight="bold" color="textPrimary" gutterBottom>
              Welcome Back
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Sign in to your account to continue
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

          <StyledForm onSubmit={handleSubmit(onSubmit)}>
            <TextField
              fullWidth
              id="mobile"
              label="Mobile Number"
              autoComplete="tel"
              autoFocus
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
              autoComplete="current-password"
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

            <Box textAlign="right" mb={2}>
              <Link
                component={RouterLink}
                to="/forgot-password"
                variant="body2"
                color="primary"
                underline="hover"
              >
                Forgot Password?
              </Link>
            </Box>

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
                'Sign In'
              )}
            </SubmitButton>

            <Box mt={3} textAlign="center">
              <Typography variant="body2" color="textSecondary">
                Don't have an account?{' '}
                <Link
                  component={RouterLink}
                  to="/register"
                  color="primary"
                  fontWeight={600}
                  underline="hover"
                >
                  Sign Up
                </Link>
              </Typography>
            </Box>
          </StyledForm>
        </StyledPaper>
      </Fade>
    </StyledContainer>
  );
};

export default SignIn;