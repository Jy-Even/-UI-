import { useState, useEffect } from 'react';
import { useApp } from '../AppContext';
import { motion } from 'motion/react';
import { Save, Trash2, AlertTriangle } from 'lucide-react';

export default function InfoSettings() {
  const { state, updateKB, deleteKB, setView } = useApp();
  const selectedKB = state.knowledgeBases.find(kb => kb.id === state.selectedKBId);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (selectedKB) {
      setName(selectedKB.name);
      setDescription(selectedKB.description);
    }
  }, [selectedKB?.id]);

  if (!selectedKB) return null;

  const handleSave = () => {
    updateKB(selectedKB.id, { name, description });
  };

  const handleDelete = () => {
    if (window.confirm('确定要删除这个知识库吗？此操作不可撤销。')) {
      deleteKB(selectedKB.id);
      setView('workbench');
    }
  };

  return (
    <div className="space-y-10">
      <section className="bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant/5 shadow-sm">
        <h2 className="text-lg font-bold mb-6 text-on-surface">基本信息</h2>
        <div className="space-y-6 max-w-2xl">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-on-surface-variant">知识库名称</label>
            <input 
              className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary-container/20 outline-none transition-all" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="输入知识库名称"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-on-surface-variant">描述</label>
            <textarea 
              className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary-container/20 outline-none transition-all min-h-[120px]" 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="描述这个知识库的用途..."
            />
          </div>
          <div className="pt-4">
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSave}
              className="bg-primary-container text-white px-8 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 shadow-md shadow-primary/10"
            >
              <Save className="w-4 h-4" />
              保存基本信息
            </motion.button>
          </div>
        </div>
      </section>

      <section className="bg-error-container/5 p-8 rounded-2xl border border-error/10">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-error/10 flex items-center justify-center text-error flex-shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-error mb-2">危险区域</h2>
            <p className="text-sm text-on-surface-variant/60 mb-6">
              删除知识库是不可逆的操作。一旦删除，所有文档、成员关系和配置信息都将永久丢失。
            </p>
            <button 
              onClick={handleDelete}
              className="bg-error text-white px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-error/90 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              删除此知识库
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
