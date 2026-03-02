import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useOrg } from './OrgContext';
import { useAuth } from './AuthContext';

/**
 * useSocialContext — internal hook, consumed only by MarketingProvider.
 * Owns social posts CRUD with optimistic updates.
 * Extracted from MarketingContext (Phase 4).
 *
 * @param {string|null} selectedProjectId — passed in from MarketingProvider local state
 */
export function useSocialContext(selectedProjectId) {
    const { orgId } = useOrg();
    const { user } = useAuth();

    const [socialPosts, setSocialPosts] = useState([]);
    const [socialPostsLoading, setSocialPostsLoading] = useState(true);

    const fetchSocialPosts = useCallback(async () => {
        if (!orgId) { setSocialPosts([]); setSocialPostsLoading(false); return; }
        setSocialPostsLoading(true);
        const { data } = await supabase
            .from('social_posts')
            .select('*')
            .eq('org_id', orgId)
            .order('created_at', { ascending: false });
        setSocialPosts(data || []);
        setSocialPostsLoading(false);
    }, [orgId]);

    useEffect(() => { fetchSocialPosts(); }, [fetchSocialPosts]);

    const addSocialPost = async (post) => {
        if (!orgId) return null;
        // Optimistic update
        const tempId = crypto.randomUUID();
        const optimistic = { ...post, id: tempId, org_id: orgId, created_at: new Date().toISOString() };
        setSocialPosts(prev => [optimistic, ...prev]);

        const { data, error } = await supabase
            .from('social_posts')
            .insert({
                org_id: orgId,
                project_id: selectedProjectId || null,
                created_by: user?.id,
                content: post.content,
                post_type: post.type || post.post_type || 'image',
                status: post.status || 'draft',
                scheduled_for: post.scheduledFor || post.scheduled_for || null,
                platforms: post.platforms || [],
                media_urls: post.mediaUrls || post.media_urls || []
            })
            .select()
            .single();

        if (!error && data) {
            // Replace optimistic with real row
            setSocialPosts(prev => prev.map(p => p.id === tempId ? data : p));
            return data;
        } else {
            // Rollback on error
            setSocialPosts(prev => prev.filter(p => p.id !== tempId));
            return null;
        }
    };

    const deleteSocialPost = async (postId) => {
        // Optimistic removal
        setSocialPosts(prev => prev.filter(p => p.id !== postId));
        const { error } = await supabase
            .from('social_posts')
            .delete()
            .eq('id', postId);
        if (error) {
            // Rollback: refetch on failure
            fetchSocialPosts();
        }
    };

    const updateSocialPost = async (postId, updates) => {
        setSocialPosts(prev => prev.map(p => p.id === postId ? { ...p, ...updates } : p));
        const { data, error } = await supabase
            .from('social_posts')
            .update(updates)
            .eq('id', postId)
            .select()
            .single();
        if (!error && data) setSocialPosts(prev => prev.map(p => p.id === postId ? data : p));
    };

    return {
        socialPosts,
        socialPostsLoading,
        addSocialPost,
        updateSocialPost,
        deleteSocialPost,
    };
}
