import { useState, useEffect } from 'react';
import { CardData, CategoryColor, Priority, ChecklistItem } from '@/types/card';
import { Plus, X, GripVertical, Image, Link, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface CardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    title: string,
    description: string,
    category: CategoryColor,
    priority: Priority,
    checklist: ChecklistItem[],
    imageUrl?: string,
    dueDate?: Date
  ) => void;
  editingCard?: CardData | null;
}

const categories: { value: CategoryColor; label: string; color: string }[] = [
  { value: 'blue', label: 'Azul', color: 'bg-category-blue' },
  { value: 'green', label: 'Verde', color: 'bg-category-green' },
  { value: 'orange', label: 'Laranja', color: 'bg-category-orange' },
  { value: 'pink', label: 'Rosa', color: 'bg-category-pink' },
  { value: 'purple', label: 'Roxo', color: 'bg-category-purple' },
  { value: 'teal', label: 'Turquesa', color: 'bg-category-teal' },
];

const priorities: { value: Priority; label: string; color: string; bgColor: string }[] = [
  { value: 'low', label: 'Baixa', color: 'text-priority-low', bgColor: 'bg-priority-low' },
  { value: 'medium', label: 'Média', color: 'text-priority-medium', bgColor: 'bg-priority-medium' },
  { value: 'high', label: 'Alta', color: 'text-priority-high', bgColor: 'bg-priority-high' },
  { value: 'urgent', label: 'Urgente', color: 'text-priority-urgent', bgColor: 'bg-priority-urgent' },
];

const generateId = () => Math.random().toString(36).substring(2, 9);

