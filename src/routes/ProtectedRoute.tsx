import { Navigate, useLocation } from 'react-router-dom';
import { useAuthUser, useIsAuthenticated, useIsAuthPending } from '../store/authStore';
import { Spinner, LoadingContainer } from '../components/basic';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requiredRoles?: string[];
}

export function ProtectedRoute({ children, requiredRoles }: ProtectedRouteProps) {
    const user = useAuthUser();
    const isPending = useIsAuthPending();
    const isAuthenticated = useIsAuthenticated();
    const location = useLocation();

    if (isPending) {
        return (
            <LoadingContainer>
                <Spinner />
            </LoadingContainer>
        )
    }

    if (!isAuthenticated) {
        return <Navigate to="/signin" state={{ from: location }} replace />;
    }

    if (requiredRoles?.length && user && !requiredRoles.includes(user.role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <>{children}</>;
}