import { X, Search, FileText, LayoutTemplate, Briefcase, Users, Code, PenTool, Plus, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { useApp } from '../AppContext';

export default function TemplateGalleryModal() {
  const { isTemplateGalleryOpen, setIsTemplateGalleryOpen, openEditor } = useApp();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTemplateId, setActiveTemplateId] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: '全部模板' },
    { id: 'product', label: '产品设计' },
    { id: 'engineering', label: '研发技术' },
    { id: 'hr', label: '人事行政' },
    { id: 'personal', label: '个人管理' },
    { id: 'custom', label: '自定义模板' },
  ];

  const templates = [
    { 
      id: 't1', 
      title: '产品需求文档 (PRD)', 
      desc: '标准化的产品需求说明模板，包含背景、功能列表、交互说明等。', 
      category: 'product', 
      icon: LayoutTemplate, 
      color: 'text-primary-container', 
      bg: 'bg-primary-container/10',
      content: `
        <h1 class="text-4xl font-bold mb-6 font-headline">产品需求文档 (PRD)</h1>
        <h2 class="text-2xl font-bold mt-8 mb-4 border-b pb-2">1. 背景与目标</h2>
        <p class="mb-4 text-on-surface-variant">阐述为什么要做这个项目，期望达成什么业务目标。</p>
        <h2 class="text-2xl font-bold mt-8 mb-4 border-b pb-2">2. 目标用户与痛点</h2>
        <ul class="list-disc pl-6 mb-4 text-on-surface-variant">
          <li class="mb-2"><strong>目标用户：</strong>描述核心用户群体</li>
          <li class="mb-2"><strong>用户痛点：</strong>当前用户面临的主要问题</li>
        </ul>
        <h2 class="text-2xl font-bold mt-8 mb-4 border-b pb-2">3. 核心功能范围</h2>
        <table class="w-full border-collapse border border-outline-variant/20 mb-4 text-sm">
          <thead>
            <tr class="bg-surface-container-low"><th class="border border-outline-variant/20 p-2 text-left">功能模块</th><th class="border border-outline-variant/20 p-2 text-left">功能描述</th><th class="border border-outline-variant/20 p-2 text-left">优先级</th></tr>
          </thead>
          <tbody>
            <tr><td class="border border-outline-variant/20 p-2">模块A</td><td class="border border-outline-variant/20 p-2">描述A</td><td class="border border-outline-variant/20 p-2">P0</td></tr>
            <tr><td class="border border-outline-variant/20 p-2">模块B</td><td class="border border-outline-variant/20 p-2">描述B</td><td class="border border-outline-variant/20 p-2">P1</td></tr>
          </tbody>
        </table>
        <h2 class="text-2xl font-bold mt-8 mb-4 border-b pb-2">4. 交互与视觉说明</h2>
        <p class="mb-4 text-on-surface-variant">在此处附上设计稿链接或交互说明。</p>
      `
    },
    { 
      id: 't2', 
      title: '会议纪要', 
      desc: '记录会议议题、决议事项及后续待办。', 
      category: 'all', 
      icon: FileText, 
      color: 'text-tertiary', 
      bg: 'bg-tertiary/10',
      content: `
        <h1 class="text-4xl font-bold mb-6 font-headline">会议纪要</h1>
        <div class="bg-surface-container-low p-4 rounded-lg mb-6 text-sm">
          <p class="mb-2"><strong>会议时间：</strong> 202X年X月X日</p>
          <p class="mb-2"><strong>会议地点：</strong> 会议室 / 线上链接</p>
          <p class="mb-2"><strong>参会人员：</strong> @人员A, @人员B</p>
          <p class="mb-0"><strong>记录人：</strong> @记录人</p>
        </div>
        <h2 class="text-2xl font-bold mt-8 mb-4 border-b pb-2">1. 会议议题</h2>
        <ul class="list-decimal pl-6 mb-4 text-on-surface-variant">
          <li class="mb-2">议题一：讨论...</li>
          <li class="mb-2">议题二：评审...</li>
        </ul>
        <h2 class="text-2xl font-bold mt-8 mb-4 border-b pb-2">2. 决议与待办 (Action Items)</h2>
        <ul class="list-none pl-0 mb-4 text-on-surface-variant">
          <li class="mb-2 flex items-center gap-2"><input type="checkbox" /> <span>[待办] 任务描述 - 负责人 - 截止日期</span></li>
          <li class="mb-2 flex items-center gap-2"><input type="checkbox" /> <span>[待办] 任务描述 - 负责人 - 截止日期</span></li>
        </ul>
      `
    },
    { 
      id: 't3', 
      title: '个人周报', 
      desc: '记录本周工作进展、下周计划及遇到的问题。', 
      category: 'personal', 
      icon: PenTool, 
      color: 'text-secondary', 
      bg: 'bg-secondary/10',
      content: `
        <h1 class="text-4xl font-bold mb-6 font-headline">个人周报</h1>
        <p class="mb-6 text-on-surface-variant"><strong>汇报周期：</strong> 202X.XX.XX - 202X.XX.XX</p>
        <h2 class="text-2xl font-bold mt-8 mb-4 border-b pb-2">🎯 本周工作进展</h2>
        <ul class="list-disc pl-6 mb-4 text-on-surface-variant">
          <li class="mb-2"><strong>[项目A]</strong> 完成了核心模块的开发，进度 100%。</li>
          <li class="mb-2"><strong>[项目B]</strong> 参与需求评审，输出技术方案。</li>
        </ul>
        <h2 class="text-2xl font-bold mt-8 mb-4 border-b pb-2">🚀 下周工作计划</h2>
        <ul class="list-disc pl-6 mb-4 text-on-surface-variant">
          <li class="mb-2"><strong>[项目B]</strong> 开始编码，预计周三提测。</li>
          <li class="mb-2"><strong>[日常]</strong> 修复线上遗留 Bug。</li>
        </ul>
        <h2 class="text-2xl font-bold mt-8 mb-4 border-b pb-2">💡 思考与建议 / 需要协调</h2>
        <p class="mb-4 text-on-surface-variant">记录本周的工作感悟，或者需要其他团队协助的事项。</p>
      `
    },
    { 
      id: 't4', 
      title: '技术架构设计', 
      desc: '系统架构图、数据库设计、接口规范等技术文档模板。', 
      category: 'engineering', 
      icon: Code, 
      color: 'text-tertiary', 
      bg: 'bg-tertiary/10',
      content: `
        <h1 class="text-4xl font-bold mb-6 font-headline">技术架构设计</h1>
        <h2 class="text-2xl font-bold mt-8 mb-4 border-b pb-2">1. 系统概述</h2>
        <p class="mb-4 text-on-surface-variant">简述系统的主要功能、业务背景及技术栈选型。</p>
        <h2 class="text-2xl font-bold mt-8 mb-4 border-b pb-2">2. 架构图</h2>
        <div class="w-full h-48 bg-surface-container border border-dashed border-outline-variant/30 flex items-center justify-center text-on-surface-variant/40 mb-4 rounded-lg">
          [在此处插入架构图]
        </div>
        <h2 class="text-2xl font-bold mt-8 mb-4 border-b pb-2">3. 接口定义</h2>
        <pre class="bg-surface-container-high text-on-surface p-4 rounded-lg text-sm mb-4 overflow-x-auto"><code>POST /api/v1/resource
{
  "id": "string",
  "name": "string"
}</code></pre>
      `
    },
    { id: 't5', title: '竞品分析报告', desc: '多维度对比竞品优劣势，辅助产品决策。', category: 'product', icon: Briefcase, color: 'text-secondary', bg: 'bg-secondary/10', content: '<h1 class="text-4xl font-bold mb-6 font-headline">竞品分析报告</h1><p>在此输入竞品分析内容...</p>' },
    { id: 't6', title: '项目复盘报告', desc: '总结项目经验教训，沉淀团队知识。', category: 'engineering', icon: FileText, color: 'text-on-surface-variant', bg: 'bg-surface-container-high', content: '<h1 class="text-4xl font-bold mb-6 font-headline">项目复盘报告</h1><p>在此输入复盘内容...</p>' },
    { id: 't7', title: '新员工入职指南', desc: '帮助新员工快速了解公司文化、规章制度及常用工具。', category: 'hr', icon: Users, color: 'text-primary-container', bg: 'bg-primary-container/10', content: '<h1 class="text-4xl font-bold mb-6 font-headline">新员工入职指南</h1><p>在此输入入职指南内容...</p>' },
  ];

  const filteredTemplates = templates.filter(t => 
    (activeCategory === 'all' || t.category === activeCategory) &&
    (t.title.toLowerCase().includes(searchQuery.toLowerCase()) || t.desc.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  useEffect(() => {
    if (filteredTemplates.length > 0) {
      if (!activeTemplateId || !filteredTemplates.find(t => t.id === activeTemplateId)) {
        setActiveTemplateId(filteredTemplates[0].id);
      }
    } else {
      setActiveTemplateId(null);
    }
  }, [activeCategory, searchQuery]);

  const activeTemplate = templates.find(t => t.id === activeTemplateId);

  const handleUseTemplate = () => {
    if (activeTemplate) {
      setIsTemplateGalleryOpen(false);
      openEditor(`未命名 - ${activeTemplate.title}`, activeTemplate.content);
    }
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
            className="relative bg-surface-container-lowest w-full max-w-7xl h-[85vh] rounded-3xl overflow-hidden shadow-2xl border border-outline-variant/10 flex flex-col"
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

            {/* Content Split View */}
            <div className="flex flex-1 overflow-hidden">
              {/* Left Sidebar: Categories */}
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

              {/* Middle: Template List */}
              <div className="w-80 border-r border-outline-variant/5 bg-surface-container-lowest p-4 shrink-0 overflow-y-auto custom-scrollbar flex flex-col gap-2">
                {(activeCategory === 'custom' || activeCategory === 'all') && (
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    onClick={handleCreateCustomTemplate}
                    className="p-4 rounded-xl border-2 border-dashed border-outline-variant/20 hover:border-primary-container/40 hover:bg-primary-container/5 flex items-center gap-3 text-on-surface-variant/60 hover:text-primary-container cursor-pointer transition-all group mb-2"
                  >
                    <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center group-hover:bg-primary-container/10 transition-colors">
                      <Plus className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-sm">新建自定义模板</span>
                  </motion.div>
                )}

                {filteredTemplates.map(template => (
                  <div 
                    key={template.id}
                    onClick={() => setActiveTemplateId(template.id)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      activeTemplateId === template.id
                        ? 'bg-primary/5 border-primary-container/30 shadow-sm'
                        : 'bg-surface-container-lowest border-outline-variant/10 hover:border-outline-variant/30 hover:bg-surface-container-low'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${template.bg} ${template.color}`}>
                        <template.icon className="w-4 h-4" />
                      </div>
                      <h4 className={`font-bold text-sm line-clamp-1 ${activeTemplateId === template.id ? 'text-primary-container' : 'text-on-surface'}`}>
                        {template.title}
                      </h4>
                    </div>
                    <p className="text-xs text-on-surface-variant/60 line-clamp-2 leading-relaxed">{template.desc}</p>
                  </div>
                ))}

                {filteredTemplates.length === 0 && activeCategory !== 'custom' && (
                  <div className="py-12 flex flex-col items-center justify-center text-on-surface-variant/40">
                    <Search className="w-8 h-8 mb-4 opacity-20" />
                    <p className="text-sm">没有找到相关模板</p>
                  </div>
                )}
              </div>

              {/* Right: Preview Pane */}
              <div className="flex-1 bg-surface flex flex-col relative overflow-hidden">
                {activeTemplate ? (
                  <>
                    <div className="h-16 border-b border-outline-variant/5 bg-surface-container-lowest/80 backdrop-blur-md flex items-center justify-between px-8 shrink-0 absolute top-0 left-0 right-0 z-10">
                      <h3 className="font-bold text-lg text-on-surface">{activeTemplate.title}</h3>
                      <button 
                        onClick={handleUseTemplate}
                        className="bg-primary-container text-white px-6 py-2 rounded-full text-sm font-bold flex items-center gap-2 shadow-md shadow-primary/10 hover:shadow-lg hover:opacity-90 transition-all"
                      >
                        <Check className="w-4 h-4" />
                        使用此模板
                      </button>
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar pt-24 pb-12 px-8 flex justify-center">
                      <div 
                        className="w-full max-w-3xl bg-white shadow-sm border border-outline-variant/5 rounded-lg min-h-[600px] p-12 pointer-events-none"
                        dangerouslySetInnerHTML={{ __html: activeTemplate.content }}
                      />
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-on-surface-variant/40">
                    <LayoutTemplate className="w-16 h-16 mb-4 opacity-20" />
                    <p>请在左侧选择一个模板以预览</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
