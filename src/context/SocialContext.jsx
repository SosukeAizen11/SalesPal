import { useState, useEffect, useCallback } from 'react';
import api from '../lib/api';
import { useOrg } from './OrgContext';
import { useAuth } from './AuthContext';

/**
 * useSocialContext — REST-backed social posts CRUD with optimistic updates.
 * Replaces Supabase .from('social_posts') calls.
 */
export function useSocialContext(selectedProjectId) {
    const { orgId } = useOrg();
    const { user } = useAuth();

    const [socialPosts, setSocialPosts] = useState([]);
    const [socialPostsLoading, setSocialPostsLoading] = useState(true);

    const fetchSocialPosts = useCallback(async () => {
        if (!orgId) { setSocialPosts([]); setSocialPostsLoading(false); return; }
        setSocialPostsLoading(true);
        try {
            const data = await api.get('/social/posts');
            setSocialPosts(data.posts || data || []);
        } catch (err) {
            console.error('Error fetching social posts:', err);
            setSocialPosts([]);
        }
        setSocialPostsLoading(false);
    }, [orgId]);

    useEffect(() => { fetchSocialPosts(); }, [fetchSocialPosts]);

    const addSocialPost = async (post) => {
        if (!orgId) return null;
        // Optimistic update
        const tempId = crypto.randomUUID();
        const optimistic = { ...post, id: tempId, org_id: orgId, created_at: new Date().toISOString() };
        setSocialPosts(prev => [optimistic, ...prev]);

        try {
            const data = await api.post('/social/posts', {
                project_id: selectedProjectId || null,
                content: post.content,
                post_type: post.type || post.post_type || 'image',
                status: post.status || 'draft',
                scheduled_for: post.scheduledFor || post.scheduled_for || null,
                platforms: post.platforms || [],
                media_urls: post.mediaUrls || post.media_urls || [],
            });
            const newPost = data.post || data;
            setSocialPosts(prev => prev.map(p => p.id === tempId ? newPost : p));
            return newPost;
        } catch (err) {
            console.error('Error creating social post:', err);
            setSocialPosts(prev => prev.filter(p => p.id !== tempId));
            return null;
        }
    };

    const deleteSocialPost = async (postId) => {
        setSocialPosts(prev => prev.filter(p => p.id !== postId));
        try {
            await api.del(`/social/posts/${postId}`);
        } catch (err) {
            console.error('Error deleting social post:', err);
            fetchSocialPosts();
        }
    };

    const updateSocialPost = async (postId, updates) => {
        setSocialPosts(prev => prev.map(p => p.id === postId ? { ...p, ...updates } : p));
        try {
            const data = await api.put(`/social/posts/${postId}`, updates);
            const updated = data.post || data;
            setSocialPosts(prev => prev.map(p => p.id === postId ? updated : p));
        } catch (err) {
            console.error('Error updating social post:', err);
        }
    };

    return {
        socialPosts,
        socialPostsLoading,
        addSocialPost,
        updateSocialPost,
        deleteSocialPost,
    };
}
