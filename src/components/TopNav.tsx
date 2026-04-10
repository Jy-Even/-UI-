import { Search, Bell } from 'lucide-react';
import { useApp } from '../AppContext';

export default function TopNav() {
  const { state, setView } = useApp();

  return (
    <header className="fixed top-0 w-full h-14 z-50 bg-white/80 backdrop-blur-xl flex items-center justify-between px-6 border-b border-outline-variant/10">
      <div className="flex items-center gap-8">
        <div 
          className="flex items-center gap-2 cursor-pointer" 
          onClick={() => setView('workbench')}
        >
          <div className="w-8 h-8 bg-primary-container rounded-lg flex items-center justify-center text-white font-bold text-lg">
            K
          </div>
          <span className="font-headline font-bold text-lg text-on-surface tracking-tight">知识空间</span>
        </div>
        <nav className="hidden md:flex gap-6 items-center">
          <button 
            onClick={() => setView('workbench')}
            className={`font-headline text-sm px-3 py-1 rounded-md transition-colors ${
              state.view === 'workbench' 
                ? 'text-primary-container font-semibold border-b-2 border-primary-container' 
                : 'text-on-surface-variant hover:bg-surface-container-low'
            }`}
          >
            工作台
          </button>
          <button 
            onClick={() => setView('management')}
            className={`font-headline text-sm px-3 py-1 rounded-md transition-colors ${
              state.view === 'management' 
                ? 'text-primary-container font-semibold border-b-2 border-primary-container' 
                : 'text-on-surface-variant hover:bg-surface-container-low'
            }`}
          >
            管理
          </button>
        </nav>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative flex items-center">
          <Search className="absolute left-3 text-on-surface-variant/50 w-4 h-4" />
          <input 
            className="bg-surface-container border-none text-sm rounded-full pl-9 pr-4 py-1.5 w-64 focus:ring-2 focus:ring-primary/20 outline-none" 
            placeholder="搜索文档..." 
            type="text"
          />
        </div>
        <button className="text-on-surface-variant hover:bg-surface-container-low p-2 rounded-full transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border-2 border-white"></span>
        </button>
        <div className="relative group cursor-pointer">
          <img 
            alt="User Avatar" 
            className="w-8 h-8 rounded-full border border-outline-variant/20 object-cover" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBXaoqNiHOVZ0boo64UEJXIH_1cqNCqF6V1LaJZ7UKpv1KbbQAypgngUKMbcDU-nMwDvfEJcEJgwUAT_2GVT53Bwab0saEAGIj2QDUXZ5SzFyh-2a-DI7IGMWRDNZv6cDTZ1J_FaB-2g3BRc4dwSXZBs4ttWOl3I8NaQmqLMUXzYrA1Hu7pEZuh_DKsuxEFP7BlpSWZGR08lcVX26JcDC9P4wDsJ-YsOrzPszpdRBQYs6PGcnndy16DB868SGds5ggOXXX-3Z0OnU0"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>
    </header>
  );
}
