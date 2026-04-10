import { X, Search, FileText, LayoutTemplate, Briefcase, Users, Code, PenTool, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { useApp } from '../AppContext';

export default function TemplateGalleryModal() {
  const { isTemplateGalleryOpen, setIsTemplateGalleryOpen, openEditor } = useApp();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', label: '全部模板' },
    { id: 'product', label: '产品设计' },
    { id: 'engineering', label: '研发技术' },
    { id: 'hr', label: '人事行政' },
    { id: 'personal', label: '个人管理' },
    { id: 'custom', label: '自定义模板' },
  ];

  const templates = [
    { id: 't1', title: '产品需求文档 (PRD)', desc: '标准化的产品需求说明模板，包含背景、功能列表、交互说明等。', category: 'product', icon: LayoutTemplate, color: 'text-primary-container', bg: 'bg-primary-container/10' },
    { id: 't2', title: '竞品分析报告', desc: '多维度对比竞品优劣势，辅助产品决策。', category: 'product', icon: Briefcase, color: 'text-secondary', bg: 'bg-secondary/10' },
    { id: 't3', title: '技术架构设计', desc: '系统架构图、数据库设计、接口规范等技术文档模板。', category: 'engineering', icon: Code, color: 'text-tertiary', bg: 'bg-tertiary/10' },
    { id: 't4', title: '项目复盘报告', desc: '总结项目经验教训，沉淀团队知识。', category: 'engineering', icon: FileText, color: 'text-on-surface-variant', bg: 'bg-surface-container-high' },
    { id: 't5', title: '新员工入职指南', desc: '帮助新员工快速了解公司文化、规章制度及常用工具。', category: 'hr', icon: Users, color: 'text-primary-container', bg: 'bg-primary-container/10' },
    { id: 't6', title: '个人周报', desc: '记录本周工作进展、下周计划及遇到的问题。', category: 'personal', icon: PenTool, color: 'text-secondary', bg: 'bg-secondary/10' },
    { id: 't7', title: '会议纪要', desc: '记录会议议题、决议事项及后续待办。', category: 'all', icon: FileText, color: 'text-tertiary', bg: 'bg-tertiary/10' },
  ];

  const filteredTemplates = templates.filter(t => 
    (activeCategory === 'all' || t.category === activeCategory) &&
    (t.title.toLowerCase().includes(searchQuery.toLowerCase()) || t.desc.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSelectTemplate = (title: string) => {
    setIsTemplateGalleryOpen(false);
    openEditor(`未命名 - ${title}`);
  };

  const handleCreateCustomTemplate = () => {
    setIsTemplateGalleryOpen(false);
    openEditor('新建自定义模板');
  };

  return (
    <AnimatePresence>
      {isTemplateGalleryOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={() => setIsTemplateGalleryOpen(false)}
            className="absolute inset-0 bg-on-surface/20 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }} 
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-surface-container-lowest w-full max-w-6xl h-[85vh] rounded-3xl overflow-hidden shadow-2xl border border-outline-variant/10 flex flex-col"
          >
            {/* Header */}
            <div className="px-8 py-6 flex items-center justify-between border-b border-outline-variant/5 shrink-0">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-headline font-bold text-on-surface">模板库</h2>
                <div className="relative ml-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50 w-4 h-4" />
                  <input 
                    className="bg-surface-container border border-outline-variant/10 text-sm rounded-full pl-9 pr-4 py-2 w-64 focus:ring-2 focus:ring-primary-container/20 outline-none transition-all" 
                    placeholder="搜索模板..." 
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <button 
                onClick={() => setIsTemplateGalleryOpen(false)} 
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-low transition-colors"
              >
                <X className="w-5 h-5 text-on-surface-variant" />
              </button>
            </div>

            {/* Content */}
            <div className="flex flex-1 overflow-hidden">
              {/* Sidebar */}
              <div className="w-48 border-r border-outline-variant/5 bg-surface-container-lowest/50 p-4 shrink-0 overflow-y-auto custom-scrollbar">
                <nav className="space-y-1">
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                        activeCategory === cat.id 
                          ? 'bg-primary-container/10 text-primary-container font-bold' 
                          : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Grid */}
              <div className="flex-1 p-8 overflow-y-auto custom-scrollbar bg-surface">
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="text-lg font-bold text-on-surface">
                    {categories.find(c => c.id === activeCategory)?.label}
                  </h3>
                  {activeCategory === 'custom' && (
                    <button 
                      onClick={handleCreateCustomTemplate}
                      className="text-sm font-bold text-primary-container hover:underline flex items-center gap-1"
                    >
                      <Plus className="w-4 h-4" />
                      创建新模板
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {(activeCategory === 'custom' || activeCategory === 'all') && (
                    <motion.div 
                      whileHover={{ scale: 1.02 }}
                      onClick={handleCreateCustomTemplate}
                      className="h-48 rounded-2xl border-2 border-dashed border-outline-variant/20 hover:border-primary-container/40 hover:bg-primary-container/5 flex flex-col items-center justify-center text-on-surface-variant/60 hover:text-primary-container cursor-pointer transition-all group"
                    >
                      <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center mb-3 group-hover:bg-primary-container/10 transition-colors">
                        <Plus className="w-6 h-6" />
                      </div>
                      <span className="font-bold text-sm">新建自定义模板</span>
                    </motion.div>
                  )}

                  {filteredTemplates.map(template => (
                    <motion.div 
                      key={template.id}
                      whileHover={{ y: -4 }}
                      onClick={() => handleSelectTemplate(template.title)}
                      className="h-48 bg-surface-container-lowest rounded-2xl border border-outline-variant/10 p-5 flex flex-col hover:shadow-lg hover:border-primary-container/30 cursor-pointer transition-all group"
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${template.bg} ${template.color}`}>
                        <template.icon className="w-5 h-5" />
                      </div>
                      <h4 className="font-bold text-on-surface mb-2 group-hover:text-primary-container transition-colors line-clamp-1">{template.title}</h4>
                      <p className="text-xs text-on-surface-variant/60 line-clamp-3 leading-relaxed">{template.desc}</p>
                    </motion.div>
                  ))}

                  {filteredTemplates.length === 0 && activeCategory !== 'custom' && (
                    <div className="col-span-full py-12 flex flex-col items-center justify-center text-on-surface-variant/40">
                      <Search className="w-12 h-12 mb-4 opacity-20" />
                      <p>没有找到相关模板</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
