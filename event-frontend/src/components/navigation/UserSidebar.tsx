import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Ticket,
  CreditCard,
  User,
  Bell,
  RefreshCw,
  Settings,
  HelpCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Home,
  Calendar,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  href: string;
  badge?: number;
}

const navItems: NavItem[] = [
  { id: 'tickets', label: 'Mes Billets', icon: Ticket, href: '/account/tickets' },
  { id: 'payments', label: 'Historique paiements', icon: CreditCard, href: '/account/payments' },
  { id: 'refunds', label: 'Remboursements', icon: RefreshCw, href: '/account/refunds' },
  { id: 'notifications', label: 'Notifications', icon: Bell, href: '/account/notifications', badge: 3 },
  { id: 'profile', label: 'Mon Profil', icon: User, href: '/account/profile' },
  { id: 'settings', label: 'Paramètres', icon: Settings, href: '/account/settings' },
];

const quickLinks: NavItem[] = [
  { id: 'home', label: 'Accueil', icon: Home, href: '/' },
  { id: 'events', label: 'Événements', icon: Calendar, href: '/events' },
];

interface UserSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export function UserSidebar({ isCollapsed, onToggle }: UserSidebarProps) {
  const location = useLocation();
  const { user, logout } = useAuthStore();

  const isActive = (href: string) => location.pathname === href;

  const renderNavItem = (item: NavItem, isQuickLink = false) => {
    const Icon = item.icon;
    const active = isActive(item.href);

    if (isCollapsed) {
      return (
        <Tooltip key={item.id} delayDuration={0}>
          <TooltipTrigger asChild>
            <Link
              to={item.href}
              className={cn(
                'relative flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200',
                active
                  ? 'bg-primary text-primary-foreground shadow-glow'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <Icon className="h-5 w-5" />
              {item.badge && item.badge > 0 && (
                <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 bg-destructive text-destructive-foreground text-xs font-bold rounded-full flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">{item.label}</TooltipContent>
        </Tooltip>
      );
    }

    return (
      <Link
        key={item.id}
        to={item.href}
        className={cn(
          'relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group',
          active
            ? 'bg-primary text-primary-foreground shadow-glow'
            : 'text-muted-foreground hover:bg-muted hover:text-foreground',
          isQuickLink && 'py-2'
        )}
      >
        <Icon className={cn('h-5 w-5 shrink-0', isQuickLink && 'h-4 w-4')} />
        <span className={cn('font-medium', isQuickLink ? 'text-sm' : 'text-sm')}>{item.label}</span>
        {item.badge && item.badge > 0 && (
          <span className={cn(
            'ml-auto min-w-5 h-5 px-1.5 text-xs font-bold rounded-full flex items-center justify-center',
            active
              ? 'bg-primary-foreground/20 text-primary-foreground'
              : 'bg-destructive text-destructive-foreground'
          )}>
            {item.badge}
          </span>
        )}
      </Link>
    );
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 72 : 260 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className={cn(
        'fixed left-0 top-0 h-screen bg-card border-r border-border z-40',
        'flex flex-col'
      )}
    >
      {/* Header */}
      <div className={cn(
        'h-16 border-b border-border flex items-center px-4',
        isCollapsed ? 'justify-center' : 'justify-between'
      )}>
        {!isCollapsed && (
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center shadow-glow">
              <span className="text-primary-foreground font-display font-bold text-sm">T</span>
            </div>
            <span className="font-display font-bold text-lg text-foreground">
              Tikerama
            </span>
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="h-8 w-8 shrink-0"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Quick Links */}
      <div className={cn('p-3 border-b border-border', isCollapsed && 'flex flex-col items-center')}>
        {!isCollapsed && (
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 px-3">
            Navigation
          </p>
        )}
        <div className="space-y-1">
          {quickLinks.map(item => renderNavItem(item, true))}
        </div>
      </div>

      {/* Main Navigation */}
      <nav className={cn('flex-1 overflow-y-auto p-3 space-y-1', isCollapsed && 'flex flex-col items-center')}>
        {!isCollapsed && (
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 px-3">
            Mon Compte
          </p>
        )}
        {navItems.map(item => renderNavItem(item))}
      </nav>

      {/* Help */}
      {!isCollapsed && (
        <div className="px-3 pb-3">
          <div className="p-4 rounded-xl bg-muted/50 border border-border">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-info/10 flex items-center justify-center">
                <HelpCircle className="h-4 w-4 text-info" />
              </div>
              <span className="font-medium text-sm">Besoin d'aide?</span>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              Contactez notre support pour toute question.
            </p>
            <Button variant="outline" size="sm" className="w-full">
              Contacter le support
            </Button>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className={cn(
        'border-t border-border p-3',
        isCollapsed && 'flex flex-col items-center'
      )}>
        {isCollapsed ? (
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center cursor-pointer">
                <span className="text-primary-foreground text-sm font-semibold">
                  {user?.firstName?.charAt(0)?.toUpperCase()}
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent side="right">
              <div>
                <p className="font-medium">{user?.firstName} {user?.lastName}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
            </TooltipContent>
          </Tooltip>
        ) : (
          <>
            <div className="flex items-center gap-3 px-2 py-2 mb-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center shrink-0">
                <span className="text-primary-foreground text-sm font-semibold">
                  {user?.firstName?.charAt(0)?.toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              onClick={logout}
              className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            >
              <LogOut className="h-4 w-4" />
              <span>Déconnexion</span>
            </Button>
          </>
        )}
      </div>
    </motion.aside>
  );
}
