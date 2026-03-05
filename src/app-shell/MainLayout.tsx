import { ReactNode, useEffect, useState } from 'react';
import { Sidebar } from './Sidebar';
import { useUIStore } from '../stores/storyStore';
import { cn } from '../lib/utils';
import { CommandPalette, useCommandPalette } from '../components/CommandPalette';
import { useParams } from 'react-router-dom';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { sidebarOpen, sidebarWidth } = useUIStore();
  const { isOpen, setIsOpen } = useCommandPalette();
  const { id: storyId } = useParams();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      
      <main
        className={cn(
          "transition-all duration-200",
          !isMobile && (sidebarOpen ? "lg:ml-[280px]" : "lg:ml-16")
        )}
        style={{ 
          marginLeft: isMobile ? 0 : (sidebarOpen ? sidebarWidth : 64),
          paddingBottom: isMobile ? '80px' : 0 // Space for mobile nav
        }}
      >
        {children}
      </main>

      <CommandPalette 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)}
        storyId={storyId}
      />
    </div>
  );
}