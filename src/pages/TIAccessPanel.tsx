import React, { useState } from 'react';
import { Shield, Users, Key, Search, Edit2, Trash2, X, Check } from 'lucide-react';

type UserData = {
  id: number;
  name: string;
  role: string;
  status: string;
  lastLogin: string;
};

export default function TIAccessPanel() {
  const [users, setUsers] = useState<UserData[]>([
    { id: 1, name: 'Pedro (Auxiliar)', role: 'Colaborador', status: 'Ativo', lastLogin: '28/05/2026 10:15' },
    { id: 2, name: 'Rafael (Coordenador)', role: 'Lider', status: 'Ativo', lastLogin: '27/05/2026 16:42' },
    { id: 3, name: 'Márcia (RH)', role: 'RH', status: 'Inativo', lastLogin: '15/05/2026 09:10' },
    { id: 4, name: 'João (TI)', role: 'TI', status: 'Ativo', lastLogin: '28/05/2026 12:20' }
  ]);

  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<UserData>>({});

  const handleDelete = (id: number) => {
    if (confirm('Tem certeza que deseja remover este usuário?')) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  const handleEdit = (user: UserData) => {
    setEditingUserId(user.id);
    setEditForm({ ...user });
  };

  const handleSave = () => {
    if (editingUserId) {
      setUsers(users.map(u => u.id === editingUserId ? { ...u, ...editForm } as UserData : u));
      setEditingUserId(null);
    }
  };

  const handleCancel = () => {
    setEditingUserId(null);
  };

  return (
    <div className="w-full xl:max-w-7xl mx-auto flex flex-col gap-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-display font-bold text-slate-100 flex items-center gap-3">
          <Shield className="w-6 h-6 text-teal-400" />
          Gerenciamento de Acessos
        </h2>
        <p className="text-slate-400 text-sm">Controle de perfis, permissões e status de contas.</p>
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
          <button className="w-full sm:w-auto bg-teal-500 hover:bg-teal-400 text-slate-950 px-4 py-2 rounded-xl text-sm font-bold transition-all">
            + Novo Usuário
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider">
                <th className="pb-3 font-medium">Nome</th>
                <th className="pb-3 font-medium">Perfil</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Último Login</th>
                <th className="pb-3 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {users.map(user => (
                <tr key={user.id} className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors">
                  {editingUserId === user.id ? (
                    <>
                      <td className="py-4">
                        <input
                          type="text"
                          value={editForm.name || ''}
                          onChange={e => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full bg-slate-950 border border-slate-700 rounded p-1 text-sm text-slate-200 outline-none focus:border-teal-500"
                        />
                      </td>
                      <td className="py-4">
                        <select
                          value={editForm.role || ''}
                          onChange={e => setEditForm(prev => ({ ...prev, role: e.target.value }))}
                          className="w-full bg-slate-950 border border-slate-700 rounded p-1 text-sm text-slate-200 outline-none focus:border-teal-500"
                        >
                          <option value="Colaborador">Colaborador</option>
                          <option value="Lider">Lider</option>
                          <option value="RH">RH</option>
                          <option value="TI">TI</option>
                        </select>
                      </td>
                      <td className="py-4">
                        <select
                          value={editForm.status || ''}
                          onChange={e => setEditForm(prev => ({ ...prev, status: e.target.value }))}
                          className="w-full bg-slate-950 border border-slate-700 rounded p-1 text-sm text-slate-200 outline-none focus:border-teal-500"
                        >
                          <option value="Ativo">Ativo</option>
                          <option value="Inativo">Inativo</option>
                        </select>
                      </td>
                      <td className="py-4 text-slate-500">{user.lastLogin}</td>
                      <td className="py-4 flex justify-end gap-2">
                        <button onClick={handleSave} className="p-1.5 text-teal-400 hover:bg-teal-400/10 rounded-lg transition-colors" title="Salvar">
                          <Check className="w-4 h-4" />
                        </button>
                        <button onClick={handleCancel} className="p-1.5 text-slate-400 hover:text-teal-400 hover:bg-teal-400/10 rounded-lg transition-colors" title="Cancelar">
                          <X className="w-4 h-4" />
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="py-4 text-slate-200">{user.name}</td>
                      <td className="py-4 text-slate-400">{user.role}</td>
                      <td className="py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          user.status === 'Ativo' ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20' : 'bg-teal-500/10 text-teal-400 border border-teal-500/20'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="py-4 text-slate-500">{user.lastLogin}</td>
                      <td className="py-4 flex justify-end gap-2">
                        <button className="p-1.5 text-slate-400 hover:text-teal-400 hover:bg-teal-400/10 rounded-lg transition-colors" title="Redefinir Senha">
                          <Key className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleEdit(user)} className="p-1.5 text-slate-400 hover:text-teal-400 hover:bg-teal-400/10 rounded-lg transition-colors" title="Editar">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(user.id)} className="p-1.5 text-slate-400 hover:text-teal-400 hover:bg-teal-400/10 rounded-lg transition-colors" title="Remover">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
