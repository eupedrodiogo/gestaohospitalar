import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { Send, Search, User, CheckCheck, Clock, ArrowLeft, MessageSquarePlus, X, Trash2, Paperclip, FileText, Image as ImageIcon, Video, Loader2, MoreVertical, Archive, UserCircle, Sun, Moon } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import { useTheme } from '../contexts/ThemeContext';

type Profile = {
  userId: string;
  name: string;
  role: string;
  department: string;
};

type Message = {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
};

interface ChatPanelProps {
  currentUser: { userId: string; name: string };
}

export default function ChatPanel({ currentUser }: ChatPanelProps) {
  const [users, setUsers] = useState<Profile[]>([]);
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  
  const [activeChatUserIds, setActiveChatUserIds] = useState<string[]>([]);
  const [lastMessageTimes, setLastMessageTimes] = useState<Record<string, number>>({});
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [modalSearch, setModalSearch] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addToast } = useToast();
  const { currentTheme, setCurrentTheme } = useTheme();
  
  const [contextMenu, setContextMenu] = useState<{ userId: string; x: number; y: number } | null>(null);

  const isDarkTheme = currentTheme?.includes('dark');
  const toggleTheme = () => {
    if (currentTheme === 'hsf') setCurrentTheme('hsf-dark');
    else if (currentTheme === 'hsf-dark') setCurrentTheme('hsf');
    else if (currentTheme === 'dark-hsf') setCurrentTheme('hsf');
    else if (currentTheme === 'dark') setCurrentTheme('light');
    else setCurrentTheme('dark');
  };

  useEffect(() => {
    const handleClickOutside = () => setContextMenu(null);
    document.addEventListener('click', handleClickOutside);
    // Também fechar ao dar scroll
    document.addEventListener('scroll', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('scroll', handleClickOutside, true);
    };
  }, []);
  
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // 1. Fetch Users
  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('userId, name, role, department')
        .neq('userId', currentUser.userId)
        .order('name');
        
      if (data) setUsers(data);
    };
    fetchUsers();
  }, [currentUser.userId]);

  // Fetch active chat users
  useEffect(() => {
    const fetchActiveChats = async () => {
      const { data, error } = await supabase
        .from('direct_messages')
        .select('sender_id, receiver_id, created_at')
        .or(`sender_id.eq.${currentUser.userId},receiver_id.eq.${currentUser.userId}`)
        .order('created_at', { ascending: true });
        
      if (data) {
        const ids = new Set<string>();
        const times: Record<string, number> = {};
        data.forEach(m => {
          const otherId = m.sender_id === currentUser.userId ? m.receiver_id : m.sender_id;
          ids.add(otherId);
          times[otherId] = new Date(m.created_at).getTime();
        });
        setActiveChatUserIds(Array.from(ids));
        setLastMessageTimes(times);
      }
    };
    fetchActiveChats();
    const interval = setInterval(fetchActiveChats, 3000);

    const channel = supabase
      .channel('active_chats_listener')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'direct_messages'
      }, (payload) => {
        const newMsg = payload.new as Message;
        if (newMsg.sender_id === currentUser.userId || newMsg.receiver_id === currentUser.userId) {
          const otherId = newMsg.sender_id === currentUser.userId ? newMsg.receiver_id : newMsg.sender_id;
          setActiveChatUserIds(prev => prev.includes(otherId) ? prev : [...prev, otherId]);
          setLastMessageTimes(prev => ({ ...prev, [otherId]: new Date(newMsg.created_at).getTime() }));
        }
      })
      .subscribe();

    return () => {
      clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, [currentUser.userId]);

  // 2. Fetch Messages and subscribe
  useEffect(() => {
    if (!selectedUser) return;
    
    let isMounted = true;
    
    const fetchMessages = async (isPolling = false) => {
      if (!isPolling) setLoading(true);
      const { data, error } = await supabase
        .from('direct_messages')
        .select('*')
        .or(`and(sender_id.eq.${currentUser.userId},receiver_id.eq.${selectedUser.userId}),and(sender_id.eq.${selectedUser.userId},receiver_id.eq.${currentUser.userId})`)
        .order('created_at', { ascending: true });
        
      if (error) {
        console.error("Erro ao buscar mensagens:", error);
      }
        
      if (data && isMounted) {
        setMessages(prev => {
          const isDifferent = data.length !== prev.length || data.some((m, i) => !prev[i] || m.id !== prev[i].id || m.is_read !== prev[i].is_read);
          if (isDifferent) {
            if (!isPolling || data.length > prev.length) setTimeout(scrollToBottom, 100);
            return data;
          }
          return prev;
        });
        
        // Mark as read se fomos nós que recebemos
        const unreadIds = data.filter(m => m.receiver_id === currentUser.userId && !m.is_read).map(m => m.id);
        if (unreadIds.length > 0) {
          await supabase.from('direct_messages').update({ is_read: true }).in('id', unreadIds);
        }
      }
      if (!isPolling) setLoading(false);
    };

    fetchMessages();
    const pollInterval = setInterval(() => fetchMessages(true), 3000);

    const channel = supabase
      .channel(`chat_${selectedUser.userId}`)
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'direct_messages'
      }, (payload) => {
        if (payload.eventType === 'INSERT') {
          const newMsg = payload.new as Message;
          // Verifica se a mensagem pertence à conversa atual
          if (
            (newMsg.sender_id === currentUser.userId && newMsg.receiver_id === selectedUser.userId) ||
            (newMsg.sender_id === selectedUser.userId && newMsg.receiver_id === currentUser.userId)
          ) {
            if (isMounted) {
              setMessages(prev => {
                if (prev.some(m => m.id === newMsg.id)) return prev;
                
                // Substitui a mensagem otimista (fake ID) pela mensagem real (real ID) do banco
                const optimisticMsgIndex = prev.findIndex(m => 
                  m.sender_id === newMsg.sender_id && 
                  m.content === newMsg.content && 
                  m.id !== newMsg.id &&
                  Math.abs(new Date(newMsg.created_at).getTime() - new Date(m.created_at).getTime()) < 10000 // menos de 10s
                );

                if (optimisticMsgIndex >= 0) {
                  const newArray = [...prev];
                  newArray[optimisticMsgIndex] = newMsg;
                  return newArray;
                }

                return [...prev, newMsg];
              });
              setTimeout(scrollToBottom, 100);
              
              // Marca como lida se recebemos via socket e estamos com a aba aberta
              if (newMsg.receiver_id === currentUser.userId) {
                supabase.from('direct_messages').update({ is_read: true }).eq('id', newMsg.id).then();
              }
            }
          }
        } else if (payload.eventType === 'UPDATE') {
          const updatedMsg = payload.new as Message;
          if (
            (updatedMsg.sender_id === currentUser.userId && updatedMsg.receiver_id === selectedUser.userId) ||
            (updatedMsg.sender_id === selectedUser.userId && updatedMsg.receiver_id === currentUser.userId)
          ) {
            if (isMounted) {
              setMessages(prev => prev.map(m => m.id === updatedMsg.id ? updatedMsg : m));
            }
          }
        } else if (payload.eventType === 'DELETE') {
          const oldMsg = payload.old as { id: string };
          if (isMounted) {
            setMessages(prev => prev.filter(m => m.id !== oldMsg.id));
          }
        }
      })
      .subscribe();

    return () => {
      isMounted = false;
      clearInterval(pollInterval);
      supabase.removeChannel(channel);
    };
  }, [selectedUser, currentUser.userId]);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;

    try {
      const content = newMessage.trim();
      setNewMessage(''); // Optimistic clear
      
      // Optimistic UI insert
      const tempMsg: Message = {
        id: Math.random().toString(36).substring(2, 15) + Date.now().toString(36),
        sender_id: currentUser.userId,
        receiver_id: selectedUser.userId,
        content,
        is_read: false,
        created_at: new Date().toISOString()
      };
      setMessages(prev => [...prev, tempMsg]);
      setTimeout(scrollToBottom, 100);

    const { error } = await supabase.from('direct_messages').insert({
      sender_id: currentUser.userId,
      receiver_id: selectedUser.userId,
      content
    });

    if (error) {
      addToast('Erro ao enviar mensagem', 'error');
      console.error(error);
      return;
    } else {
      setActiveChatUserIds(prev => prev.includes(selectedUser.userId) ? prev : [...prev, selectedUser.userId]);
      setLastMessageTimes(prev => ({ ...prev, [selectedUser.userId]: Date.now() }));
    }

    // Disparar Web Push
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      fetch('/api/send-push', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          title: `Mensagem de ${currentUser.name || 'Colega'}`,
          body: content.substring(0, 100),
          url: '/', // Poderia ser /?tab=chat, mas vamos simplificar
          targetUserId: selectedUser.userId
        })
      }).catch(console.error);
    }
    } catch (err) {
      console.error('Erro inesperado no envio da mensagem:', err);
      addToast('Erro inesperado', 'error');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedUser) return;

    let type = 'document';
    if (file.type.startsWith('image/')) type = 'image';
    else if (file.type.startsWith('video/')) type = 'video';

    setIsUploading(true);
    setUploadProgress(10); // Simulated progress

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `chat_attachments/${currentUser.userId}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('community_media')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw uploadError;
      }
      
      setUploadProgress(100);

      const { data: { publicUrl } } = supabase.storage
        .from('community_media')
        .getPublicUrl(fileName);

      const downloadURL = publicUrl;
      const content = `[ATTACHMENT|${type}|${file.name}]${downloadURL}`;
      
      // Optimistic UI insert
      const tempMsg: Message = {
        id: Math.random().toString(36).substring(2, 15) + Date.now().toString(36),
        sender_id: currentUser.userId,
        receiver_id: selectedUser.userId,
        content,
        is_read: false,
        created_at: new Date().toISOString()
      };
      setMessages(prev => [...prev, tempMsg]);
      setTimeout(scrollToBottom, 100);

      const { error } = await supabase.from('direct_messages').insert({
        sender_id: currentUser.userId,
        receiver_id: selectedUser.userId,
        content
      });

      if (error) {
        addToast('Erro ao enviar anexo', 'error');
        console.error(error);
      } else {
        setActiveChatUserIds(prev => prev.includes(selectedUser.userId) ? prev : [...prev, selectedUser.userId]);
        setLastMessageTimes(prev => ({ ...prev, [selectedUser.userId]: Date.now() }));
      }

      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      console.error('Erro inesperado no upload:', err);
      addToast('Erro ao fazer upload do arquivo', 'error');
      setIsUploading(false);
    }
  };

  const handleDeleteMessage = async (id: string) => {
    // Optimistic delete
    setMessages(prev => prev.filter(m => m.id !== id));

    const { error } = await supabase
      .from('direct_messages')
      .delete()
      .eq('id', id);

    if (error) {
      addToast('Erro ao apagar mensagem', 'error');
      console.error('Error deleting message:', error);
    }
  };

  const handleDeleteConversation = async (targetUserId: string) => {
    if (!currentUser) return;
    
    const confirmDelete = window.confirm('Tem certeza que deseja apagar toda a conversa? Esta ação não pode ser desfeita e apagará as mensagens para ambos.');
    if (!confirmDelete) return;

    try {
      // Optimistic UI updates
      if (selectedUser?.userId === targetUserId) {
        setMessages([]);
        setSelectedUser(null);
      }
      setActiveChatUserIds(prev => prev.filter(id => id !== targetUserId));
      
      addToast('Conversa apagada com sucesso', 'success');

      // Delete from backend
      const { error } = await supabase
        .from('direct_messages')
        .delete()
        .or(`and(sender_id.eq.${currentUser.userId},receiver_id.eq.${targetUserId}),and(sender_id.eq.${targetUserId},receiver_id.eq.${currentUser.userId})`);

      if (error) throw error;
      
    } catch (err) {
      console.error('Erro ao apagar conversa:', err);
      addToast('Erro ao apagar conversa', 'error');
      // Idealy we would rollback the state here if it fails
    }
  };



  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) || 
                          u.department.toLowerCase().includes(search.toLowerCase());
    
    // A lista lateral mostra apenas conversas iniciadas. A busca filtra dentro delas.
    return activeChatUserIds.includes(u.userId) && (search.trim() === '' || matchesSearch);
  }).sort((a, b) => {
    const timeA = lastMessageTimes[a.userId] || 0;
    const timeB = lastMessageTimes[b.userId] || 0;
    return timeB - timeA;
  });

  return (
    <div className="flex-1 max-w-7xl w-full mx-auto p-0 sm:p-4 lg:p-8 animate-in fade-in duration-500 flex flex-col h-[calc(100dvh-160px)] md:h-[calc(100dvh-100px)] min-h-[400px]">
      <div className="hidden sm:block mb-6 px-4 sm:px-0 mt-4 sm:mt-0 shrink-0">
        <h1 className="text-3xl font-bold text-slate-100 tracking-tight flex items-center gap-3">
          Chat Corporativo
        </h1>
        <p className="text-slate-400 mt-2 text-md max-w-2xl font-light">
          Comunicação direta, segura e em tempo real com todos os colaboradores.
        </p>
      </div>

      <div className="flex flex-1 h-full min-h-0 sm:rounded-3xl overflow-hidden border border-slate-800/60 bg-slate-900/95 shadow-2xl backdrop-blur-xl">
        
        {/* Painel Esquerdo: Lista de Contatos */}
        <div className={`w-full lg:w-1/3 flex flex-col border-r border-slate-800/60 bg-slate-950/40 ${selectedUser ? 'hidden lg:flex' : 'flex'}`}>
          <div className="px-6 py-5 bg-transparent min-h-[72px] flex items-center justify-between shrink-0">
            <h2 className="text-xl font-semibold text-slate-100 tracking-tight">Mensagens</h2>
            <button 
              onClick={toggleTheme}
              className="lg:hidden p-2 rounded-xl hover:bg-slate-800 text-slate-400 transition-colors active:scale-95"
              title="Trocar tema"
            >
              {isDarkTheme ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
          <div className="px-5 pb-4 bg-transparent flex gap-3 items-center relative z-10">
            <div className="relative flex-1 group">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-teal-400 transition-colors" />
              <input 
                type="text" 
                placeholder="Pesquisar mensagens..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-900/60 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500/50 placeholder:text-slate-500 transition-all shadow-sm"
              />
            </div>
            <button
              onClick={() => setIsSearchModalOpen(true)}
              className="p-2.5 bg-teal-600 hover:bg-teal-500 text-white shadow-lg shadow-teal-900/20 rounded-xl transition-all hover:-translate-y-0.5 shrink-0 flex items-center justify-center active:scale-95"
              title="Nova conversa"
            >
              <MessageSquarePlus className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-3 space-y-1 pb-4">
            {filteredUsers.map(user => (
              <div
                key={user.userId}
                className={`relative w-full flex items-center group transition-all duration-200 rounded-2xl overflow-hidden cursor-pointer select-none ${selectedUser?.userId === user.userId ? 'bg-slate-800 shadow-md ring-1 ring-slate-700/50' : 'hover:bg-slate-850/50'}`}
                onClick={() => setSelectedUser(user)}
                onContextMenu={(e) => {
                  e.preventDefault();
                  setContextMenu({
                    userId: user.userId,
                    x: e.clientX,
                    y: e.clientY
                  });
                }}
              >
                {selectedUser?.userId === user.userId && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-teal-500 rounded-r-full" />
                )}
                <div className="flex-1 flex items-center gap-3.5 p-3 text-left min-w-0 transition-transform duration-200 group-hover:translate-x-1">
                  <div className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors duration-200 ${selectedUser?.userId === user.userId ? 'border-teal-500/30 bg-teal-500/10 text-teal-600 dark:text-teal-400' : 'border-slate-800 bg-slate-900 text-slate-400 group-hover:border-slate-700'}`}>
                    <User className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <div className="flex justify-between items-baseline mb-1">
                      <p className={`font-semibold truncate text-[14px] ${selectedUser?.userId === user.userId ? 'text-slate-100' : 'text-slate-200'}`}>{user.name}</p>
                    </div>
                    <p className={`text-xs truncate ${selectedUser?.userId === user.userId ? 'text-slate-500' : 'text-slate-500'}`}>{user.role} • {user.department}</p>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const rect = e.currentTarget.getBoundingClientRect();
                    setContextMenu({
                      userId: user.userId,
                      x: rect.right - 180, // Offset to not overflow screen usually
                      y: rect.bottom
                    });
                  }}
                  className="p-3 text-slate-500 hover:text-teal-400 hover:bg-teal-500/10 rounded-xl mr-2 lg:opacity-0 lg:group-hover:opacity-100 transition-all shrink-0 active:scale-95"
                  title="Opções da conversa"
                >
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            ))}
            {filteredUsers.length === 0 && (
              <div className="p-8 text-center text-slate-450 text-sm">
                {search.trim() === '' 
                  ? (
                    <div className="space-y-3">
                      <p>Nenhuma conversa ativa.</p>
                      <button
                        onClick={() => setIsSearchModalOpen(true)}
                        className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold transition-colors"
                      >
                        Iniciar conversa
                      </button>
                    </div>
                  ) 
                  : (
                    <div className="space-y-3">
                      <p>Nenhuma conversa ativa encontrada para "{search}".</p>
                      <button
                        onClick={() => {
                          setModalSearch(search);
                          setIsSearchModalOpen(true);
                        }}
                        className="px-4 py-2 bg-slate-850 hover:bg-slate-800 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold transition-colors"
                      >
                        Pesquisar em toda a empresa
                      </button>
                    </div>
                  )}
              </div>
            )}
          </div>
        </div>

        {/* Painel Direito: Chat Box */}
        <div className={`w-full lg:w-2/3 flex flex-col bg-slate-900/50 relative ${!selectedUser ? 'hidden lg:flex' : 'flex'}`}>
          {/* Background sutil */}
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
          
          {selectedUser ? (
            <>
              {/* Header do Chat */}
              <div className="px-6 py-4 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/60 flex items-center justify-between min-h-[72px] shrink-0 z-20 shadow-sm">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setSelectedUser(null)}
                    className="lg:hidden p-2 -ml-2 rounded-xl hover:bg-slate-800 text-slate-400 transition-colors active:scale-95"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <div className="relative">
                    <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center text-slate-300 shrink-0 border-2 border-slate-700/50 shadow-sm">
                      <User className="w-6 h-6" />
                    </div>
                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-teal-500 rounded-full border-2 border-slate-950"></div>
                  </div>
                  <div className="flex flex-col">
                    <h3 className="font-semibold text-slate-100 text-[16px] leading-tight tracking-wide">{selectedUser.name}</h3>
                    <p className="text-[13px] text-teal-400/80 font-medium leading-tight mt-0.5">{selectedUser.role} <span className="text-slate-500 font-normal">• {selectedUser.department}</span></p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={toggleTheme}
                    className="lg:hidden p-2.5 rounded-xl hover:bg-slate-800/50 text-slate-400 hover:text-teal-400 transition-colors tooltip-trigger active:scale-95"
                    title="Trocar tema"
                  >
                    {isDarkTheme ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                  </button>
                  <button
                    onClick={() => handleDeleteConversation(selectedUser.userId)}
                    className="p-2.5 rounded-xl hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-colors tooltip-trigger active:scale-95"
                    title="Apagar conversa inteira"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Mensagens */}
              <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 sm:p-6 pb-4 md:pb-6 space-y-3 z-10 flex flex-col">
                {loading ? (
                  <div className="flex-1 flex items-center justify-center text-slate-450">
                    <Clock className="w-5 h-5 animate-spin mr-2" /> Carregando mensagens...
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-slate-455 space-y-3">
                    <div className="bg-amber-500/10 border border-amber-500/20 px-4 py-2 rounded-xl text-[12px] text-center max-w-xs shadow-sm text-amber-600 font-medium">
                      As mensagens enviadas para este chat e chamadas agora são protegidas com a criptografia de ponta a ponta padrão da empresa.
                    </div>
                  </div>
                ) : (
                  messages.map(msg => {
                    const isMine = msg.sender_id === currentUser.userId;
                    return (
                      <div key={msg.id} className={`flex flex-col ${isMine ? 'items-end' : 'items-start'} group w-full mb-1`}>
                        <div 
                          className={`max-w-[85%] sm:max-w-[75%] relative px-4 pt-2.5 pb-3 shadow-md flex flex-col gap-1.5 transition-all
                          ${isMine 
                            ? 'bg-teal-600/90 text-white rounded-2xl rounded-tr-sm border border-teal-500/30 shadow-teal-900/20' 
                            : 'bg-slate-800/80 text-slate-100 rounded-2xl rounded-tl-sm border border-slate-700/50 shadow-black/20 backdrop-blur-sm'}`}
                        >
                          {isMine && (
                            <button
                              onClick={() => handleDeleteMessage(msg.id)}
                              className="absolute -left-10 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-slate-900/90 border border-slate-700 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30 text-slate-400 opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer z-20 shadow-lg"
                              title="Apagar mensagem"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                          
                          {(() => {
                            const attachmentMatch = msg.content.match(/^\[ATTACHMENT\|([^|]+)\|([^\]]+)\](.+)$/);
                            if (attachmentMatch) {
                              const [, type, name, url] = attachmentMatch;
                              if (type === 'image') {
                                return (
                                  <a href={url} target="_blank" rel="noopener noreferrer" className="block max-w-full overflow-hidden rounded-xl border border-white/10 mt-1">
                                    <img src={url} alt={name} className="max-w-full max-h-72 object-contain hover:scale-105 transition-transform duration-500" />
                                  </a>
                                );
                              } else if (type === 'video') {
                                return (
                                  <div className="mt-1 max-w-full overflow-hidden rounded-xl border border-white/10 bg-black/20">
                                    <video src={url} controls className="max-w-full max-h-72" />
                                  </div>
                                );
                              } else {
                                return (
                                  <a href={url} target="_blank" rel="noopener noreferrer" className={`flex items-center gap-3 mt-1 p-3 rounded-xl hover:opacity-90 transition-opacity break-all ${isMine ? 'bg-black/15' : 'bg-slate-900/50'}`}>
                                    <FileText className={`w-8 h-8 shrink-0 ${isMine ? 'text-teal-200' : 'text-teal-400'}`} />
                                    <span className="text-[14px] font-medium leading-snug">{name}</span>
                                  </a>
                                );
                              }
                            }
                            return <p className={`text-[15px] leading-relaxed whitespace-pre-wrap break-words ${isMine ? 'text-white' : 'text-slate-200'}`}>{msg.content}</p>;
                          })()}
                          
                          <div className="flex items-center justify-end gap-1.5 mt-0.5 select-none">
                            <span className={`text-[11px] font-medium leading-none ${isMine ? 'text-white/70' : 'text-slate-400'}`}>
                              {new Date(msg.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            {isMine && (
                              <CheckCheck className={`w-[14px] h-[14px] ${msg.is_read ? 'text-sky-400' : 'text-white/50'}`} />
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Input Area */}
              <div className="p-3 sm:p-4 bg-slate-950/90 md:bg-transparent z-40 shrink-0 mt-auto border-t border-slate-800/50 md:border-none backdrop-blur-md w-full">
                {isUploading && (
                  <div className="absolute top-0 left-0 w-full h-0.5 bg-slate-800">
                    <div 
                      className="h-full bg-teal-500 transition-all duration-300 shadow-[0_0_10px_rgba(20,184,166,0.8)]" 
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                )}
                <form onSubmit={handleSend} className="flex items-end gap-2 sm:gap-3 max-w-4xl mx-auto bg-slate-900/90 backdrop-blur-xl border border-slate-700/60 p-2 rounded-[24px] shadow-2xl relative">
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileUpload}
                    className="hidden" 
                    accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="w-11 h-11 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-300 rounded-full flex items-center justify-center transition-all shrink-0 ml-1 hover:text-teal-400 active:scale-95"
                    title="Anexar arquivo"
                  >
                    {isUploading ? <Loader2 className="w-5 h-5 animate-spin text-teal-500" /> : <Paperclip className="w-5 h-5" />}
                  </button>
                  <div className="flex-1 flex items-center overflow-hidden">
                    <textarea
                      value={newMessage}
                      onChange={e => setNewMessage(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSend(e);
                        }
                      }}
                      placeholder="Escreva uma mensagem..."
                      className="w-full bg-transparent border-none px-2 py-3 text-[15px] text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-0 resize-none max-h-32 min-h-[44px] scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent"
                      rows={1}
                      style={{ height: 'auto' }}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={!newMessage.trim() || isUploading}
                    className="w-11 h-11 bg-gradient-to-tr from-teal-600 to-teal-400 hover:from-teal-500 hover:to-teal-300 disabled:opacity-0 disabled:w-0 disabled:scale-0 disabled:ml-0 text-white rounded-full flex items-center justify-center transition-all duration-300 shrink-0 shadow-lg shadow-teal-900/30 mr-1 active:scale-95"
                  >
                    <Send className="w-5 h-5 ml-0.5" />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="hidden lg:flex flex-1 flex-col items-center justify-center text-slate-400 bg-slate-900/30">
              <div className="w-full max-w-md text-center space-y-6 p-8 rounded-3xl bg-slate-900/50 border border-slate-800/50 shadow-2xl backdrop-blur-sm animate-in zoom-in-95 duration-500">
                <div className="flex justify-center mb-6">
                   <div className="w-24 h-24 bg-slate-800/80 rounded-full flex items-center justify-center shadow-inner border border-slate-700/50">
                     <MessageSquarePlus className="w-10 h-10 text-teal-500/80" />
                   </div>
                </div>
                <h2 className="text-2xl font-semibold text-slate-100 tracking-tight">Comunicação Corporativa</h2>
                <p className="text-[15px] leading-relaxed text-slate-400 font-light">
                  Selecione um contato na lista lateral ou inicie uma nova conversa para colaborar com sua equipe.
                </p>
                <div className="mt-8 pt-6 border-t border-slate-800/50 inline-flex items-center gap-2 px-4 py-2 bg-slate-950/50 rounded-full">
                  <div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></div>
                  <span className="text-xs text-slate-400 font-medium tracking-wide uppercase">Criptografia de ponta a ponta</span>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Search Modal / Popup */}
      {isSearchModalOpen && (() => {
        const filteredModalUsers = users.filter(u => 
          u.name.toLowerCase().includes(modalSearch.toLowerCase()) || 
          u.department.toLowerCase().includes(modalSearch.toLowerCase()) ||
          u.role.toLowerCase().includes(modalSearch.toLowerCase())
        );

        // Group by department
        const groupedUsers = filteredModalUsers.reduce((acc, user) => {
          const dept = user.department || 'Geral';
          if (!acc[dept]) acc[dept] = [];
          acc[dept].push(user);
          return acc;
        }, {} as Record<string, Profile[]>);

        return (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900/90 border border-slate-700/50 w-full max-w-lg rounded-3xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden animate-in zoom-in-95 duration-300">
              
              {/* Modal Header */}
              <div className="p-5 border-b border-slate-800/60 flex items-center justify-between gap-4 bg-slate-950/50">
                <div className="flex-1 relative group">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-teal-400 transition-colors" />
                  <input 
                    type="text"
                    autoFocus
                    placeholder="Buscar colaborador por nome, cargo ou setor..."
                    value={modalSearch}
                    onChange={(e) => setModalSearch(e.target.value)}
                    className="w-full bg-slate-900/60 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-[15px] text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500/50 placeholder:text-slate-500 transition-all shadow-sm"
                  />
                </div>
                <button 
                  onClick={() => {
                    setIsSearchModalOpen(false);
                    setModalSearch('');
                  }}
                  className="p-2.5 rounded-xl bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors shrink-0 active:scale-95"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body: Users List */}
              <div className="flex-1 overflow-y-auto p-3 space-y-4 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                {Object.entries(groupedUsers).map(([dept, deptUsers]) => (
                  <div key={dept} className="space-y-2">
                    <div className="px-4 py-1.5 flex items-center gap-2">
                      <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-slate-800 to-transparent"></div>
                      <h4 className="text-[11px] font-bold text-teal-500/80 uppercase tracking-widest">{dept}</h4>
                      <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-slate-800 to-transparent"></div>
                    </div>
                    <div className="space-y-1">
                      {(deptUsers as Profile[]).map(u => (
                        <button
                          key={u.userId}
                          onClick={() => {
                            setSelectedUser(u);
                            setIsSearchModalOpen(false);
                            setModalSearch('');
                          }}
                          className="w-full flex items-center gap-3.5 p-3 rounded-2xl text-left hover:bg-slate-800/60 transition-all duration-200 group border border-transparent hover:border-slate-700/50 hover:shadow-md"
                        >
                          <div className="w-11 h-11 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-teal-500/10 group-hover:text-teal-400 border border-slate-700/50 transition-colors shrink-0 shadow-sm">
                            <User className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-slate-100 text-[14px] truncate group-hover:text-white transition-colors">{u.name}</p>
                            <p className="text-[12px] text-slate-500 truncate group-hover:text-teal-200/70 transition-colors">{u.role}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
                {Object.keys(groupedUsers).length === 0 && (
                  <div className="py-12 flex flex-col items-center justify-center text-slate-400 space-y-3">
                    <Search className="w-8 h-8 text-slate-600 mb-2" />
                    <p className="text-[15px]">Nenhum colaborador encontrado.</p>
                    <p className="text-[13px] text-slate-500">Tente buscar por nome, cargo ou setor.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })()}

      {/* Context Menu */}
      {contextMenu && (
        <div 
          className="fixed z-50 w-52 bg-slate-800/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
          style={{ 
            top: Math.min(contextMenu.y, window.innerHeight - 200), // Prevent overflow bottom
            left: Math.min(contextMenu.x, window.innerWidth - 220)  // Prevent overflow right
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="py-1.5 flex flex-col">
            <button 
              className="w-full flex items-center gap-3 px-4 py-2.5 text-[14px] text-slate-300 hover:bg-slate-700/80 hover:text-white transition-colors text-left"
              onClick={() => {
                setContextMenu(null);
                const u = users.find(u => u.userId === contextMenu.userId);
                if(u) setSelectedUser(u);
              }}
            >
              <MessageSquarePlus className="w-4 h-4 text-teal-400" />
              Abrir conversa
            </button>
            <button 
              className="w-full flex items-center gap-3 px-4 py-2.5 text-[14px] text-slate-300 hover:bg-slate-700/80 hover:text-white transition-colors text-left"
              onClick={() => {
                setContextMenu(null);
                addToast('O arquivamento de conversas será adicionado em breve.', 'info');
              }}
            >
              <Archive className="w-4 h-4 text-slate-400" />
              Arquivar conversa
            </button>
            <button 
              className="w-full flex items-center gap-3 px-4 py-2.5 text-[14px] text-slate-300 hover:bg-slate-700/80 hover:text-white transition-colors text-left"
              onClick={() => {
                setContextMenu(null);
                addToast('Limpeza de histórico será adicionada em breve.', 'info');
              }}
            >
              <UserCircle className="w-4 h-4 text-slate-400" />
              Limpar histórico
            </button>
            
            <div className="h-px bg-slate-700/50 my-1.5 mx-2"></div>
            
            <button 
              className="w-full flex items-center gap-3 px-4 py-2.5 text-[14px] text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors text-left font-medium"
              onClick={() => {
                setContextMenu(null);
                handleDeleteConversation(contextMenu.userId);
              }}
            >
              <Trash2 className="w-4 h-4" />
              Apagar conversa
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
