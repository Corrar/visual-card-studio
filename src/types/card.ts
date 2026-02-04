export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface CardData {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  checklist: ChecklistItem[];
  tags: Tag[];
  imageUrl?: string;
  dueDate?: Date;
  createdAt: Date;
  completed: boolean;
  completedAt?: Date;
}

export type PriorityFilter = 'all' | Priority;
