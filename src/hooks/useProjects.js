import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useOrg } from '../context/OrgContext';

/**
 * useProjects — Supabase-backed projects CRUD hook
 * Replaces localStorage project persistence from ProjectContext + MarketingContext
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

        const { data, error: fetchError } = await supabase
            .from('projects')
            .select('*')
            .eq('org_id', orgId)
            .eq('status', 'active')
            .order('created_at', { ascending: false });

        if (fetchError) {
            console.error('Error fetching projects:', fetchError);
            setError(fetchError.message);
        } else {
            setProjects(data || []);
        }

        setLoading(false);
    }, [orgId]);

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    const createProject = async (projectData) => {
        if (!orgId) return { data: null, error: 'No organization' };

        const { data, error: insertError } = await supabase
            .from('projects')
            .insert({
                name: projectData.name,
                org_id: orgId,
                status: 'active',
                created_by: (await supabase.auth.getUser()).data.user?.id
            })
            .select()
            .single();

        if (insertError) {
            console.error('Error creating project:', insertError);
            return { data: null, error: insertError.message };
        }

        setProjects(prev => [data, ...prev]);
        return { data, error: null };
    };

    const updateProject = async (projectId, updates) => {
        const { data, error: updateError } = await supabase
            .from('projects')
            .update(updates)
            .eq('id', projectId)
            .select()
            .single();

        if (updateError) {
            console.error('Error updating project:', updateError);
            return { data: null, error: updateError.message };
        }

        setProjects(prev => prev.map(p => p.id === projectId ? data : p));
        return { data, error: null };
    };

    const archiveProject = async (projectId) => {
        const { error: archiveError } = await supabase
            .from('projects')
            .update({ status: 'archived' })
            .eq('id', projectId);

        if (archiveError) {
            console.error('Error archiving project:', archiveError);
            return { error: archiveError.message };
        }

        setProjects(prev => prev.filter(p => p.id !== projectId));
        return { error: null };
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
