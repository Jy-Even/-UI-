import { Search, UserPlus, Trash2, MinusCircle, ChevronDown, Filter, UserCheck, ShieldCheck, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useMemo } from 'react';
import { useApp } from '../AppContext';
import { Role, Member } from '../types';
import InviteMemberModal from './InviteMemberModal';
import EmptyState from './common/EmptyState';

export default function MemberManagement() {
  const { state, removeMember, updateMemberRole, updateKBMembers } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<Role | 'ALL'>('ALL');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  const selectedKB = state.knowledgeBases.find(kb => kb.id === state.selectedKBId);

  const handleInvite = (email: string, role: Role, reason: string) => {
    if (!selectedKB) return;
    const newMember: Member = {
      id: `m-${Date.now()}`,
      name: email.split('@')[0],
      email,
      avatar: `https://picsum.photos/seed/${email}/100/100`,
      role,
      lastActive: '刚刚',
    };
    updateKBMembers(selectedKB.id, [...selectedKB.members, newMember]);
  };

  const filteredMembers = useMemo(() => {
    if (!selectedKB) return [];
    return selectedKB.members.filter(member => {
      const matchesSearch = 
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = roleFilter === 'ALL' || member.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [selectedKB, searchQuery, roleFilter]);

  if (!selectedKB) return null;

  return (
    <section className="mb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-gray-900">成员管理</h2>
            <span className="bg-gray-100 text-gray-500 text-xs font-bold px-2.5 py-1 rounded-full">
              {searchQuery || roleFilter !== 'ALL' ? `找到 ${filteredMembers.length} 人` : `共 ${filteredMembers.length} 人`}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">管理当前知识库的访问人员及其编辑权限</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              className="bg-white border border-gray-100 text-sm rounded-xl pl-10 pr-4 py-2.5 w-full md:w-64 focus:ring-4 focus:ring-gray-100 focus:border-gray-200 outline-none transition-all" 
              placeholder="搜索姓名或邮箱..." 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select 
              className="appearance-none bg-white border border-gray-100 text-sm rounded-xl pl-10 pr-10 py-2.5 focus:ring-4 focus:ring-gray-100 focus:border-gray-200 outline-none cursor-pointer transition-all font-bold text-gray-600"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as Role | 'ALL')}
            >
              <option value="ALL">所有角色</option>
              <option value="OWNER">所有者</option>
              <option value="ADMIN">管理员</option>
              <option value="MEMBER">成员</option>
              <option value="VIEWER">查看者</option>
            </select>
            <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-gray-400" />
          </div>

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsInviteModalOpen(true)}
            className="bg-[#141414] text-white px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-lg shadow-black/5 hover:bg-gray-800"
          >
            <UserPlus className="w-4 h-4" />
            邀请成员
          </motion.button>
        </div>
      </div>

      <InviteMemberModal 
        isOpen={isInviteModalOpen} 
        onClose={() => setIsInviteModalOpen(false)} 
        onInvite={handleInvite} 
      />

      <div className="space-y-3">
        <div className="grid grid-cols-12 px-6 py-2 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
          <div className="col-span-5">基本信息</div>
          <div className="col-span-3">所属角色</div>
          <div className="col-span-3">最后活动时间</div>
          <div className="col-span-1 text-right">操作</div>
        </div>

        <AnimatePresence mode="popLayout">
          {filteredMembers.length > 0 ? (
            filteredMembers.map((member) => (
              <motion.div 
                key={member.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="grid grid-cols-12 items-center bg-white p-5 rounded-2xl hover:shadow-md transition-all group border border-gray-100"
              >
                <div className="col-span-5 flex items-center gap-4">
                  <div className="relative">
                    <img 
                      alt={member.name} 
                      className="w-12 h-12 rounded-xl object-cover border border-gray-100" 
                      src={member.avatar}
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full" />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-gray-900">{member.name}</div>
                    <div className="text-xs text-gray-500">{member.email}</div>
                  </div>
                </div>
                <div className="col-span-3">
                  {member.role === 'OWNER' ? (
                    <div className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-600 text-[10px] font-bold px-3 py-1.5 rounded-full border border-amber-100">
                      <ShieldCheck className="w-3 h-3" />
                      OWNER
                    </div>
                  ) : (
                    <div className="relative inline-block">
                      <select 
                        className="appearance-none bg-gray-50 border border-transparent hover:border-gray-200 text-[10px] font-bold text-gray-600 px-4 pr-9 py-1.5 rounded-full focus:ring-0 cursor-pointer outline-none transition-all"
                        value={member.role}
                        onChange={(e) => updateMemberRole(selectedKB.id, member.id, e.target.value as Role)}
                      >
                        <option value="ADMIN">ADMIN</option>
                        <option value="MEMBER">MEMBER</option>
                        <option value="VIEWER">VIEWER</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="col-span-3 text-sm text-gray-500 font-medium">{member.lastActive}</div>
                <div className="col-span-1 text-right flex justify-end">
                  <button 
                    onClick={() => removeMember(selectedKB.id, member.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all text-xs font-bold ${
                      member.role === 'OWNER' 
                        ? 'text-gray-200 cursor-not-allowed' 
                        : 'text-gray-400 hover:text-red-600 hover:bg-red-50'
                    }`}
                    disabled={member.role === 'OWNER'}
                    title={member.role === 'OWNER' ? "无法移除所有者" : "移除成员"}
                  >
                    <MinusCircle className="w-4 h-4" />
                    <span className="hidden xl:inline">移除</span>
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <EmptyState 
              icon={User}
              title="未找到匹配的成员"
              description="请尝试更换搜索关键词或过滤条件。"
              action={{
                label: "清除过滤",
                onClick: () => { setSearchQuery(''); setRoleFilter('ALL'); },
                icon: Trash2
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
