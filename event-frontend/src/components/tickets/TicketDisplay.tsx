import { QRCodeSVG } from 'qrcode.react';
import { Calendar, MapPin, Download } from 'lucide-react';
import type { Ticket } from '@/types';
import { formatCurrency, formatDate, formatTime } from '@/lib/format';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface TicketDisplayProps {
  ticket: Ticket;
  variant?: 'full' | 'compact';
}

export function TicketDisplay({ ticket, variant = 'full' }: TicketDisplayProps) {
  const statusConfig = {
    valid: { label: 'Valide', className: 'status-success' },
    used: { label: 'Utilisé', className: 'bg-muted text-muted-foreground' },
    cancelled: { label: 'Annulé', className: 'status-failed' },
    expired: { label: 'Expiré', className: 'bg-muted text-muted-foreground' },
  };

  const status = statusConfig[ticket.status];

  if (variant === 'compact') {
    return (
      <div className="bg-card rounded-xl border border-border p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-semibold line-clamp-1">{ticket.eventTitle}</h3>
            <p className="text-sm text-muted-foreground">{ticket.ticketType}</p>
          </div>
          <Badge variant="outline" className={status.className}>
            {status.label}
          </Badge>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {formatDate(ticket.eventDate, { day: 'numeric', month: 'short' })}
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            {ticket.venue}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden">
      {/* Header with gradient */}
      <div className="gradient-primary p-6 text-primary-foreground">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm opacity-80 mb-1">Billet pour</p>
            <h2 className="font-display font-bold text-xl md:text-2xl">
              {ticket.eventTitle}
            </h2>
          </div>
          <Badge
            variant="outline"
            className={cn('bg-white/20 border-white/30 text-white', 
              ticket.status === 'valid' && 'bg-white/90 text-success border-success'
            )}
          >
            {status.label}
          </Badge>
        </div>
      </div>

      {/* Ticket Details */}
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Date</p>
            <p className="font-semibold">{formatDate(ticket.eventDate, { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Heure</p>
            <p className="font-semibold">{formatTime(ticket.eventTime)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Lieu</p>
            <p className="font-semibold">{ticket.venue}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Type</p>
            <p className="font-semibold">{ticket.ticketType}</p>
          </div>
        </div>

        {/* Dashed Separator */}
        <div className="relative">
          <div className="absolute left-0 right-0 border-t-2 border-dashed border-border" />
          <div className="absolute -left-6 -translate-x-1/2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-background" />
          <div className="absolute -right-6 translate-x-1/2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-background" />
        </div>

        {/* QR Code */}
        <div className="flex flex-col items-center py-4">
          <div className="qr-container">
            <QRCodeSVG
              value={ticket.qrCode}
              size={180}
              level="H"
              includeMargin={false}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-3 font-mono">
            {ticket.qrCode}
          </p>
        </div>

        {/* Ticket Holder */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Titulaire</p>
          <p className="font-semibold text-lg">{ticket.ticketHolder}</p>
        </div>

        {/* Price */}
        <div className="flex justify-between items-center pt-4 border-t border-border">
          <span className="text-muted-foreground">Prix payé</span>
          <span className="font-bold text-lg">{formatCurrency(ticket.price)}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 bg-muted/50 border-t border-border">
        <Button variant="outline" className="w-full gap-2">
          <Download className="h-4 w-4" />
          Télécharger le billet
        </Button>
      </div>
    </div>
  );
}
