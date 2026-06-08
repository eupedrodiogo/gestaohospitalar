import React, { useState, useEffect } from 'react';
import { Shield, Search, Check, X, Plus, Key, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { createClient } from '@supabase/supabase-js';

type UserProfileData = {
  userId: string;
  name: string;
  username: string;
  role: string;
  status: string;
  lastLogin: string;
};

export default function TIAccessPanel() {
  const [users, setUsers] = useState<UserProfileData[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  
  // Form para novo usuário
  const [newName, setNewName] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState('colaborador');

  const fetchUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('user_profiles').select('*').order('name');
    
    if (error) {
      console.error(error);
      setErrorMsg("Erro ao carregar usuários.");
    } else if (data) {
      setUsers(data.map(u => ({
        userId: u.userId,
        name: u.name,
        username: u.email.replace('@hsf.local', ''),
        role: u.role,
        status: 'Ativo',
        lastLogin: new Date(u.createdAt).toLocaleDateString('pt-BR')
      })));
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    setErrorMsg(null);

    try {
      // 1. Criar usuário no Supabase Auth usando um cliente secundário
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      const adminClient = createClient(supabaseUrl, supabaseAnonKey, {
        auth: { persistSession: false, autoRefreshToken: false }
      });

      const corporativeEmail = `${newUsername.toLowerCase().trim()}@hsf.local`;

      const { data: authData, error: authError } = await adminClient.auth.signUp({
        email: corporativeEmail,
        password: newPassword,
      });

      if (authError) throw new Error("Erro ao criar credenciais: " + authError.message);
      if (!authData.user) throw new Error("Usuário não retornado.");

      // 2. Inserir o perfil na tabela user_profiles (Permitido pelo RLS porque o usuário logado é 'ti')
      const { error: dbError } = await supabase.from('user_profiles').insert([{
        userId: authData.user.id,
        name: newName,
        email: corporativeEmail,
        role: newRole,
        language: 'pt'
      }]);

      if (dbError) throw new Error("Erro ao salvar perfil no banco de dados: " + dbError.message);

      // Sucesso
      setIsModalOpen(false);
      setNewName('');
      setNewUsername('');
      setNewPassword('');
      setNewRole('colaborador');
      fetchUsers();
      alert("Usuário criado com sucesso!");
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Ocorreu um erro desconhecido.");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="w-full xl:max-w-7xl mx-auto flex flex-col gap-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-display font-bold text-slate-100 flex items-center gap-3">
          <Shield className="w-6 h-6 text-teal-400" />
          Gerenciamento de Acessos
        </h2>
        <p className="text-slate-400 text-sm">Controle de perfis, permissões e status de contas de toda a organização.</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input 
              type="text" 
              placeholder="Buscar usuário..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-200 outline-none focus:border-teal-500/50 transition-colors"
            />
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-teal-500 hover:bg-teal-400 text-slate-950 px-4 py-2 rounded-xl text-sm font-bold transition-all"
          >
            <Plus className="w-4 h-4" /> Novo Usuário
          </button>
        </div>

        {errorMsg && (
          <div className="mb-4 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            {errorMsg}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider">
                <th className="pb-3 font-medium">Nome</th>
                <th className="pb-3 font-medium">Usuário</th>
                <th className="pb-3 font-medium">Perfil</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {loading ? (
                <tr><td colSpan={5} className="py-8 text-center text-slate-500">Carregando usuários...</td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={5} className="py-8 text-center text-slate-500">Nenhum usuário encontrado.</td></tr>
              ) : (
                users.map(user => (
                  <tr key={user.userId} className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors">
                    <td className="py-4 text-slate-200 font-medium">{user.name}</td>
                    <td className="py-4 text-slate-400">{user.username}</td>
                    <td className="py-4 text-slate-400 capitalize">{user.role}</td>
                    <td className="py-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-teal-500/10 text-teal-400 border border-teal-500/20">
                        {user.status}
                      </span>
                    </td>
                    <td className="py-4 flex justify-end gap-2">
                      <button className="p-1.5 text-slate-400 hover:text-teal-400 hover:bg-teal-400/10 rounded-lg transition-colors" title="Sem implementação">
                        <Key className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Criação */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
              <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <Plus className="w-5 h-5 text-teal-400" />
                Cadastrar Novo Usuário
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleCreateUser} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Nome Completo</label>
                <input required type="text" value={newName} onChange={e => setNewName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-200 focus:border-teal-500 outline-none" />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Usuário de Acesso</label>
                <input required type="text" value={newUsername} onChange={e => setNewUsername(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-200 focus:border-teal-500 outline-none" placeholder="ex: pdsmello" />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Senha Provisória</label>
                <input required type="text" value={newPassword} onChange={e => setNewPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-200 focus:border-teal-500 outline-none" />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Perfil (Role)</label>
                <select value={newRole} onChange={e => setNewRole(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-200 focus:border-teal-500 outline-none">
                  <option value="colaborador">Colaborador</option>
                  <option value="lider">Líder / Coordenador</option>
                  <option value="rh">RH</option>
                  <option value="ti">TI</option>
                </select>
              </div>

              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 py-2.5 rounded-xl text-sm font-bold transition-all">
                  Cancelar
                </button>
                <button type="submit" disabled={isCreating}
                  className="flex-1 bg-teal-500 hover:bg-teal-400 text-slate-950 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-50 flex justify-center items-center gap-2">
                  {isCreating ? 'Criando...' : <><Check className="w-4 h-4"/> Salvar</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
