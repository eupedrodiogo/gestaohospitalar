import React, { useState, useEffect, useRef } from "react";
import { supabase } from "../lib/supabase";
import { 
  MessageSquare, Heart, Image as ImageIcon, Send, MoreHorizontal, 
  ThumbsUp, Share2, MessageCircle, AlertCircle, Trash2, Clock, X, FileVideo
} from "lucide-react";
import { CommunityPost, CommunityComment, UserProfile } from "../types";

interface NetworkPanelProps {
  currentUser: UserProfile;
}

export default function NetworkPanel({ currentUser }: NetworkPanelProps) {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [newPostContent, setNewPostContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeCommentPost, setActiveCommentPost] = useState<string | null>(null);
  const [newCommentContent, setNewCommentContent] = useState("");
  const [comments, setComments] = useState<Record<string, CommunityComment[]>>({});
  const [errorMsg, setErrorMsg] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [userBadges, setUserBadges] = useState<Record<string, any[]>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchPosts = async () => {
    const { data: postsData, error } = await supabase
      .from("community_posts")
      .select(`
        *,
        community_likes(user_id)
      `)
      .order("createdAt", { ascending: false });
      
    if (postsData) {
      const { data: commentsData } = await supabase.from("community_comments").select("post_id");
      
      const counts: Record<string, number> = {};
      if (commentsData) {
        commentsData.forEach((c: any) => {
          counts[c.post_id] = (counts[c.post_id] || 0) + 1;
        });
      }

      const mapped: CommunityPost[] = postsData.map((p: any) => ({
        ...p,
        likes: p.community_likes ? p.community_likes.map((l: any) => l.user_id) : [],
        commentCount: counts[p.id] || 0
      }));
      setPosts(mapped);
    }
  };

  useEffect(() => {
    fetchPosts();
    
    const fetchBadges = async () => {
      const { data } = await supabase.from("user_profiles").select("userId, badges");
      if (data) {
        const badgesMap: Record<string, any[]> = {};
        data.forEach(u => {
           let b = u.badges;
           if (!b || b.length === 0) {
             b = [
               { id: '1', name: '5 Anos de Casa', icon: '🏆', description: 'Tempo de empresa', earnedAt: Date.now() - 86400000 * 365 * 5 },
               { id: '2', name: 'Zero Faltas', icon: '⭐', description: 'Assiduidade perfeita', earnedAt: Date.now() - 86400000 * 30 },
               { id: '3', name: 'Biossegurança', icon: '🛡️', description: 'Treinamento concluído', earnedAt: Date.now() - 86400000 * 10 }
             ];
           }
           badgesMap[u.userId] = b;
        });
        setUserBadges(badgesMap);
      }
    };
    fetchBadges();
    
    const sub = supabase.channel('community_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'community_posts' }, fetchPosts)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'community_likes' }, fetchPosts)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'community_comments' }, fetchPosts)
      .subscribe();
      
    return () => { supabase.removeChannel(sub); };
  }, []);

  const fetchComments = async (postId: string) => {
    const { data } = await supabase
      .from("community_comments")
      .select("*")
      .eq("post_id", postId)
      .order("createdAt", { ascending: true });
      
    if (data) {
      setComments(prev => ({ ...prev, [postId]: data as CommunityComment[] }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setFilePreview(url);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    if(filePreview) URL.revokeObjectURL(filePreview);
    setFilePreview(null);
    if(fileInputRef.current) fileInputRef.current.value = "";
  };

  const handlePost = async () => {
    if (!newPostContent.trim() && !selectedFile) return;
    
    // Validação de tamanho (15MB)
    if (selectedFile && selectedFile.size > 15 * 1024 * 1024) {
      setErrorMsg("O arquivo excede o limite de 15MB. Por favor, escolha um arquivo menor.");
      return;
    }

    setLoading(true);
    let imageUrl = null;
    let videoUrl = null;

    try {
      if (selectedFile) {
        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('community_media')
          .upload(fileName, selectedFile);

        if (uploadError) {
          throw uploadError;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('community_media')
          .getPublicUrl(fileName);

        if (selectedFile.type.startsWith("video/")) {
          videoUrl = publicUrl;
        } else {
          imageUrl = publicUrl;
        }
      }

      const newPost = {
        authorId: currentUser.userId,
        authorName: currentUser.name,
        authorRole: currentUser.role,
        content: newPostContent.trim(),
        imageUrl: imageUrl,
        videoUrl: videoUrl,
        createdAt: Date.now()
      };

      const { error } = await supabase.from("community_posts").insert(newPost);
      if (error) throw error;
      
      // Dispara notificação push nativa (PWA)
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.access_token) {
        fetch('/api/send-push', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`
          },
          body: JSON.stringify({
            title: `Nova publicação de ${currentUser.name.split(' ')[0]}`,
            body: newPostContent.trim() ? newPostContent.trim().substring(0, 100) + '...' : 'Nova foto/vídeo na comunidade.',
            url: '/'
          })
        }).catch(err => console.error("Erro ao enviar push:", err));
      }

      setNewPostContent("");
      removeFile();
      fetchPosts();
    } catch (e: any) {
      console.error(e);
      setErrorMsg("Erro ao enviar arquivo ou publicar o post. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (post: CommunityPost) => {
    const isLiked = post.likes.includes(currentUser.userId);
    
    // Optimistic
    const newLikes = isLiked 
      ? post.likes.filter(id => id !== currentUser.userId)
      : [...post.likes, currentUser.userId];
    setPosts(posts.map(p => p.id === post.id ? { ...p, likes: newLikes } : p));
    
    try {
      if (isLiked) {
        await supabase.from("community_likes").delete().match({ post_id: post.id, user_id: currentUser.userId });
      } else {
        await supabase.from("community_likes").insert({ post_id: post.id, user_id: currentUser.userId });
      }
    } catch (err) {}
  };

  const handleDeletePost = async (postId: string) => {
    if(!window.confirm("Você tem certeza que quer excluir este post?")) return;
    
    setPosts(posts.filter(p => p.id !== postId));
    try {
      await supabase.from("community_posts").delete().eq("id", postId);
    } catch (err) {}
  };

  const handleComment = async (postId: string) => {
    if (!newCommentContent.trim()) return;
    
    const newComment = {
      post_id: postId,
      authorId: currentUser.userId,
      authorName: currentUser.name,
      authorRole: currentUser.role,
      content: newCommentContent.trim(),
      createdAt: Date.now()
    };
    
    try {
      await supabase.from("community_comments").insert(newComment);
      setNewCommentContent("");
      fetchComments(postId);
    } catch (err) {}
  };

  const formatRole = (r: string) => {
    if (r === 'rh') return 'Recursos Humanos';
    if (r === 'ti') return 'Tecnologia da Informação';
    if (r === 'diretor_administrativo') return 'Diretor Adm';
    if (r === 'diretor_geral') return 'Diretor Geral';
    return r.charAt(0).toUpperCase() + r.slice(1);
  };
  
  const timeAgo = (timestamp: number) => {
    const diff = Math.floor((Date.now() - timestamp) / 1000);
    if(diff < 60) return "agora";
    if(diff < 3600) return `${Math.floor(diff/60)} m`;
    if(diff < 86400) return `${Math.floor(diff/3600)} h`;
    return `${Math.floor(diff/86400)} d`;
  };

  const canDeletePost = (post: CommunityPost) => {
    return post.authorId === currentUser.userId || ["rh", "lider", "ti", "diretor_administrativo", "diretor_geral"].includes(currentUser.role);
  };

  return (
    <div className="max-w-3xl mx-auto py-6 px-4 pb-32 md:pb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-[#461D15] dark:text-white">Comunidade HSF</h2>
          <p className="text-[#693A32] dark:text-slate-400 mt-1 text-sm md:text-base">Conecte-se com os profissionais do Hospital São Francisco.</p>
        </div>
      </div>

      {errorMsg && (
        <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
          <p className="text-red-700 text-sm">{errorMsg}</p>
          <button onClick={() => setErrorMsg("")} className="ml-auto text-red-500 scale-90">X</button>
        </div>
      )}

      {/* CREATE POST WIDGET */}
      <div className="bg-[#FAFAFA] dark:bg-slate-800 rounded-2xl shadow-sm border border-[#A78177]/30 dark:border-slate-700 p-4 sm:p-5 mb-8">
        <div className="flex gap-4">
          <div className="w-10 h-10 shrink-0 rounded-full bg-[#8D5B4F] dark:bg-slate-600 flex items-center justify-center text-white font-bold text-lg shadow-inner">
            {currentUser.name?.[0]?.toUpperCase()}
          </div>
          <div className="flex-1">
            <textarea
              className="w-full bg-white dark:bg-slate-700 border border-[#A78177]/40 dark:border-slate-600 rounded-xl px-4 py-3 text-[#461D15] dark:text-white placeholder-[#A78177] dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#693A32] dark:focus:ring-blue-500 focus:border-transparent resize-none h-24 shadow-inner mb-2"
              placeholder={`O que está acontecendo na sua área, ${currentUser.name.split(' ')[0]}?`}
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
            />
            
            {filePreview && (
              <div className="relative mb-3 inline-block">
                {selectedFile?.type.startsWith('video/') ? (
                  <video src={filePreview} className="max-h-48 rounded-lg border border-[#A78177]/20 dark:border-slate-600 object-cover" controls />
                ) : (
                  <img src={filePreview} alt="Preview" className="max-h-48 rounded-lg border border-[#A78177]/20 dark:border-slate-600 object-cover" />
                )}
                <button 
                  onClick={removeFile}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            <div className="flex items-center justify-between pt-3 border-t border-[#A78177]/20 dark:border-slate-700">
              <div className="flex gap-2">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  accept="image/*,video/*" 
                  className="hidden" 
                />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 text-[#8D5B4F] dark:text-slate-300 hover:bg-[#A78177]/10 dark:hover:bg-slate-700 rounded-full transition-colors flex items-center gap-2 text-sm font-medium"
                >
                  <ImageIcon className="w-5 h-5" />
                  <span className="hidden sm:inline">Foto</span>
                </button>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 text-[#8D5B4F] dark:text-slate-300 hover:bg-[#A78177]/10 dark:hover:bg-slate-700 rounded-full transition-colors flex items-center gap-2 text-sm font-medium"
                >
                  <FileVideo className="w-5 h-5" />
                  <span className="hidden sm:inline">Vídeo</span>
                </button>
              </div>
              <button 
                onClick={handlePost}
                disabled={loading || (!newPostContent.trim() && !selectedFile)}
                className="bg-[#693A32] dark:bg-blue-600 hover:bg-[#461D15] dark:hover:bg-blue-700 text-white px-5 py-2 rounded-full font-medium transition-all shadow-md active:scale-95 disabled:opacity-50 disabled:active:scale-100 flex items-center gap-2"
              >
                {loading ? "Publicando..." : "Publicar"}
                <Send className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* FEED */}
      <div className="space-y-6">
        {posts.length === 0 ? (
          <div className="bg-[#FAFAFA] dark:bg-slate-800 border border-dashed border-[#A78177] dark:border-slate-600 rounded-xl p-8 text-center text-[#8D5B4F] dark:text-slate-400">
            <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p>Ainda não há nenhuma publicação.</p>
            <p className="text-sm opacity-80">Seja o primeiro a compartilhar algo!</p>
          </div>
        ) : (
          posts.map(post => (
            <div key={post.id} className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-[#A78177]/20 dark:border-slate-700 overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-3 items-center">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#8D5B4F] to-[#693A32] dark:from-slate-600 dark:to-slate-700 flex items-center justify-center text-white font-bold shadow">
                      {post.authorName?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#461D15] dark:text-white flex items-center gap-1.5">
                        {post.authorName}
                        {userBadges[post.authorId]?.slice(0, 3).map((badge: any) => (
                           <span key={badge.id} title={`${badge.name} - ${badge.description}`} className="text-sm cursor-help hover:scale-110 transition-transform">
                             {badge.icon}
                           </span>
                        ))}
                      </h4>
                      <p className="text-xs text-[#8D5B4F] dark:text-slate-400 flex items-center gap-1">
                        {formatRole(post.authorRole)} 
                        <span className="opacity-50">•</span>
                        <Clock className="w-3 h-3"/> {timeAgo(post.createdAt)}
                      </p>
                    </div>
                  </div>
                  {canDeletePost(post) && (
                     <button onClick={() => handleDeletePost(post.id)} className="p-2 text-[#A78177] dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-500 dark:hover:text-red-400 rounded-full transition-colors">
                        <Trash2 className="w-4 h-4" />
                     </button>
                  )}
                </div>
                
                {post.content && (
                  <p className="text-[#461D15] dark:text-slate-200 whitespace-pre-wrap leading-relaxed text-[15px] mb-3">
                    {post.content}
                  </p>
                )}

                {post.imageUrl && (
                  <div className="mt-3 rounded-xl overflow-hidden border border-[#A78177]/10 dark:border-slate-700 bg-[#FAFAFA] dark:bg-slate-900">
                    <img src={post.imageUrl} alt="Anexo do post" className="max-h-96 w-full object-contain" />
                  </div>
                )}
                
                {post.videoUrl && (
                  <div className="mt-3 rounded-xl overflow-hidden border border-[#A78177]/10 dark:border-slate-700 bg-[#FAFAFA] dark:bg-slate-900">
                    <video src={post.videoUrl} controls className="max-h-96 w-full object-contain" />
                  </div>
                )}
              </div>

              {/* ACTION BAR */}
              <div className="px-5 py-3 bg-[#FAFAFA] dark:bg-slate-800/50 border-t border-[#A78177]/10 dark:border-slate-700 flex items-center gap-4">
                <button 
                  onClick={() => handleLike(post)}
                  className={`flex items-center gap-2 py-1 px-2 rounded-lg transition-colors ${
                    post.likes.includes(currentUser.userId) 
                    ? "text-[#693A32] dark:text-blue-400 bg-[#A78177]/10 dark:bg-blue-500/10" 
                    : "text-[#8D5B4F] dark:text-slate-400 hover:bg-[#A78177]/10 dark:hover:bg-slate-700"
                  }`}
                >
                  <Heart className={`w-5 h-5 ${post.likes.includes(currentUser.userId) ? "fill-[#693A32] dark:fill-blue-400" : ""}`} />
                  <span className="font-medium text-sm">{post.likes.length}</span>
                </button>
                <button 
                  onClick={() => {
                    if (activeCommentPost === post.id) {
                      setActiveCommentPost(null);
                    } else {
                      setActiveCommentPost(post.id);
                      if (!comments[post.id]) {
                        fetchComments(post.id);
                      }
                    }
                  }}
                  className="flex items-center gap-2 py-1 px-2 text-[#8D5B4F] dark:text-slate-400 hover:bg-[#A78177]/10 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span className="font-medium text-sm">{post.commentCount}</span>
                </button>
              </div>

              {/* COMMENTS SECTION */}
              {activeCommentPost === post.id && (
                <div className="bg-[#FAFAFA] dark:bg-slate-900/50 border-t border-[#A78177]/20 dark:border-slate-700 px-5 py-4 animate-in slide-in-from-top-2">
                  <div className="space-y-4 mb-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                    {comments[post.id] === undefined ? (
                      <p className="text-sm text-center text-[#A78177] dark:text-slate-500 py-2">Carregando comentários...</p>
                    ) : comments[post.id].length === 0 ? (
                      <p className="text-sm text-center text-[#A78177] dark:text-slate-500 py-2">Nenhum comentário. Seja o primeiro!</p>
                    ) : (
                      comments[post.id].map(comment => (
                        <div key={comment.id} className="flex gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#A78177]/30 dark:bg-slate-700 flex items-center justify-center text-[#461D15] dark:text-slate-200 font-semibold text-sm shrink-0">
                            {comment.authorName?.[0]?.toUpperCase()}
                          </div>
                          <div className="bg-white dark:bg-slate-800 border border-[#A78177]/20 dark:border-slate-700 rounded-2xl rounded-tl-sm px-4 py-2 flex-1 shadow-sm">
                            <div className="flex justify-between items-baseline gap-2 mb-1">
                              <span className="font-semibold text-sm text-[#693A32] dark:text-blue-400 flex items-center gap-1">
                                {comment.authorName}
                                {userBadges[comment.authorId]?.slice(0, 2).map((badge: any) => (
                                   <span key={badge.id} title={`${badge.name} - ${badge.description}`} className="text-xs cursor-help hover:scale-110 transition-transform">
                                     {badge.icon}
                                   </span>
                                ))}
                              </span>
                              <span className="text-[10px] text-[#A78177] dark:text-slate-500">{timeAgo(comment.createdAt)}</span>
                            </div>
                            <p className="text-sm text-[#461D15] dark:text-slate-300 whitespace-pre-wrap">{comment.content}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                     <input 
                      type="text"
                      className="flex-1 bg-white dark:bg-slate-800 border border-[#A78177]/40 dark:border-slate-600 rounded-full px-4 py-2 text-sm text-[#461D15] dark:text-white focus:outline-none focus:border-[#693A32] dark:focus:border-blue-500"
                      placeholder="Escreva um comentário..."
                      value={newCommentContent}
                      onChange={(e) => setNewCommentContent(e.target.value)}
                      onKeyDown={(e) => { 
                        if(e.key === 'Enter') handleComment(post.id); 
                      }}
                     />
                     <button 
                        onClick={() => handleComment(post.id)}
                        disabled={!newCommentContent.trim()}
                        className="bg-[#693A32] dark:bg-blue-600 text-white w-9 h-9 rounded-full flex items-center justify-center disabled:opacity-50"
                     >
                       <Send className="w-4 h-4 ml-0.5" />
                     </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

    </div>
  );
}
