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
    imageUrl: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=200&fit=crop',
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
    imageUrl: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=400&h=200&fit=crop',
    createdAt: new Date(),
    completed: false,
  },
  {
    id: generateId(),
    title: 'Tarefa Urgente!',
    description: 'Este é um exemplo de card com prioridade urgente. Note a cor destacada.',
    category: 'pink',
    priority: 'urgent',
    checklist: [
      { id: generateId(), text: 'Resolver imediatamente', completed: false },
      { id: generateId(), text: 'Notificar equipe', completed: false },
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
    checklist: ChecklistItem[],
    imageUrl?: string,
    dueDate?: Date
  ) => {
    const newCard: CardData = {
      id: generateId(),
      title,
      description,
      category,
      priority,
      checklist,
      imageUrl,
      dueDate,
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
    checklist: ChecklistItem[],
    imageUrl?: string,
    dueDate?: Date
  ) => {
    setCards((prev) =>
      prev.map((card) =>
        card.id === id ? { ...card, title, description, category, priority, checklist, imageUrl, dueDate } : card
      )
    );
  }, []);

  const deleteCard = useCallback((id: string) => {
    setCards((prev) => prev.filter((card) => card.id !== id));
  }, []);

  const duplicateCard = useCallback((id: string) => {
    setCards((prev) => {
      const cardToDuplicate = prev.find((card) => card.id === id);
      if (!cardToDuplicate) return prev;
      
      const duplicatedCard: CardData = {
        ...cardToDuplicate,
        id: generateId(),
        title: `${cardToDuplicate.title} (cópia)`,
        checklist: cardToDuplicate.checklist.map(item => ({
          ...item,
          id: generateId(),
          completed: false,
        })),
        createdAt: new Date(),
        completed: false,
        completedAt: undefined,
      };
      
      const index = prev.findIndex((card) => card.id === id);
      const newCards = [...prev];
      newCards.splice(index + 1, 0, duplicatedCard);
      return newCards;
    });
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

  const reorderCards = useCallback((sourceIndex: number, destinationIndex: number) => {
    setCards((prev) => {
      const result = Array.from(prev);
      const [removed] = result.splice(sourceIndex, 1);
      result.splice(destinationIndex, 0, removed);
      return result;
    });
  }, []);

  return { 
    cards, 
    addCard, 
    updateCard, 
    deleteCard, 
    duplicateCard,
    toggleChecklistItem, 
    toggleCardCompleted,
    reorderCards,
  };
};
