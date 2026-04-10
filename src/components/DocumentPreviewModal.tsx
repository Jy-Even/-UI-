import { X, FileText, Download, Share2, ListTree } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useRef, useEffect } from 'react';

interface DocumentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentTitle: string;
}

export default function DocumentPreviewModal({ isOpen, onClose, documentTitle }: DocumentPreviewModalProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [toc, setToc] = useState<{ id: string; text: string; level: number }[]>([]);
  const [stats, setStats] = useState({ words: 0, pages: 1 });
  const [isTocOpen, setIsTocOpen] = useState(true);

  useEffect(() => {
    if (isOpen && contentRef.current) {
      // Small delay to ensure DOM is rendered
      setTimeout(() => {
        if (!contentRef.current) return;
        const content = contentRef.current.innerText || '';
        const words = content.replace(/\s+/g, '').length;
        const pages = Math.max(1, Math.ceil(contentRef.current.scrollHeight / 1122));
        setStats({ words, pages });

        const headings = Array.from(contentRef.current.querySelectorAll('h1, h2, h3'));
        const newToc = headings.map((h, i) => {
          if (!h.id) h.id = `preview-heading-${i}`;
          return {
            id: h.id,
            text: h.textContent || '',
            level: parseInt(h.tagName[1])
          };
        });
        setToc(newToc);
      }, 100);
    }
  }, [isOpen]);

  const scrollToHeading = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

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
            className="relative bg-surface-container-lowest w-full max-w-6xl h-[85vh] rounded-3xl overflow-hidden shadow-2xl border border-outline-variant/10 flex flex-col"
          >
            {/* Header */}
            <div className="px-6 py-4 flex items-center justify-between border-b border-outline-variant/5 bg-surface-container-lowest z-10 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary-container/10 flex items-center justify-center text-primary-container">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-on-surface line-clamp-1">{documentTitle}</h2>
                  <p className="text-xs text-on-surface-variant/60">预览模式 · 仅供查看</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsTocOpen(!isTocOpen)}
                  className={`p-2 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium ${isTocOpen ? 'bg-primary-container/10 text-primary-container' : 'text-on-surface-variant hover:bg-surface-container-low'}`}
                >
                  <ListTree className="w-4 h-4" />
                  <span className="hidden sm:inline">目录</span>
                </button>
                <div className="w-px h-6 bg-outline-variant/20 mx-2"></div>
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

            {/* Main Content Area */}
            <div className="flex-1 flex overflow-hidden bg-surface">
              {/* Content Area */}
              <div className="flex-1 overflow-y-auto p-8 md:p-12 custom-scrollbar relative">
                <div ref={contentRef} className="max-w-3xl mx-auto space-y-6 prose prose-slate max-w-none">
                  <h1 className="text-4xl font-extrabold font-headline text-on-surface mb-8">{documentTitle}</h1>
                  
                  <div className="space-y-4 text-on-surface-variant leading-relaxed">
                    <p>
                      这是一段示例文档内容。在实际应用中，这里将展示真实的文档数据，可能包含富文本、图片、表格等复杂结构。
                    </p>
                    <p>
                      知识库管理系统旨在帮助团队更好地沉淀、组织和分享知识。通过结构化的目录和强大的搜索功能，成员可以快速找到所需的信息。
                    </p>
                    
                    <h2 className="text-2xl font-bold text-on-surface mt-10 mb-4 border-b pb-2">核心功能亮点</h2>
                    <ul className="list-disc pl-5 space-y-2">
                      <li><strong>实时协同编辑：</strong> 支持多人同时在线编辑同一篇文档，变更实时同步，告别版本冲突。</li>
                      <li><strong>细粒度权限控制：</strong> 灵活设置知识库、目录甚至单篇文档的访问和编辑权限，确保数据安全。</li>
                      <li><strong>智能搜索与问答：</strong> 结合 AI 技术，提供精准的全文搜索和基于知识库内容的智能问答服务。</li>
                      <li><strong>丰富的模板库：</strong> 提供多种场景的文档模板，一键套用，提高创作效率。</li>
                    </ul>

                    <h2 className="text-2xl font-bold text-on-surface mt-10 mb-4 border-b pb-2">系统架构</h2>
                    <p>
                      系统采用现代化的前后端分离架构，前端使用 React 和 Tailwind CSS 构建响应式界面，后端提供高可用的 RESTful API 和 WebSocket 服务以支持实时协同。
                    </p>

                    <h3 className="text-xl font-bold text-on-surface mt-8 mb-4">前端技术栈</h3>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>React 18</li>
                      <li>Tailwind CSS</li>
                      <li>Lucide Icons</li>
                      <li>Framer Motion</li>
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

              {/* ToC Sidebar */}
              {isTocOpen && (
                <div className="w-64 border-l border-outline-variant/10 bg-surface-container-lowest flex flex-col shrink-0">
                  <div className="p-4 border-b border-outline-variant/5 font-bold text-sm text-on-surface flex items-center gap-2">
                    <ListTree className="w-4 h-4" />
                    大纲目录
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                    {toc.length > 0 ? (
                      <ul className="space-y-2">
                        {toc.map((item) => (
                          <li 
                            key={item.id} 
                            className={`text-sm cursor-pointer hover:text-primary-container transition-colors line-clamp-1 ${
                              item.level === 1 ? 'font-bold text-on-surface' : 
                              item.level === 2 ? 'pl-4 text-on-surface-variant' : 
                              'pl-8 text-on-surface-variant/80 text-xs'
                            }`}
                            onClick={() => scrollToHeading(item.id)}
                            title={item.text}
                          >
                            {item.text}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-xs text-on-surface-variant/40 text-center mt-10">暂无目录结构</p>
                    )}
                  </div>
                  {/* Stats Footer */}
                  <div className="p-4 border-t border-outline-variant/5 bg-surface-container-lowest/50 text-xs text-on-surface-variant flex justify-between items-center">
                    <span>字数：{stats.words}</span>
                    <span>页数：~{stats.pages}</span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
