import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import SignIn from '../pages/auth/SignIn';
import SignUp from '../pages/auth/SignUp';
import { Menu } from '../pages/Menu';
import Dashboard from '../pages/Dashboard';
import { Restaurants } from '../pages/Restaurants';
import { MenuEditor } from '../pages/MenuEditor';
import { Cart } from '../pages/Cart';
import { Orders } from '../pages/Orders';
import { RestaurantOrders } from '../pages/RestaurantOrders';

export default function AppRoutes() {
    return (
        <Routes>
            {/* Public routes */}
            <Route path="/" element={<Restaurants />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/menu/:rid" element={<Menu />} />
            
            {/* Protected routes */}
            <Route path="/dashboard" element={
                <ProtectedRoute>
                    <Dashboard />
                </ProtectedRoute>
            } />
            <Route path="/owner/menu/:rid" element={
                <ProtectedRoute requiredRoles={['owner']}>
                    <MenuEditor />
                </ProtectedRoute>
            } />
            <Route path="/cart" element={
                <ProtectedRoute requiredRoles={['customer']}>
                    <Cart />
                </ProtectedRoute>
            } />
            <Route path="/orders" element={
                <ProtectedRoute requiredRoles={['customer']}>
                    <Orders />
                </ProtectedRoute>
            } />
            <Route path="/restaurant-orders" element={
                <ProtectedRoute requiredRoles={['owner']}>
                    <RestaurantOrders />
                </ProtectedRoute>
            } />


            {/* Default route */}
            <Route path="*" element={<Restaurants />} />
        </Routes>
    );
}
