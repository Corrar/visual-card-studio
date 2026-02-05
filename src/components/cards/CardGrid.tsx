import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { CardData } from '@/types/card';
import { SortableCard } from './SortableCard';
import { InfoCard } from './InfoCard';

interface CardGridProps {
  cards: CardData[];
  onReorder: (sourceIndex: number, destinationIndex: number) => void;
  onEdit: (card: CardData) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onToggleChecklistItem: (cardId: string, itemId: string) => void;
  onToggleCompleted: (cardId: string) => void;
  onArchive?: (id: string) => void;
  onExpand?: (card: CardData) => void;
}

export const CardGrid = ({
  cards,
  onReorder,
  onEdit,
  onDelete,
  onDuplicate,
  onToggleChecklistItem,
  onToggleCompleted,
  onArchive,
  onExpand,
}: CardGridProps) => {
  const [activeCard, setActiveCard] = useState<CardData | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const card = cards.find((c) => c.id === active.id);
    if (card) {
      setActiveCard(card);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveCard(null);

    if (over && active.id !== over.id) {
      const oldIndex = cards.findIndex((card) => card.id === active.id);
      const newIndex = cards.findIndex((card) => card.id === over.id);
      onReorder(oldIndex, newIndex);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={cards.map((c) => c.id)} strategy={rectSortingStrategy}>
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 stagger-animation"
          role="feed"
          aria-label="Cards"
        >
          {cards.map((card, index) => (
            <SortableCard
              key={card.id}
              card={card}
              onEdit={onEdit}
              onDelete={onDelete}
              onDuplicate={onDuplicate}
              onToggleChecklistItem={onToggleChecklistItem}
              onToggleCompleted={onToggleCompleted}
              onArchive={onArchive}
              onExpand={onExpand}
              index={index}
            />
          ))}
        </div>
      </SortableContext>

      <DragOverlay dropAnimation={{
        duration: 250,
        easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
      }}>
        {activeCard ? (
          <div className="rotate-3 scale-105 opacity-95 shadow-2xl">
            <InfoCard
              card={activeCard}
              onEdit={() => {}}
              onDelete={() => {}}
              onDuplicate={() => {}}
              onToggleChecklistItem={() => {}}
              onToggleCompleted={() => {}}
              index={0}
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};
