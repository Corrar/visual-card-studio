import { useState } from 'react';
import { CardData, Priority, ChecklistItem, ChecklistGroup } from '@/types/card';
import { 
  X, Calendar, Flag, Clock, CheckCircle2, Circle, 
  ChevronDown, ChevronRight, Plus, Trash2, Edit3, 
  MessageSquare, Timer, AlertCircle, AlertTriangle, 
  Minus, MoreHorizontal, GripVertical
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface CardDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  card: CardData;
  onToggleChecklistItem: (cardId: string, itemId: string) => void;
  onToggleCompleted: (cardId: string) => void;
  onEdit: (card: CardData) => void;
  onAddNote: (cardId: string, content: string) => void;
  onDeleteNote: (cardId: string, noteId: string) => void;
  onAddChecklistItem: (cardId: string, text: string, groupId?: string) => void;
  onDeleteChecklistItem: (cardId: string, itemId: string) => void;
  onAddChecklistGroup: (cardId: string, name: string) => void;
  onDeleteChecklistGroup: (cardId: string, groupId: string) => void;
  onUpdateEstimatedTime: (cardId: string, minutes: number) => void;
}

const priorityConfig: Record<Priority, { label: string; color: string; bgColor: string; icon: typeof Flag }> = {
  low: { label: 'Baixa', color: 'text-priority-low', bgColor: 'bg-priority-low', icon: Minus },
  medium: { label: 'Média', color: 'text-priority-medium', bgColor: 'bg-priority-medium', icon: Flag },
  high: { label: 'Alta', color: 'text-priority-high', bgColor: 'bg-priority-high', icon: AlertTriangle },
  urgent: { label: 'Urgente', color: 'text-priority-urgent', bgColor: 'bg-priority-urgent', icon: AlertCircle },
};

const groupColors = [
  'bg-blue-500',
  'bg-emerald-500',
  'bg-violet-500',
  'bg-orange-500',
  'bg-pink-500',
  'bg-cyan-500',
];

