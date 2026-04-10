import { X, FileText, Download, Share2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface DocumentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentTitle: string;
}

export default function DocumentPreviewModal({ isOpen, onClose, documentTitle }: DocumentPreviewModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-on-surface/20 backdrop-blur-sm"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-surface-container-lowest w-full max-w-4xl h-[80vh] rounded-3xl overflow-hidden shadow-2xl border border-outline-variant/10 flex flex-col"
          >
            {/* Header */}
            <div className="px-6 py-4 flex items-center justify-between border-b border-outline-variant/5 bg-surface-container-lowest z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary-container/10 flex items-center justify-center text-primary-container">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-on-surface">{documentTitle}</h2>
                  <p className="text-xs text-on-surface-variant/60">预览模式 · 仅供查看</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 text-on-surface-variant hover:text-primary-container hover:bg-primary-container/10 rounded-lg transition-colors">
                  <Share2 className="w-4 h-4" />
                </button>
                <button className="p-2 text-on-surface-variant hover:text-primary-container hover:bg-primary-container/10 rounded-lg transition-colors">
                  <Download className="w-4 h-4" />
                </button>
                <div className="w-px h-6 bg-outline-variant/20 mx-2"></div>
                <button 
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container-low transition-colors"
                >
                  <X className="w-4 h-4 text-on-surface-variant" />
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-8 md:p-12 bg-surface custom-scrollbar">
              <div className="max-w-2xl mx-auto space-y-6">
                <h1 className="text-3xl font-extrabold font-headline text-on-surface mb-8">{documentTitle}</h1>
                
                <div className="space-y-4 text-on-surface-variant leading-relaxed">
                  <p>
                    这是一段示例文档内容。在实际应用中，这里将展示真实的文档数据，可能包含富文本、图片、表格等复杂结构。
                  </p>
                  <p>
                    知识库管理系统旨在帮助团队更好地沉淀、组织和分享知识。通过结构化的目录和强大的搜索功能，成员可以快速找到所需的信息。
                  </p>
                  
                  <h3 className="text-lg font-bold text-on-surface mt-8 mb-4">核心功能亮点</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    <li><strong>实时协同编辑：</strong> 支持多人同时在线编辑同一篇文档，变更实时同步，告别版本冲突。</li>
                    <li><strong>细粒度权限控制：</strong> 灵活设置知识库、目录甚至单篇文档的访问和编辑权限，确保数据安全。</li>
                    <li><strong>智能搜索与问答：</strong> 结合 AI 技术，提供精准的全文搜索和基于知识库内容的智能问答服务。</li>
                    <li><strong>丰富的模板库：</strong> 提供多种场景的文档模板，一键套用，提高创作效率。</li>
                  </ul>

                  <div className="bg-surface-container-low p-6 rounded-xl border border-outline-variant/10 mt-8">
                    <p className="text-sm italic text-on-surface-variant/80">
                      "知识的价值在于流动和分享。构建一个开放、协作的知识库，是提升团队整体战斗力的关键。"
                    </p>
                  </div>
                  
                  <p className="pt-4">
                    为了保障文档的安全性，系统还提供了完善的版本历史记录和操作审计日志。任何修改都有迹可循，随时可以恢复到之前的版本。
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
