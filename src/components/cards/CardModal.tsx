import { useState, useEffect } from 'react';
import { CardData, CategoryColor } from '@/types/card';
import { X } from 'lucide-react';
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

interface CardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (title: string, description: string, category: CategoryColor) => void;
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

export const CardModal = ({ isOpen, onClose, onSave, editingCard }: CardModalProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<CategoryColor>('blue');

  useEffect(() => {
    if (editingCard) {
      setTitle(editingCard.title);
      setDescription(editingCard.description);
      setCategory(editingCard.category);
    } else {
      setTitle('');
      setDescription('');
      setCategory('blue');
    }
  }, [editingCard, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onSave(title.trim(), description.trim(), category);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {editingCard ? 'Editar Card' : 'Novo Card'}
          </DialogTitle>
          <DialogDescription>
            {editingCard
              ? 'Atualize as informações do seu card.'
              : 'Preencha as informações para criar um novo card.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Digite o título do card"
              className="h-11"
              autoFocus
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Adicione uma descrição (opcional)"
              className="min-h-24 resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label>Categoria</Label>
            <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Selecionar categoria">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setCategory(cat.value)}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition-all duration-200',
                    category === cat.value
                      ? 'border-primary bg-primary/5'
                      : 'border-transparent bg-secondary hover:bg-accent'
                  )}
                  role="radio"
                  aria-checked={category === cat.value}
                >
                  <span className={cn('w-3 h-3 rounded-full', cat.color)} />
                  <span className="text-sm font-medium">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1">
              {editingCard ? 'Salvar' : 'Criar Card'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
