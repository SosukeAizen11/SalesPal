import { useState, useEffect, useCallback } from 'react';
import api from '../lib/api';
import { useOrg } from '../context/OrgContext';

/**
 * useProjects — REST-backed projects CRUD hook.
 * Replaces Supabase .from('projects') calls.
 */
export function useProjects() {
    const { orgId } = useOrg();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchProjects = useCallback(async () => {
        if (!orgId) {
            setProjects([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const data = await api.get('/projects');
            setProjects(data.projects || data || []);
        } catch (err) {
            console.error('Error fetching projects:', err);
            setError(err.message);
        }

        setLoading(false);
    }, [orgId]);

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    const createProject = async (projectData) => {
        if (!orgId) return { data: null, error: 'No organization' };

        try {
            const data = await api.post('/projects', {
                name: projectData.name,
            });
            const project = data.project || data;
            setProjects(prev => [project, ...prev]);
            return { data: project, error: null };
        } catch (err) {
            console.error('Error creating project:', err);
            return { data: null, error: err.message };
        }
    };

    const updateProject = async (projectId, updates) => {
        try {
            const data = await api.put(`/projects/${projectId}`, updates);
            const project = data.project || data;
            setProjects(prev => prev.map(p => p.id === projectId ? project : p));
            return { data: project, error: null };
        } catch (err) {
            console.error('Error updating project:', err);
            return { data: null, error: err.message };
        }
    };

    const archiveProject = async (projectId) => {
        try {
            await api.del(`/projects/${projectId}`);
            setProjects(prev => prev.filter(p => p.id !== projectId));
            return { error: null };
        } catch (err) {
            console.error('Error archiving project:', err);
            return { error: err.message };
        }
    };

    const getProjectById = (id) => {
        return projects.find(p => p.id === id) || null;
    };

    return {
        projects,
        loading,
        error,
        createProject,
        updateProject,
        archiveProject,
        getProjectById,
        refetch: fetchProjects
    };
}
