import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Menu, X, ShoppingCart, User, LogOut, Moon, Sun, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/authStore';
import { useCartStore } from '@/stores/cartStore';
import { cn } from '@/lib/utils';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const location = useLocation();
  
  const { isAuthenticated, user, logout, hasRole } = useAuthStore();
  const { items } = useCartStore();
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Check for dark mode preference
    const isDarkMode = document.documentElement.classList.contains('dark');
    setIsDark(isDarkMode);
  }, []);

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle('dark');
    setIsDark(!isDark);
  };

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { href: '/', label: 'Accueil' },
    { href: '/events', label: 'Événements' },
  ];

  if (isAuthenticated) {
    navLinks.push({ href: '/my-tickets', label: 'Mes Billets' });
    if (hasRole(['admin', 'organizer'])) {
      navLinks.push({ href: '/admin', label: 'Dashboard' });
    }
  }

  return (
    <header 
      className={cn(
        'sticky top-0 z-50 transition-all duration-300',
        scrolled 
          ? 'glass-strong shadow-sm' 
          : 'bg-background/80 backdrop-blur-sm border-b border-transparent'
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shadow-glow transition-transform duration-300 group-hover:scale-105">
              <span className="text-primary-foreground font-display font-bold text-lg">T</span>
            </div>
            <span className="font-display font-bold text-xl text-foreground">
              Tikerama
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                  isActive(link.href)
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-2">
            {/* Dark Mode Toggle */}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleDarkMode}
              className="text-muted-foreground hover:text-foreground"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            {/* Cart */}
            <Link to="/checkout" className="relative">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 bg-primary text-primary-foreground text-xs font-bold rounded-full flex items-center justify-center animate-scale-in shadow-glow">
                    {itemCount}
                  </span>
                )}
              </Button>
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center gap-1 ml-2">
                <Link to="/my-tickets">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="gap-2 px-3 hover:bg-muted/50"
                  >
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center">
                      <span className="text-primary-foreground text-xs font-semibold">
                        {user?.firstName?.charAt(0)?.toUpperCase()}
                      </span>
                    </div>
                    <span className="max-w-[100px] truncate font-medium">{user?.firstName}</span>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={logout}
                  className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Link to="/login">
                <Button size="sm" className="ml-2 shadow-sm hover:shadow-glow transition-shadow">
                  Connexion
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleDarkMode}
              className="text-muted-foreground"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            
            <Link to="/checkout" className="relative">
              <Button variant="ghost" size="icon">
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 bg-primary text-primary-foreground text-xs font-bold rounded-full flex items-center justify-center shadow-glow">
                    {itemCount}
                  </span>
                )}
              </Button>
            </Link>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5 animate-scale-in" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={cn(
          'md:hidden overflow-hidden transition-all duration-300',
          mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        )}>
          <nav className="flex flex-col gap-1 py-4 border-t border-border">
            {navLinks.map((link, index) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  'px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200',
                  isActive(link.href)
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                )}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {link.label}
              </Link>
            ))}
            
            <div className="border-t border-border mt-2 pt-2">
              {isAuthenticated ? (
                <div className="space-y-1">
                  <div className="px-4 py-2 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center">
                      <span className="text-primary-foreground text-sm font-semibold">
                        {user?.firstName?.charAt(0)?.toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">{user?.firstName} {user?.lastName}</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-2 text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                  >
                    <LogOut className="h-4 w-4" />
                    Déconnexion
                  </Button>
                </div>
              ) : (
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full shadow-sm">Connexion</Button>
                </Link>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
