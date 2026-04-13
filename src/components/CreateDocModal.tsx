import { X, FileText, Table, Presentation, LayoutTemplate, FileEdit, LayoutGrid } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../AppContext';

export default function CreateDocModal() {
  const { isCreateDocModalOpen, setIsCreateDocModalOpen, openEditor, setIsTemplateGalleryOpen } = useApp();

  const docTypes = [
    { id: 'blank', icon: FileText, title: '空白文档', desc: '从零开始自由创作', color: 'text-primary-container', bg: 'bg-primary-container/10' },
    { id: 'template', icon: LayoutGrid, title: '从模板新建', desc: '海量模板，快速起步', color: 'text-secondary', bg: 'bg-secondary/10' },
    { id: 'sheet', icon: Table, title: '数据表格', desc: '结构化管理数据', color: 'text-tertiary', bg: 'bg-tertiary/10' },
    { id: 'board', icon: Presentation, title: '互动白板', desc: '自由绘制与头脑风暴', color: 'text-on-surface-variant', bg: 'bg-surface-container-high' },
    { id: 'meeting', icon: FileEdit, title: '会议记录', desc: '套用标准会议模板', color: 'text-on-surface-variant', bg: 'bg-surface-container-high' },
    { id: 'plan', icon: LayoutTemplate, title: '项目计划', desc: '敏捷项目管理模板', color: 'text-on-surface-variant', bg: 'bg-surface-container-high' },
  ];

  const handleCreate = (id: string, title: string) => {
    setIsCreateDocModalOpen(false);
    if (id === 'template') {
      setIsTemplateGalleryOpen(true);
    } else {
      let type: 'doc' | 'sheet' | 'board' = 'doc';
      if (id === 'sheet') type = 'sheet';
      if (id === 'board') type = 'board';
      openEditor(`未命名${title}`, undefined, type);
    }
  };

  return (
    <AnimatePresence>
      {isCreateDocModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={() => setIsCreateDocModalOpen(false)}
            className="absolute inset-0 bg-on-surface/10 backdrop-blur-[8px]"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }} 
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-surface-container-lowest w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border border-outline-variant/10"
          >
            <div className="px-8 py-6 flex items-center justify-between border-b border-outline-variant/5">
              <h2 className="text-xl font-headline font-bold text-on-surface">新建内容</h2>
              <button 
                onClick={() => setIsCreateDocModalOpen(false)} 
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container-low transition-colors"
              >
                <X className="w-4 h-4 text-on-surface-variant" />
              </button>
            </div>
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {docTypes.map(type => (
                <div 
                  key={type.id}
                  onClick={() => handleCreate(type.id, type.title)}
                  className="p-4 rounded-2xl border border-outline-variant/10 hover:border-primary-container/30 hover:shadow-md cursor-pointer transition-all group bg-surface-container-lowest hover:bg-primary/5"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${type.bg} ${type.color} group-hover:scale-110 transition-transform`}>
                    <type.icon className="w-5 h-5" />
                  </div>
                  <div className="font-bold text-sm text-on-surface mb-1">{type.title}</div>
                  <div className="text-xs text-on-surface-variant/60">{type.desc}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
