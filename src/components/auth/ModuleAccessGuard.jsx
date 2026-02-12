import React from 'react';
import { Navigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const ModuleAccessGuard = ({ moduleName, children }) => {
    const { ownedProducts } = useCart();

    // Check if user has the active module
    const hasAccess = ownedProducts.some(
        product => product.id === moduleName && product.status === 'active'
    );

    if (!hasAccess) {
        // Redirect to the product page for this module
        return <Navigate to={`/products/${moduleName}`} replace />;
    }

    return children;
};

export default ModuleAccessGuard;
