import { Search, Bell } from 'lucide-react';

export default function TopNav() {
  return (
    <header className="fixed top-0 w-full h-14 z-50 bg-white/80 backdrop-blur-xl flex items-center justify-between px-6 border-b border-outline-variant/10">
      <div className="flex items-center gap-8">
        <div className="text-xl font-bold text-primary-container tracking-tight font-headline">知识空间</div>
        <nav className="hidden md:flex gap-6 items-center">
          <a className="text-on-surface-variant font-headline text-sm hover:bg-surface-container-low transition-colors px-3 py-1 rounded-md" href="#">工作台</a>
          <a className="text-primary-container font-semibold border-b-2 border-primary-container font-headline text-sm px-3 py-1" href="#">管理</a>
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
