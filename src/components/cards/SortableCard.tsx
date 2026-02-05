import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { CardData } from '@/types/card';
import { InfoCard } from './InfoCard';
import { GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SortableCardProps {
  card: CardData;
  onEdit: (card: CardData) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onToggleChecklistItem: (cardId: string, itemId: string) => void;
  onToggleCompleted: (cardId: string) => void;
  onArchive?: (id: string) => void;
  index: number;
}

export const SortableCard = ({
  card,
  onEdit,
  onDelete,
  onDuplicate,
  onToggleChecklistItem,
  onToggleCompleted,
  onArchive,
  index,
}: SortableCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'relative group/drag',
        isDragging && 'z-50 opacity-90 scale-105 rotate-2 shadow-2xl'
      )}
    >
      {/* Drag handle */}
      <div
        {...attributes}
        {...listeners}
        className={cn(
          'absolute -left-2 top-1/2 -translate-y-1/2 z-10',
          'p-1.5 rounded-lg bg-background border shadow-sm cursor-grab active:cursor-grabbing',
          'opacity-0 group-hover/drag:opacity-100 transition-all duration-300',
          'hover:bg-muted hover:scale-110',
          'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1',
          isDragging && 'opacity-100'
        )}
        aria-label="Arrastar para reorganizar"
      >
        <GripVertical className="w-4 h-4 text-muted-foreground" />
      </div>

      <InfoCard
        card={card}
        onEdit={onEdit}
        onDelete={onDelete}
        onDuplicate={onDuplicate}
        onToggleChecklistItem={onToggleChecklistItem}
        onToggleCompleted={onToggleCompleted}
        onArchive={onArchive}
        index={index}
      />
    </div>
  );
};
