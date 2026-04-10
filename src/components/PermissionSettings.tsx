import { Globe, Users, Lock, CheckCircle2, Ruler } from 'lucide-react';
import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { useApp } from '../AppContext';
import { AccessLevel, PermissionSettings as IPermissionSettings } from '../types';

export default function PermissionSettings() {
  const { state, updateKB } = useApp();
  const selectedKB = state.knowledgeBases.find(kb => kb.id === state.selectedKBId);
  
  const [localPermissions, setLocalPermissions] = useState<IPermissionSettings | null>(null);
  const [localAccess, setLocalAccess] = useState<AccessLevel | null>(null);

  useEffect(() => {
    if (selectedKB) {
      setLocalPermissions(selectedKB.permissions);
      setLocalAccess(selectedKB.access);
    }
  }, [selectedKB?.id]);

  if (!selectedKB || !localPermissions || !localAccess) return null;

  const handleSave = () => {
    updateKB(selectedKB.id, { 
      permissions: localPermissions,
      access: localAccess
    });
  };

  const accessOptions = [
    { id: 'PUBLIC', icon: Globe, title: '完全公开', desc: '任何拥有链接的人都可以访问并查看内容。', color: 'primary' },
    { id: 'TEAM', icon: Users, title: '仅团队可见', desc: '仅当前团队内的注册成员可以访问此内容。', color: 'tertiary' },
    { id: 'PRIVATE', icon: Lock, title: '私密空间', desc: '仅被明确邀请的成员才可以看到并访问。', color: 'on-surface-variant' },
  ];

  const togglePermission = (key: keyof IPermissionSettings) => {
    setLocalPermissions(prev => prev ? { ...prev, [key]: !prev[key] } : null);
  };

  return (
    <section>
      <div className="mb-8">
        <h2 className="text-lg font-bold font-headline text-on-surface">访问权限</h2>
        <p className="text-sm text-on-surface-variant/60 mt-1">配置该知识库的可见性与全局交互权限</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {accessOptions.map((option) => (
          <label key={option.id} className="relative cursor-pointer group">
            <input 
              className="peer sr-only" 
              name="access" 
              type="radio" 
              checked={localAccess === option.id}
              onChange={() => setLocalAccess(option.id as AccessLevel)}
            />
            <div className="h-full p-6 rounded-2xl bg-surface-container-lowest border-2 border-transparent transition-all peer-checked:border-primary-container peer-checked:bg-primary/5 shadow-sm hover:shadow-md">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-4 ${
                option.id === 'PUBLIC' ? 'bg-primary-container/10 text-primary' :
                option.id === 'TEAM' ? 'bg-tertiary-container/10 text-tertiary' :
                'bg-surface-container-highest text-on-surface-variant'
              }`}>
                <option.icon className="w-5 h-5" />
              </div>
              <div className="font-bold text-sm mb-1">{option.title}</div>
              <p className="text-[11px] text-on-surface-variant/60 leading-relaxed">{option.desc}</p>
            </div>
            <div className="absolute top-4 right-4 opacity-0 peer-checked:opacity-100 text-primary-container transition-opacity">
              <CheckCircle2 className="w-5 h-5 fill-current" />
            </div>
          </label>
        ))}
      </div>

      <div className="bg-surface-container-lowest rounded-2xl p-8 border border-outline-variant/5 shadow-sm">
        <h3 className="text-md font-bold mb-6 flex items-center gap-2 text-on-surface">
          <Ruler className="text-primary-container w-5 h-5" />
          交互权限明细
        </h3>
        <div className="grid md:grid-cols-2 gap-x-12 gap-y-6">
          <div className="space-y-4">
            <PermissionToggle 
              title="允许成员创建子文档" 
              desc="管理员和普通成员可以在目录下建立新篇章" 
              checked={localPermissions.allowSubDocs}
              onChange={() => togglePermission('allowSubDocs')}
            />
            <PermissionToggle 
              title="允许实时在线协作" 
              desc="开启多人同时编辑，实时同步草稿" 
              checked={localPermissions.allowRealtime}
              onChange={() => togglePermission('allowRealtime')}
            />
          </div>
          <div className="space-y-4">
            <PermissionToggle 
              title="强制内容审核" 
              desc="所有非管理员的更新需要审核后方可发布" 
              checked={localPermissions.forceReview}
              onChange={() => togglePermission('forceReview')}
            />
            <PermissionToggle 
              title="启用水印防护" 
              desc="在页面背景显示访问者身份信息水印" 
              checked={localPermissions.watermark}
              onChange={() => togglePermission('watermark')}
            />
          </div>
        </div>
      </div>

      <div className="mt-10 flex justify-end gap-4">
        <button 
          onClick={() => {
            setLocalPermissions(selectedKB.permissions);
            setLocalAccess(selectedKB.access);
          }}
          className="px-6 py-2.5 rounded-xl text-sm font-semibold text-on-surface bg-surface-container-high hover:bg-surface-container-highest transition-colors"
        >
          重置变更
        </button>
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSave}
          className="px-8 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-primary to-primary-container shadow-md shadow-primary/10 hover:shadow-lg hover:shadow-primary/20 transition-all"
        >
          保存设置
        </motion.button>
      </div>
    </section>
  );
}

function PermissionToggle({ title, desc, checked, onChange }: { title: string, desc: string, checked: boolean, onChange: () => void }) {
  return (
    <div 
      className="flex items-start gap-4 p-3 rounded-lg hover:bg-surface-container-low transition-colors cursor-pointer"
      onClick={onChange}
    >
      <div className="mt-1">
        <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
          checked ? 'bg-primary-container border-primary-container text-white' : 'border-outline-variant/30 bg-white'
        }`}>
          {checked && <CheckCircle2 className="w-3 h-3" />}
        </div>
      </div>
      <div>
        <div className="text-sm font-semibold text-on-surface">{title}</div>
        <div className="text-[11px] text-on-surface-variant/60 mt-1">{desc}</div>
      </div>
    </div>
  );
}
