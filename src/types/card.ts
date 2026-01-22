export type CategoryColor = 'blue' | 'green' | 'orange' | 'pink' | 'purple' | 'teal';

export interface CardData {
  id: string;
  title: string;
  description: string;
  category: CategoryColor;
  createdAt: Date;
}
