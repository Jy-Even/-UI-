import { FolderHeart, Plus, Info, Users, ShieldCheck, FileOutput, Trash2, Settings, LayoutDashboard, ChevronDown, FileText } from 'lucide-react';
import { motion } from 'motion/react';
import { useApp } from '../AppContext';

interface SidebarProps {
  onCreateNew?: () => void;
}

export default function Sidebar({ onCreateNew }: SidebarProps) {
  const { state, setView, setManagementTab, selectKB } = useApp();
  const selectedKB = state.knowledgeBases.find(kb => kb.id === state.selectedKBId);

  const navItems = [
    { id: 'docs', icon: FileText, label: '文档管理' },
    { id: 'info', icon: Info, label: '信息设置' },
    { id: 'members', icon: Users, label: '成员管理' },
    { id: 'permissions', icon: ShieldCheck, label: '权限配置' },
    { id: 'export', icon: FileOutput, label: '数据导出' },
    { id: 'audit', icon: ShieldCheck, label: '安全审计' },
  ];

  return (
    <aside className="fixed left-0 top-14 w-[240px] h-[calc(100vh-56px)] bg-surface-container flex flex-col py-6 px-4 gap-y-2 overflow-y-auto border-r border-outline-variant/5 custom-scrollbar">
      <div className="mb-6 px-2">
        <div className="relative group mb-4">
          <div className="flex items-center gap-3 p-2 rounded-xl bg-surface-container-high border border-outline-variant/10 cursor-pointer hover:bg-surface-container-highest transition-all">
            <div className="w-10 h-10 rounded-lg bg-primary-container flex items-center justify-center text-white flex-shrink-0">
              <FolderHeart className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-sm truncate">{selectedKB?.name || '未选择知识库'}</div>
              <div className="text-[10px] text-on-surface-variant/60 uppercase tracking-widest">Team Space</div>
            </div>
            <ChevronDown className="w-4 h-4 text-on-surface-variant/40" />
          </div>
          
          {/* Dropdown for switching KBs */}
          <div className="absolute top-full left-0 right-0 mt-2 bg-surface-container-highest rounded-xl shadow-xl border border-outline-variant/10 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
            <div className="px-3 py-1 text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-widest mb-1">切换知识库</div>
            {state.knowledgeBases.map(kb => (
              <button
                key={kb.id}
                onClick={() => selectKB(kb.id)}
                className={`w-full text-left px-3 py-2 text-xs hover:bg-white/10 transition-colors truncate ${
                  kb.id === state.selectedKBId ? 'text-primary-container font-bold' : 'text-on-surface-variant'
                }`}
              >
                {kb.name}
              </button>
            ))}
          </div>
        </div>

        <motion.button 
          whileHover={{ scale: 0.98 }}
          whileTap={{ scale: 0.95 }}
          onClick={onCreateNew}
          className="w-full bg-gradient-to-br from-primary to-primary-container text-white py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 shadow-lg shadow-primary/20 transition-transform"
        >
          <Plus className="w-4 h-4" />
          新建文档
        </motion.button>
      </div>

      <div className="space-y-1">
        <button
          onClick={() => setView('workbench')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-all ${
            state.view === 'workbench' 
              ? 'text-primary-container font-bold bg-white/50' 
              : 'text-on-surface-variant hover:text-primary-container hover:bg-white/30'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          工作台
        </button>

        {state.view === 'management' && (
          <div className="pt-4 space-y-1">
            <div className="px-3 text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-widest mb-2">管理</div>
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setManagementTab(item.id as any)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-all ${
                  state.managementTab === item.id 
                    ? 'text-primary-container font-bold bg-white/50' 
                    : 'text-on-surface-variant hover:text-primary-container hover:bg-white/30'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="mt-auto pt-6 space-y-1">
        <button 
          onClick={() => setView('trash')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-all ${
            state.view === 'trash'
              ? 'bg-error-container/20 text-error font-bold'
              : 'text-on-surface-variant hover:bg-surface-container-low hover:text-error'
          }`}
        >
          <Trash2 className="w-5 h-5" />
          回收站
        </button>
        <button 
          onClick={() => {
            setManagementTab('permissions');
            setView('management');
          }}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-on-surface-variant hover:bg-white/30 rounded-lg transition-all"
        >
          <Settings className="w-5 h-5" />
          设置
        </button>
      </div>
    </aside>
  );
}
