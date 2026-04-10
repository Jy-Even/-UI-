import { Search, UserPlus, Trash2, MinusCircle, ChevronDown, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useMemo } from 'react';
import { useApp } from '../AppContext';
import { Role, Member } from '../types';
import InviteMemberModal from './InviteMemberModal';

export default function MemberManagement() {
  const { state, removeMember, updateMemberRole, updateKBMembers } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<Role | 'ALL'>('ALL');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  const selectedKB = state.knowledgeBases.find(kb => kb.id === state.selectedKBId);

  const handleInvite = (email: string, role: Role) => {
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold font-headline text-on-surface">空间成员</h2>
            <span className="bg-primary-container/10 text-primary-container text-xs font-bold px-2.5 py-0.5 rounded-full transition-all">
              {searchQuery || roleFilter !== 'ALL' ? `找到 ${filteredMembers.length} 人` : `共 ${filteredMembers.length} 人`}
            </span>
          </div>
          <p className="text-sm text-on-surface-variant/60 mt-1">管理当前知识库的访问人员及其编辑权限</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50 w-4 h-4" />
            <input 
              className="bg-surface-container-low border-none text-sm rounded-xl pl-10 pr-4 py-2.5 w-full md:w-64 focus:ring-primary/20 outline-none transition-all" 
              placeholder="搜索姓名或邮箱..." 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50 w-4 h-4" />
            <select 
              className="appearance-none bg-surface-container-low border-none text-sm rounded-xl pl-10 pr-10 py-2.5 focus:ring-primary/20 outline-none cursor-pointer transition-all font-medium text-on-surface-variant"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as Role | 'ALL')}
            >
              <option value="ALL">所有角色</option>
              <option value="OWNER">所有者 (OWNER)</option>
              <option value="ADMIN">管理员 (ADMIN)</option>
              <option value="MEMBER">成员 (MEMBER)</option>
              <option value="VIEWER">查看者 (VIEWER)</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-on-surface-variant/50" />
          </div>

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsInviteModalOpen(true)}
            className="bg-primary-container hover:bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-md shadow-primary/10"
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

      <div className="space-y-4">
        <div className="grid grid-cols-12 px-4 py-2 text-[11px] font-bold text-on-surface-variant/40 uppercase tracking-widest">
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
                className="grid grid-cols-12 items-center bg-surface-container-lowest p-4 rounded-xl hover:bg-surface-container-low transition-all group border border-outline-variant/5"
              >
                <div className="col-span-5 flex items-center gap-4">
                  <img 
                    alt={member.name} 
                    className="w-10 h-10 rounded-full object-cover border border-outline-variant/10" 
                    src={member.avatar}
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <div className="font-semibold text-sm">{member.name}</div>
                    <div className="text-xs text-on-surface-variant/60">{member.email}</div>
                  </div>
                </div>
                <div className="col-span-3">
                  {member.role === 'OWNER' ? (
                    <span className="bg-[#FFF8E1] text-[#FF8F00] text-[10px] font-bold px-2.5 py-1 rounded-full border border-[#FFE082]/30">OWNER</span>
                  ) : (
                    <div className="relative inline-block">
                      <select 
                        className="appearance-none bg-surface-container-low border-none text-[10px] font-bold text-tertiary px-3 pr-8 py-1 rounded-full focus:ring-0 cursor-pointer outline-none"
                        value={member.role}
                        onChange={(e) => updateMemberRole(selectedKB.id, member.id, e.target.value as Role)}
                      >
                        <option value="ADMIN">ADMIN</option>
                        <option value="MEMBER">MEMBER</option>
                        <option value="VIEWER">VIEWER</option>
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none text-tertiary" />
                    </div>
                  )}
                </div>
                <div className="col-span-3 text-sm text-on-surface-variant/60">{member.lastActive}</div>
                <div className="col-span-1 text-right">
                  <button 
                    onClick={() => removeMember(selectedKB.id, member.id)}
                    className="text-on-surface-variant/40 hover:text-error transition-colors p-1"
                    disabled={member.role === 'OWNER'}
                  >
                    {member.role === 'OWNER' ? <Trash2 className="w-4 h-4 opacity-20" /> : <MinusCircle className="w-4 h-4" />}
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-20 flex flex-col items-center justify-center text-on-surface-variant/40 bg-surface-container-lowest rounded-2xl border border-dashed border-outline-variant/20"
            >
              <Search className="w-12 h-12 mb-4 opacity-20" />
              <p className="text-sm font-medium">未找到匹配的成员</p>
              <button 
                onClick={() => { setSearchQuery(''); setRoleFilter('ALL'); }}
                className="mt-4 text-primary-container text-xs font-bold hover:underline"
              >
                清除所有过滤条件
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
