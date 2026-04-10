import { ArrowLeft, Share2, MessageSquare, MoreHorizontal, Bold, Italic, Underline, List, ListOrdered, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import { useApp } from '../AppContext';

export default function DocumentEditor() {
  const { state, closeEditor } = useApp();

  return (
    <div className="flex flex-col h-screen bg-surface-container-lowest">
      {/* Header */}
      <header className="h-14 border-b border-outline-variant/10 flex items-center justify-between px-4 shrink-0 bg-white">
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
            className="text-lg font-bold font-headline bg-transparent border-none outline-none focus:ring-2 focus:ring-primary-container/20 rounded px-2 py-1 w-64"
          />
          <span className="text-xs text-on-surface-variant/40 bg-surface-container px-2 py-1 rounded-md">已保存到云端</span>
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
      <div className="h-12 border-b border-outline-variant/5 flex items-center justify-center gap-1 px-4 shrink-0 bg-surface-container-lowest/50">
        <select className="text-sm border-none bg-transparent hover:bg-surface-container-low rounded px-2 py-1 outline-none cursor-pointer font-medium">
          <option>正文</option>
          <option>标题 1</option>
          <option>标题 2</option>
          <option>标题 3</option>
        </select>
        <div className="w-px h-4 bg-outline-variant/20 mx-2"></div>
        <ToolbarBtn icon={Bold} />
        <ToolbarBtn icon={Italic} />
        <ToolbarBtn icon={Underline} />
        <div className="w-px h-4 bg-outline-variant/20 mx-2"></div>
        <ToolbarBtn icon={AlignLeft} />
        <ToolbarBtn icon={AlignCenter} />
        <ToolbarBtn icon={AlignRight} />
        <div className="w-px h-4 bg-outline-variant/20 mx-2"></div>
        <ToolbarBtn icon={List} />
        <ToolbarBtn icon={ListOrdered} />
      </div>

      {/* Editor Area */}
      <div className="flex-1 overflow-y-auto bg-surface custom-scrollbar flex justify-center py-10">
        <div 
          className="w-full max-w-4xl bg-white shadow-sm border border-outline-variant/5 rounded-lg min-h-[800px] p-16 outline-none" 
          contentEditable 
          suppressContentEditableWarning
        >
          <h1 className="text-4xl font-bold mb-6 font-headline">{state.currentDocTitle || '未命名文档'}</h1>
          <p className="text-on-surface-variant leading-relaxed mb-4">在这里开始输入内容...</p>
        </div>
      </div>
    </div>
  );
}

function ToolbarBtn({ icon: Icon }: { icon: any }) {
  return (
    <button className="p-1.5 text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface rounded transition-colors">
      <Icon className="w-4 h-4" />
    </button>
  );
}
