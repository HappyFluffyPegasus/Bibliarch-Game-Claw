import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useUIStore } from '../stores/storyStore';
import { cn } from '../lib/utils';
import { 
  Menu, 
  Home, 
  BookOpen, 
  Users, 
  Map, 
  Video, 
  Clock,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const navItems = [
  { id: 'overview', label: 'Overview', icon: Home, path: '' },
  { id: 'notes', label: 'Notes', icon: BookOpen, path: '/notes' },
  { id: 'characters', label: 'Characters', icon: Users, path: '/characters' },
  { id: 'world', label: 'World', icon: Map, path: '/world' },
  { id: 'scenes', label: 'Scenes', icon: Video, path: '/scenes' },
  { id: 'timeline', label: 'Timeline', icon: Clock, path: '/timeline' },
];

export function Sidebar() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { sidebarOpen, setSidebarOpen, sidebarWidth, setSidebarWidth } = useUIStore();
  const [isResizing, setIsResizing] = useState(false);
  
  const currentPath = location.pathname.split('/').pop() || 'overview';
  
  const handleResizeStart = () => {
    setIsResizing(true);
    document.addEventListener('mousemove', handleResizeMove);
    document.addEventListener('mouseup', handleResizeEnd);
  };
  
  const handleResizeMove = (e: MouseEvent) => {
    const newWidth = Math.max(200, Math.min(400, e.clientX));
    setSidebarWidth(newWidth);
  };
  
  const handleResizeEnd = () => {
    setIsResizing(false);
    document.removeEventListener('mousemove', handleResizeMove);
    document.removeEventListener('mouseup', handleResizeEnd);
  };
  
  const handleNavClick = (path: string) => {
    if (!id) return;
    navigate(`/story/${id}${path}`);
  };
  
  const handleHomeClick = () => {
    navigate('/');
  };
  
  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-full bg-card border-r border-border z-50 flex flex-col transition-transform",
          !sidebarOpen && "-translate-x-full lg:translate-x-0 lg:w-16"
        )}
        style={{ width: sidebarOpen ? sidebarWidth : 64 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border h-16">
          {sidebarOpen ? (
            <>
              <span className="font-semibold text-lg truncate">Bibliarch</span>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1 hover:bg-accent rounded"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            </>
          ) : (
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 hover:bg-accent rounded mx-auto"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {sidebarOpen ? (
            <div className="px-2 space-y-1">
              <button
                onClick={handleHomeClick}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                  currentPath === 'overview' && !id
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent"
                )}
              >
                <Home className="w-4 h-4" />
                Home
              </button>
              
              <div className="my-2 border-t border-border" />
              
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPath === item.id || (item.id === 'overview' && currentPath === `story/${id}`);
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.path)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-accent"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="px-2 space-y-2">
              <button
                onClick={handleHomeClick}
                className="w-full flex justify-center p-2 hover:bg-accent rounded"
                title="Home"
              >
                <Home className="w-5 h-5" />
              </button>
              
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPath === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.path)}
                    className={cn(
                      "w-full flex justify-center p-2 rounded transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-accent"
                    )}
                    title={item.label}
                  >
                    <Icon className="w-5 h-5" />
                  </button>
                );
              })}
            </div>
          )}
        </nav>
        
        {/* Resize handle */}
        {sidebarOpen && (
          <div
            className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-primary/50"
            onMouseDown={handleResizeStart}
          />
        )}
      </aside>
    </>
  );
}