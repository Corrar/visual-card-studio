import { useState } from 'react';
import { Plus, Sparkles } from 'lucide-react';
import { useCards } from '@/hooks/useCards';
import { InfoCard } from '@/components/cards/InfoCard';
import { CardModal } from '@/components/cards/CardModal';
import { EmptyState } from '@/components/cards/EmptyState';
import { CardData, CategoryColor } from '@/types/card';
import { Button } from '@/components/ui/button';

const Index = () => {
  const { cards, addCard, updateCard, deleteCard } = useCards();
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

  const handleSave = (title: string, description: string, category: CategoryColor) => {
    if (editingCard) {
      updateCard(editingCard.id, title, description, category);
    } else {
      addCard(title, description, category);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Card Manager</h1>
                <p className="text-sm text-muted-foreground">
                  {cards.length} {cards.length === 1 ? 'card' : 'cards'}
                </p>
              </div>
            </div>

            <Button onClick={handleOpenCreate} size="lg" className="gap-2">
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">Novo Card</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-6xl mx-auto px-4 py-8">
        {cards.length === 0 ? (
          <EmptyState onCreateClick={handleOpenCreate} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {cards.map((card, index) => (
              <InfoCard
                key={card.id}
                card={card}
                onEdit={handleOpenEdit}
                onDelete={deleteCard}
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
