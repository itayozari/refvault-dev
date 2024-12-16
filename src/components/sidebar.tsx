import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Home, 
  FolderOpen, 
  Settings, 
  User, 
  ChevronDown, 
  Library, 
  History, 
  Star,
  LogOut,
  Bell,
  CreditCard,
  Sparkles
} from 'lucide-react';
import { ThemeToggle } from './theme-toggle';

interface SidebarProps {
  className?: string;
  onCollapse?: (collapsed: boolean) => void;
}

export function Sidebar({ className, onCollapse }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMyVideosOpen, setIsMyVideosOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('home');

  useEffect(() => {
    onCollapse?.(isCollapsed);
  }, [isCollapsed, onCollapse]);

  return (
    <div className={`relative ${className}`}>
      <div className={`
        fixed top-0 left-0 h-screen bg-[var(--background)] border-r app-border
        transition-all duration-300 ease-in-out flex flex-col
        ${isCollapsed ? 'w-16' : 'w-64'}
      `}>
        {/* Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-8 bg-[var(--background)] rounded-full p-1 shadow-md app-border"
        >
          {isCollapsed ? 
            <ChevronRight className="w-4 h-4 text-[var(--text-secondary)]" /> : 
            <ChevronLeft className="w-4 h-4 text-[var(--text-secondary)]" />
          }
        </button>

        {/* Logo */}
        <div className="p-4 flex items-center justify-between border-b app-border">
          <span className={`font-bold text-xl text-[var(--text)] ${isCollapsed ? 'hidden' : 'block'}`}>RefVault</span>
          {isCollapsed && (
            <span className="font-bold text-xl text-[var(--text)]">R</span>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 mt-6">
          <NavItem 
            icon={<Home size={20} />} 
            label="Home" 
            isCollapsed={isCollapsed} 
            isActive={activeTab === 'home'} 
            onClick={() => setActiveTab('home')}
          />
          
          {/* My Videos Section */}
          <div>
            <NavItem 
              icon={<FolderOpen size={20} />} 
              label="My Videos" 
              isCollapsed={isCollapsed}
              isActive={activeTab === 'videos'}
              onClick={() => {
                if (!isCollapsed) {
                  setIsMyVideosOpen(!isMyVideosOpen);
                }
                setActiveTab('videos');
              }}
              rightIcon={
                !isCollapsed && (
                  <ChevronDown 
                    size={16} 
                    className={`transition-transform duration-200 ${isMyVideosOpen ? 'rotate-180' : ''}`}
                  />
                )
              }
            />
            
            {/* My Videos Submenu */}
            {!isCollapsed && isMyVideosOpen && (
              <div className="pl-12">
                <SubNavItem 
                  label="History" 
                  icon={<History size={16} />} 
                  onClick={() => setActiveTab('history')}
                  isActive={activeTab === 'history'}
                />
                <SubNavItem 
                  label="Starred" 
                  icon={<Star size={16} />} 
                  onClick={() => setActiveTab('starred')}
                  isActive={activeTab === 'starred'}
                />
                <SubNavItem 
                  label="Collections" 
                  icon={<Library size={16} />} 
                  onClick={() => setActiveTab('collections')}
                  isActive={activeTab === 'collections'}
                />
              </div>
            )}
          </div>
          
          {/* Settings Section */}
          <div>
            <NavItem 
              icon={<Settings size={20} />} 
              label="Settings" 
              isCollapsed={isCollapsed}
              isActive={activeTab === 'settings'}
              onClick={() => {
                if (!isCollapsed) {
                  setIsSettingsOpen(!isSettingsOpen);
                }
                setActiveTab('settings');
              }}
              rightIcon={
                !isCollapsed && (
                  <ChevronDown 
                    size={16} 
                    className={`transition-transform duration-200 ${isSettingsOpen ? 'rotate-180' : ''}`}
                  />
                )
              }
            />
            
            {/* Settings Submenu */}
            {!isCollapsed && isSettingsOpen && (
              <div className="pl-12">
                {isCollapsed ? null : <ThemeToggle />}
              </div>
            )}
          </div>
        </nav>

        {/* Profile Section */}
        <div className="border-t app-border mt-auto">
          <div className="relative p-2">
            <button 
              onClick={() => !isCollapsed && setIsUserMenuOpen(!isUserMenuOpen)}
              className={`
                w-full flex items-center px-4 py-2 text-[var(--text-secondary)]
                hover:bg-[var(--background-secondary)] rounded-md transition-colors
                ${isUserMenuOpen ? 'bg-[var(--background-secondary)]' : ''}
              `}
            >
              <span className="flex items-center justify-center w-8 flex-shrink-0">
                <div className="w-6 h-6 rounded-full bg-[var(--primary)] flex items-center justify-center text-white text-sm">
                  U
                </div>
              </span>
              {!isCollapsed && (
                <>
                  <span className="ml-2 flex-1 text-left truncate">User Name</span>
                  <ChevronDown 
                    size={16} 
                    className={`ml-2 transition-transform duration-200 flex-shrink-0 ${isUserMenuOpen ? 'rotate-180' : ''}`}
                  />
                </>
              )}
            </button>

            {/* User Menu Dropdown */}
            {!isCollapsed && isUserMenuOpen && (
              <div className="absolute bottom-full left-0 right-0 mb-2 mx-2 bg-[var(--background)] rounded-md shadow-lg app-border py-1">
                <div className="px-4 py-2 border-b app-border">
                  <div className="font-medium text-sm">shadcn</div>
                  <div className="text-xs app-text-secondary">m@example.com</div>
                </div>
                <div className="py-1">
                  <SubNavItem label="Upgrade to Pro" icon={<Sparkles size={16} />} />
                  <SubNavItem label="Account" icon={<User size={16} />} />
                  <SubNavItem label="Billing" icon={<CreditCard size={16} />} />
                  <SubNavItem label="Notifications" icon={<Bell size={16} />} />
                </div>
                <div className="border-t app-border py-1">
                  <SubNavItem label="Log out" icon={<LogOut size={16} />} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  isCollapsed: boolean;
  isActive?: boolean;
  onClick?: () => void;
  rightIcon?: React.ReactNode;
}

function NavItem({ icon, label, isCollapsed, isActive, onClick, rightIcon }: NavItemProps) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center px-4 py-3 text-[var(--text-secondary)]
        hover:bg-[var(--background-secondary)] transition-colors
        ${isActive ? 'bg-[var(--background-secondary)] text-[var(--primary)]' : ''}
      `}
    >
      <span className="flex items-center justify-center w-8">
        {icon}
      </span>
      {!isCollapsed && (
        <>
          <span className="ml-2 flex-1 text-left">{label}</span>
          {rightIcon && <span className="ml-2">{rightIcon}</span>}
        </>
      )}
    </button>
  );
}

interface SubNavItemProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  isActive?: boolean;
}

function SubNavItem({ icon, label, onClick, isActive }: SubNavItemProps) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center py-2 text-[var(--text-secondary)] hover:text-[var(--primary)]
        ${isActive ? 'bg-[var(--background-secondary)]' : ''}
      `}
    >
      <span className="flex items-center justify-center w-5">
        {icon}
      </span>
      <span className="ml-2">{label}</span>
    </button>
  );
} 