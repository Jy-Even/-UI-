import { ArrowLeft, Share2, MessageSquare, MoreHorizontal, Bold, Italic, Underline as UnderlineIcon, Strikethrough, Quote, Code, Link as LinkIcon, Image as ImageIcon, Table, List, ListOrdered, AlignLeft, AlignCenter, AlignRight, AlignJustify, ListTree, Loader2, CloudLightning, CheckSquare, Pin, PinOff, Combine, Palette, Type, Search, FileText, LayoutDashboard, History as HistoryIcon } from 'lucide-react';
import { useApp } from '../AppContext';
import { useState, useRef, useEffect, useMemo } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { Color } from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import GlobalDragHandle from 'tiptap-extension-global-drag-handle';
import * as Y from 'yjs';
// WebrtcProvider is imported dynamically in useEffect to avoid hangs
import Collaboration from '@tiptap/extension-collaboration';
import CollaborationCursor from '@tiptap/extension-collaboration-cursor';
import { SlashCommand, suggestionOptions } from './editor/SlashCommand';
import { motion, AnimatePresence } from 'motion/react';

const colors = ['#958DF1', '#F98181', '#FBBC88', '#FAF594', '#70CFF8', '#94FADB', '#B9F18D'];
const names = ['Alice', 'Bob', 'Charlie', 'David', 'Eve', 'Frank', 'Grace'];

const getWordAlignedPrefix = (str1: string, str2: string) => {
  let i = 0;
  while (i < str1.length && i < str2.length && str1[i] === str2[i]) {
    i++;
  }
  const rawPrefix = str1.substring(0, i);
  if (rawPrefix.length < 2) return '';
  if (/[\s:：-]$/.test(rawPrefix)) return rawPrefix.trim();
  
  const lastSpace = rawPrefix.lastIndexOf(' ');
  if (lastSpace > 0) {
    return rawPrefix.substring(0, lastSpace).trim();
  }
  if (rawPrefix.length >= 3) return rawPrefix;
  return '';
};

