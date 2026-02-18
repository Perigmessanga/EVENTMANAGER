import { useState } from 'react';
import { Minus, Plus, Info } from 'lucide-react';
import type { Event, TicketType } from '@/types';
import { formatCurrency } from '@/lib/format';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/stores/cartStore';
import { cn } from '@/lib/utils';

interface TicketSelectorProps {
  event: Event;
  onContinue?: () => void;
}

export function TicketSelector({ event, onContinue }: TicketSelectorProps) {
  const { addItem, getItemByTicketType, updateQuantity, removeItem } = useCartStore();
  
  const [localQuantities, setLocalQuantities] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    event.ticketTypes.forEach(ticket => {
      const cartItem = getItemByTicketType(ticket.id);
      initial[ticket.id] = cartItem?.quantity || 0;
    });
    return initial;
  });

  const handleQuantityChange = (ticketType: TicketType, delta: number) => {
    const current = localQuantities[ticketType.id] || 0;
    const newQuantity = Math.max(0, Math.min(current + delta, ticketType.maxPerOrder, ticketType.available));
    
    setLocalQuantities(prev => ({
      ...prev,
      [ticketType.id]: newQuantity,
    }));

    // Update cart
    if (newQuantity === 0) {
      removeItem(ticketType.id);
    } else if (current === 0 && newQuantity > 0) {
      addItem(event, ticketType, newQuantity);
    } else {
      updateQuantity(ticketType.id, newQuantity);
    }
  };

  const totalSelected = Object.values(localQuantities).reduce((sum, q) => sum + q, 0);
  const totalPrice = event.ticketTypes.reduce((sum, ticket) => {
    return sum + (localQuantities[ticket.id] || 0) * ticket.price;
  }, 0);

  return (
    <div className="space-y-4">
      <h3 className="font-display font-bold text-lg flex items-center gap-2">
        Choisissez vos billets
      </h3>
      
      <div className="space-y-3">
        {event.ticketTypes.map((ticket, index) => (
          <TicketTypeCard
            key={ticket.id}
            ticket={ticket}
            quantity={localQuantities[ticket.id] || 0}
            onQuantityChange={(delta) => handleQuantityChange(ticket, delta)}
            style={{ animationDelay: `${index * 50}ms` }}
          />
        ))}
      </div>

      {/* Summary */}
      {totalSelected > 0 && (
        <div className="bg-muted/50 rounded-xl p-4 space-y-4 animate-fade-in border border-border/50">
          <div className="space-y-2">
            {event.ticketTypes.map(ticket => {
              const qty = localQuantities[ticket.id] || 0;
              if (qty === 0) return null;
              return (
                <div key={ticket.id} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {qty}x {ticket.name}
                  </span>
                  <span className="font-medium">{formatCurrency(qty * ticket.price)}</span>
                </div>
              );
            })}
          </div>
          
          <div className="flex justify-between items-center pt-3 border-t border-border">
            <span className="font-medium">
              Total ({totalSelected} billet{totalSelected > 1 ? 's' : ''})
            </span>
            <span className="font-display font-bold text-xl text-primary">{formatCurrency(totalPrice)}</span>
          </div>
          
          {onContinue && (
            <Button 
              className="w-full h-12 text-base font-semibold shadow-md hover:shadow-glow transition-all" 
              size="lg" 
              onClick={onContinue}
            >
              Continuer vers le paiement
            </Button>
          )}
        </div>
      )}

      {totalSelected === 0 && (
        <p className="text-sm text-muted-foreground text-center py-2 flex items-center justify-center gap-2">
          <Info className="h-4 w-4" />
          Sélectionnez au moins un billet
        </p>
      )}
    </div>
  );
}

interface TicketTypeCardProps {
  ticket: TicketType;
  quantity: number;
  onQuantityChange: (delta: number) => void;
  style?: React.CSSProperties;
}

function TicketTypeCard({ ticket, quantity, onQuantityChange, style }: TicketTypeCardProps) {
  const isSelected = quantity > 0;
  const isSoldOut = ticket.available === 0;
  const isAlmostSoldOut = ticket.available > 0 && ticket.available < 20;

  return (
    <div
      className={cn(
        'border rounded-xl p-4 transition-all duration-300 animate-fade-in',
        isSelected 
          ? 'border-primary bg-primary/5 shadow-md' 
          : 'border-border hover:border-primary/30',
        isSoldOut && 'opacity-60'
      )}
      style={style}
    >
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-semibold">{ticket.name}</h4>
            {isSoldOut && (
              <span className="text-xs bg-destructive/10 text-destructive px-2 py-0.5 rounded-full font-medium">
                Épuisé
              </span>
            )}
            {isAlmostSoldOut && !isSoldOut && (
              <span className="text-xs bg-warning/10 text-warning px-2 py-0.5 rounded-full font-medium animate-pulse-slow">
                Plus que {ticket.available}!
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-1.5 line-clamp-2">{ticket.description}</p>
          <p className="text-xs text-muted-foreground mt-2 flex items-center gap-2">
            <span className="inline-flex items-center gap-1">
              Max {ticket.maxPerOrder} par commande
            </span>
            <span>•</span>
            <span>{ticket.available} disponibles</span>
          </p>
        </div>
        
        <div className="text-right flex-shrink-0">
          <p className="font-display font-bold text-xl text-primary">{formatCurrency(ticket.price)}</p>
          
          {!isSoldOut && (
            <div className="flex items-center gap-2 mt-3">
              <Button
                variant="outline"
                size="icon"
                className={cn(
                  'h-9 w-9 rounded-lg transition-all',
                  quantity === 0 && 'opacity-50'
                )}
                onClick={() => onQuantityChange(-1)}
                disabled={quantity === 0}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className={cn(
                'w-8 text-center font-bold text-lg transition-colors',
                isSelected && 'text-primary'
              )}>
                {quantity}
              </span>
              <Button
                variant={isSelected ? 'default' : 'outline'}
                size="icon"
                className="h-9 w-9 rounded-lg transition-all"
                onClick={() => onQuantityChange(1)}
                disabled={quantity >= ticket.maxPerOrder || quantity >= ticket.available}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
