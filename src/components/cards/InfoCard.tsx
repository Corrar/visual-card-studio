import { CardData, CategoryColor, Priority } from '@/types/card';
import { Pencil, Trash2, CheckCircle2, Circle, Flag, AlertTriangle, AlertCircle, Minus, Check, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InfoCardProps {
  card: CardData;
  onEdit: (card: CardData) => void;
  onDelete: (id: string) => void;
  onToggleChecklistItem: (cardId: string, itemId: string) => void;
  onToggleCompleted: (cardId: string) => void;
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

const priorityConfig: Record<Priority, { label: string; color: string; bgColor: string; borderColor: string; icon: typeof Flag }> = {
  low: { label: 'Baixa', color: 'text-priority-low', bgColor: 'bg-priority-low/10', borderColor: 'border-priority-low/30', icon: Minus },
  medium: { label: 'Média', color: 'text-priority-medium', bgColor: 'bg-priority-medium/10', borderColor: 'border-priority-medium/30', icon: Flag },
  high: { label: 'Alta', color: 'text-priority-high', bgColor: 'bg-priority-high/10', borderColor: 'border-priority-high/30', icon: AlertTriangle },
  urgent: { label: 'Urgente', color: 'text-priority-urgent', bgColor: 'bg-priority-urgent/10', borderColor: 'border-priority-urgent/30', icon: AlertCircle },
};

export const InfoCard = ({ card, onEdit, onDelete, onToggleChecklistItem, onToggleCompleted, index }: InfoCardProps) => {
  const priority = priorityConfig[card.priority];
  const PriorityIcon = priority.icon;
  const completedCount = card.checklist.filter(item => item.completed).length;
  const totalCount = card.checklist.length;
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <article
      className={cn(
        'group relative rounded-2xl p-5 card-shadow transition-all duration-300',
        'hover:card-shadow-hover hover:-translate-y-1',
        'animate-slide-up overflow-hidden border-2',
        'focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2',
        priority.borderColor,
        priority.bgColor,
        card.completed && 'opacity-75'
      )}
      style={{ animationDelay: `${index * 50}ms` }}
      role="article"
      aria-label={`Card: ${card.title}, Prioridade: ${priority.label}${card.completed ? ', Concluído' : ''}`}
      tabIndex={0}
    >
      {/* Category indicator */}
      <div
        className={cn('category-indicator', categoryColorClasses[card.category])}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="pl-4">
        {/* Header with priority and actions */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            {/* Priority badge */}
            <div className="flex items-center gap-2 mb-2">
              <span
                className={cn(
                  'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-semibold',
                  priority.bgColor,
                  priority.color
                )}
                role="status"
                aria-label={`Prioridade: ${priority.label}`}
              >
                <PriorityIcon className="w-3 h-3" aria-hidden="true" />
                {priority.label}
              </span>
            </div>

            <h3 className="font-semibold text-card-foreground text-lg leading-tight line-clamp-2">
              {card.title}
            </h3>
          </div>

          {/* Actions */}
          <div 
            className="flex gap-1 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-200"
            role="group"
            aria-label="Ações do card"
          >
            <button
              onClick={() => onToggleCompleted(card.id)}
              className={cn(
                'p-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                card.completed ? 'hover:bg-secondary bg-secondary/50' : 'hover:bg-primary/10'
              )}
              aria-label={card.completed ? `Reabrir ${card.title}` : `Marcar ${card.title} como pronto`}
              title={card.completed ? 'Reabrir card' : 'Marcar como pronto'}
            >
              {card.completed ? (
                <RotateCcw className="w-4 h-4 text-muted-foreground" />
              ) : (
                <Check className="w-4 h-4 text-primary" />
              )}
            </button>
            <button
              onClick={() => onEdit(card)}
              className="p-2 rounded-lg hover:bg-secondary transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              aria-label={`Editar ${card.title}`}
              title="Editar card"
            >
              <Pencil className="w-4 h-4 text-muted-foreground" />
            </button>
            <button
              onClick={() => onDelete(card.id)}
              className="p-2 rounded-lg hover:bg-destructive/10 transition-colors focus:outline-none focus:ring-2 focus:ring-destructive focus:ring-offset-2"
              aria-label={`Excluir ${card.title}`}
              title="Excluir card"
            >
              <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
            </button>
          </div>
        </div>

        {card.description && (
          <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2 mb-4">
            {card.description}
          </p>
        )}

        {/* Checklist section */}
        {card.checklist.length > 0 && (
          <div className="mb-4 space-y-2">
            {/* Progress bar */}
            <div className="flex items-center gap-2 mb-2">
              <div 
                className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden"
                role="progressbar"
                aria-valuenow={completedCount}
                aria-valuemin={0}
                aria-valuemax={totalCount}
                aria-label={`Progresso: ${completedCount} de ${totalCount} itens concluídos`}
              >
                <div 
                  className="h-full bg-primary rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground font-medium whitespace-nowrap">
                {completedCount}/{totalCount}
              </span>
            </div>

            {/* Checklist items */}
            <ul className="space-y-1.5" aria-label="Checklist">
              {card.checklist.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => onToggleChecklistItem(card.id, item.id)}
                    className={cn(
                      'w-full flex items-start gap-2.5 p-2 rounded-lg text-left transition-all duration-200',
                      'hover:bg-secondary/60 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1',
                      item.completed && 'opacity-60'
                    )}
                    aria-pressed={item.completed}
                    aria-label={`${item.completed ? 'Desmarcar' : 'Marcar como concluído'}: ${item.text}`}
                  >
                    {item.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" aria-hidden="true" />
                    ) : (
                      <Circle className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" aria-hidden="true" />
                    )}
                    <span 
                      className={cn(
                        'text-sm leading-tight',
                        item.completed && 'line-through text-muted-foreground'
                      )}
                    >
                      {item.text}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Footer with category */}
        <div className="flex items-center gap-2 pt-2 border-t border-border/50">
          <span
            className={cn(
              'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium capitalize',
              categoryBgClasses[card.category],
              'text-card-foreground'
            )}
          >
            <span className={cn('w-2 h-2 rounded-full mr-1.5', categoryColorClasses[card.category])} />
            {card.category}
          </span>
        </div>
      </div>
    </article>
  );
};
