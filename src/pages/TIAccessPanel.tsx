import React, { useState, useEffect } from 'react';
import { Shield, Search, Check, X, Plus, Key, Trash2, Save, Edit2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { createClient } from '@supabase/supabase-js';
import { ALL_NAV_MODULES } from '../utils/navigationModules';
import { ALLOWED_TABS_BY_ROLE, DYNAMIC_ALLOWED_TABS_BY_ROLE } from '../App';

type UserProfileData = {
  userId: string;
  name: string;
  username: string;
  role: string;
  department: string;
  status: string;
  lastLogin: string;
};

export default function TIAccessPanel() {
  const [activeInternalTab, setActiveInternalTab] = useState<'users' | 'permissions'>('users');
  
  const [users, setUsers] = useState<UserProfileData[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [permissions, setPermissions] = useState<Record<string, string[]>>({});
  const [loadingPermissions, setLoadingPermissions] = useState(false);
  const [isSavingPermissions, setIsSavingPermissions] = useState(false);
  const [permissionsSuccess, setPermissionsSuccess] = useState(false);

  const fetchPermissions = async () => {
    setLoadingPermissions(true);
    const { data, error } = await supabase.from('role_permissions').select('*');
    if (data && !error && data.length > 0) {
      const perms: Record<string, string[]> = { ...ALLOWED_TABS_BY_ROLE };
      data.forEach(row => {
        perms[row.role_id] = row.allowed_tabs;
      });
      setPermissions(perms);
    } else {
      setPermissions({ ...ALLOWED_TABS_BY_ROLE });
    }
    setLoadingPermissions(false);
  };

  useEffect(() => {
    if (activeInternalTab === 'permissions') {
      fetchPermissions();
    }
  }, [activeInternalTab]);

  const handleTogglePermission = (role: string, moduleId: string) => {
    setPermissions(prev => {
      const rolePerms = prev[role] || [];
      if (rolePerms.includes(moduleId)) {
        return { ...prev, [role]: rolePerms.filter(id => id !== moduleId) };
      } else {
        return { ...prev, [role]: [...rolePerms, moduleId] };
      }
    });
  };

  const savePermissions = async () => {
    setIsSavingPermissions(true);
    try {
      const updates = Object.entries(permissions).map(([role_id, allowed_tabs]) => ({
        role_id,
        allowed_tabs,
        updated_at: new Date().toISOString()
      }));
      const { error } = await supabase.from('role_permissions').upsert(updates);
      if (error) throw error;
      
      Object.assign(DYNAMIC_ALLOWED_TABS_BY_ROLE, permissions);
      
      setPermissionsSuccess(true);
      setTimeout(() => setPermissionsSuccess(false), 3000);
    } catch (e) {
      console.error(e);
      alert("Erro ao salvar permissões");
    } finally {
      setIsSavingPermissions(false);
    }
  };

  const [permissionsSearch, setPermissionsSearch] = useState('');
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  
  const openEditModal = (user: UserProfileData) => {
    setEditingUserId(user.userId);
    setNewName(user.name);
    setNewUsername(user.username);
    setNewRole(user.role);
    setNewDepartment(user.department);
    setIsEditModalOpen(true);
  };

  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUserId) return;
    setIsEditing(true);
    setErrorMsg(null);

    try {
      const roleMap: Record<string, string> = {
        "Recursos Humanos": "rh",
        "Segurança e TI": "ti",
        "Hub de Ideias": "inovacao",
        "Apoio Diagnóstico": "sadt",
        "Exp. do Cliente": "atendimento",
        "Gestão Financeira": "financeiro",
        "Faturamento & Glosas": "faturamento",
        "Custos e Controladoria": "custos",
        "Comercial": "comercial",
        "Marketing & Brand": "marketing",
        "Segurança do Trabalho": "seguranca",
        "Medicina do Trabalho": "sesmt",
        "Jurídico e Compliance": "juridico",
        "Diretoria Administrativa": "diretor_administrativo",
        "Diretoria Geral": "diretor_geral",
        "Suprimentos e Logística": "suprimentos"
      };
      
      const assignedRole = roleMap[newDepartment] || newRole;

      const { error: dbError } = await supabase.from('user_profiles')
        .update({
          name: newName,
          role: assignedRole,
          department: newDepartment,
        })
        .eq('userId', editingUserId);

      if (dbError) throw new Error("Erro ao atualizar perfil no banco de dados: " + dbError.message);

      setIsSuccess(true);
      fetchUsers();
      
      setTimeout(() => {
        setIsSuccess(false);
        setIsEditModalOpen(false);
        setEditingUserId(null);
        setNewName('');
        setNewUsername('');
        setNewRole('colaborador');
        setNewDepartment('Geral');
      }, 2000);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Ocorreu um erro desconhecido.");
    } finally {
      setIsEditing(false);
    }
  };

  const handleDeleteUser = async (userIdToDel: string, userNameToDel: string) => {
    if (window.confirm(`Tem certeza que deseja excluir o acesso de ${userNameToDel}?`)) {
      try {
        const { error } = await supabase.from('user_profiles').delete().eq('userId', userIdToDel);
        if (error) throw error;
        
        fetchUsers();
      } catch (err: any) {
        console.error(err);
        alert("Erro ao excluir usuário: " + (err.message || "Erro desconhecido"));
      }
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  // Form para novo usuário
  const [newName, setNewName] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState('colaborador');
  const [newDepartment, setNewDepartment] = useState('Geral');

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
        department: u.department || 'Geral',
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
        auth: { 
          persistSession: false, 
          autoRefreshToken: false,
          detectSessionInUrl: false,
          storageKey: 'admin-temp-key'
        }
      });

      const corporativeEmail = `${newUsername.toLowerCase().trim()}@hsf.local`;

      const { data: authData, error: authError } = await adminClient.auth.signUp({
        email: corporativeEmail,
        password: newPassword,
      });

      if (authError) throw new Error("Erro ao criar credenciais: " + authError.message);
      if (!authData.user) throw new Error("Usuário não retornado.");

      // Determinar o role correto baseado no setor escolhido para garantir que o usuário acesse o painel correto
      const roleMap: Record<string, string> = {
        "Recursos Humanos": "rh",
        "Segurança e TI": "ti",
        "Hub de Ideias": "inovacao",
        "Apoio Diagnóstico": "sadt",
        "Exp. do Cliente": "atendimento",
        "Gestão Financeira": "financeiro",
        "Faturamento & Glosas": "faturamento",
        "Custos e Controladoria": "custos",
        "Comercial": "comercial",
        "Marketing & Brand": "marketing",
        "Segurança do Trabalho": "seguranca",
        "Medicina do Trabalho": "sesmt",
        "Jurídico e Compliance": "juridico",
        "Diretoria Administrativa": "diretor_administrativo",
        "Diretoria Geral": "diretor_geral",
        "Suprimentos e Logística": "suprimentos"
      };
      
      const assignedRole = roleMap[newDepartment] || newRole;

      // 2. Inserir o perfil na tabela user_profiles (Permitido pelo RLS porque o usuário logado é 'ti')
      const { error: dbError } = await supabase.from('user_profiles').insert([{
        userId: authData.user.id,
        name: newName,
        email: corporativeEmail,
        role: assignedRole,
        department: newDepartment,
        language: 'pt',
        force_password_change: true
      }]);

      if (dbError) throw new Error("Erro ao salvar perfil no banco de dados: " + dbError.message);

      // Sucesso
      setIsSuccess(true);
      fetchUsers();
      
      setTimeout(() => {
        setIsSuccess(false);
        setIsModalOpen(false);
        setNewName('');
        setNewUsername('');
        setNewPassword('');
        setNewRole('colaborador');
        setNewDepartment('Geral');
      }, 2500);
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

      <div className="flex border-b border-slate-800">
        <button
          onClick={() => setActiveInternalTab('users')}
          className={`px-6 py-3 font-bold text-sm tracking-wide transition-colors border-b-2 ${activeInternalTab === 'users' ? 'border-teal-500 text-teal-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
        >
          Usuários
        </button>
        <button
          onClick={() => setActiveInternalTab('permissions')}
          className={`px-6 py-3 font-bold text-sm tracking-wide transition-colors border-b-2 ${activeInternalTab === 'permissions' ? 'border-teal-500 text-teal-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
        >
          Permissões de Módulos
        </button>
      </div>

      {activeInternalTab === 'users' ? (
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



        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider">
                <th className="pb-3 font-medium">Nome</th>
                <th className="pb-3 font-medium">Usuário</th>
                <th className="pb-3 font-medium">Setor</th>
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
                    <td className="py-4 text-slate-400">{user.department}</td>
                    <td className="py-4 text-slate-400 capitalize">{user.role}</td>
                    <td className="py-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-teal-500/10 text-teal-400 border border-teal-500/20">
                        {user.status}
                      </span>
                    </td>
                    <td className="py-4 flex justify-end gap-2">
                      <button onClick={() => openEditModal(user)} className="p-1.5 text-slate-400 hover:text-teal-400 hover:bg-teal-400/10 rounded-lg transition-colors" title="Editar Usuário">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDeleteUser(user.userId, user.name)} className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors" title="Excluir Usuário">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <h3 className="text-lg font-bold text-slate-200">Permissões por Perfil/Setor</h3>
            <div className="flex gap-4 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input 
                  type="text" 
                  value={permissionsSearch}
                  onChange={(e) => setPermissionsSearch(e.target.value)}
                  placeholder="Filtrar módulos..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-200 outline-none focus:border-teal-500/50 transition-colors"
                />
              </div>
              <button
                onClick={savePermissions}
                disabled={isSavingPermissions}
                className="flex items-center justify-center gap-2 bg-teal-500 hover:bg-teal-400 text-slate-950 px-5 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-50"
              >
                {isSavingPermissions ? 'Salvando...' : permissionsSuccess ? <><Check className="w-4 h-4"/> Salvo!</> : <><Save className="w-4 h-4" /> Salvar</>}
              </button>
            </div>
          </div>
          
          {loadingPermissions ? (
            <div className="py-12 text-center text-slate-500">Carregando permissões...</div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {Object.keys(ALLOWED_TABS_BY_ROLE).map(role => (
                <div key={role} className="border border-slate-800 rounded-xl p-4 bg-slate-950/50">
                  <div className="font-bold text-teal-400 mb-4 capitalize text-lg border-b border-slate-800 pb-2">{role}</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                    {ALL_NAV_MODULES.filter(mod => {
                      const modLabel = typeof mod.label === 'function' ? mod.label(role) : mod.label;
                      return modLabel.toLowerCase().includes(permissionsSearch.toLowerCase());
                    }).map(mod => {
                      const isAllowed = permissions[role]?.includes(mod.id);
                      const modLabel = typeof mod.label === 'function' ? mod.label(role) : mod.label;
                      return (
                        <label key={mod.id} className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer border transition-colors ${isAllowed ? 'bg-teal-500/10 border-teal-500/30' : 'bg-slate-900 border-slate-800 hover:bg-slate-800'}`}>
                          <input type="checkbox" className="hidden" checked={!!isAllowed} onChange={() => handleTogglePermission(role, mod.id)} />
                          <div className={`w-5 h-5 rounded flex items-center justify-center border ${isAllowed ? 'bg-teal-500 border-teal-500' : 'bg-slate-800 border-slate-700'}`}>
                            {isAllowed && <Check className="w-3 h-3 text-slate-950" />}
                          </div>
                          <div className="flex items-center gap-2 overflow-hidden">
                            <mod.icon className={`w-4 h-4 shrink-0 ${isAllowed ? 'text-teal-400' : 'text-slate-500'}`} />
                            <span className={`text-sm truncate ${isAllowed ? 'text-teal-400 font-medium' : 'text-slate-400'}`}>{modLabel}</span>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

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
            
            {isSuccess ? (
              <div className="p-10 flex flex-col items-center justify-center space-y-4 animate-in zoom-in fade-in duration-500">
                <div className="w-20 h-20 bg-teal-500/10 rounded-full flex items-center justify-center mb-2 border border-teal-500/20 shadow-[0_0_30px_rgba(20,184,166,0.15)]">
                  <Check className="w-10 h-10 text-teal-400" />
                </div>
                <h3 className="text-xl font-display font-bold text-slate-100">Usuário Criado!</h3>
                <p className="text-sm text-slate-400 text-center leading-relaxed">
                  O acesso de <strong className="text-slate-300">{newName}</strong> foi configurado com sucesso e já está disponível no sistema.
                </p>
              </div>
            ) : (
              <form onSubmit={handleCreateUser} className="p-5 space-y-4">
                {errorMsg && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
                    {errorMsg}
                  </div>
                )}
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

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Setor (Departamento)</label>
                  <select value={newDepartment} onChange={e => setNewDepartment(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-200 focus:border-teal-500 outline-none">
                    <option value="Almoxarifado">Almoxarifado</option>
                    <option value="Recursos Humanos">Recursos Humanos (RH)</option>
                    <option value="Segurança e TI">Segurança e TI</option>
                    <option value="Hub de Ideias">Inovação / Hub de Ideias</option>
                    <option value="Apoio Diagnóstico">SADT / Apoio Diagnóstico</option>
                    <option value="Exp. do Cliente">Atendimento / Exp. do Cliente</option>
                    <option value="Gestão Financeira">Gestão Financeira & DRE</option>
                    <option value="Faturamento & Glosas">Faturamento & Glosas</option>
                    <option value="Custos e Controladoria">Custos e Controladoria</option>
                    <option value="Comercial">Comercial / Relac. e Vendas</option>
                    <option value="Marketing & Brand">Marketing & Brand</option>
                    <option value="Segurança do Trabalho">Segurança do Trabalho (Riscos Amb.)</option>
                    <option value="Medicina do Trabalho">Medicina do Trabalho (SESMT)</option>
                    <option value="Jurídico e Compliance">Jurídico e Compliance</option>
                    <option value="Diretoria Administrativa">Diretoria Administrativa</option>
                    <option value="Diretoria Geral">Diretoria Geral</option>
                    <option value="Suprimentos e Logística">Suprimentos e Logística</option>
                    <option value="Geral">Geral (Outros)</option>
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
            )}
          </div>
        </div>
      )}

      {/* Modal de Edição */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
              <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-teal-400" />
                Editar Usuário
              </h3>
              <button onClick={() => { setIsEditModalOpen(false); setEditingUserId(null); }} className="text-slate-400 hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {isSuccess ? (
              <div className="p-10 flex flex-col items-center justify-center space-y-4 animate-in zoom-in fade-in duration-500">
                <div className="w-20 h-20 bg-teal-500/10 rounded-full flex items-center justify-center mb-2 border border-teal-500/20 shadow-[0_0_30px_rgba(20,184,166,0.15)]">
                  <Check className="w-10 h-10 text-teal-400" />
                </div>
                <h3 className="text-xl font-display font-bold text-slate-100">Usuário Atualizado!</h3>
                <p className="text-sm text-slate-400 text-center leading-relaxed">
                  Os dados de <strong className="text-slate-300">{newName}</strong> foram atualizados com sucesso.
                </p>
              </div>
            ) : (
              <form onSubmit={handleEditUser} className="p-5 space-y-4">
                {errorMsg && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
                    {errorMsg}
                  </div>
                )}
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Nome Completo</label>
                  <input required type="text" value={newName} onChange={e => setNewName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-200 focus:border-teal-500 outline-none" />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Usuário de Acesso (Não editável)</label>
                  <input type="text" value={newUsername} disabled
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-500 outline-none cursor-not-allowed" />
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

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Setor (Departamento)</label>
                  <select value={newDepartment} onChange={e => setNewDepartment(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-200 focus:border-teal-500 outline-none">
                    <option value="Almoxarifado">Almoxarifado</option>
                    <option value="Recursos Humanos">Recursos Humanos (RH)</option>
                    <option value="Segurança e TI">Segurança e TI</option>
                    <option value="Hub de Ideias">Inovação / Hub de Ideias</option>
                    <option value="Apoio Diagnóstico">SADT / Apoio Diagnóstico</option>
                    <option value="Exp. do Cliente">Atendimento / Exp. do Cliente</option>
                    <option value="Gestão Financeira">Gestão Financeira & DRE</option>
                    <option value="Faturamento & Glosas">Faturamento & Glosas</option>
                    <option value="Custos e Controladoria">Custos e Controladoria</option>
                    <option value="Comercial">Comercial / Relac. e Vendas</option>
                    <option value="Marketing & Brand">Marketing & Brand</option>
                    <option value="Segurança do Trabalho">Segurança do Trabalho (Riscos Amb.)</option>
                    <option value="Medicina do Trabalho">Medicina do Trabalho (SESMT)</option>
                    <option value="Jurídico e Compliance">Jurídico e Compliance</option>
                    <option value="Diretoria Administrativa">Diretoria Administrativa</option>
                    <option value="Diretoria Geral">Diretoria Geral</option>
                    <option value="Suprimentos e Logística">Suprimentos e Logística</option>
                    <option value="Geral">Geral (Outros)</option>
                  </select>
                </div>

                <div className="pt-4 flex gap-3">
                  <button type="button" onClick={() => { setIsEditModalOpen(false); setEditingUserId(null); }}
                    className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 py-2.5 rounded-xl text-sm font-bold transition-all">
                    Cancelar
                  </button>
                  <button type="submit" disabled={isEditing}
                    className="flex-1 bg-teal-500 hover:bg-teal-400 text-slate-950 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-50 flex justify-center items-center gap-2">
                    {isEditing ? 'Salvando...' : <><Check className="w-4 h-4"/> Salvar</>}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
