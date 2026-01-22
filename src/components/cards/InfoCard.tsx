import { CardData, CategoryColor } from '@/types/card';
import { Pencil, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InfoCardProps {
  card: CardData;
  onEdit: (card: CardData) => void;
  onDelete: (id: string) => void;
  index: number;
}

const categoryColorClasses: Record<CategoryColor, string> = {
  blue: 'bg-category-blue',
  green: 'bg-category-green',
  orange: 'bg-category-orange',
  pink: 'bg-category-pink',
  purple: 'bg-category-purple',
  teal: 'bg-category-teal',
};

const categoryBgClasses: Record<CategoryColor, string> = {
  blue: 'bg-category-blue/10',
  green: 'bg-category-green/10',
  orange: 'bg-category-orange/10',
  pink: 'bg-category-pink/10',
  purple: 'bg-category-purple/10',
  teal: 'bg-category-teal/10',
};

export const InfoCard = ({ card, onEdit, onDelete, index }: InfoCardProps) => {
  return (
    <article
      className={cn(
        'group relative bg-card rounded-xl p-5 card-shadow transition-all duration-300',
        'hover:card-shadow-hover hover:-translate-y-1',
        'animate-slide-up overflow-hidden'
      )}
      style={{ animationDelay: `${index * 50}ms` }}
      role="article"
      aria-label={`Card: ${card.title}`}
    >
      {/* Category indicator */}
      <div
        className={cn('category-indicator', categoryColorClasses[card.category])}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="pl-3">
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="font-semibold text-card-foreground text-lg leading-tight line-clamp-2">
            {card.title}
          </h3>
          
          {/* Actions */}
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={() => onEdit(card)}
              className="p-2 rounded-lg hover:bg-secondary transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              aria-label={`Editar ${card.title}`}
            >
              <Pencil className="w-4 h-4 text-muted-foreground" />
            </button>
            <button
              onClick={() => onDelete(card.id)}
              className="p-2 rounded-lg hover:bg-destructive/10 transition-colors focus:outline-none focus:ring-2 focus:ring-destructive focus:ring-offset-2"
              aria-label={`Excluir ${card.title}`}
            >
              <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
            </button>
          </div>
        </div>

        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 mb-4">
          {card.description}
        </p>

        {/* Category badge */}
        <span
          className={cn(
            'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium capitalize',
            categoryBgClasses[card.category],
            'text-card-foreground'
          )}
        >
          {card.category}
        </span>
      </div>
    </article>
  );
};
