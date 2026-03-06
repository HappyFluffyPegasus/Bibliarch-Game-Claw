import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, X, ChevronRight, Home, BookOpen, Users, Map, 
  Image, Clock, Settings, Sparkles, Wand2
} from 'lucide-react';
import { cn } from '../lib/utils';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
  children?: { id: string; label: string }[];
}

const navItems: NavItem[] = [
  { 
    id: 'dashboard', 
    label: 'Dashboard', 
    icon: <Home className="w-5 h-5" /> 
  },
  { 
    id: 'story', 
    label: 'Story', 
    icon: <BookOpen className="w-5 h-5" />,
    children: [
      { id: 'notes', label: 'Notes' },
      { id: 'timeline', label: 'Timeline' },
      { id: 'scenes', label: 'Scenes' },
    ]
  },
  { 
    id: 'characters', 
    label: 'Characters', 
    icon: <Users className="w-5 h-5" />,
    badge: 12
  },
  { 
    id: 'world', 
    label: 'World', 
    icon: <Map className="w-5 h-5" />,
    children: [
      { id: 'map', label: 'Map' },
      { id: 'locations', label: 'Locations' },
      { id: 'lore', label: 'Lore' },
    ]
  },
  { 
    id: 'assets', 
    label: 'Assets', 
    icon: <Image className="w-5 h-5" /> 
  },
  { 
    id: 'ai', 
    label: 'AI Assistant', 
    icon: <Sparkles className="w-5 h-5" />,
    badge: 3
  },
];

interface MobileNavProps {
  activeItem?: string;
  onNavigate?: (id: string) => void;
}

export function MobileNav({ activeItem = 'dashboard', onNavigate }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  // Close menu when clicking outside or on route change
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const toggleExpand = (id: string) => {
    setExpandedItems(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleNavigate = (id: string) => {
    onNavigate?.(id);
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-background/95 backdrop-blur border-b border-border z-40 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-pink-500 rounded-lg flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-lg">Bibliarch</span>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-accent"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />
          
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="lg:hidden fixed top-14 left-0 bottom-0 w-72 bg-background border-r border-border z-50 overflow-y-auto"
          >
            <div className="p-4">
              <div className="space-y-1">
                {navItems.map(item => {
                  const isActive = activeItem === item.id;
                  const isExpanded = expandedItems.has(item.id);
                  const hasChildren = item.children && item.children.length > 0;

                  return (
                    <div key={item.id}>
                      <button
                        onClick={() => {
                          if (hasChildren) {
                            toggleExpand(item.id);
                          } else {
                            handleNavigate(item.id);
                          }
                        }}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all",
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-accent"
                        )}
                      >
                        <span className={cn(
                          "transition-colors",
                          isActive ? "text-primary-foreground" : "text-muted-foreground"
                        )}>
                          {item.icon}
                        </span>
                        
                        <span className="flex-1 font-medium text-left">{item.label}</span>

                        {item.badge && (
                          <span className={cn(
                            "px-2 py-0.5 text-xs rounded-full",
                            isActive ? "bg-primary-foreground/20" : "bg-primary/10 text-primary"
                          )}>
                            {item.badge}
                          </span>
                        )}

                        {hasChildren && (
                          <ChevronRight className={cn(
                            "w-4 h-4 transition-transform",
                            isExpanded && "rotate-90"
                          )} />
                        )}
                      </button>

                      {/* Submenu */}
                      {hasChildren && isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="pl-11 py-1 space-y-1">
                            {item.children.map(child => (
                              <button
                                key={child.id}
                                onClick={() => handleNavigate(`${item.id}-${child.id}`)}
                                className="w-full text-left px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors"
                              >
                                {child.label}
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Bottom Actions */}
              <div className="mt-8 pt-4 border-t border-border">
                <button
                  onClick={() => handleNavigate('settings')}
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-accent transition-colors"
                >
                  <Settings className="w-5 h-5 text-muted-foreground" />
                  <span>Settings</span>
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}

      {/* Bottom Tab Bar (Mobile) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-background/95 backdrop-blur border-t border-border z-40 flex items-center justify-around px-2">
        {navItems.slice(0, 5).map(item => {
          const isActive = activeItem === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => handleNavigate(item.id)}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              <div className="relative">
                {item.icon}
                {item.badge && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground text-[10px] rounded-full flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex flex-col w-64 h-screen bg-card/50 border-r border-border">
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-pink-500 rounded-lg flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg">Bibliarch</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          <div className="space-y-1">
            {navItems.map(item => {
              const isActive = activeItem === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate?.(item.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-accent"
                  )}
                >
                  <span className={isActive ? "" : "text-muted-foreground"}>{item.icon}</span>
                  <span className="flex-1 font-medium text-left">{item.label}</span>
                  {item.badge && (
                    <span className={cn(
                      "px-2 py-0.5 text-xs rounded-full",
                      isActive ? "bg-primary-foreground/20" : "bg-primary/10 text-primary"
                    )}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-3 border-t border-border">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent transition-colors">
            <Settings className="w-5 h-5 text-muted-foreground" />
            <span>Settings</span>
          </button>
        </div>
      </div>
    </>
  );
}
