import { useEffect, useCallback, useRef } from 'react';
import { CardData } from '@/types/card';
import { toast } from 'sonner';
import { differenceInHours, differenceInDays, format, isToday, isTomorrow, isPast } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ReminderConfig {
  checkInterval: number; // in milliseconds
  reminderThresholds: {
    hours: number;
    message: string;
    type: 'warning' | 'error' | 'info';
  }[];
}

const defaultConfig: ReminderConfig = {
  checkInterval: 60000, // Check every minute
  reminderThresholds: [
    { hours: 1, message: 'Vence em 1 hora!', type: 'error' },
    { hours: 3, message: 'Vence em 3 horas', type: 'warning' },
    { hours: 24, message: 'Vence hoje', type: 'warning' },
    { hours: 48, message: 'Vence amanhã', type: 'info' },
  ],
};

export const useDueDateReminders = (cards: CardData[], config: ReminderConfig = defaultConfig) => {
  const notifiedCards = useRef<Set<string>>(new Set());

  const checkDueDates = useCallback(() => {
    const now = new Date();

    cards.forEach((card) => {
      if (!card.dueDate || card.completed) return;

      const dueDate = new Date(card.dueDate);
      const hoursUntilDue = differenceInHours(dueDate, now);
      const cardKey = `${card.id}-${hoursUntilDue}`;

      // Skip if already notified for this threshold
      if (notifiedCards.current.has(cardKey)) return;

      // Check if overdue
      if (isPast(dueDate)) {
        const overdueKey = `${card.id}-overdue`;
        if (!notifiedCards.current.has(overdueKey)) {
          toast.error(`⚠️ "${card.title}" está atrasado!`, {
            description: `Venceu em ${format(dueDate, "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })}`,
            duration: 8000,
            action: {
              label: 'Ver',
              onClick: () => {
                // Scroll to card if visible
                document.getElementById(`card-${card.id}`)?.scrollIntoView({ behavior: 'smooth' });
              },
            },
          });
          notifiedCards.current.add(overdueKey);
        }
        return;
      }

      // Check thresholds
      for (const threshold of config.reminderThresholds) {
        if (hoursUntilDue <= threshold.hours && hoursUntilDue > 0) {
          const thresholdKey = `${card.id}-${threshold.hours}h`;
          if (!notifiedCards.current.has(thresholdKey)) {
            const toastFn = threshold.type === 'error' ? toast.error : threshold.type === 'warning' ? toast.warning : toast.info;
            
            let timeDescription = '';
            if (isToday(dueDate)) {
              timeDescription = `Hoje às ${format(dueDate, 'HH:mm')}`;
            } else if (isTomorrow(dueDate)) {
              timeDescription = `Amanhã às ${format(dueDate, 'HH:mm')}`;
            } else {
              timeDescription = format(dueDate, "dd 'de' MMMM 'às' HH:mm", { locale: ptBR });
            }

            toastFn(`🔔 "${card.title}" ${threshold.message}`, {
              description: timeDescription,
              duration: 6000,
              action: {
                label: 'Ver',
                onClick: () => {
                  document.getElementById(`card-${card.id}`)?.scrollIntoView({ behavior: 'smooth' });
                },
              },
            });
            notifiedCards.current.add(thresholdKey);
          }
          break; // Only show the most urgent threshold
        }
      }
    });
  }, [cards, config.reminderThresholds]);

  // Check immediately on mount and when cards change
  useEffect(() => {
    checkDueDates();
  }, [checkDueDates]);

  // Set up interval for periodic checks
  useEffect(() => {
    const intervalId = setInterval(checkDueDates, config.checkInterval);
    return () => clearInterval(intervalId);
  }, [checkDueDates, config.checkInterval]);

  // Get cards with upcoming due dates for display
  const getUpcomingReminders = useCallback(() => {
    const now = new Date();
    return cards
      .filter((card) => {
        if (!card.dueDate || card.completed) return false;
        const dueDate = new Date(card.dueDate);
        const daysUntilDue = differenceInDays(dueDate, now);
        return daysUntilDue <= 7; // Show cards due within 7 days
      })
      .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime());
  }, [cards]);

  return {
    checkDueDates,
    getUpcomingReminders,
  };
};