export const CardDetailModal = ({
  isOpen,
  onClose,
  card,
  onToggleChecklistItem,
  onToggleCompleted,
  onEdit,
  onAddNote,
  onDeleteNote,
  onAddChecklistItem,
  onDeleteChecklistItem,
  onAddChecklistGroup,
  onDeleteChecklistGroup,
  onUpdateEstimatedTime,
}: CardDetailModalProps) => {
  const [newNoteContent, setNewNoteContent] = useState('');
  const [newItemText, setNewItemText] = useState('');
  const [selectedGroupId, setSelectedGroupId] = useState<string | undefined>(undefined);
  const [newGroupName, setNewGroupName] = useState('');
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(['ungrouped']));
  const [showAddGroup, setShowAddGroup] = useState(false);
  const [estimatedTimeInput, setEstimatedTimeInput] = useState(card.estimatedTime?.toString() || '');

  const priority = priorityConfig[card.priority];
  const PriorityIcon = priority.icon;
  
  const completedCount = card.checklist.filter(item => item.completed).length;
  const totalCount = card.checklist.length;
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  // Group checklist items
  const groupedItems = card.checklist.reduce((acc, item) => {
    const groupId = item.groupId || 'ungrouped';
    if (!acc[groupId]) acc[groupId] = [];
    acc[groupId].push(item);
    return acc;
  }, {} as Record<string, ChecklistItem[]>);

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => {
      const next = new Set(prev);
      if (next.has(groupId)) {
        next.delete(groupId);
      } else {
        next.add(groupId);
      }
      return next;
    });
  };

  const handleAddNote = () => {
    if (newNoteContent.trim()) {
      onAddNote(card.id, newNoteContent.trim());
      setNewNoteContent('');
    }
  };

  const handleAddItem = () => {
    if (newItemText.trim()) {
      onAddChecklistItem(card.id, newItemText.trim(), selectedGroupId);
      setNewItemText('');
    }
  };

  const handleAddGroup = () => {
    if (newGroupName.trim()) {
      onAddChecklistGroup(card.id, newGroupName.trim());
      setNewGroupName('');
      setShowAddGroup(false);
    }
  };

  const handleUpdateTime = () => {
    const minutes = parseInt(estimatedTimeInput);
    if (!isNaN(minutes) && minutes > 0) {
      onUpdateEstimatedTime(card.id, minutes);
    }
  };

  const renderChecklistGroup = (groupId: string, items: ChecklistItem[], group?: ChecklistGroup) => {
    const isExpanded = expandedGroups.has(groupId);
    const groupCompletedCount = items.filter(i => i.completed).length;
    const groupTotalCount = items.length;
    
    return (
      <Collapsible 
        key={groupId}
        open={isExpanded}
        onOpenChange={() => toggleGroup(groupId)}
        className="space-y-2"
      >
        <CollapsibleTrigger className="w-full">
          <div className={cn(
            "flex items-center gap-2 p-3 rounded-lg transition-all duration-200",
            "hover:bg-muted/50 cursor-pointer group"
          )}>
            {isExpanded ? (
              <ChevronDown className="w-4 h-4 text-muted-foreground transition-transform" />
            ) : (
              <ChevronRight className="w-4 h-4 text-muted-foreground transition-transform" />
            )}
            
            {group && (
              <span className={cn("w-3 h-3 rounded-full", group.color)} />
            )}
            
            <span className="font-medium text-sm flex-1 text-left">
              {group?.name || 'Sem grupo'}
            </span>
            
            <span className="text-xs text-muted-foreground">
              {groupCompletedCount}/{groupTotalCount}
            </span>
            
            {group && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <button className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-secondary transition-all">
                    <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-popover border shadow-lg">
                  <DropdownMenuItem 
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteChecklistGroup(card.id, groupId);
                    }}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Excluir grupo
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </CollapsibleTrigger>
        
        <CollapsibleContent className="space-y-1 pl-6">
          {items.map((item) => (
            <div
              key={item.id}
              className={cn(
                "flex items-center gap-3 p-2 rounded-lg group transition-all duration-200",
                "hover:bg-muted/30"
              )}
            >
              <button
                onClick={() => onToggleChecklistItem(card.id, item.id)}
                className="shrink-0 transition-transform hover:scale-110"
              >
                {item.completed ? (
                  <CheckCircle2 className={cn("w-5 h-5", priority.color)} />
                ) : (
                  <Circle className="w-5 h-5 text-muted-foreground" />
                )}
              </button>
              
              <span className={cn(
                "flex-1 text-sm",
                item.completed && "line-through text-muted-foreground"
              )}>
                {item.text}
              </span>
              
              <button
                onClick={() => onDeleteChecklistItem(card.id, item.id)}
                className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-destructive/10 transition-all"
              >
                <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
              </button>
            </div>
          ))}
          
          {/* Add item to this group */}
          {groupId !== 'ungrouped' && (
            <div className="flex gap-2 pt-2">
              <Input
                value={selectedGroupId === groupId ? newItemText : ''}
                onChange={(e) => {
                  setSelectedGroupId(groupId);
                  setNewItemText(e.target.value);
                }}
                onFocus={() => setSelectedGroupId(groupId)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && selectedGroupId === groupId) {
                    handleAddItem();
                  }
                }}
                placeholder="Adicionar item..."
                className="h-8 text-sm"
              />
              <Button 
                size="sm" 
                variant="ghost"
                onClick={handleAddItem}
                disabled={selectedGroupId !== groupId || !newItemText.trim()}
                className="h-8"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          )}
        </CollapsibleContent>
      </Collapsible>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] p-0 overflow-hidden">
        <ScrollArea className="max-h-[90vh]">
          <div className="p-6">
            <DialogHeader className="mb-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <Badge className={cn("gap-1", priority.bgColor, "text-white")}>
                      <PriorityIcon className="w-3 h-3" />
                      {priority.label}
                    </Badge>
                    
                    {card.completed && (
                      <Badge variant="secondary" className="bg-primary/10 text-primary">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Concluído
                      </Badge>
                    )}
                    
                    {card.dueDate && (
                      <Badge variant="outline" className="gap-1">
                        <Calendar className="w-3 h-3" />
                        {format(card.dueDate, 'dd MMM yyyy', { locale: ptBR })}
                      </Badge>
                    )}
                  </div>
                  
                  <DialogTitle className="text-2xl font-bold">{card.title}</DialogTitle>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => onEdit(card)}>
                    <Edit3 className="w-4 h-4 mr-1" />
                    Editar
                  </Button>
                  <Button 
                    variant={card.completed ? "secondary" : "default"}
                    size="sm"
                    onClick={() => onToggleCompleted(card.id)}
                  >
                    <CheckCircle2 className="w-4 h-4 mr-1" />
                    {card.completed ? "Reabrir" : "Concluir"}
                  </Button>
                </div>
              </div>
            </DialogHeader>

            {/* Image */}
            {card.imageUrl && (
              <div className="mb-6 rounded-xl overflow-hidden">
                <img 
                  src={card.imageUrl} 
                  alt={card.title}
                  className="w-full h-48 object-cover"
                />
              </div>
            )}

            {/* Description */}
            {card.description && (
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-muted-foreground mb-2">Descrição</h4>
                <p className="text-foreground leading-relaxed">{card.description}</p>
              </div>
            )}

            {/* Tags */}
            {card.tags.length > 0 && (
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-muted-foreground mb-2">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {card.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className={cn(
                        "px-3 py-1 rounded-full text-xs font-medium text-white",
                        tag.color
                      )}
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Time Tracking */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-2">
                <Timer className="w-4 h-4" />
                Tempo Estimado
              </h4>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={estimatedTimeInput}
                  onChange={(e) => setEstimatedTimeInput(e.target.value)}
                  placeholder="Minutos"
                  className="w-24 h-9"
                />
                <span className="text-sm text-muted-foreground">minutos</span>
                <Button size="sm" variant="secondary" onClick={handleUpdateTime}>
                  Salvar
                </Button>
              </div>
            </div>

            <Separator className="my-6" />

            {/* Checklist */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Checklist
                </h4>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => setShowAddGroup(!showAddGroup)}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Novo grupo
                  </Button>
                </div>
              </div>

              {/* Progress */}
              {totalCount > 0 && (
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>Progresso</span>
                    <span>{completedCount}/{totalCount} ({Math.round(progressPercentage)}%)</span>
                  </div>
                  <Progress value={progressPercentage} className="h-2" />
                </div>
              )}

              {/* Add new group */}
              {showAddGroup && (
                <div className="flex gap-2 mb-4 p-3 bg-muted/50 rounded-lg">
                  <Input
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    placeholder="Nome do grupo..."
                    className="h-9"
                    onKeyDown={(e) => e.key === 'Enter' && handleAddGroup()}
                  />
                  <Button size="sm" onClick={handleAddGroup} disabled={!newGroupName.trim()}>
                    Criar
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setShowAddGroup(false)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}

              {/* Checklist groups */}
              <div className="space-y-2">
                {/* Ungrouped items */}
                {groupedItems['ungrouped'] && groupedItems['ungrouped'].length > 0 && (
                  renderChecklistGroup('ungrouped', groupedItems['ungrouped'])
                )}
                
                {/* Grouped items */}
                {card.checklistGroups.map((group) => {
                  const items = groupedItems[group.id] || [];
                  if (items.length === 0 && !expandedGroups.has(group.id)) return null;
                  return renderChecklistGroup(group.id, items, group);
                })}
              </div>

              {/* Add item without group */}
              <div className="flex gap-2 mt-4">
                <Input
                  value={selectedGroupId === undefined ? newItemText : ''}
                  onChange={(e) => {
                    setSelectedGroupId(undefined);
                    setNewItemText(e.target.value);
                  }}
                  onFocus={() => setSelectedGroupId(undefined)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && selectedGroupId === undefined) {
                      handleAddItem();
                    }
                  }}
                  placeholder="Adicionar item sem grupo..."
                  className="h-9"
                />
                <Button 
                  size="sm" 
                  variant="secondary"
                  onClick={handleAddItem}
                  disabled={selectedGroupId !== undefined || !newItemText.trim()}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <Separator className="my-6" />

            {/* Notes */}
            <div>
              <h4 className="text-sm font-semibold text-muted-foreground mb-4 flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Notas ({card.notes.length})
              </h4>

              {/* Add note */}
              <div className="mb-4">
                <Textarea
                  value={newNoteContent}
                  onChange={(e) => setNewNoteContent(e.target.value)}
                  placeholder="Adicionar uma nota..."
                  className="min-h-20 resize-none mb-2"
                />
                <Button 
                  size="sm" 
                  onClick={handleAddNote}
                  disabled={!newNoteContent.trim()}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Adicionar nota
                </Button>
              </div>

              {/* Notes list */}
              <div className="space-y-3">
                {card.notes.map((note) => (
                  <div 
                    key={note.id}
                    className="p-3 rounded-lg bg-muted/50 group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm flex-1">{note.content}</p>
                      <button
                        onClick={() => onDeleteNote(card.id, note.id)}
                        className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-destructive/10 transition-all"
                      >
                        <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      {formatDistanceToNow(note.createdAt, { addSuffix: true, locale: ptBR })}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Metadata */}
            <Separator className="my-6" />
            <div className="text-xs text-muted-foreground space-y-1">
              <p>Criado {formatDistanceToNow(card.createdAt, { addSuffix: true, locale: ptBR })}</p>
              {card.completedAt && (
                <p>Concluído {formatDistanceToNow(card.completedAt, { addSuffix: true, locale: ptBR })}</p>
              )}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
