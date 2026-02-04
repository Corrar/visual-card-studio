import { useState, useMemo } from 'react';
import { Plus, Sparkles, ListTodo, CheckCircle, Search, LayoutGrid } from 'lucide-react';
import { useCards } from '@/hooks/useCards';
import { InfoCard } from '@/components/cards/InfoCard';
import { CardModal } from '@/components/cards/CardModal';
import { CardFilters } from '@/components/cards/CardFilters';
import { EmptyState } from '@/components/cards/EmptyState';
import { ThemeToggle } from '@/components/ThemeToggle';
import { CardData, Priority, ChecklistItem, Tag } from '@/types/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

const Index = () => {
  const { cards, addCard, updateCard, deleteCard, duplicateCard, toggleChecklistItem, toggleCardCompleted, archiveCard } = useCards();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<CardData | null>(null);
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'all'>('all');
  const [tagFilter, setTagFilter] = useState<string>('');

  // Get all unique tags from cards
  const availableTags = useMemo(() => {
    const tagsSet = new Set<string>();
    cards.forEach(card => {
      card.tags.forEach(tag => tagsSet.add(tag.name));
    });
    return Array.from(tagsSet);
  }, [cards]);

  // Filter logic
  const filteredCards = useMemo(() => {
    return cards.filter(card => {
      // Search filter
      const matchesSearch = searchQuery === '' || 
        card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        card.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Priority filter
      const matchesPriority = priorityFilter === 'all' || card.priority === priorityFilter;
      
      // Tag filter
      const matchesTag = tagFilter === '' || card.tags.some(tag => tag.name === tagFilter);
      
      return matchesSearch && matchesPriority && matchesTag;
    });
  }, [cards, searchQuery, priorityFilter, tagFilter]);

  const activeCards = useMemo(() => filteredCards.filter(card => !card.completed), [filteredCards]);
  const completedCards = useMemo(() => filteredCards.filter(card => card.completed), [filteredCards]);

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
    priority: Priority,
    checklist: ChecklistItem[],
    tags: Tag[],
    imageUrl?: string,
    dueDate?: Date
  ) => {
    if (editingCard) {
      updateCard(editingCard.id, title, description, priority, checklist, tags, imageUrl, dueDate);
    } else {
      addCard(title, description, priority, checklist, tags, imageUrl, dueDate);
    }
  };

  const handleClearFilters = () => {
    setPriorityFilter('all');
    setTagFilter('');
    setSearchQuery('');
  };

  const renderCards = (cardList: CardData[]) => (
    cardList.length === 0 ? (
      activeTab === 'active' ? (
        searchQuery || priorityFilter !== 'all' || tagFilter !== '' ? (
          <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Nenhum card encontrado</h3>
            <p className="text-muted-foreground text-sm max-w-sm mb-4">
              Tente ajustar os filtros ou termo de busca.
            </p>
            <Button variant="outline" size="sm" onClick={handleClearFilters}>
              Limpar filtros
            </Button>
          </div>
        ) : (
          <EmptyState onCreateClick={handleOpenCreate} />
        )
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4 floating">
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
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 stagger-animation"
        role="feed"
        aria-label={activeTab === 'active' ? 'Cards ativos' : 'Cards concluídos'}
      >
        {cardList.map((card, index) => (
          <InfoCard
            key={card.id}
            card={card}
            onEdit={handleOpenEdit}
            onDelete={deleteCard}
            onDuplicate={duplicateCard}
            onToggleChecklistItem={toggleChecklistItem}
            onToggleCompleted={toggleCardCompleted}
            onArchive={archiveCard}
            index={index}
          />
        ))}
      </div>
    )
  );

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
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
          <div className="flex flex-col gap-4">
            {/* Top row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 pulse-glow">
                  <LayoutGrid className="w-5 h-5 text-primary-foreground" aria-hidden="true" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground">TaskFlow</h1>
                  <p className="text-sm text-muted-foreground" aria-live="polite">
                    {activeCards.length} {activeCards.length === 1 ? 'ativo' : 'ativos'} · {completedCards.length} {completedCards.length === 1 ? 'concluído' : 'concluídos'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <ThemeToggle />
                <Button 
                  onClick={handleOpenCreate} 
                  size="lg" 
                  className="gap-2 shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-transform"
                >
                  <Plus className="w-5 h-5" aria-hidden="true" />
                  <span className="hidden sm:inline">Novo Card</span>
                  <span className="sr-only sm:hidden">Criar novo card</span>
                </Button>
              </div>
            </div>

            {/* Search and Filters row */}
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar cards..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-10 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                  aria-label="Buscar cards"
                />
              </div>

              {/* Filters */}
              <CardFilters
                priorityFilter={priorityFilter}
                tagFilter={tagFilter}
                availableTags={availableTags}
                onPriorityChange={setPriorityFilter}
                onTagChange={setTagFilter}
                onClearFilters={handleClearFilters}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main id="main-content" className="container max-w-6xl mx-auto px-4 py-8" role="main">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'active' | 'completed')} className="w-full">
          <TabsList className="mb-6 grid w-full max-w-md mx-auto grid-cols-2 h-12 p-1 bg-muted/50">
            <TabsTrigger 
              value="active" 
              className={cn(
                "gap-2 text-sm font-medium transition-all duration-300",
                activeTab === 'active' && "shadow-sm bg-background"
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
                "gap-2 text-sm font-medium transition-all duration-300",
                activeTab === 'completed' && "shadow-sm bg-background"
              )}
            >
              <CheckCircle className="w-4 h-4" />
              Concluídos
              {completedCards.length > 0 && (
                <span className="ml-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
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
