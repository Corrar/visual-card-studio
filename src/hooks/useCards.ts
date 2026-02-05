import { useState, useCallback } from 'react';
import { CardData, Priority, ChecklistItem, Tag, ChecklistGroup, CardNote } from '@/types/card';

const generateId = () => Math.random().toString(36).substring(2, 9);

const initialCards: CardData[] = [
  {
    id: generateId(),
    title: 'Bem-vindo ao TaskFlow',
    description: 'Organize suas ideias de forma visual e intuitiva. Clique no botão + para criar seu primeiro card.',
    priority: 'medium',
    checklist: [
      { id: generateId(), text: 'Criar primeiro card', completed: false },
      { id: generateId(), text: 'Explorar funcionalidades', completed: true },
    ],
    checklistGroups: [],
    tags: [
      { id: generateId(), name: 'Início', color: 'bg-blue-500' },
    ],
    notes: [],
    imageUrl: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=200&fit=crop',
    createdAt: new Date(),
    completed: false,
  },
  {
    id: generateId(),
    title: 'Adicione tags para organizar',
    description: 'Use tags coloridas para categorizar e filtrar seus cards de forma eficiente.',
    priority: 'low',
    checklist: [
      { id: generateId(), text: 'Criar tags personalizadas', completed: false },
    ],
    checklistGroups: [],
    tags: [
      { id: generateId(), name: 'Dica', color: 'bg-emerald-500' },
      { id: generateId(), name: 'Produtividade', color: 'bg-violet-500' },
    ],
    notes: [],
    imageUrl: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=400&h=200&fit=crop',
    createdAt: new Date(),
    completed: false,
  },
  {
    id: generateId(),
    title: 'Tarefa Urgente!',
    description: 'Este é um exemplo de card com prioridade urgente. Note o destaque visual.',
    priority: 'urgent',
    checklist: [
      { id: generateId(), text: 'Resolver imediatamente', completed: false },
      { id: generateId(), text: 'Notificar equipe', completed: false },
    ],
    checklistGroups: [],
    tags: [
      { id: generateId(), name: 'Importante', color: 'bg-red-500' },
    ],
    notes: [],
    createdAt: new Date(),
    completed: false,
  },
  {
    id: generateId(),
    title: 'Design Moderno',
    description: 'Interface limpa e minimalista para melhor foco e produtividade.',
    priority: 'high',
    checklist: [],
    checklistGroups: [],
    tags: [
      { id: generateId(), name: 'UI/UX', color: 'bg-pink-500' },
    ],
    notes: [],
    createdAt: new Date(),
    completed: false,
  },
];

const groupColors = [
  'bg-blue-500',
  'bg-emerald-500',
  'bg-violet-500',
  'bg-orange-500',
  'bg-pink-500',
  'bg-cyan-500',
];

export const useCards = () => {
  const [cards, setCards] = useState<CardData[]>(initialCards);

  const addCard = useCallback((
    title: string,
    description: string,
    priority: Priority,
    checklist: ChecklistItem[],
    tags: Tag[],
    imageUrl?: string,
    dueDate?: Date
  ) => {
    const newCard: CardData = {
      id: generateId(),
      title,
      description,
      priority,
      checklist,
      checklistGroups: [],
      tags,
      notes: [],
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
    priority: Priority,
    checklist: ChecklistItem[],
    tags: Tag[],
    imageUrl?: string,
    dueDate?: Date
  ) => {
    setCards((prev) =>
      prev.map((card) =>
        card.id === id ? { ...card, title, description, priority, checklist, tags, imageUrl, dueDate } : card
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
        checklistGroups: cardToDuplicate.checklistGroups.map(group => ({
          ...group,
          id: generateId(),
        })),
        tags: cardToDuplicate.tags.map(tag => ({
          ...tag,
          id: generateId(),
        })),
        notes: [],
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

  const archiveCard = useCallback((id: string) => {
    setCards((prev) => prev.filter((card) => card.id !== id));
  }, []);

  // New functions for enhanced card management
  const addNote = useCallback((cardId: string, content: string) => {
    setCards((prev) =>
      prev.map((card) =>
        card.id === cardId
          ? {
              ...card,
              notes: [
                ...card.notes,
                { id: generateId(), content, createdAt: new Date() },
              ],
            }
          : card
      )
    );
  }, []);

  const deleteNote = useCallback((cardId: string, noteId: string) => {
    setCards((prev) =>
      prev.map((card) =>
        card.id === cardId
          ? {
              ...card,
              notes: card.notes.filter((note) => note.id !== noteId),
            }
          : card
      )
    );
  }, []);

  const addChecklistItem = useCallback((cardId: string, text: string, groupId?: string) => {
    setCards((prev) =>
      prev.map((card) =>
        card.id === cardId
          ? {
              ...card,
              checklist: [
                ...card.checklist,
                { id: generateId(), text, completed: false, groupId },
              ],
            }
          : card
      )
    );
  }, []);

  const deleteChecklistItem = useCallback((cardId: string, itemId: string) => {
    setCards((prev) =>
      prev.map((card) =>
        card.id === cardId
          ? {
              ...card,
              checklist: card.checklist.filter((item) => item.id !== itemId),
            }
          : card
      )
    );
  }, []);

  const addChecklistGroup = useCallback((cardId: string, name: string) => {
    setCards((prev) =>
      prev.map((card) => {
        if (card.id !== cardId) return card;
        const colorIndex = card.checklistGroups.length % groupColors.length;
        return {
          ...card,
          checklistGroups: [
            ...card.checklistGroups,
            { id: generateId(), name, color: groupColors[colorIndex] },
          ],
        };
      })
    );
  }, []);

  const deleteChecklistGroup = useCallback((cardId: string, groupId: string) => {
    setCards((prev) =>
      prev.map((card) =>
        card.id === cardId
          ? {
              ...card,
              checklistGroups: card.checklistGroups.filter((g) => g.id !== groupId),
              checklist: card.checklist.map((item) =>
                item.groupId === groupId ? { ...item, groupId: undefined } : item
              ),
            }
          : card
      )
    );
  }, []);

  const updateEstimatedTime = useCallback((cardId: string, minutes: number) => {
    setCards((prev) =>
      prev.map((card) =>
        card.id === cardId
          ? { ...card, estimatedTime: minutes }
          : card
      )
    );
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
    archiveCard,
    addNote,
    deleteNote,
    addChecklistItem,
    deleteChecklistItem,
    addChecklistGroup,
    deleteChecklistGroup,
    updateEstimatedTime,
  };
};
