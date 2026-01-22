export type CategoryColor = 'blue' | 'green' | 'orange' | 'pink' | 'purple' | 'teal';

export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface CardData {
  id: string;
  title: string;
  description: string;
  category: CategoryColor;
  priority: Priority;
  checklist: ChecklistItem[];
  createdAt: Date;
}
