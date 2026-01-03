import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from './store/store';
import FixedLayout from "./components/FixedLayout";
import Dashboard from "./pages/Dashboard";
import AddStock from "./pages/AddStock";
import AddDesign from "./pages/AddDesign";
import AddVarient from "./pages/AddVarient";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import MyWork from "./pages/MyWork";
import Users from './pages/Users';

// Protected Route component
type ProtectedRouteProps = {
  children: React.ReactNode;
};

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user } = useSelector((state: RootState) => state.auth);
  return user ? <>{children}</> : <Navigate to="/login" replace />;
};

// Public Route component
const PublicRoute = ({ children }: ProtectedRouteProps) => {
  const { user } = useSelector((state: RootState) => state.auth);
  return user ? <Navigate to="/" replace /> : <>{children}</>;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={
          <PublicRoute>
            <SignIn />
          </PublicRoute>
        } />
        <Route path="/register" element={
          <PublicRoute>
            <SignUp />
          </PublicRoute>
        } />

        {/* Protected Routes */}
        <Route path="/" element={
          <ProtectedRoute>
            <FixedLayout>
              <Dashboard />
            </FixedLayout>
          </ProtectedRoute>
        } />
         <Route path="/my-work" element={
          <ProtectedRoute>
            <FixedLayout>
              <MyWork />
            </FixedLayout>
          </ProtectedRoute>
        } />
        <Route path="/add-stock" element={
          <ProtectedRoute>
            <FixedLayout>
              <AddStock />
            </FixedLayout>
          </ProtectedRoute>
        } />
        <Route path="/add-design" element={
          <ProtectedRoute>
            <FixedLayout>
              <AddDesign />
            </FixedLayout>
          </ProtectedRoute>
        } />
        <Route path="/add-varient" element={
          <ProtectedRoute>
            <FixedLayout>
              <AddVarient />
            </FixedLayout>
          </ProtectedRoute>
        } />

        <Route path="/users" element={
          <ProtectedRoute>
            <FixedLayout>
              <Users />
            </FixedLayout>
          </ProtectedRoute>
        } />

        {/* 404 Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;