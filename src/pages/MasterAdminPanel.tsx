import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { UserProfile } from '../types';
import { ShieldCheck, Users, KeyRound, Activity, UserCheck, ShieldAlert, RefreshCw, Search, Edit3, Lock } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

export default function MasterAdminPanel() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null); // userId being acted upon

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.from('user_profiles').select('*');
      if (error) throw error;
      setUsers(data as UserProfile[]);
    } catch (e: any) {
      console.error(e);
      setError('Erro ao buscar usuários do banco de dados.');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    setActionLoading(userId);
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ role: newRole as any })
        .eq('userId', userId);
      
      if (error) throw error;
      
      // Update local state
      setUsers(users.map(u => u.userId === userId ? { ...u, role: newRole as any } : u));
    } catch (e: any) {
      console.error(e);
      alert('Erro ao alterar cargo: ' + e.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleForcePasswordChange = async (userId: string) => {
    if (!window.confirm('Tem certeza que deseja forçar este usuário a trocar a senha no próximo acesso?')) return;
    
    setActionLoading(userId);
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ force_password_change: true })
        .eq('userId', userId);
      
      if (error) throw error;
      
      setUsers(users.map(u => u.userId === userId ? { ...u, force_password_change: true } : u));
      alert('Ação registrada com sucesso! O usuário deverá trocar a senha ao entrar.');
    } catch (e: any) {
      console.error(e);
      alert('Erro ao forçar troca de senha: ' + e.message);
    } finally {
      setActionLoading(null);
    }
  };

  // Metrics
  const totalUsers = users.length;
  const activeUsersLast7Days = users.filter(u => u.lastLoginAt && (Date.now() - new Date(u.lastLoginAt).getTime() < 7 * 24 * 60 * 60 * 1000)).length;
  const passwordChangedCount = users.filter(u => u.passwordChangedAt).length;
  const masterAdmins = users.filter(u => u.role === 'master').length;

  // Chart Data: Roles
  const rolesCount = users.reduce((acc, user) => {
    acc[user.role] = (acc[user.role] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const rolesData = Object.keys(rolesCount).map(role => ({
    name: role.toUpperCase(),
    value: rolesCount[role]
  })).sort((a, b) => b.value - a.value);

  // Teal/Slate Palette for Chart
  const COLORS = ['#2dd4bf', '#0f766e', '#134e4a', '#5eead4', '#115e59', '#ccfbf1', '#042f2e'];

  // Filtered users for table
  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 text-slate-200 overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 via-slate-900 to-slate-950 z-0"></div>
      
      <div className="relative z-10 flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
        <div className="max-w-7xl mx-auto space-y-8">
          
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(45,212,191,0.15)]">
                  <ShieldCheck className="w-6 h-6 text-teal-400" />
                </div>
                <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-teal-200">
                  Painel Master
                </h1>
              </div>
              <p className="text-slate-400 font-medium">Controle total e auditoria de usuários do sistema.</p>
            </div>
            
            <button 
              onClick={fetchUsers}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-teal-400 rounded-lg transition-colors border border-slate-700 font-semibold text-sm cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Atualizar Dados
            </button>
          </header>

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <p className="text-red-300 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard 
              title="Total de Usuários" 
              value={totalUsers} 
              icon={Users} 
            />
            <MetricCard 
              title="Acessos Recentes (7d)" 
              value={activeUsersLast7Days} 
              icon={Activity} 
            />
            <MetricCard 
              title="Trocaram a Senha" 
              value={passwordChangedCount} 
              icon={KeyRound} 
            />
            <MetricCard 
              title="Admins Master" 
              value={masterAdmins} 
              icon={UserCheck} 
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chart: Distribution */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm lg:col-span-1">
              <h3 className="text-lg font-bold text-slate-200 mb-6">Cargos</h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={rolesData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={70}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {rolesData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#f8fafc' }}
                      itemStyle={{ color: '#f8fafc' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap gap-2 justify-center mt-4">
                {rolesData.slice(0, 6).map((role, idx) => (
                  <div key={role.name} className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-800/50 px-2 py-1 rounded">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
                    {role.name} ({role.value})
                  </div>
                ))}
              </div>
            </div>

            {/* User Management Table */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm lg:col-span-2 flex flex-col">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h3 className="text-lg font-bold text-slate-200">Gestão de Usuários</h3>
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input 
                    type="text" 
                    placeholder="Buscar usuário..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full sm:w-64 bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-300 focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/50 transition-all"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-x-auto custom-scrollbar">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400">
                      <th className="pb-3 px-2 font-semibold">Usuário / Email</th>
                      <th className="pb-3 px-2 font-semibold">Último Acesso</th>
                      <th className="pb-3 px-2 font-semibold">Cargo</th>
                      <th className="pb-3 px-2 font-semibold text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {filteredUsers.map(user => (
                      <tr key={user.userId} className="hover:bg-slate-800/20 transition-colors">
                        <td className="py-3 px-2">
                          <p className="font-bold text-slate-200">{user.name}</p>
                          <p className="text-xs text-slate-500">{user.email}</p>
                        </td>
                        <td className="py-3 px-2">
                          {user.lastLoginAt ? (
                            <div>
                              <p className="text-slate-300">{new Date(user.lastLoginAt).toLocaleDateString('pt-BR')}</p>
                              <p className="text-xs text-slate-500">{new Date(user.lastLoginAt).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}</p>
                            </div>
                          ) : (
                            <span className="text-slate-600 italic">Nunca acessou</span>
                          )}
                        </td>
                        <td className="py-3 px-2">
                          <select 
                            value={user.role}
                            onChange={(e) => handleRoleChange(user.userId, e.target.value)}
                            disabled={actionLoading === user.userId}
                            className="bg-slate-950 border border-slate-800 rounded-md px-2 py-1.5 text-xs text-slate-300 focus:border-teal-500/50 outline-none cursor-pointer disabled:opacity-50"
                          >
                            <option value="colaborador">Colaborador</option>
                            <option value="lider">Líder</option>
                            <option value="rh">RH</option>
                            <option value="ti">TI</option>
                            <option value="marketing">Marketing</option>
                            <option value="diretor_administrativo">Diretor Admin.</option>
                            <option value="diretor_geral">Diretor Geral</option>
                            <option value="master">Master</option>
                          </select>
                        </td>
                        <td className="py-3 px-2 text-right">
                          <button
                            onClick={() => handleForcePasswordChange(user.userId)}
                            disabled={actionLoading === user.userId || user.force_password_change}
                            title="Forçar troca de senha no próximo acesso"
                            className="inline-flex items-center justify-center p-1.5 rounded-md bg-slate-800 text-slate-400 hover:text-teal-400 hover:bg-teal-500/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {user.force_password_change ? <Lock className="w-4 h-4 text-teal-500" /> : <Edit3 className="w-4 h-4" />}
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filteredUsers.length === 0 && !loading && (
                      <tr>
                        <td colSpan={4} className="py-8 text-center text-slate-500">
                          Nenhum usuário encontrado.
                        </td>
                      </tr>
                    )}
                    {loading && (
                      <tr>
                        <td colSpan={4} className="py-8 text-center text-slate-500">
                          <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2" />
                          Carregando usuários...
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, icon: Icon }: { title: string, value: number, icon: any }) {
  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 relative overflow-hidden group">
      <div className="absolute -right-4 -top-4 w-24 h-24 bg-teal-500/10 rounded-full opacity-10 blur-2xl group-hover:opacity-20 transition-opacity duration-500"></div>
      <div className="flex justify-between items-start relative z-10">
        <div>
          <p className="text-slate-400 text-sm font-semibold mb-1">{title}</p>
          <p className="text-3xl font-black text-slate-100">{value}</p>
        </div>
        <div className="w-10 h-10 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center">
          <Icon className="w-5 h-5 text-teal-400" />
        </div>
      </div>
    </div>
  );
}
