export type Role = 'OWNER' | 'ADMIN' | 'MEMBER' | 'VIEWER';

export interface Member {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: Role;
  lastActive: string;
}

export type AccessLevel = 'PUBLIC' | 'TEAM' | 'PRIVATE';

export interface PermissionSettings {
  allowSubDocs: boolean;
  allowRealtime: boolean;
  forceReview: boolean;
  watermark: boolean;
}

export interface KnowledgeBase {
  id: string;
  name: string;
  description: string;
  access: AccessLevel;
  members: Member[];
  permissions: PermissionSettings;
  createdAt: string;
}

export type ManagementTab = 'docs' | 'info' | 'members' | 'permissions' | 'export' | 'audit';

export interface AppState {
  knowledgeBases: KnowledgeBase[];
  selectedKBId: string | null;
  view: 'workbench' | 'management' | 'trash' | 'editor';
  managementTab: ManagementTab;
  currentDocTitle?: string;
  currentDocContent?: string;
}
