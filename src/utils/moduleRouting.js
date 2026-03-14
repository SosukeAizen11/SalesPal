// Module priority hierarchy
const MODULE_HIERARCHY = ['marketing', 'sales', 'postSale', 'support'];

// Mapping from module key to route
const MODULE_ROUTES = {
    marketing: '/marketing/dashboard',
    sales: '/sales/dashboard',
    postSale: '/post-sales/dashboard',
    support: '/support/dashboard',
};

/**
 * Returns the correct dashboard path based on active subscriptions,
 * following the module hierarchy: Marketing > Sales > Post Sales > Support.
 * Falls back to '/marketing/dashboard' if nothing is active.
 */
export function getTopModuleRoute(subscriptions) {
    if (!subscriptions) return '/marketing/dashboard';

    // Build set of active module keys
    const activeKeys = Object.values(subscriptions)
        .filter(sub => sub && sub.active)
        .map(sub => sub.module);

    for (const key of MODULE_HIERARCHY) {
        if (activeKeys.includes(key)) {
            return MODULE_ROUTES[key];
        }
    }

    return '/marketing/dashboard';
}
