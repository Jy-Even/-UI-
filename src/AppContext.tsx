import React, { createContext, useContext, useState, ReactNode } from 'react';
import { KnowledgeBase, Member, AppState, AccessLevel, PermissionSettings, Role, ManagementTab } from './types';

interface AppContextType {
  state: AppState;
  isCreateModalOpen: boolean;
  setIsCreateModalOpen: (isOpen: boolean) => void;
  isCreateDocModalOpen: boolean;
  setIsCreateDocModalOpen: (isOpen: boolean) => void;
  isTemplateGalleryOpen: boolean;
  setIsTemplateGalleryOpen: (isOpen: boolean) => void;
  createKB: (name: string, description: string, access: AccessLevel) => void;
  selectKB: (id: string) => void;
  setView: (view: 'workbench' | 'management' | 'trash' | 'editor') => void;
  setManagementTab: (tab: ManagementTab) => void;
  updateKB: (kbId: string, updates: Partial<KnowledgeBase>) => void;
  deleteKB: (kbId: string) => void;
  updateKBMembers: (kbId: string, members: Member[]) => void;
  removeMember: (kbId: string, memberId: string) => void;
  updateMemberRole: (kbId: string, memberId: string, role: Role) => void;
  openEditor: (title: string) => void;
  closeEditor: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const initialMembers: Member[] = [
  {
    id: '1',
    name: '林知非',
    email: 'zhifei.lin@knowledge.com',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDpIpPMQPYDOfe7v3lPdd-cRR9nBEKGllc3JwBkHzmPCgiSRUhj77bTpE-2HZy33XaWhoe87NI18s1qDtSQSD0RIh0T-aeVtnxQ35fjr_XB4EoJeb1CBoYA8XVPZstnaI-fMVdyNhOydSD3u6EZOdz78tkFeZogi8KXMiYjNY7xWGbqUrVJBIBNbcWn0Y_SjcD9ehgLghb6NeAALLa4WnZv3kwAhmXCpcTKMs9N5CVbLHjmFPSnwXHZ1Qo1rf8ABU92d2Yodm3YVYg',
    role: 'OWNER',
    lastActive: '2分钟前',
  },
  {
    id: '2',
    name: '陈子珊',
    email: 'zishan.chen@knowledge.com',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB4AYIO4lvwRotU__Hyb8m4X2_PBYXpmgE-3rSY0X6PefT0wGOIhH0xul8vUxrWuKc7z9JAtiD06VpaVtwvXzJH_DWciqhy28xJ3dtSjmVQD0vMAZhpryvzbqpqDzdSpJTS_mDFPL1ciyDMLBbZQmbCwmwy28uMskXr7npr-Ik0IepIpmFi-tJgYChPVtGNyTtMdKXbhpKuwwyNUCPv8EfJFNsXlSuVBTXDG8w2eLTQDYj_FT31TsG7-XsSbt1J5oHLdLYmepkLipM',
    role: 'ADMIN',
    lastActive: '昨天 18:30',
  },
];

const initialKBs: KnowledgeBase[] = [
  {
    id: 'kb-1',
    name: '产品设计知识库',
    description: '沉淀产品设计规范与方法论',
    access: 'TEAM',
    members: initialMembers,
    permissions: {
      allowSubDocs: true,
      allowRealtime: true,
      forceReview: false,
      watermark: true,
    },
    createdAt: '2024-01-01',
  }
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreateDocModalOpen, setIsCreateDocModalOpen] = useState(false);
  const [isTemplateGalleryOpen, setIsTemplateGalleryOpen] = useState(false);
  const [state, setState] = useState<AppState>({
    knowledgeBases: initialKBs,
    selectedKBId: 'kb-1',
    view: 'workbench',
    managementTab: 'members',
  });

  const createKB = (name: string, description: string, access: AccessLevel) => {
    const newKB: KnowledgeBase = {
      id: `kb-${Date.now()}`,
      name,
      description,
      access,
      members: [initialMembers[0]], // Creator as owner
      permissions: {
        allowSubDocs: true,
        allowRealtime: true,
        forceReview: false,
        watermark: false,
      },
      createdAt: new Date().toISOString().split('T')[0],
    };
    setState(prev => ({
      ...prev,
      knowledgeBases: [...prev.knowledgeBases, newKB],
      selectedKBId: newKB.id,
      view: 'management',
      managementTab: 'members',
    }));
  };

  const selectKB = (id: string) => {
    setState(prev => ({ ...prev, selectedKBId: id }));
  };

  const setView = (view: 'workbench' | 'management' | 'trash' | 'editor') => {
    setState(prev => ({ ...prev, view }));
  };

  const setManagementTab = (tab: ManagementTab) => {
    setState(prev => ({ ...prev, managementTab: tab }));
  };

  const updateKB = (kbId: string, updates: Partial<KnowledgeBase>) => {
    setState(prev => ({
      ...prev,
      knowledgeBases: prev.knowledgeBases.map(kb => 
        kb.id === kbId ? { ...kb, ...updates } : kb
      ),
    }));
  };

  const deleteKB = (kbId: string) => {
    setState(prev => {
      const newKBs = prev.knowledgeBases.filter(kb => kb.id !== kbId);
      return {
        ...prev,
        knowledgeBases: newKBs,
        selectedKBId: newKBs.length > 0 ? newKBs[0].id : null,
        view: newKBs.length > 0 ? prev.view : 'workbench',
      };
    });
  };

  const updateKBMembers = (kbId: string, members: Member[]) => {
    setState(prev => ({
      ...prev,
      knowledgeBases: prev.knowledgeBases.map(kb => 
        kb.id === kbId ? { ...kb, members } : kb
      ),
    }));
  };

  const removeMember = (kbId: string, memberId: string) => {
    setState(prev => ({
      ...prev,
      knowledgeBases: prev.knowledgeBases.map(kb => 
        kb.id === kbId ? { ...kb, members: kb.members.filter(m => m.id !== memberId) } : kb
      ),
    }));
  };

  const updateMemberRole = (kbId: string, memberId: string, role: Role) => {
    setState(prev => ({
      ...prev,
      knowledgeBases: prev.knowledgeBases.map(kb => 
        kb.id === kbId ? { 
          ...kb, 
          members: kb.members.map(m => m.id === memberId ? { ...m, role } : m) 
        } : kb
      ),
    }));
  };

  const openEditor = (title: string) => {
    setState(prev => ({ ...prev, view: 'editor', currentDocTitle: title }));
  };

  const closeEditor = () => {
    setState(prev => ({ ...prev, view: 'workbench', currentDocTitle: undefined }));
  };

  return (
    <AppContext.Provider value={{ 
      state, 
      isCreateModalOpen,
      setIsCreateModalOpen,
      isCreateDocModalOpen,
      setIsCreateDocModalOpen,
      isTemplateGalleryOpen,
      setIsTemplateGalleryOpen,
      createKB, 
      selectKB, 
      setView, 
      setManagementTab,
      updateKB,
      deleteKB,
      updateKBMembers, 
      removeMember,
      updateMemberRole,
      openEditor,
      closeEditor
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
