import React, { useState, useEffect, useRef } from "react";
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("hsf_community_posts_v1");
      if (saved) {
        setPosts(JSON.parse(saved));
      }
      const savedComments = localStorage.getItem("hsf_community_comments_v1");
      if (savedComments) {
        setComments(JSON.parse(savedComments));
      }
    } catch(e) {}
  }, []);

  const savePosts = (newPosts: CommunityPost[]) => {
    setPosts(newPosts);
    localStorage.setItem("hsf_community_posts_v1", JSON.stringify(newPosts));
  };

  const saveComments = (newComments: Record<string, CommunityComment[]>) => {
    setComments(newComments);
    localStorage.setItem("hsf_community_comments_v1", JSON.stringify(newComments));
  };

  const fetchComments = (postId: string) => {
    // comments already loaded in state
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
    setLoading(true);
    let imageUrl = "";
    let videoUrl = "";

    try {
      if (selectedFile) {
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(selectedFile);
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = error => reject(error);
        });

        if (selectedFile.type.startsWith("video/")) {
          videoUrl = base64;
        } else {
          imageUrl = base64;
        }
      }

      const newPost: CommunityPost = {
        id: "post_" + Date.now(),
        authorId: currentUser.userId,
        authorName: currentUser.name,
        authorRole: currentUser.role,
        content: newPostContent.trim(),
        imageUrl: imageUrl || undefined,
        videoUrl: videoUrl || undefined,
        likes: [],
        commentCount: 0,
        createdAt: Date.now()
      };

      const updatedPosts = [newPost, ...posts];
      savePosts(updatedPosts);
      
      setNewPostContent("");
      removeFile();
    } catch (e: any) {
      setErrorMsg("Erro ao criar post ou arquivo excede o limite do armazenamento local.");
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (post: CommunityPost) => {
    const isLiked = post.likes.includes(currentUser.userId);
    const newLikes = isLiked 
      ? post.likes.filter(id => id !== currentUser.userId)
      : [...post.likes, currentUser.userId];
    
    const updatedPosts = posts.map(p => 
      p.id === post.id ? { ...p, likes: newLikes } : p
    );
    
    savePosts(updatedPosts);
  };

  const handleDeletePost = async (postId: string) => {
    if(!window.confirm("Você tem certeza que quer excluir este post?")) return;
    
    const updatedPosts = posts.filter(p => p.id !== postId);
    savePosts(updatedPosts);
    
    if (comments[postId]) {
      const newComments = { ...comments };
      delete newComments[postId];
      saveComments(newComments);
    }
  };

  const handleComment = async (postId: string) => {
    if (!newCommentContent.trim()) return;
    
    const newComment: CommunityComment = {
      id: "comment_" + Date.now(),
      authorId: currentUser.userId,
      authorName: currentUser.name,
      authorRole: currentUser.role,
      content: newCommentContent.trim(),
      createdAt: Date.now()
    };
    
    const postComments = comments[postId] || [];
    const newComments = {
      ...comments,
      [postId]: [...postComments, newComment]
    };
    saveComments(newComments);
    
    const updatedPosts = posts.map(p => 
      p.id === postId ? { ...p, commentCount: p.commentCount + 1 } : p
    );
    savePosts(updatedPosts);
    
    setNewCommentContent("");
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
          <h2 className="text-3xl font-bold tracking-tight text-[#461D15]">Comunidade HSF</h2>
          <p className="text-[#693A32] mt-1 text-sm md:text-base">Conecte-se com os profissionais do Hospital São Francisco.</p>
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
      <div className="bg-[#FAFAFA] rounded-2xl shadow-sm border border-[#A78177]/30 p-4 sm:p-5 mb-8">
        <div className="flex gap-4">
          <div className="w-10 h-10 shrink-0 rounded-full bg-[#8D5B4F] flex items-center justify-center text-white font-bold text-lg shadow-inner">
            {currentUser.name?.[0]?.toUpperCase()}
          </div>
          <div className="flex-1">
            <textarea
              className="w-full bg-white border border-[#A78177]/40 rounded-xl px-4 py-3 text-[#461D15] placeholder-[#A78177] focus:outline-none focus:ring-2 focus:ring-[#693A32] focus:border-transparent resize-none h-24 shadow-inner mb-2"
              placeholder={`O que está acontecendo na sua área, ${currentUser.name.split(' ')[0]}?`}
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
            />
            
            {filePreview && (
              <div className="relative mb-3 inline-block">
                {selectedFile?.type.startsWith('video/') ? (
                  <video src={filePreview} className="max-h-48 rounded-lg border border-[#A78177]/20 object-cover" controls />
                ) : (
                  <img src={filePreview} alt="Preview" className="max-h-48 rounded-lg border border-[#A78177]/20 object-cover" />
                )}
                <button 
                  onClick={removeFile}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            <div className="flex items-center justify-between pt-3 border-t border-[#A78177]/20">
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
                  className="p-2 text-[#8D5B4F] hover:bg-[#A78177]/10 rounded-full transition-colors flex items-center gap-2 text-sm font-medium"
                >
                  <ImageIcon className="w-5 h-5" />
                  <span className="hidden sm:inline">Foto</span>
                </button>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 text-[#8D5B4F] hover:bg-[#A78177]/10 rounded-full transition-colors flex items-center gap-2 text-sm font-medium"
                >
                  <FileVideo className="w-5 h-5" />
                  <span className="hidden sm:inline">Vídeo</span>
                </button>
              </div>
              <button 
                onClick={handlePost}
                disabled={loading || (!newPostContent.trim() && !selectedFile)}
                className="bg-[#693A32] hover:bg-[#461D15] text-white px-5 py-2 rounded-full font-medium transition-all shadow-md active:scale-95 disabled:opacity-50 disabled:active:scale-100 flex items-center gap-2"
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
          <div className="bg-[#FAFAFA] border border-dashed border-[#A78177] rounded-xl p-8 text-center text-[#8D5B4F]">
            <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p>Ainda não há nenhuma publicação.</p>
            <p className="text-sm opacity-80">Seja o primeiro a compartilhar algo!</p>
          </div>
        ) : (
          posts.map(post => (
            <div key={post.id} className="bg-white rounded-2xl shadow-sm border border-[#A78177]/20 overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-3 items-center">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#8D5B4F] to-[#693A32] flex items-center justify-center text-white font-bold shadow">
                      {post.authorName?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#461D15]">{post.authorName}</h4>
                      <p className="text-xs text-[#8D5B4F] flex items-center gap-1">
                        {formatRole(post.authorRole)} 
                        <span className="opacity-50">•</span>
                        <Clock className="w-3 h-3"/> {timeAgo(post.createdAt)}
                      </p>
                    </div>
                  </div>
                  {canDeletePost(post) && (
                     <button onClick={() => handleDeletePost(post.id)} className="p-2 text-[#A78177] hover:bg-red-50 hover:text-red-500 rounded-full transition-colors">
                        <Trash2 className="w-4 h-4" />
                     </button>
                  )}
                </div>
                
                {post.content && (
                  <p className="text-[#461D15] whitespace-pre-wrap leading-relaxed text-[15px] mb-3">
                    {post.content}
                  </p>
                )}

                {post.imageUrl && (
                  <div className="mt-3 rounded-xl overflow-hidden border border-[#A78177]/10 bg-[#FAFAFA]">
                    <img src={post.imageUrl} alt="Anexo do post" className="max-h-96 w-full object-contain" />
                  </div>
                )}
                
                {post.videoUrl && (
                  <div className="mt-3 rounded-xl overflow-hidden border border-[#A78177]/10 bg-[#FAFAFA]">
                    <video src={post.videoUrl} controls className="max-h-96 w-full object-contain" />
                  </div>
                )}
              </div>

              {/* ACTION BAR */}
              <div className="px-5 py-3 bg-[#FAFAFA] border-t border-[#A78177]/10 flex items-center gap-4">
                <button 
                  onClick={() => handleLike(post)}
                  className={`flex items-center gap-2 py-1 px-2 rounded-lg transition-colors ${
                    post.likes.includes(currentUser.userId) 
                    ? "text-[#693A32] bg-[#A78177]/10" 
                    : "text-[#8D5B4F] hover:bg-[#A78177]/10"
                  }`}
                >
                  <Heart className={`w-5 h-5 ${post.likes.includes(currentUser.userId) ? "fill-[#693A32]" : ""}`} />
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
                  className="flex items-center gap-2 py-1 px-2 text-[#8D5B4F] hover:bg-[#A78177]/10 rounded-lg transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span className="font-medium text-sm">{post.commentCount}</span>
                </button>
              </div>

              {/* COMMENTS SECTION */}
              {activeCommentPost === post.id && (
                <div className="bg-[#FAFAFA] border-t border-[#A78177]/20 px-5 py-4 animate-in slide-in-from-top-2">
                  <div className="space-y-4 mb-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                    {comments[post.id] === undefined ? (
                      <p className="text-sm text-center text-[#A78177] py-2">Carregando comentários...</p>
                    ) : comments[post.id].length === 0 ? (
                      <p className="text-sm text-center text-[#A78177] py-2">Nenhum comentário. Seja o primeiro!</p>
                    ) : (
                      comments[post.id].map(comment => (
                        <div key={comment.id} className="flex gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#A78177]/30 flex items-center justify-center text-[#461D15] font-semibold text-sm shrink-0">
                            {comment.authorName?.[0]?.toUpperCase()}
                          </div>
                          <div className="bg-white border border-[#A78177]/20 rounded-2xl rounded-tl-sm px-4 py-2 flex-1 shadow-sm">
                            <div className="flex justify-between items-baseline gap-2 mb-1">
                              <span className="font-semibold text-sm text-[#693A32]">{comment.authorName}</span>
                              <span className="text-[10px] text-[#A78177]">{timeAgo(comment.createdAt)}</span>
                            </div>
                            <p className="text-sm text-[#461D15] whitespace-pre-wrap">{comment.content}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                     <input 
                      type="text"
                      className="flex-1 bg-white border border-[#A78177]/40 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-[#693A32]"
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
                        className="bg-[#693A32] text-white w-9 h-9 rounded-full flex items-center justify-center disabled:opacity-50"
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