export default function DocumentEditor() {
  const { state, closeEditor, openVersionHistory } = useApp();
  const [toc, setToc] = useState<{ id: string; text: string; level: number }[]>([]);
  const [stats, setStats] = useState({ words: 0, pages: 1 });
  const [isTocOpen, setIsTocOpen] = useState(true);
  const [isTocPinned, setIsTocPinned] = useState(true);
  const [groupSimilar, setGroupSimilar] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving'>('saved');
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const displayToc = useMemo(() => {
    if (!groupSimilar) return toc;
    
    const result: any[] = [];
    let i = 0;
    while (i < toc.length) {
      const current = toc[i];
      let j = i + 1;
      let bestPrefix = '';
      
      if (j < toc.length && toc[j].level === current.level) {
        const prefix = getWordAlignedPrefix(current.text, toc[j].text);
        if (prefix.length >= 2) {
          bestPrefix = prefix;
          while (j < toc.length && toc[j].level === current.level && toc[j].text.startsWith(bestPrefix)) {
            j++;
          }
        }
      }
      
      if (j > i + 1 && bestPrefix) {
        result.push({
          id: `group-${i}`,
          text: `${bestPrefix} (Grouped)`,
          level: current.level,
          isGroupHeader: true
        });
        for (let k = i; k < j; k++) {
          result.push({
            ...toc[k],
            level: toc[k].level + 1,
            text: toc[k].text.substring(bestPrefix.length).replace(/^[\s:：-]+/, '') || toc[k].text,
            isGroupedItem: true
          });
        }
        i = j;
      } else {
        result.push(current);
        i++;
      }
    }
    return result;
  }, [toc, groupSimilar]);
  
  const currentUser = useMemo(() => {
    return {
      name: names[Math.floor(Math.random() * names.length)],
      color: colors[Math.floor(Math.random() * colors.length)]
    };
  }, []);

  const [ydoc] = useState(() => new Y.Doc());
  const [provider, setProvider] = useState<any>(null);
  const providerRef = useRef<any>(null);

  useEffect(() => {
    let mounted = true;
    let webrtcProvider: any = null;
    
    const initProvider = async () => {
      try {
        const { WebrtcProvider } = await import('y-webrtc');
        if (!mounted) return;

        const roomName = `aida-doc-${state.currentDocTitle?.replace(/\s+/g, '-') || 'untitled'}`;
        
        // Cleanup any existing provider in this ref before creating a new one
        if (providerRef.current) {
          providerRef.current.destroy();
          providerRef.current = null;
        }

        webrtcProvider = new WebrtcProvider(roomName, ydoc);
        providerRef.current = webrtcProvider;
        setProvider(webrtcProvider);
      } catch (error) {
        console.error('Failed to initialize WebRTC provider:', error);
      }
    };

    initProvider();

    return () => {
      mounted = false;
      if (webrtcProvider) {
        try {
          webrtcProvider.destroy();
        } catch (e) {
          console.warn('Error destroying provider:', e);
        }
      }
      if (providerRef.current) {
        try {
          providerRef.current.destroy();
        } catch (e) {
          console.warn('Error destroying provider ref:', e);
        }
        providerRef.current = null;
      }
      setProvider(null);
    };
  }, [state.currentDocTitle, ydoc]);

  const handleInput = () => {
    setSaveStatus('saving');
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      setSaveStatus('saved');
    }, 1500);
  };

  // Periodic auto-save every 15 seconds
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      // Only trigger if not already saving from manual input
      setSaveStatus(prev => {
        if (prev === 'saved') {
          console.log('Periodic auto-save triggered...');
          setTimeout(() => {
            setSaveStatus('saved');
          }, 1500);
          return 'saving';
        }
        return prev;
      });
    }, 15000);

    return () => clearInterval(autoSaveInterval);
  }, []);

  const updateContentInfo = (editorInstance: any) => {
    const text = editorInstance.getText();
    const words = text.replace(/\s+/g, '').length;
    const dom = editorInstance.view.dom;
    const pages = Math.max(1, Math.ceil(dom.scrollHeight / 1122));
    
    setStats({ words, pages });

    const headings = Array.from(dom.querySelectorAll('h1, h2, h3')) as HTMLElement[];
    const newToc = headings.map((h, i) => {
      if (!h.id) h.id = `heading-${i}`;
      return {
        id: h.id,
        text: h.textContent || '',
        level: parseInt(h.tagName[1])
      };
    });
    setToc(newToc);
  };

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        // @ts-ignore: history is part of StarterKit but types might be missing
        history: false,
      }),
      Placeholder.configure({
        placeholder: '输入 / 唤出菜单，或直接开始输入...',
      }),
      Link.configure({ openOnClick: false }),
      Image,
      TaskList,
      TaskItem.configure({ nested: true }),
      Underline,
      TextStyle,
      Color,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      GlobalDragHandle.configure({
        dragHandleWidth: 20,
        scrollTreshold: 100,
      }),
      SlashCommand.configure({
        suggestion: suggestionOptions,
      }),
      Collaboration.configure({
        document: ydoc,
      }),
      ...(provider ? [
        CollaborationCursor.configure({
          provider: provider,
          user: {
            name: currentUser.name,
            color: currentUser.color,
          },
        })
      ] : []),
    ],
    onUpdate: ({ editor }) => {
      handleInput();
      updateContentInfo(editor);
    },
    onCreate: ({ editor }) => {
      // If the document is empty, set initial content
      if (editor.isEmpty) {
        editor.commands.setContent(state.currentDocContent || `<h1>${state.currentDocTitle || '未命名文档'}</h1><p></p>`);
      }
      updateContentInfo(editor);
    },
    editorProps: {
      attributes: {
        class: 'prose prose-slate max-w-none focus:outline-none min-h-[800px]',
      },
    },
  }, [provider]); // Re-create editor when provider is ready

  const scrollToHeading = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-col h-screen bg-surface-container-lowest">
      {/* Header */}
      <header className="h-14 border-b border-outline-variant/10 flex items-center justify-between px-4 shrink-0 bg-white z-10">
        <div className="flex items-center gap-4">
          <button 
            onClick={closeEditor}
            className="p-2 hover:bg-surface-container-low rounded-full transition-colors text-on-surface-variant"
            title="返回工作台"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <input 
            type="text" 
            defaultValue={state.currentDocTitle || '未命名文档'}
            onChange={handleInput}
            className="text-lg font-bold font-headline bg-transparent border-none outline-none focus:ring-2 focus:ring-primary-container/20 rounded px-2 py-1 w-64"
          />
          <div className="flex items-center gap-1.5 text-xs text-on-surface-variant/60 bg-surface-container-low px-2.5 py-1 rounded-md border border-outline-variant/5">
            {saveStatus === 'saving' ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-primary-container" />
                <span className="font-medium">正在保存...</span>
              </>
            ) : (
              <>
                <CloudLightning className="w-3.5 h-3.5 text-primary-container" />
                <span className="font-medium">已同步到云端</span>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center -space-x-2.5">
            {[
              { name: '张三', color: 'bg-blue-500', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDpIpPMQPYDOfe7v3lPdd-cRR9nBEKGllc3JwBkHzmPCgiSRUhj77bTpE-2HZy33XaWhoe87NI18s1qDtSQSD0RIh0T-aeVtnxQ35fjr_XB4EoJeb1CBoYA8XVPZstnaI-fMVdyNhOydSD3u6EZOdz78tkFeZogi8KXMiYjNY7xWGbqUrVJBIBNbcWn0Y_SjcD9ehgLghb6NeAALLa4WnZv3kwAhmXCpcTKMs9N5CVbLHjmFPSnwXHZ1Qo1rf8ABU92d2Yodm3YVYg' },
              { name: '李四', color: 'bg-green-500', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB4AYIO4lvwRotU__Hyb8m4X2_PBYXpmgE-3rSY0X6PefT0wGOIhH0xul8vUxrWuKc7z9JAtiD06VpaVtwvXzJH_DWciqhy28xJ3dtSjmVQD0vMAZhpryvzbqpqDzdSpJTS_mDFPL1ciyDMLBbZQmbCwmwy28uMskXr7npr-Ik0IepIpmFi-tJgYChPVtGNyTtMdKXbhpKuwwyNUCPv8EfJFNsXlSuVBTXDG8w2eLTQDYj_FT31TsG7-XsSbt1J5oHLdLYmepkLipM' },
              { name: '王五', color: 'bg-amber-500', img: 'https://picsum.photos/seed/user3/32/32' }
            ].map((user, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -2, zIndex: 10 }}
                className="relative group"
              >
                <img 
                  className="w-8 h-8 rounded-full border-2 border-white shadow-sm object-cover" 
                  src={user.img} 
                  alt={user.name} 
                  referrerPolicy="no-referrer" 
                />
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-on-surface text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  {user.name} 正在编辑
                </div>
              </motion.div>
            ))}
            <div className="w-8 h-8 rounded-full border-2 border-white bg-surface-container-high flex items-center justify-center text-[10px] font-bold text-on-surface-variant shadow-sm">
              +2
            </div>
          </div>
          <div className="w-px h-6 bg-outline-variant/20"></div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => openVersionHistory(state.currentDocTitle || '未命名文档')}
              className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-xl transition-colors"
              title="版本历史"
            >
              <HistoryIcon className="w-5 h-5" />
            </button>
            <button className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-xl transition-colors relative">
              <MessageSquare className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary-container rounded-full border-2 border-white"></span>
            </button>
            <button className="px-5 py-2 bg-primary-container text-white text-sm font-bold rounded-xl hover:shadow-lg hover:shadow-primary-container/20 active:scale-95 transition-all flex items-center gap-2">
              <Share2 className="w-4 h-4" />
              分享
            </button>
          </div>
        </div>
      </header>

      {/* Toolbar */}
      <div className="h-14 border-b border-outline-variant/5 flex items-center justify-between px-6 shrink-0 bg-white/90 backdrop-blur-xl z-10 overflow-x-auto custom-scrollbar sticky top-0">
        <div className="flex items-center gap-2 shrink-0">
          {/* Text Style Group */}
          <div className="flex items-center bg-gray-50 rounded-xl p-1 border border-gray-100 shadow-sm">
            <div className="relative flex items-center">
              <select 
                className="appearance-none text-xs font-bold text-gray-700 bg-white border border-gray-200 rounded-lg pl-3 pr-8 py-1.5 outline-none cursor-pointer hover:border-gray-300 transition-all focus:ring-2 focus:ring-black/5"
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === 'p') editor.chain().focus().setParagraph().run();
                  else editor.chain().focus().toggleHeading({ level: parseInt(val) as any }).run();
                }}
                value={editor.isActive('heading', { level: 1 }) ? '1' : editor.isActive('heading', { level: 2 }) ? '2' : editor.isActive('heading', { level: 3 }) ? '3' : 'p'}
              >
                <option value="p">正文文本</option>
                <option value="1">一级标题</option>
                <option value="2">二级标题</option>
                <option value="3">三级标题</option>
              </select>
              <div className="absolute right-2.5 pointer-events-none text-gray-400">
                <Type className="w-3 h-3" />
              </div>
            </div>
          </div>
          
          <div className="w-px h-6 bg-gray-100 mx-1"></div>
          
          {/* Formatting Group */}
          <div className="flex items-center bg-gray-50 rounded-xl p-1 border border-gray-100 shadow-sm">
            <ToolbarBtn icon={Bold} isActive={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()} title="加粗 (Ctrl+B)" />
            <ToolbarBtn icon={Italic} isActive={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()} title="斜体 (Ctrl+I)" />
            <ToolbarBtn icon={UnderlineIcon} isActive={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()} title="下划线 (Ctrl+U)" />
            <ToolbarBtn icon={Strikethrough} isActive={editor.isActive('strike')} onClick={() => editor.chain().focus().toggleStrike().run()} title="删除线" />
          </div>

          <div className="w-px h-6 bg-gray-100 mx-1"></div>

          {/* Alignment Group */}
          <div className="flex items-center bg-gray-50 rounded-xl p-1 border border-gray-100 shadow-sm">
            <ToolbarBtn 
              icon={AlignLeft} 
              isActive={editor.isActive({ textAlign: 'left' })} 
              onClick={() => editor.chain().focus().setTextAlign('left').run()} 
              title="左对齐"
            />
            <ToolbarBtn 
              icon={AlignCenter} 
              isActive={editor.isActive({ textAlign: 'center' })} 
              onClick={() => editor.chain().focus().setTextAlign('center').run()} 
              title="居中对齐"
            />
            <ToolbarBtn 
              icon={AlignRight} 
              isActive={editor.isActive({ textAlign: 'right' })} 
              onClick={() => editor.chain().focus().setTextAlign('right').run()} 
              title="右对齐"
            />
            <ToolbarBtn 
              icon={AlignJustify} 
              isActive={editor.isActive({ textAlign: 'justify' })} 
              onClick={() => editor.chain().focus().setTextAlign('justify').run()} 
              title="两端对齐"
            />
          </div>

          <div className="w-px h-6 bg-gray-100 mx-1"></div>

          {/* Lists Group */}
          <div className="flex items-center bg-gray-50 rounded-xl p-1 border border-gray-100 shadow-sm">
            <ToolbarBtn icon={List} isActive={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()} title="无序列表" />
            <ToolbarBtn icon={ListOrdered} isActive={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()} title="有序列表" />
            <ToolbarBtn icon={CheckSquare} isActive={editor.isActive('taskList')} onClick={() => editor.chain().focus().toggleTaskList().run()} title="任务列表" />
          </div>

          <div className="w-px h-6 bg-gray-100 mx-1"></div>

          {/* Blocks Group */}
          <div className="flex items-center bg-gray-50 rounded-xl p-1 border border-gray-100 shadow-sm">
            <ToolbarBtn 
              icon={Quote} 
              isActive={editor.isActive('blockquote')} 
              onClick={() => editor.chain().focus().toggleBlockquote().run()} 
              title="引用"
            />
            <ToolbarBtn 
              icon={Code} 
              isActive={editor.isActive('codeBlock')} 
              onClick={() => editor.chain().focus().toggleCodeBlock().run()} 
              title="代码块"
            />
          </div>

          <div className="w-px h-6 bg-gray-100 mx-1"></div>

          {/* Insert Group */}
          <div className="flex items-center bg-gray-50 rounded-xl p-1 border border-gray-100 shadow-sm">
            <ToolbarBtn icon={LinkIcon} isActive={editor.isActive('link')} onClick={() => {
              if (editor.isActive('link')) {
                editor.chain().focus().unsetLink().run();
              } else {
                const url = window.prompt('输入链接地址:');
                if (url) editor.chain().focus().setLink({ href: url }).run();
              }
            }} title="插入链接" />
            <ToolbarBtn icon={ImageIcon} onClick={() => {
              const url = window.prompt('输入图片地址:');
              if (url) editor.chain().focus().setImage({ src: url }).run();
            }} title="插入图片" />
            <div className="relative flex items-center">
              <ToolbarBtn 
                icon={Palette} 
                onClick={() => {
                  const color = window.prompt('输入颜色代码 (例如: #ff0000):', editor.getAttributes('textStyle').color || '#000000');
                  if (color !== null) {
                    editor.chain().focus().setColor(color).run();
                  }
                }}
                isActive={!!editor.getAttributes('textStyle').color}
                title="文本颜色"
              />
              {editor.getAttributes('textStyle').color && (
                <div 
                  className="absolute bottom-1.5 right-1.5 w-1.5 h-1.5 rounded-full border border-white shadow-sm" 
                  style={{ backgroundColor: editor.getAttributes('textStyle').color }}
                />
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3 shrink-0 ml-4">
          <button 
            onClick={() => setIsTocOpen(!isTocOpen)}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 text-xs font-bold border ${
              isTocOpen 
                ? 'bg-[#141414] text-white border-[#141414] shadow-lg shadow-black/10' 
                : 'bg-white text-gray-600 hover:bg-gray-50 border-gray-100'
            }`}
          >
            <ListTree className="w-3.5 h-3.5" />
            文档大纲
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden bg-surface relative">
        {/* ToC Sidebar */}
        <AnimatePresence>
          {isTocOpen && (
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              className={`
                bg-surface-container flex flex-col shrink-0 z-20 transition-all duration-300
                ${isTocPinned ? 'w-64 border-r border-outline-variant/10 relative' : 'w-64 absolute left-0 top-0 bottom-0 shadow-2xl'}
              `}
            >
              <div className="p-4 border-b border-outline-variant/5 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-sm text-on-surface">
                    <ListTree className="w-4 h-4 text-primary-container" />
                    大纲目录
                  </div>
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => setGroupSimilar(!groupSimilar)}
                      className={`p-1.5 rounded-lg transition-colors ${groupSimilar ? 'bg-primary-container/20 text-primary-container' : 'text-on-surface-variant hover:bg-surface-container-low'}`}
                      title="自动分组相似标题"
                    >
                      <Combine className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={() => setIsTocPinned(!isTocPinned)}
                      className={`p-1.5 rounded-lg transition-colors ${isTocPinned ? 'bg-primary-container/20 text-primary-container' : 'text-on-surface-variant hover:bg-surface-container-low'}`}
                      title={isTocPinned ? "取消固定" : "固定在侧边"}
                    >
                      {isTocPinned ? <Pin className="w-3.5 h-3.5" /> : <PinOff className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
                
                <div className="relative group">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-on-surface-variant/40 group-focus-within:text-primary-container transition-colors" />
                  <input 
                    type="text" 
                    placeholder="在目录中搜索..."
                    className="w-full bg-surface-container-low border border-outline-variant/10 rounded-lg py-1.5 pl-8 pr-3 text-xs outline-none focus:ring-2 focus:ring-primary-container/20 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                {displayToc.length > 0 ? (
                  <ul className="space-y-1">
                    {displayToc.map((item) => (
                      <li 
                        key={item.id} 
                        className={`text-sm cursor-pointer transition-all rounded-lg px-2 py-1.5 line-clamp-1 ${
                          item.isGroupHeader ? 'font-bold text-primary text-[10px] uppercase tracking-widest mt-4 mb-1 hover:bg-transparent' :
                          item.level === 1 ? 'font-bold text-on-surface hover:bg-white hover:text-primary-container' : 
                          item.level === 2 ? 'pl-4 text-on-surface-variant hover:bg-white hover:text-primary-container' : 
                          'pl-8 text-on-surface-variant/70 text-xs hover:bg-white hover:text-primary-container'
                        } ${item.isGroupedItem ? 'border-l-2 border-primary-container/20 ml-2 pl-3' : ''}`}
                        onClick={() => {
                          if (!item.isGroupHeader) {
                            scrollToHeading(item.id);
                            if (!isTocPinned) setIsTocOpen(false);
                          }
                        }}
                        title={item.text}
                      >
                        {item.text}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="flex flex-col items-center justify-center mt-20 text-on-surface-variant/30">
                    <ListTree className="w-8 h-8 mb-2 opacity-20" />
                    <p className="text-xs font-medium">暂无目录结构</p>
                  </div>
                )}
              </div>
              
              <div className="p-4 border-t border-outline-variant/5 bg-surface-container-low/50">
                <div className="flex justify-between items-center text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-widest">
                  <div className="flex items-center gap-1">
                    <FileText className="w-3 h-3" />
                    {stats.words} 字
                  </div>
                  <div className="flex items-center gap-1">
                    <LayoutDashboard className="w-3 h-3" />
                    约 {stats.pages} 页
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Editor Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar flex justify-center py-10 relative">
          <div className="w-full max-w-4xl bg-white shadow-sm border border-outline-variant/5 rounded-lg min-h-[800px] p-16 focus-within:ring-2 focus-within:ring-primary-container/10 transition-shadow">
            <EditorContent editor={editor} />
          </div>
        </div>
      </div>
    </div>
  );
}

function ToolbarBtn({ icon: Icon, isActive, onClick, title }: { icon: any, isActive?: boolean, onClick?: () => void, title?: string }) {
  return (
    <motion.button 
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`p-2 rounded-lg transition-all ${
        isActive 
          ? 'bg-[#141414] text-white shadow-md' 
          : 'text-gray-500 hover:bg-white hover:text-gray-900 hover:shadow-sm'
      }`}
      title={title}
    >
      <Icon className="w-4 h-4" />
    </motion.button>
  );
}