import { X, Mail, Shield, Send, MessageSquare, Users, Search, Check, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { Role } from '../types';

interface SystemUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  department: string;
}

const MOCK_SYSTEM_USERS: SystemUser[] = [
  { id: 'u1', name: '张伟', email: 'zhangwei@company.com', avatar: 'https://picsum.photos/seed/u1/100/100', department: '技术部' },
  { id: 'u2', name: '李娜', email: 'lina@company.com', avatar: 'https://picsum.photos/seed/u2/100/100', department: '产品部' },
  { id: 'u3', name: '王强', email: 'wangqiang@company.com', avatar: 'https://picsum.photos/seed/u3/100/100', department: '设计部' },
  { id: 'u4', name: '刘洋', email: 'liuyang@company.com', avatar: 'https://picsum.photos/seed/u4/100/100', department: '市场部' },
  { id: 'u5', name: '陈静', email: 'chenjing@company.com', avatar: 'https://picsum.photos/seed/u5/100/100', department: '人事部' },
];

interface InviteMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInvite: (email: string, role: Role, reason: string) => void;
}

export default function InviteMemberModal({ isOpen, onClose, onInvite }: InviteMemberModalProps) {
  const [mode, setMode] = useState<'email' | 'system'>('email');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<Role>('MEMBER');
  const [reason, setReason] = useState('');
  const [invitationLetter, setInvitationLetter] = useState('');
  const [search, setSearch] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const handleInvite = () => {
    if (mode === 'email') {
      if (!email.trim()) return;
      onInvite(email, role, reason);
    } else {
      const user = MOCK_SYSTEM_USERS.find(u => u.id === selectedUserId);
      if (!user) return;
      onInvite(user.email, role, invitationLetter || reason);
    }
    setEmail('');
    setReason('');
    setInvitationLetter('');
    setSelectedUserId(null);
    onClose();
  };

  const filteredUsers = MOCK_SYSTEM_USERS.filter(u => 
    u.name.includes(search) || u.email.includes(search) || u.department.includes(search)
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/20 backdrop-blur-[8px]"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white w-full max-w-lg rounded-[32px] overflow-hidden shadow-2xl border border-gray-100"
          >
            <div className="px-8 py-6 flex items-center justify-between border-b border-gray-50">
              <h2 className="text-xl font-bold text-gray-900">添加成员</h2>
              <button 
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            <div className="p-8 space-y-6">
              <div className="flex p-1 bg-gray-50 rounded-2xl">
                <button 
                  onClick={() => setMode('email')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${mode === 'email' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  邮件邀请
                </button>
                <button 
                  onClick={() => setMode('system')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${mode === 'system' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  系统人员库
                </button>
              </div>

              {mode === 'email' ? (
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-blue-500" />
                    电子邮箱
                  </label>
                  <input 
                    className="w-full bg-gray-50 border-transparent rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-4 focus:ring-gray-100 focus:border-gray-200 outline-none transition-all font-medium" 
                    placeholder="例如：member@company.com" 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-black transition-colors" />
                    <input 
                      type="text" 
                      placeholder="搜索系统人员..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full bg-gray-50 border-transparent rounded-xl py-2.5 pl-12 pr-4 text-sm outline-none focus:bg-white focus:ring-4 focus:ring-gray-100 focus:border-gray-200 transition-all font-medium"
                    />
                  </div>
                  
                  <div className="max-h-[240px] overflow-y-auto custom-scrollbar space-y-2 pr-2">
                    {filteredUsers.map((user) => (
                      <button
                        key={user.id}
                        onClick={() => setSelectedUserId(user.id)}
                        className={`w-full flex items-center gap-4 p-3 rounded-2xl transition-all border ${
                          selectedUserId === user.id 
                            ? 'bg-blue-50 border-blue-100 ring-1 ring-blue-100' 
                            : 'bg-white border-gray-50 hover:border-gray-200'
                        }`}
                      >
                        <img src={user.avatar} className="w-10 h-10 rounded-xl object-cover" alt={user.name} referrerPolicy="no-referrer" />
                        <div className="flex-1 text-left">
                          <div className="text-sm font-bold text-gray-900">{user.name}</div>
                          <div className="text-[11px] text-gray-400 font-medium">{user.department} · {user.email}</div>
                        </div>
                        {selectedUserId === user.id && (
                          <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>

                  <AnimatePresence>
                    {selectedUserId && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                        exit={{ opacity: 0, y: -10, height: 0 }}
                        className="space-y-2 pt-2 overflow-hidden"
                      >
                        <label className="text-sm font-bold text-gray-900 flex items-center gap-2">
                          <FileText className="w-4 h-4 text-blue-500" />
                          邀请函
                        </label>
                        <textarea 
                          className="w-full bg-blue-50/30 border border-blue-100 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-4 focus:ring-blue-100/20 outline-none transition-all min-h-[100px] resize-none font-medium" 
                          placeholder="输入一段诚挚的邀请语..." 
                          value={invitationLetter}
                          onChange={(e) => setInvitationLetter(e.target.value)}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-amber-500" />
                  分配角色
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['ADMIN', 'MEMBER', 'VIEWER'] as Role[]).map((r) => (
                    <button
                      key={r}
                      onClick={() => setRole(r)}
                      className={`py-2 rounded-xl text-[10px] font-black tracking-widest transition-all border ${
                        role === r 
                          ? 'bg-[#141414] text-white border-[#141414]' 
                          : 'bg-white text-gray-400 border-gray-100 hover:border-gray-300'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {mode === 'email' && (
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-gray-400" />
                    邀请理由 <span className="text-gray-300 font-normal">(可选)</span>
                  </label>
                  <textarea 
                    className="w-full bg-gray-50 border-transparent rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-4 focus:ring-gray-100 focus:border-gray-200 outline-none transition-all min-h-[80px] resize-none font-medium" 
                    placeholder="说点什么来邀请Ta加入..." 
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  />
                </div>
              )}

              <div className="pt-4">
                <button 
                  onClick={handleInvite}
                  disabled={mode === 'email' ? !email.trim() : !selectedUserId}
                  className="w-full bg-[#141414] text-white py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-xl shadow-black/10 hover:bg-gray-800 transition-all disabled:opacity-50 disabled:shadow-none"
                >
                  <Send className="w-4 h-4" />
                  {mode === 'email' ? '发送邀请邮件' : '确认添加成员'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
