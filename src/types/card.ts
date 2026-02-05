export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
  groupId?: string;
}

export interface ChecklistGroup {
  id: string;
  name: string;
  color: string;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface CardNote {
  id: string;
  content: string;
  createdAt: Date;
}

export interface CardData {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  checklist: ChecklistItem[];
  checklistGroups: ChecklistGroup[];
  tags: Tag[];
  notes: CardNote[];
  imageUrl?: string;
  dueDate?: Date;
  createdAt: Date;
  completed: boolean;
  completedAt?: Date;
  estimatedTime?: number; // in minutes
  actualTime?: number; // in minutes
}

export type PriorityFilter = 'all' | Priority;
