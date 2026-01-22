import { useState, useMemo } from 'react';
import { Plus, Sparkles, ListTodo, CheckCircle } from 'lucide-react';
import { useCards } from '@/hooks/useCards';
import { InfoCard } from '@/components/cards/InfoCard';
import { CardModal } from '@/components/cards/CardModal';
import { EmptyState } from '@/components/cards/EmptyState';
import { CardData, CategoryColor, Priority, ChecklistItem } from '@/types/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

const Index = () => {
  const { cards, addCard, updateCard, deleteCard, toggleChecklistItem, toggleCardCompleted } = useCards();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<CardData | null>(null);
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');

  const activeCards = useMemo(() => cards.filter(card => !card.completed), [cards]);
  const completedCards = useMemo(() => cards.filter(card => card.completed), [cards]);

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

  const renderCards = (cardList: CardData[]) => (
    cardList.length === 0 ? (
      activeTab === 'active' ? (
        <EmptyState onCreateClick={handleOpenCreate} />
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">Nenhum card concluído</h3>
          <p className="text-muted-foreground text-sm max-w-sm">
            Marque cards como "Pronto" para movê-los para esta aba.
          </p>
        </div>
      )
    ) : (
      <div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        role="feed"
        aria-label={activeTab === 'active' ? 'Cards ativos' : 'Cards concluídos'}
      >
        {cardList.map((card, index) => (
          <InfoCard
            key={card.id}
            card={card}
            onEdit={handleOpenEdit}
            onDelete={deleteCard}
            onToggleChecklistItem={toggleChecklistItem}
            onToggleCompleted={toggleCardCompleted}
            index={index}
          />
        ))}
      </div>
    )
  );

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
                  {activeCards.length} {activeCards.length === 1 ? 'ativo' : 'ativos'} · {completedCards.length} {completedCards.length === 1 ? 'concluído' : 'concluídos'}
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
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'active' | 'completed')} className="w-full">
          <TabsList className="mb-6 grid w-full max-w-md mx-auto grid-cols-2 h-12">
            <TabsTrigger 
              value="active" 
              className={cn(
                "gap-2 text-sm font-medium",
                activeTab === 'active' && "shadow-sm"
              )}
            >
              <ListTodo className="w-4 h-4" />
              Ativos
              {activeCards.length > 0 && (
                <span className="ml-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                  {activeCards.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger 
              value="completed"
              className={cn(
                "gap-2 text-sm font-medium",
                activeTab === 'completed' && "shadow-sm"
              )}
            >
              <CheckCircle className="w-4 h-4" />
              Concluídos
              {completedCards.length > 0 && (
                <span className="ml-1 px-2 py-0.5 rounded-full bg-green-500/10 text-green-600 text-xs font-semibold">
                  {completedCards.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="animate-fade-in">
            {renderCards(activeCards)}
          </TabsContent>

          <TabsContent value="completed" className="animate-fade-in">
            {renderCards(completedCards)}
          </TabsContent>
        </Tabs>
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