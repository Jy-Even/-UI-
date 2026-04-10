import { ArrowLeft, Share2, MessageSquare, MoreHorizontal, Bold, Italic, Underline as UnderlineIcon, Strikethrough, Quote, Code, Link as LinkIcon, Image as ImageIcon, Table, List, ListOrdered, AlignLeft, AlignCenter, AlignRight, ListTree, Loader2, CloudLightning, CheckSquare, Pin, PinOff, Combine } from 'lucide-react';
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
import GlobalDragHandle from 'tiptap-extension-global-drag-handle';
import * as Y from 'yjs';
// WebrtcProvider is imported dynamically in useEffect to avoid hangs
import Collaboration from '@tiptap/extension-collaboration';
import CollaborationCursor from '@tiptap/extension-collaboration-cursor';
import { SlashCommand, suggestionOptions } from './editor/SlashCommand';

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
  const { state, closeEditor } = useApp();
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

  useEffect(() => {
    let webrtcProvider: any = null;
    
    const initProvider = async () => {
      try {
        const { WebrtcProvider } = await import('y-webrtc');
        const roomName = `aida-doc-${state.currentDocTitle?.replace(/\s+/g, '-') || 'untitled'}`;
        webrtcProvider = new WebrtcProvider(roomName, ydoc);
        setProvider(webrtcProvider);
      } catch (error) {
        console.error('Failed to initialize WebRTC provider:', error);
      }
    };

    initProvider();

    return () => {
      if (webrtcProvider) {
        webrtcProvider.destroy();
      }
    };
  }, [state.currentDocTitle, ydoc]);

  const handleInput = () => {
    setSaveStatus('saving');
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      setSaveStatus('saved');
    }, 1500);
  };

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
          <div className="flex items-center gap-1.5 text-xs text-on-surface-variant/60 bg-surface-container-low px-2.5 py-1 rounded-md">
            {saveStatus === 'saving' ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>保存中...</span>
              </>
            ) : (
              <>
                <CloudLightning className="w-3.5 h-3.5 text-primary-container" />
                <span>已保存到云端</span>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2 mr-2">
            <img className="w-8 h-8 rounded-full border-2 border-white" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDpIpPMQPYDOfe7v3lPdd-cRR9nBEKGllc3JwBkHzmPCgiSRUhj77bTpE-2HZy33XaWhoe87NI18s1qDtSQSD0RIh0T-aeVtnxQ35fjr_XB4EoJeb1CBoYA8XVPZstnaI-fMVdyNhOydSD3u6EZOdz78tkFeZogi8KXMiYjNY7xWGbqUrVJBIBNbcWn0Y_SjcD9ehgLghb6NeAALLa4WnZv3kwAhmXCpcTKMs9N5CVbLHjmFPSnwXHZ1Qo1rf8ABU92d2Yodm3YVYg" alt="User 1" referrerPolicy="no-referrer" />
            <img className="w-8 h-8 rounded-full border-2 border-white" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB4AYIO4lvwRotU__Hyb8m4X2_PBYXpmgE-3rSY0X6PefT0wGOIhH0xul8vUxrWuKc7z9JAtiD06VpaVtwvXzJH_DWciqhy28xJ3dtSjmVQD0vMAZhpryvzbqpqDzdSpJTS_mDFPL1ciyDMLBbZQmbCwmwy28uMskXr7npr-Ik0IepIpmFi-tJgYChPVtGNyTtMdKXbhpKuwwyNUCPv8EfJFNsXlSuVBTXDG8w2eLTQDYj_FT31TsG7-XsSbt1J5oHLdLYmepkLipM" alt="User 2" referrerPolicy="no-referrer" />
          </div>
          <button className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-full transition-colors">
            <MessageSquare className="w-5 h-5" />
          </button>
          <button className="px-4 py-1.5 bg-primary-container text-white text-sm font-bold rounded-full hover:opacity-90 transition-opacity flex items-center gap-2">
            <Share2 className="w-4 h-4" />
            分享
          </button>
          <button className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-full transition-colors">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Toolbar */}
      <div className="h-12 border-b border-outline-variant/5 flex items-center justify-between px-4 shrink-0 bg-surface-container-lowest/50 z-10 overflow-x-auto custom-scrollbar">
        <div className="flex items-center gap-1 shrink-0">
          <select 
            className="text-sm border-none bg-transparent hover:bg-surface-container-low rounded px-2 py-1 outline-none cursor-pointer font-medium"
            onChange={(e) => {
              const val = e.target.value;
              if (val === 'p') editor.chain().focus().setParagraph().run();
              else editor.chain().focus().toggleHeading({ level: parseInt(val) as any }).run();
            }}
            value={editor.isActive('heading', { level: 1 }) ? '1' : editor.isActive('heading', { level: 2 }) ? '2' : editor.isActive('heading', { level: 3 }) ? '3' : 'p'}
          >
            <option value="p">正文</option>
            <option value="1">标题 1</option>
            <option value="2">标题 2</option>
            <option value="3">标题 3</option>
          </select>
          <div className="w-px h-4 bg-outline-variant/20 mx-2"></div>
          <ToolbarBtn icon={Bold} isActive={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()} />
          <ToolbarBtn icon={Italic} isActive={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()} />
          <ToolbarBtn icon={UnderlineIcon} isActive={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()} />
          <ToolbarBtn icon={Strikethrough} isActive={editor.isActive('strike')} onClick={() => editor.chain().focus().toggleStrike().run()} />
          <div className="w-px h-4 bg-outline-variant/20 mx-2"></div>
          <ToolbarBtn icon={Quote} isActive={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()} />
          <ToolbarBtn icon={Code} isActive={editor.isActive('codeBlock')} onClick={() => editor.chain().focus().toggleCodeBlock().run()} />
          <ToolbarBtn icon={LinkIcon} isActive={editor.isActive('link')} onClick={() => {
            if (editor.isActive('link')) {
              editor.chain().focus().unsetLink().run();
            } else {
              const url = window.prompt('URL');
              if (url) editor.chain().focus().setLink({ href: url }).run();
            }
          }} />
          <div className="w-px h-4 bg-outline-variant/20 mx-2"></div>
          <ToolbarBtn icon={ImageIcon} onClick={() => {
            const url = window.prompt('Image URL');
            if (url) editor.chain().focus().setImage({ src: url }).run();
          }} />
          <div className="w-px h-4 bg-outline-variant/20 mx-2"></div>
          <ToolbarBtn icon={AlignLeft} isActive={editor.isActive({ textAlign: 'left' })} onClick={() => editor.chain().focus().setTextAlign('left').run()} />
          <ToolbarBtn icon={AlignCenter} isActive={editor.isActive({ textAlign: 'center' })} onClick={() => editor.chain().focus().setTextAlign('center').run()} />
          <ToolbarBtn icon={AlignRight} isActive={editor.isActive({ textAlign: 'right' })} onClick={() => editor.chain().focus().setTextAlign('right').run()} />
          <div className="w-px h-4 bg-outline-variant/20 mx-2"></div>
          <ToolbarBtn icon={List} isActive={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()} />
          <ToolbarBtn icon={ListOrdered} isActive={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()} />
          <ToolbarBtn icon={CheckSquare} isActive={editor.isActive('taskList')} onClick={() => editor.chain().focus().toggleTaskList().run()} />
        </div>
        
        <button 
          onClick={() => setIsTocOpen(!isTocOpen)}
          className={`p-2 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium shrink-0 ml-4 ${isTocOpen ? 'bg-primary-container/10 text-primary-container' : 'text-on-surface-variant hover:bg-surface-container-low'}`}
        >
          <ListTree className="w-4 h-4" />
          目录
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden bg-surface relative">
        {/* ToC Sidebar */}
        {isTocOpen && (
          <div className={`
            bg-surface-container-lowest flex flex-col shrink-0 z-20 transition-all duration-300
            ${isTocPinned ? 'w-64 border-r border-outline-variant/10 relative' : 'w-64 absolute left-0 top-0 bottom-0 shadow-2xl'}
          `}>
            <div className="p-4 border-b border-outline-variant/5 font-bold text-sm text-on-surface flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ListTree className="w-4 h-4" />
                大纲目录
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => setGroupSimilar(!groupSimilar)}
                  className={`p-1.5 rounded transition-colors ${groupSimilar ? 'bg-primary-container/20 text-primary-container' : 'text-on-surface-variant hover:bg-surface-container-low'}`}
                  title="自动分组相似标题"
                >
                  <Combine className="w-3.5 h-3.5" />
                </button>
                <button 
                  onClick={() => setIsTocPinned(!isTocPinned)}
                  className={`p-1.5 rounded transition-colors ${isTocPinned ? 'bg-primary-container/20 text-primary-container' : 'text-on-surface-variant hover:bg-surface-container-low'}`}
                  title={isTocPinned ? "取消固定" : "固定在侧边"}
                >
                  {isTocPinned ? <Pin className="w-3.5 h-3.5" /> : <PinOff className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
              {displayToc.length > 0 ? (
                <ul className="space-y-2">
                  {displayToc.map((item) => (
                    <li 
                      key={item.id} 
                      className={`text-sm cursor-pointer hover:text-primary-container transition-colors line-clamp-1 ${
                        item.isGroupHeader ? 'font-bold text-primary text-xs uppercase tracking-wider mt-4 mb-2' :
                        item.level === 1 ? 'font-bold text-on-surface' : 
                        item.level === 2 ? 'pl-4 text-on-surface-variant' : 
                        'pl-8 text-on-surface-variant/80 text-xs'
                      } ${item.isGroupedItem ? 'border-l-2 border-primary-container/30 ml-2 pl-3' : ''}`}
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
                <p className="text-xs text-on-surface-variant/40 text-center mt-10">暂无目录结构</p>
              )}
            </div>
            {/* Stats Footer in Sidebar */}
            <div className="p-4 border-t border-outline-variant/5 bg-surface-container-lowest/50 text-xs text-on-surface-variant flex justify-between items-center">
              <span>字数：{stats.words}</span>
              <span>页数：~{stats.pages}</span>
            </div>
          </div>
        )}

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

function ToolbarBtn({ icon: Icon, isActive, onClick }: { icon: any, isActive?: boolean, onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`p-1.5 rounded transition-colors ${isActive ? 'bg-primary-container/20 text-primary-container' : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'}`}
    >
      <Icon className="w-4 h-4" />
    </button>
  );
}