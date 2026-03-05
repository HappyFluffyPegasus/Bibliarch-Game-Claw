import { ReactNode } from 'react';
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

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      
      <main
        className={cn(
          "transition-all duration-200",
          sidebarOpen ? "lg:ml-[280px]" : "lg:ml-16"
        )}
        style={{ marginLeft: sidebarOpen ? sidebarWidth : 64 }}
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