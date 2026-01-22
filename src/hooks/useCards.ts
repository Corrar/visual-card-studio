import { useState, useCallback } from 'react';
import { CardData, CategoryColor, Priority, ChecklistItem } from '@/types/card';

const generateId = () => Math.random().toString(36).substring(2, 9);

const initialCards: CardData[] = [
  {
    id: generateId(),
    title: 'Bem-vindo ao Card Manager',
    description: 'Organize suas ideias de forma visual e intuitiva. Clique no botão + para criar seu primeiro card.',
    category: 'blue',
    priority: 'medium',
    checklist: [
      { id: generateId(), text: 'Criar primeiro card', completed: false },
      { id: generateId(), text: 'Explorar categorias', completed: true },
    ],
    createdAt: new Date(),
    completed: false,
  },
  {
    id: generateId(),
    title: 'Categorize com cores',
    description: 'Use cores diferentes para organizar seus cards por tipo ou prioridade.',
    category: 'green',
    priority: 'low',
    checklist: [
      { id: generateId(), text: 'Escolher categoria favorita', completed: false },
    ],
    createdAt: new Date(),
    completed: false,
  },
  {
    id: generateId(),
    title: 'Design Moderno',
    description: 'Interface limpa e minimalista para melhor foco e produtividade.',
    category: 'purple',
    priority: 'high',
    checklist: [],
    createdAt: new Date(),
    completed: false,
  },
];

export const useCards = () => {
  const [cards, setCards] = useState<CardData[]>(initialCards);

  const addCard = useCallback((
    title: string,
    description: string,
    category: CategoryColor,
    priority: Priority,
    checklist: ChecklistItem[]
  ) => {
    const newCard: CardData = {
      id: generateId(),
      title,
      description,
      category,
      priority,
      checklist,
      createdAt: new Date(),
      completed: false,
    };
    setCards((prev) => [newCard, ...prev]);
  }, []);

  const updateCard = useCallback((
    id: string,
    title: string,
    description: string,
    category: CategoryColor,
    priority: Priority,
    checklist: ChecklistItem[]
  ) => {
    setCards((prev) =>
      prev.map((card) =>
        card.id === id ? { ...card, title, description, category, priority, checklist } : card
      )
    );
  }, []);

  const deleteCard = useCallback((id: string) => {
    setCards((prev) => prev.filter((card) => card.id !== id));
  }, []);

  const toggleChecklistItem = useCallback((cardId: string, itemId: string) => {
    setCards((prev) =>
      prev.map((card) =>
        card.id === cardId
          ? {
              ...card,
              checklist: card.checklist.map((item) =>
                item.id === itemId ? { ...item, completed: !item.completed } : item
              ),
            }
          : card
      )
    );
  }, []);

  const toggleCardCompleted = useCallback((cardId: string) => {
    setCards((prev) =>
      prev.map((card) =>
        card.id === cardId
          ? {
              ...card,
              completed: !card.completed,
              completedAt: !card.completed ? new Date() : undefined,
            }
          : card
      )
    );
  }, []);

  return { cards, addCard, updateCard, deleteCard, toggleChecklistItem, toggleCardCompleted };
};