export const CardModal = ({ isOpen, onClose, onSave, editingCard }: CardModalProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<CategoryColor>('blue');
  const [priority, setPriority] = useState<Priority>('medium');
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [newItemText, setNewItemText] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [showImageInput, setShowImageInput] = useState(false);

  useEffect(() => {
    if (editingCard) {
      setTitle(editingCard.title);
      setDescription(editingCard.description);
      setCategory(editingCard.category);
      setPriority(editingCard.priority);
      setChecklist(editingCard.checklist);
      setImageUrl(editingCard.imageUrl || '');
      setDueDate(editingCard.dueDate);
      setShowImageInput(!!editingCard.imageUrl);
    } else {
      setTitle('');
      setDescription('');
      setCategory('blue');
      setPriority('medium');
      setChecklist([]);
      setImageUrl('');
      setDueDate(undefined);
      setShowImageInput(false);
    }
    setNewItemText('');
  }, [editingCard, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onSave(
        title.trim(), 
        description.trim(), 
        category, 
        priority, 
        checklist, 
        imageUrl.trim() || undefined,
        dueDate
      );
      onClose();
    }
  };

  const handleAddChecklistItem = () => {
    if (newItemText.trim()) {
      setChecklist([
        ...checklist,
        { id: generateId(), text: newItemText.trim(), completed: false },
      ]);
      setNewItemText('');
    }
  };

  const handleRemoveChecklistItem = (id: string) => {
    setChecklist(checklist.filter((item) => item.id !== id));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddChecklistItem();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto animate-zoom-in">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {editingCard ? 'Editar Card' : 'Novo Card'}
          </DialogTitle>
          <DialogDescription>
            {editingCard
              ? 'Atualize as informações do seu card.'
              : 'Preencha as informações para criar um novo card.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">
              Título <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Digite o título do card"
              className="h-11 transition-all duration-200 focus:scale-[1.01]"
              autoFocus
              required
              aria-required="true"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Adicione uma descrição (opcional)"
              className="min-h-20 resize-none transition-all duration-200 focus:scale-[1.01]"
            />
          </div>

          {/* Image URL */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Imagem</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowImageInput(!showImageInput)}
                className="h-7 text-xs gap-1"
              >
                <Image className="w-3.5 h-3.5" />
                {showImageInput ? 'Remover' : 'Adicionar'}
              </Button>
            </div>
            
            {showImageInput && (
              <div className="space-y-2 animate-slide-down">
                <div className="relative">
                  <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="Cole a URL da imagem aqui..."
                    className="pl-10"
                  />
                </div>
                {imageUrl && (
                  <div className="relative rounded-lg overflow-hidden h-32 bg-muted animate-fade-in">
                    <img 
                      src={imageUrl} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><text x="50%" y="50%" font-family="sans-serif" font-size="12" text-anchor="middle" dy=".3em" fill="%23999">Imagem inválida</text></svg>';
                      }}
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Due Date */}
          <div className="space-y-2">
            <Label>Data de Entrega</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !dueDate && 'text-muted-foreground'
                  )}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {dueDate ? format(dueDate, 'PPP', { locale: ptBR }) : 'Selecionar data'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={dueDate}
                  onSelect={setDueDate}
                  initialFocus
                  locale={ptBR}
                />
              </PopoverContent>
            </Popover>
            {dueDate && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setDueDate(undefined)}
                className="h-7 text-xs text-muted-foreground"
              >
                Remover data
              </Button>
            )}
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <Label id="priority-label">Prioridade</Label>
            <div 
              className="flex flex-wrap gap-2" 
              role="radiogroup" 
              aria-labelledby="priority-label"
            >
              {priorities.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setPriority(p.value)}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition-all duration-300',
                    'hover:scale-105 active:scale-95',
                    priority === p.value
                      ? 'border-primary bg-primary/5 shadow-sm'
                      : 'border-transparent bg-secondary hover:bg-accent'
                  )}
                  role="radio"
                  aria-checked={priority === p.value}
                >
                  <span className={cn('w-3 h-3 rounded-full transition-transform', p.bgColor, priority === p.value && 'scale-125')} />
                  <span className="text-sm font-medium">{p.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label id="category-label">Categoria</Label>
            <div 
              className="flex flex-wrap gap-2" 
              role="radiogroup" 
              aria-labelledby="category-label"
            >
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setCategory(cat.value)}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition-all duration-300',
                    'hover:scale-105 active:scale-95',
                    category === cat.value
                      ? 'border-primary bg-primary/5 shadow-sm'
                      : 'border-transparent bg-secondary hover:bg-accent'
                  )}
                  role="radio"
                  aria-checked={category === cat.value}
                >
                  <span className={cn('w-3 h-3 rounded-full transition-transform', cat.color, category === cat.value && 'scale-125')} />
                  <span className="text-sm font-medium">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Checklist */}
          <div className="space-y-3">
            <Label id="checklist-label">Checklist</Label>
            
            {/* Add new item */}
            <div className="flex gap-2">
              <Input
                value={newItemText}
                onChange={(e) => setNewItemText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Adicionar item à lista..."
                className="flex-1"
                aria-label="Novo item da checklist"
              />
              <Button
                type="button"
                variant="secondary"
                size="icon"
                onClick={handleAddChecklistItem}
                disabled={!newItemText.trim()}
                aria-label="Adicionar item"
                className="shrink-0 hover:scale-105 active:scale-95 transition-transform"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {/* Checklist items */}
            {checklist.length > 0 && (
              <ul className="space-y-1 stagger-animation" aria-labelledby="checklist-label">
                {checklist.map((item, index) => (
                  <li
                    key={item.id}
                    className="flex items-center gap-2 p-2 rounded-lg bg-secondary/50 group hover:bg-secondary transition-colors"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <GripVertical className="w-4 h-4 text-muted-foreground/50 cursor-grab" aria-hidden="true" />
                    <span className="flex-1 text-sm">{item.text}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveChecklistItem(item.id)}
                      className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-destructive/10 hover:scale-110 transition-all focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-destructive"
                      aria-label={`Remover: ${item.text}`}
                    >
                      <X className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose} 
              className="flex-1 hover:scale-[1.02] active:scale-[0.98] transition-transform"
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              className="flex-1 hover:scale-[1.02] active:scale-[0.98] transition-transform"
            >
              {editingCard ? 'Salvar' : 'Criar Card'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
