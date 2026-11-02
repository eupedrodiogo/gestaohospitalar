import { useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useToast } from '../contexts/ToastContext';

interface GlobalNotificationsProps {
  currentUser: { uid: string; email: string } | null;
}

export default function GlobalNotifications({ currentUser }: GlobalNotificationsProps) {
  const { addToast } = useToast();

  useEffect(() => {
    if (!currentUser) return;

    // Listen to new notices (Mural de Avisos)
    const noticesChannel = supabase.channel('global-notices')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notices' }, (payload) => {
        const newNotice = payload.new;
        // Don't notify the author
        if (newNotice.authorId !== currentUser.uid) {
          addToast(`Novo Aviso Oficial: ${newNotice.title}`, 'info');
        }
      })
      .subscribe();

    // Listen to new community posts
    const communityChannel = supabase.channel('global-community')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'community_posts' }, (payload) => {
        const newPost = payload.new;
        // Don't notify the author
        if (newPost.authorId !== currentUser.uid) {
          const authorName = newPost.authorName || 'Alguém';
          addToast(`Nova publicação de ${authorName} na Comunidade!`, 'info');
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(noticesChannel);
      supabase.removeChannel(communityChannel);
    };
  }, [currentUser, addToast]);

  return null; // This component does not render any UI, it just manages side effects.
}
