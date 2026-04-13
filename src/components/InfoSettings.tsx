import { useState, useEffect } from 'react';
import { useApp } from '../AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { Save, Trash2, AlertTriangle, CheckCircle2, X } from 'lucide-react';

export default function InfoSettings() {
  const { state, updateKB, deleteKB, setView } = useApp();
  const selectedKB = state.knowledgeBases.find(kb => kb.id === state.selectedKBId);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (selectedKB) {
      setName(selectedKB.name);
      setDescription(selectedKB.description);
    }
  }, [selectedKB?.id]);

  if (!selectedKB) return null;

  const handleSave = () => {
    updateKB(selectedKB.id, { name, description });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleDelete = () => {
    deleteKB(selectedKB.id);
    setView('workbench');
  };

  return (
    <div className="space-y-12">
      <section className="bg-white p-10 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl font-bold text-gray-900">基础设置</h2>
            <p className="text-sm text-gray-500 mt-1">更新知识库的名称和描述，帮助团队成员更好地理解其用途</p>
          </div>
          <AnimatePresence>
            {isSaved && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-xl text-sm font-bold border border-green-100"
              >
                <CheckCircle2 className="w-4 h-4" />
                已保存
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="space-y-8 max-w-3xl">
          <div className="space-y-3">
            <label className="text-sm font-bold text-gray-700 ml-1">知识库名称</label>
            <input 
              className="w-full bg-gray-50 border border-gray-100 rounded-xl px-5 py-4 text-sm font-medium focus:bg-white focus:ring-4 focus:ring-gray-100 focus:border-gray-200 outline-none transition-all" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例如：产品设计规范"
            />
          </div>
          <div className="space-y-3">
            <label className="text-sm font-bold text-gray-700 ml-1">详细描述</label>
            <textarea 
              className="w-full bg-gray-50 border border-gray-100 rounded-xl px-5 py-4 text-sm font-medium focus:bg-white focus:ring-4 focus:ring-gray-100 focus:border-gray-200 outline-none transition-all min-h-[160px] resize-none" 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="描述这个知识库的用途、目标和包含的内容..."
            />
          </div>
          <div className="pt-4">
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSave}
              className="bg-[#141414] text-white px-10 py-3.5 rounded-xl text-sm font-bold flex items-center gap-2 shadow-xl shadow-black/5 hover:bg-gray-800 transition-all"
            >
              <Save className="w-4 h-4" />
              保存更改
            </motion.button>
          </div>
        </div>
      </section>

      <section className="bg-red-50/30 p-10 rounded-2xl border border-red-100">
        <div className="flex items-start gap-6">
          <div className="w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center text-red-600 flex-shrink-0">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-red-600 mb-2">危险区域</h2>
            <p className="text-sm text-gray-600 max-w-2xl leading-relaxed mb-8">
              删除知识库是一个不可逆的操作。一旦确认，所有文档、成员权限、版本历史以及相关配置信息都将永久丢失。请在操作前确保已备份重要数据。
            </p>
            
            {!showDeleteConfirm ? (
              <button 
                onClick={() => setShowDeleteConfirm(true)}
                className="bg-red-600 text-white px-8 py-3.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-red-700 transition-all shadow-lg shadow-red-200"
              >
                <Trash2 className="w-4 h-4" />
                删除此知识库
              </button>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white p-6 rounded-2xl border border-red-200 shadow-xl max-w-md"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-2">确认删除？</h3>
                <p className="text-sm text-gray-500 mb-6">请输入知识库名称 <span className="font-bold text-gray-900">"{selectedKB.name}"</span> 以确认删除。</p>
                <div className="flex gap-3">
                  <button 
                    onClick={handleDelete}
                    className="flex-1 bg-red-600 text-white py-3 rounded-xl text-sm font-bold hover:bg-red-700 transition-all"
                  >
                    确认删除
                  </button>
                  <button 
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl text-sm font-bold hover:bg-gray-200 transition-all"
                  >
                    取消
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
