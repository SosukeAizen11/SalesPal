import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const AnalyticsContext = createContext();

export const AnalyticsProvider = ({ children }) => {
    const [searchParams, setSearchParams] = useSearchParams();

    // Core State
    const [timeRange, setTimeRange] = useState('7d'); // 'today', '7d', '30d', 'custom'
    const [channelFilter, setChannelFilter] = useState('all'); // 'all', 'meta', 'google', 'linkedin'
    const [compareMode, setCompareMode] = useState(false);

    // Sync Project ID from URL
    const selectedProjectId = searchParams.get('projectId') || 'all';

    const setProject = (projectId) => {
        if (projectId === 'all') {
            searchParams.delete('projectId');
            setSearchParams(searchParams);
        } else {
            setSearchParams({ ...Object.fromEntries(searchParams), projectId });
        }
    };

    const value = {
        timeRange,
        setTimeRange,
        channelFilter,
        setChannelFilter,
        compareMode,
        setCompareMode,
        selectedProjectId,
        setProject,
        isGlobal: selectedProjectId === 'all'
    };

    return (
        <AnalyticsContext.Provider value={value}>
            {children}
        </AnalyticsContext.Provider>
    );
};

export const useAnalytics = () => {
    const context = useContext(AnalyticsContext);
    if (!context) {
        throw new Error('useAnalytics must be used within an AnalyticsProvider');
    }
    return context;
};
