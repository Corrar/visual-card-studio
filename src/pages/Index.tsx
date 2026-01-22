import { useState } from 'react';
import { Plus, Sparkles } from 'lucide-react';
import { useCards } from '@/hooks/useCards';
import { InfoCard } from '@/components/cards/InfoCard';
import { CardModal } from '@/components/cards/CardModal';
import { EmptyState } from '@/components/cards/EmptyState';
import { CardData, CategoryColor, Priority, ChecklistItem } from '@/types/card';
import { Button } from '@/components/ui/button';

const Index = () => {
  const { cards, addCard, updateCard, deleteCard, toggleChecklistItem } = useCards();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<CardData | null>(null);

  const handleOpenCreate = () => {
    setEditingCard(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (card: CardData) => {
    setEditingCard(card);
    setIsModalOpen(true);
  };

  const handleSave = (
    title: string,
    description: string,
    category: CategoryColor,
    priority: Priority,
    checklist: ChecklistItem[]
  ) => {
    if (editingCard) {
      updateCard(editingCard.id, title, description, category, priority, checklist);
    } else {
      addCard(title, description, category, priority, checklist);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Skip link for accessibility */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-lg"
      >
        Pular para o conteúdo principal
      </a>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                <Sparkles className="w-5 h-5 text-primary-foreground" aria-hidden="true" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Card Manager</h1>
                <p className="text-sm text-muted-foreground" aria-live="polite">
                  {cards.length} {cards.length === 1 ? 'card' : 'cards'}
                </p>
              </div>
            </div>

            <Button onClick={handleOpenCreate} size="lg" className="gap-2 shadow-lg shadow-primary/20">
              <Plus className="w-5 h-5" aria-hidden="true" />
              <span className="hidden sm:inline">Novo Card</span>
              <span className="sr-only sm:hidden">Criar novo card</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main id="main-content" className="container max-w-6xl mx-auto px-4 py-8" role="main">
        {cards.length === 0 ? (
          <EmptyState onCreateClick={handleOpenCreate} />
        ) : (
          <div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
            role="feed"
            aria-label="Lista de cards"
          >
            {cards.map((card, index) => (
              <InfoCard
                key={card.id}
                card={card}
                onEdit={handleOpenEdit}
                onDelete={deleteCard}
                onToggleChecklistItem={toggleChecklistItem}
                index={index}
              />
            ))}
          </div>
        )}
      </main>

      {/* Modal */}
      <CardModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        editingCard={editingCard}
      />
    </div>
  );
};

export default Index;
