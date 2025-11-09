import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthLocal } from '../context/AuthContextLocal';

const ProtectedRoute = ({ children }) => {

const { user, loading } = useAuthLocal();
if (loading) return <div>Carregando...</div>;
if (!user) return <Navigate to="/login" replace />;
return <>{children}</>;
};

export default ProtectedRoute;