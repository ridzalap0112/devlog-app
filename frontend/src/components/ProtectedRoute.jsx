import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column',
                    alignItems:'center', justifyContent:'center' }}>
        <div className="spinner animate-spin" />
        <p style={{ color:'#64748b', fontSize:'0.9375rem' }}>Loading...</p>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" replace />;
}
