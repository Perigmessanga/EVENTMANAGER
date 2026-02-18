import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Calendar,
  CalendarPlus,
  Ticket,
  Tags,
  BarChart3,
  TrendingUp,
  DollarSign,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Settings,
  Users,
  Bell,
  LogOut,
  Menu,
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
  href?: string;
  children?: { label: string; href: string; icon?: React.ElementType }[];
  adminOnly?: boolean;
}

const navItems: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    children: [
      { label: 'Vue d\'ensemble', href: '/admin', icon: BarChart3 },
    ],
  },
  {
    id: 'events',
    label: 'Événements',
    icon: Calendar,
    children: [
      { label: 'Créer un événement', href: '/admin/events/create', icon: CalendarPlus },
      { label: 'Gérer les événements', href: '/admin/events', icon: Calendar },
    ],
  },
  {
    id: 'tickets',
    label: 'Billets',
    icon: Ticket,
    children: [
      { label: 'Types de billets', href: '/admin/tickets/types', icon: Tags },
      { label: 'Gestion des prix', href: '/admin/tickets/pricing', icon: DollarSign },
    ],
  },
  {
    id: 'sales',
    label: 'Ventes & Analytics',
    icon: BarChart3,
    children: [
      { label: 'Ventes de billets', href: '/admin/sales', icon: Ticket },
      { label: 'Revenus', href: '/admin/revenue', icon: DollarSign },
      { label: 'Tendances & KPIs', href: '/admin/analytics', icon: TrendingUp },
    ],
  },
  {
    id: 'users',
    label: 'Utilisateurs',
    icon: Users,
    href: '/admin/users',
    adminOnly: true,
  },
  {
    id: 'settings',
    label: 'Paramètres',
    icon: Settings,
    href: '/admin/settings',
  },
];

interface AdminSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export function AdminSidebar({ isCollapsed, onToggle }: AdminSidebarProps) {
  const location = useLocation();
  const { user, logout, hasRole } = useAuthStore();
  const [expandedItems, setExpandedItems] = useState<string[]>(['dashboard']);
  const isAdmin = hasRole('admin');

  const toggleExpanded = (id: string) => {
    setExpandedItems(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const isActive = (href: string) => location.pathname === href;
  const isGroupActive = (item: NavItem) => {
    if (item.href) return isActive(item.href);
    return item.children?.some(child => isActive(child.href)) ?? false;
  };

  const filteredNavItems = navItems.filter(item => !item.adminOnly || isAdmin);

  const renderNavItem = (item: NavItem) => {
    const Icon = item.icon;
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.id);
    const active = isGroupActive(item);

    if (isCollapsed) {
      return (
        <Tooltip key={item.id} delayDuration={0}>
          <TooltipTrigger asChild>
            <div>
              {item.href ? (
                <Link
                  to={item.href}
                  className={cn(
                    'flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200',
                    active
                      ? 'bg-primary text-primary-foreground shadow-glow'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  <Icon className="h-5 w-5" />
                </Link>
              ) : (
                <button
                  onClick={() => hasChildren && toggleExpanded(item.id)}
                  className={cn(
                    'flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200',
                    active
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  <Icon className="h-5 w-5" />
                </button>
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent side="right" className="flex flex-col gap-1">
            <span className="font-medium">{item.label}</span>
            {hasChildren && (
              <div className="flex flex-col gap-0.5 pt-1 border-t border-border mt-1">
                {item.children.map(child => (
                  <Link
                    key={child.href}
                    to={child.href}
                    className={cn(
                      'text-xs px-2 py-1 rounded hover:bg-muted transition-colors',
                      isActive(child.href) ? 'text-primary font-medium' : 'text-muted-foreground'
                    )}
                  >
                    {child.label}
                  </Link>
                ))}
              </div>
            )}
          </TooltipContent>
        </Tooltip>
      );
    }

    return (
      <div key={item.id} className="space-y-1">
        {item.href ? (
          <Link
            to={item.href}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group',
              active
                ? 'bg-primary text-primary-foreground shadow-glow'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            )}
          >
            <Icon className="h-5 w-5 shrink-0" />
            <span className="font-medium text-sm">{item.label}</span>
          </Link>
        ) : (
          <button
            onClick={() => hasChildren && toggleExpanded(item.id)}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 w-full group',
              active
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            )}
          >
            <Icon className="h-5 w-5 shrink-0" />
            <span className="font-medium text-sm flex-1 text-left">{item.label}</span>
            {hasChildren && (
              <ChevronDown
                className={cn(
                  'h-4 w-4 transition-transform duration-200',
                  isExpanded && 'rotate-180'
                )}
              />
            )}
          </button>
        )}

        {/* Submenu */}
        <AnimatePresence>
          {hasChildren && isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="pl-4 space-y-0.5 pt-1">
                {item.children.map(child => {
                  const ChildIcon = child.icon;
                  return (
                    <Link
                      key={child.href}
                      to={child.href}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200',
                        isActive(child.href)
                          ? 'bg-primary/10 text-primary font-medium'
                          : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                      )}
                    >
                      {ChildIcon && <ChildIcon className="h-4 w-4 shrink-0" />}
                      <span>{child.label}</span>
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
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

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {filteredNavItems.map(renderNavItem)}
      </nav>

      {/* Footer */}
      <div className={cn(
        'border-t border-border p-3 space-y-2',
        isCollapsed && 'flex flex-col items-center'
      )}>
        {isCollapsed ? (
          <>
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-10 w-10">
                  <Bell className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Notifications</TooltipContent>
            </Tooltip>
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
                  <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
                </div>
              </TooltipContent>
            </Tooltip>
          </>
        ) : (
          <>
            <div className="flex items-center gap-3 px-2 py-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center shrink-0">
                <span className="text-primary-foreground text-sm font-semibold">
                  {user?.firstName?.charAt(0)?.toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                <Bell className="h-4 w-4" />
              </Button>
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
