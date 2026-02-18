import { useState } from 'react';
import { 
  Bell, 
  Ticket, 
  CreditCard, 
  Calendar,
  Info,
  CheckCircle2,
  Trash2,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

interface Notification {
  id: string;
  type: 'ticket' | 'payment' | 'event' | 'info';
  title: string;
  message: string;
  date: string;
  read: boolean;
}

const mockNotifications: Notification[] = [
  { id: '1', type: 'ticket', title: 'Billet confirmé', message: 'Votre billet pour Concert Magic System a été confirmé.', date: '2024-01-20T14:30:00', read: false },
  { id: '2', type: 'event', title: 'Rappel d\'événement', message: 'Concert Magic System commence dans 2 jours!', date: '2024-01-20T10:00:00', read: false },
  { id: '3', type: 'payment', title: 'Paiement reçu', message: 'Votre paiement de 50 000 FCFA a été reçu avec succès.', date: '2024-01-19T16:45:00', read: false },
  { id: '4', type: 'info', title: 'Nouvelle fonctionnalité', message: 'Découvrez notre nouveau système de QR code pour un accès plus rapide.', date: '2024-01-18T09:00:00', read: true },
  { id: '5', type: 'event', title: 'Événement mis à jour', message: 'L\'horaire de Match ASEC vs Africa a été modifié.', date: '2024-01-15T11:30:00', read: true },
];

export default function UserNotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [showSettings, setShowSettings] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'ticket': return Ticket;
      case 'payment': return CreditCard;
      case 'event': return Calendar;
      case 'info': return Info;
    }
  };

  const getIconColor = (type: Notification['type']) => {
    switch (type) {
      case 'ticket': return 'bg-primary/10 text-primary';
      case 'payment': return 'bg-success/10 text-success';
      case 'event': return 'bg-secondary/10 text-secondary';
      case 'info': return 'bg-info/10 text-info';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'À l\'instant';
    if (diffInHours < 24) return `Il y a ${diffInHours}h`;
    if (diffInHours < 48) return 'Hier';
    return `Il y a ${Math.floor(diffInHours / 24)} jours`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 animate-fade-in">
        <div>
          <h1 className="font-display font-bold text-3xl mb-1">Notifications</h1>
          <p className="text-muted-foreground">
            {unreadCount > 0 ? `${unreadCount} notification${unreadCount > 1 ? 's' : ''} non lue${unreadCount > 1 ? 's' : ''}` : 'Toutes les notifications sont lues'}
          </p>
        </div>
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <Button variant="outline" onClick={markAllAsRead} className="gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Tout marquer comme lu
            </Button>
          )}
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => setShowSettings(!showSettings)}
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="dashboard-widget animate-fade-in">
          <div className="dashboard-widget-header">
            <CardTitle className="text-lg">Préférences de notification</CardTitle>
          </div>
          <div className="dashboard-widget-content space-y-4">
            {[
              { title: 'Confirmation de billets', description: 'Recevoir une notification après chaque achat' },
              { title: 'Rappels d\'événements', description: 'Être rappelé avant les événements' },
              { title: 'Mises à jour d\'événements', description: 'Être informé des changements' },
              { title: 'Paiements et remboursements', description: 'Suivi des transactions' },
              { title: 'Actualités et promotions', description: 'Offres spéciales et nouveautés' },
            ].map((pref, index) => (
              <div key={index} className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium">{pref.title}</p>
                  <p className="text-sm text-muted-foreground">{pref.description}</p>
                </div>
                <Switch defaultChecked={index < 4} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Notifications List */}
      {notifications.length === 0 ? (
        <div className="text-center py-16 animate-fade-in">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-muted/50 flex items-center justify-center mb-6">
            <Bell className="h-10 w-10 text-muted-foreground" />
          </div>
          <h2 className="font-display font-bold text-xl mb-4">
            Aucune notification
          </h2>
          <p className="text-muted-foreground">
            Vos notifications apparaîtront ici.
          </p>
        </div>
      ) : (
        <div className="dashboard-widget animate-fade-in">
          <div className="divide-y divide-border">
            {notifications.map((notification) => {
              const Icon = getIcon(notification.type);
              return (
                <div 
                  key={notification.id}
                  className={cn(
                    'p-4 flex items-start gap-4 transition-colors group cursor-pointer hover:bg-muted/30',
                    !notification.read && 'bg-primary/5'
                  )}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center shrink-0', getIconColor(notification.type))}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className={cn('font-medium', !notification.read && 'font-semibold')}>
                            {notification.title}
                          </h3>
                          {!notification.read && (
                            <span className="w-2 h-2 rounded-full bg-primary" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                        <p className="text-xs text-muted-foreground mt-2">{formatTimeAgo(notification.date)}</p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notification.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
