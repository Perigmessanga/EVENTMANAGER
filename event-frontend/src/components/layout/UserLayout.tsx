import { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { UserSidebar } from '@/components/navigation/UserSidebar';
import { MobileBottomNav } from '@/components/navigation/MobileBottomNav';
import { useAuthStore } from '@/stores/authStore';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

export function UserLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isMobile = useIsMobile();
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      {!isMobile && (
        <UserSidebar isCollapsed={isCollapsed} onToggle={() => setIsCollapsed(!isCollapsed)} />
      )}

      {/* Main Content */}
      <motion.main
        initial={false}
        animate={{
          marginLeft: isMobile ? 0 : isCollapsed ? 72 : 260,
        }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        className={cn(
          'min-h-screen transition-all duration-200',
          isMobile && 'pb-20'
        )}
      >
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="p-4 md:p-6 lg:p-8"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </motion.main>

      {/* Mobile Bottom Nav */}
      {isMobile && <MobileBottomNav variant="user" />}
    </div>
  );
}
