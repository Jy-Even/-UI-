/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { motion } from 'motion/react';
import TopNav from './components/TopNav';
import Sidebar from './components/Sidebar';
import MemberManagement from './components/MemberManagement';
import PermissionSettings from './components/PermissionSettings';
import InfoSettings from './components/InfoSettings';
import DataExport from './components/DataExport';
import CreateKBModal from './components/CreateKBModal';
import Workbench from './components/Workbench';
import DocumentManagement from './components/DocumentManagement';
import Trash from './components/Trash';
import DocumentEditor from './components/DocumentEditor';
import VersionHistory from './components/VersionHistory';
import CreateDocModal from './components/CreateDocModal';
import AllKnowledgeBases from './components/AllKnowledgeBases';
import NotificationsView from './components/NotificationsView';
import TemplateGalleryModal from './components/TemplateGalleryModal';
import { AppProvider, useApp } from './AppContext';

function AppContent() {
  const { state, setView, setManagementTab, isCreateModalOpen, setIsCreateModalOpen, setIsCreateDocModalOpen } = useApp();

  const selectedKB = state.knowledgeBases.find(kb => kb.id === state.selectedKBId);

  if (state.view === 'editor') {
    return <DocumentEditor />;
  }

  if (state.view === 'version-history') {
    return (
      <VersionHistory 
        onBack={() => setView(state.lastView || 'workbench')} 
        documentTitle={state.currentDocTitle || '未命名文档'} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <TopNav />
      
      <div className="flex pt-16 h-screen overflow-hidden">
        <Sidebar onCreateNew={() => setIsCreateDocModalOpen(true)} />
        
        <main className="flex-1 ml-[260px] overflow-y-auto bg-[#F8F9FA] custom-scrollbar">
          {state.view === 'workbench' && <Workbench />}
          {state.view === 'all-kbs' && <AllKnowledgeBases />}
          {state.view === 'notifications' && <NotificationsView />}
          {state.view === 'trash' && <Trash />}
          {state.view === 'management' && (
            <div className="min-h-full flex flex-col">
              {/* Context Header & Top Tabs */}
              <div className="bg-white px-12 pt-10 pb-0 sticky top-0 z-40 border-b border-gray-100">
                <div className="mb-8">
                  <nav className="flex items-center text-xs font-bold text-gray-400 gap-2 mb-3 uppercase tracking-widest">
                    <button onClick={() => setView('workbench')} className="hover:text-gray-900 transition-colors">我的空间</button>
                    <span className="text-gray-200">/</span>
                    <span className="text-gray-900">{selectedKB?.name}</span>
                  </nav>
                  <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                    {state.managementTab === 'docs' && '文档管理'}
                    {state.managementTab === 'info' && '信息设置'}
                    {state.managementTab === 'members' && '成员管理'}
                    {state.managementTab === 'permissions' && '权限配置'}
                    {state.managementTab === 'export' && '数据导出'}
                    {state.managementTab === 'audit' && '安全审计'}
                  </h1>
                </div>
                
                <div className="flex gap-8">
                  <TabButton 
                    active={state.managementTab === 'docs'} 
                    onClick={() => setManagementTab('docs')}
                    label="文档列表"
                  />
                  <TabButton 
                    active={state.managementTab === 'members'} 
                    onClick={() => setManagementTab('members')}
                    label="成员权限"
                  />
                  <TabButton 
                    active={state.managementTab === 'info'} 
                    onClick={() => setManagementTab('info')}
                    label="基础设置"
                  />
                  <TabButton 
                    active={state.managementTab === 'permissions'} 
                    onClick={() => setManagementTab('permissions')}
                    label="高级权限"
                  />
                  <TabButton 
                    active={state.managementTab === 'export'} 
                    onClick={() => setManagementTab('export')}
                    label="数据导出"
                  />
                  <TabButton 
                    active={state.managementTab === 'audit'} 
                    onClick={() => setManagementTab('audit')}
                    label="安全审计"
                  />
                </div>
              </div>

              <div className="p-12 max-w-7xl mx-auto w-full flex-1">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  {state.managementTab === 'docs' && <DocumentManagement />}
                  {state.managementTab === 'info' && <InfoSettings />}
                  {state.managementTab === 'members' && <MemberManagement />}
                  {state.managementTab === 'permissions' && <PermissionSettings />}
                  {state.managementTab === 'export' && <DataExport />}
                  {state.managementTab === 'audit' && (
                    <div className="flex flex-col items-center justify-center py-32 text-gray-400">
                      <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mb-6">
                        <span className="material-symbols-outlined text-4xl">security</span>
                      </div>
                      <p className="text-xl font-bold text-gray-900 mb-2">安全审计</p>
                      <p className="text-gray-500">该功能正在开发中，敬请期待...</p>
                    </div>
                  )}
                </motion.div>
              </div>
            </div>
          )}
        </main>
      </div>

      <CreateKBModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
      <CreateDocModal />
      <TemplateGalleryModal />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

function TabButton({ active, onClick, label }: { active: boolean, onClick: () => void, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`pb-4 text-sm font-bold transition-all relative ${
        active ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'
      }`}
    >
      {label}
      {active && (
        <motion.div 
          layoutId="activeTab"
          className="absolute bottom-0 left-0 right-0 h-1 bg-gray-900 rounded-full" 
        />
      )}
    </button>
  );
}
