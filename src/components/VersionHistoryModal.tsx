import { X, History, RotateCcw, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';

interface VersionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentTitle: string;
}

export default function VersionHistoryModal({ isOpen, onClose, documentTitle }: VersionHistoryModalProps) {
  const [restoredVersion, setRestoredVersion] = useState<string | null>(null);

  const versions = [
    { id: 'v3', version: 'v3.0', date: '今天 14:30', author: '林知非', current: true, changes: '更新了第三章节内容，补充了最新的市场数据分析。' },
    { id: 'v2', version: 'v2.0', date: '昨天 18:15', author: '陈子珊', current: false, changes: '修订了排版和错别字，优化了整体段落结构。' },
    { id: 'v1', version: 'v1.0', date: '2024-03-10 09:00', author: '林知非', current: false, changes: '初始版本创建，包含基础大纲和第一章草稿。' },
  ];

  const handleRestore = (versionId: string) => {
    setRestoredVersion(versionId);
    setTimeout(() => {
      setRestoredVersion(null);
      onClose();
    }, 1500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-on-surface/10 backdrop-blur-[8px]"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-surface-container-lowest w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border border-outline-variant/10 flex flex-col max-h-[80vh]"
          >
            <div className="px-8 py-6 flex items-center justify-between border-b border-outline-variant/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary-container/10 flex items-center justify-center text-primary-container">
                  <History className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-headline font-bold text-on-surface">版本历史</h2>
                  <p className="text-xs text-on-surface-variant/60 truncate max-w-[300px]">{documentTitle}</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container-low transition-colors"
              >
                <X className="w-4 h-4 text-on-surface-variant" />
              </button>
            </div>

            <div className="p-8 overflow-y-auto custom-scrollbar">
              <div className="relative border-l-2 border-outline-variant/10 ml-4 space-y-8 pb-4">
                {versions.map((v, index) => (
                  <div key={v.id} className="relative pl-8">
                    {/* Timeline Dot */}
                    <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-surface-container-lowest ${
                      v.current ? 'bg-primary-container' : 'bg-outline-variant/40'
                    }`}></div>
                    
                    <div className={`bg-surface-container-lowest border rounded-2xl p-5 transition-all ${
                      v.current ? 'border-primary-container/30 shadow-sm bg-primary/5' : 'border-outline-variant/10 hover:border-outline-variant/30'
                    }`}>
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-3">
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <span className="font-bold text-on-surface text-lg">{v.version}</span>
                            {v.current && (
                              <span className="bg-primary-container text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                                当前版本
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-on-surface-variant/60 flex items-center gap-2">
                            <span>{v.date}</span>
                            <span>·</span>
                            <span>由 <strong>{v.author}</strong> 更新</span>
                          </div>
                        </div>
                        
                        {!v.current && (
                          <button 
                            onClick={() => handleRestore(v.id)}
                            disabled={restoredVersion !== null}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                              restoredVersion === v.id 
                                ? 'bg-primary-container text-white' 
                                : 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest'
                            }`}
                          >
                            {restoredVersion === v.id ? (
                              <>
                                <CheckCircle2 className="w-4 h-4" />
                                已恢复
                              </>
                            ) : (
                              <>
                                <RotateCcw className="w-4 h-4" />
                                恢复此版本
                              </>
                            )}
                          </button>
                        )}
                      </div>
                      
                      <div className="text-sm text-on-surface-variant/80 bg-surface-container-low/50 p-3 rounded-lg">
                        {v.changes}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
