/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import TopNav from './components/TopNav';
import Sidebar from './components/Sidebar';
import MemberManagement from './components/MemberManagement';
import PermissionSettings from './components/PermissionSettings';
import InfoSettings from './components/InfoSettings';
import DataExport from './components/DataExport';
import CreateKBModal from './components/CreateKBModal';
import Workbench from './components/Workbench';
import { AppProvider, useApp } from './AppContext';

function AppContent() {
  const { state, setView, setManagementTab } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const selectedKB = state.knowledgeBases.find(kb => kb.id === state.selectedKBId);

  return (
    <div className="min-h-screen bg-surface">
      <TopNav />
      
      <div className="flex pt-14 h-screen overflow-hidden">
        <Sidebar onCreateNew={() => setIsModalOpen(true)} />
        
        <main className="flex-1 ml-[240px] overflow-y-auto bg-surface custom-scrollbar">
          {state.view === 'workbench' ? (
            <Workbench />
          ) : (
            <>
              {/* Context Header & Top Tabs */}
              <div className="bg-surface-container-lowest px-10 pt-8 pb-0 sticky top-0 z-40 border-b border-outline-variant/5">
                <div className="mb-6">
                  <nav className="flex text-xs text-on-surface-variant/40 gap-2 mb-2">
                    <button onClick={() => setView('workbench')} className="hover:text-primary-container">我的空间</button>
                    <span>/</span>
                    <span>{selectedKB?.name}</span>
                  </nav>
                  <h1 className="text-2xl font-extrabold font-headline text-on-surface tracking-tight">
                    {state.managementTab === 'info' && '信息设置'}
                    {state.managementTab === 'members' && '成员管理'}
                    {state.managementTab === 'permissions' && '权限配置'}
                    {state.managementTab === 'export' && '数据导出'}
                    {state.managementTab === 'audit' && '安全审计'}
                  </h1>
                </div>
                
                <div className="flex gap-10">
                  <TabButton 
                    active={state.managementTab === 'info'} 
                    onClick={() => setManagementTab('info')}
                    label="信息设置"
                  />
                  <TabButton 
                    active={state.managementTab === 'members'} 
                    onClick={() => setManagementTab('members')}
                    label="成员管理"
                  />
                  <TabButton 
                    active={state.managementTab === 'permissions'} 
                    onClick={() => setManagementTab('permissions')}
                    label="权限设置"
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

              <div className="p-10 max-w-6xl">
                {state.managementTab === 'info' && <InfoSettings />}
                {state.managementTab === 'members' && <MemberManagement />}
                {state.managementTab === 'permissions' && <PermissionSettings />}
                {state.managementTab === 'export' && <DataExport />}
                {state.managementTab === 'audit' && (
                  <div className="flex flex-col items-center justify-center py-20 text-on-surface-variant/40">
                    <p className="text-lg font-medium">安全审计功能正在开发中...</p>
                  </div>
                )}
              </div>
            </>
          )}
        </main>
      </div>

      <CreateKBModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      
      {/* Floating Action Button for Demo */}
      <button 
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-8 right-8 w-14 h-14 bg-primary-container text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform z-50"
      >
        <span className="material-symbols-outlined">add</span>
      </button>
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
      className={`pb-4 text-sm font-medium transition-all relative ${
        active ? 'text-primary-container font-bold' : 'text-on-surface-variant/60 hover:text-primary-container'
      }`}
    >
      {label}
      {active && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-container rounded-full" />
      )}
    </button>
  );
}
