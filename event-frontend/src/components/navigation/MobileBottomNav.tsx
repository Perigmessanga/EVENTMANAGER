import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Home,
  Calendar,
  Ticket,
  User,
  LayoutDashboard,
  BarChart3,
  Settings,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/authStore';

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  href: string;
}

const publicNavItems: NavItem[] = [
  { id: 'home', label: 'Accueil', icon: Home, href: '/' },
  { id: 'events', label: 'Événements', icon: Calendar, href: '/events' },
  { id: 'tickets', label: 'Billets', icon: Ticket, href: '/my-tickets' },
  { id: 'account', label: 'Compte', icon: User, href: '/account/profile' },
];

const userNavItems: NavItem[] = [
  { id: 'home', label: 'Accueil', icon: Home, href: '/' },
  { id: 'tickets', label: 'Mes Billets', icon: Ticket, href: '/account/tickets' },
  { id: 'events', label: 'Événements', icon: Calendar, href: '/events' },
  { id: 'account', label: 'Compte', icon: User, href: '/account/profile' },
];

const adminNavItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
  { id: 'events', label: 'Événements', icon: Calendar, href: '/admin/events' },
  { id: 'sales', label: 'Ventes', icon: BarChart3, href: '/admin/sales' },
  { id: 'settings', label: 'Paramètres', icon: Settings, href: '/admin/settings' },
];

interface MobileBottomNavProps {
  variant?: 'public' | 'user' | 'admin';
}

export function MobileBottomNav({ variant = 'public' }: MobileBottomNavProps) {
  const location = useLocation();
  const { isAuthenticated } = useAuthStore();

  const getNavItems = () => {
    if (variant === 'admin') return adminNavItems;
    if (variant === 'user' || isAuthenticated) return userNavItems;
    return publicNavItems;
  };

  const navItems = getNavItems();

  const isActive = (href: string) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="glass-strong border-t border-border px-2 pb-safe">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.id}
                to={item.href}
                className={cn(
                  'relative flex flex-col items-center justify-center py-2 px-3 rounded-xl transition-all duration-200 min-w-[64px]',
                  active
                    ? 'text-primary'
                    : 'text-muted-foreground'
                )}
              >
                <div className="relative">
                  <Icon className={cn(
                    'h-5 w-5 transition-transform duration-200',
                    active && 'scale-110'
                  )} />
                  {active && (
                    <motion.div
                      layoutId="bottomNavIndicator"
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                </div>
                <span className={cn(
                  'text-[10px] mt-1 font-medium transition-colors',
                  active ? 'text-primary' : 'text-muted-foreground'
                )}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
