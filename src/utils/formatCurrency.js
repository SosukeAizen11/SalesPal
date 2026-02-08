/**
 * Central Currency Formatter for SalesPal
 * All monetary values must use this formatter to ensure consistency.
 * 
 * Currency: INR (Indian Rupees)
 * Locale: en-IN
 * 
 * Example outputs:
 * ₹35,000
 * ₹1,25,500
 */

/**
 * Formats a numeric value as INR currency
 * @param {number|string} value - The value to format
 * @param {Object} options - Formatting options
 * @param {boolean} options.compact - Use compact notation (e.g., ₹1.2L instead of ₹1,20,000)
 * @param {number} options.decimals - Number of decimal places (default: 0)
 * @returns {string} Formatted currency string or "—" for invalid values
 */
export function formatCurrency(value, options = {}) {
    const { compact = false, decimals = 0 } = options;

    // Defensive handling: null, undefined, NaN, empty string
    if (value === null || value === undefined || value === '') {
        return '—';
    }

    // Parse if string
    const numValue = typeof value === 'string'
        ? parseFloat(value.replace(/[^0-9.-]/g, ''))
        : value;

    // Check for NaN after parsing
    if (isNaN(numValue)) {
        return '—';
    }

    // Format using Intl.NumberFormat with en-IN locale for Indian number system
    try {
        if (compact) {
            // Compact notation (₹1.2L, ₹50K)
            return new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: 'INR',
                notation: 'compact',
                maximumFractionDigits: 1
            }).format(numValue);
        }

        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        }).format(numValue);
    } catch (error) {
        console.error('Currency formatting error:', error);
        return '—';
    }
}

/**
 * Formats a value as a percentage
 * @param {number} value - The percentage value (e.g., 2.5 for 2.5%)
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted percentage or "—" for invalid values
 */
export function formatPercent(value, decimals = 1) {
    if (value === null || value === undefined || isNaN(value)) {
        return '—';
    }
    return `${Number(value).toFixed(decimals)}%`;
}

/**
 * Formats a ROAS value with 'x' suffix
 * @param {number} value - The ROAS value
 * @returns {string} Formatted ROAS (e.g., "3.24x") or "—" for invalid
 */
export function formatROAS(value) {
    if (value === null || value === undefined || isNaN(value)) {
        return '—';
    }
    return `${Number(value).toFixed(2)}x`;
}

/**
 * Formats a number with locale-aware formatting (no currency symbol)
 * @param {number} value - The number to format
 * @returns {string} Formatted number or "—" for invalid values
 */
export function formatNumber(value) {
    if (value === null || value === undefined || isNaN(value)) {
        return '—';
    }
    return new Intl.NumberFormat('en-IN').format(value);
}

export default formatCurrency;
