import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  Sun,
  X,
  User,
  Boxes,
  BarChart3,
  ShieldCheck,
  Calculator
} from 'lucide-react';

const Layout = ({
  children,
  user,
  onLogout,
  toggleTheme,
  darkMode,
  title = "Inventory Ledger",
  onOpenProfile
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const NavItem = ({ icon: Icon, label, path, onClick, active }) => (
    <button
      onClick={() => {
        if (onClick) onClick();
        else if (path) navigate(path);
        setIsSidebarOpen(false);
      }}
      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg font-medium text-xs tracking-tight transition-all duration-150 group select-none cursor-pointer ${
        active
          ? darkMode
            ? 'border border-[#19422B] bg-[#0D2116] text-[#4ADE80]'
            : 'border border-[#BBF7D0] bg-[#F0FDF4] text-[#15803D]'
          : darkMode
          ? 'border border-transparent text-[#A3A39E] hover:bg-[#1A1A1A] hover:text-[#F5F5F3]'
          : 'border border-transparent text-[#4A4A46] hover:bg-[#F3F2EE] hover:text-[#111111]'
      }`}
    >
      <Icon
        size={17}
        className={
          active
            ? darkMode
              ? 'text-[#4ADE80]'
              : 'text-[#15803D]'
            : 'text-[#767670] group-hover:text-current'
        }
      />
      <span>{label}</span>
    </button>
  );

  return (
    <div
      className={`min-h-screen ${
        darkMode ? 'bg-[#0A0A0A] text-[#F5F5F3]' : 'bg-[#FAF9F6] text-[#111111]'
      }`}
    >
      <div className="flex min-h-screen">
        {/* Sidebar Overlay (Mobile / Drawer) */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 transition-opacity"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed top-0 left-0 z-50 h-screen w-64 transform transition-transform duration-200 ease-in-out flex flex-col border-r shadow-xl ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } ${darkMode ? 'bg-[#141414] border-[#262626]' : 'bg-white border-[#E4E4E0]'}`}
        >
          {/* Sidebar Header */}
          <div
            className={`p-4 flex items-center justify-between border-b ${
              darkMode ? 'border-[#262626]' : 'border-[#E4E4E0]'
            }`}
          >
            <Link to="/" className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#111111] dark:bg-[#F5F5F3] text-[#FAF9F6] dark:text-[#0A0A0A]">
                <Boxes size={17} strokeWidth={2.2} />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-base tracking-tight leading-none">
                    Inventa
                  </span>
                  <span
                    className={`rounded px-1.5 py-0.5 text-[9px] font-mono uppercase border ${
                      darkMode
                        ? 'border-[#262626] bg-[#1A1A1A] text-[#A3A39E]'
                        : 'border-[#E4E4E0] bg-[#F3F2EE] text-[#4A4A46]'
                    }`}
                  >
                    FEFO
                  </span>
                </div>
                <p
                  className={`text-[10px] font-mono uppercase tracking-wider mt-0.5 ${
                    darkMode ? 'text-[#6E6E68]' : 'text-[#767670]'
                  }`}
                >
                  Store Workspace
                </p>
              </div>
            </Link>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-1.5 rounded-md text-[#767670] hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
              aria-label="Close sidebar"
            >
              <X size={18} />
            </button>
          </div>

          {/* Navigation */}
          <div className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
            <p
              className={`px-3 text-[10px] font-mono font-bold uppercase tracking-wider mb-2 ${
                darkMode ? 'text-[#6E6E68]' : 'text-[#767670]'
              }`}
            >
              Workspace
            </p>
            <NavItem
              icon={LayoutDashboard}
              label="Inventory Ledger"
              path="/dashboard"
              active={location.pathname === '/dashboard'}
            />
            <NavItem
              icon={BarChart3}
              label="Shelf Analytics"
              path="/analytics"
              active={location.pathname === '/analytics'}
            />
            <NavItem
              icon={Calculator}
              label="Expiry Calculator"
              path="/expiry-calculator"
              active={location.pathname === '/expiry-calculator'}
            />
          </div>

          {/* WhatsApp Status Card */}
          <div className="px-3 pb-3">
            <div
              className={`rounded-lg border p-3 text-xs ${
                darkMode
                  ? 'border-[#262626] bg-[#1A1A1A] text-[#A3A39E]'
                  : 'border-[#E4E4E0] bg-[#FAF9F6] text-[#4A4A46]'
              }`}
            >
              <div className="flex items-center gap-1.5 text-[#15803D] dark:text-[#4ADE80] font-semibold text-[11px]">
                <ShieldCheck size={14} />
                <span>WhatsApp Intake Active</span>
              </div>
              <div className="mt-1 text-[11px] leading-snug">
                Send product label photos on WhatsApp and reply <strong>YES</strong> to log.
              </div>
            </div>
          </div>

          {/* User Profile Footer */}
          <div
            className={`p-3 border-t ${
              darkMode ? 'border-[#262626]' : 'border-[#E4E4E0]'
            }`}
          >
            <div
              className={`flex items-center gap-2.5 p-2 rounded-lg mb-2 ${
                darkMode ? 'bg-[#1A1A1A]' : 'bg-[#F3F2EE]'
              }`}
            >
              <div className="w-8 h-8 rounded-md bg-[#111111] dark:bg-[#F5F5F3] text-[#FAF9F6] dark:text-[#0A0A0A] flex items-center justify-center font-mono font-bold text-xs">
                {user?.username?.substring(0, 2).toUpperCase() || 'US'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold truncate">
                  {user?.username || 'Store Manager'}
                </p>
                <p
                  className={`text-[10px] font-mono truncate ${
                    darkMode ? 'text-[#6E6E68]' : 'text-[#767670]'
                  }`}
                >
                  {user?.phoneNumber || ''}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-1.5 text-xs">
              <button
                onClick={onOpenProfile}
                className={`flex items-center justify-center gap-1.5 py-1.5 rounded-md border font-medium transition-colors cursor-pointer ${
                  darkMode
                    ? 'border-[#262626] bg-[#1A1A1A] text-[#A3A39E] hover:bg-[#222222] hover:text-white'
                    : 'border-[#E4E4E0] bg-white text-[#4A4A46] hover:bg-[#F3F2EE] hover:text-[#111111]'
                }`}
              >
                <User size={13} />
                <span>Profile</span>
              </button>
              <button
                onClick={onLogout}
                className={`flex items-center justify-center gap-1.5 py-1.5 rounded-md border font-medium transition-colors cursor-pointer ${
                  darkMode
                    ? 'border-[#5E1A1A] bg-[#2A1212] text-[#F87171] hover:bg-[#3B1818]'
                    : 'border-[#FECACA] bg-[#FEF2F2] text-[#B91C1C] hover:bg-[#FEE2E2]'
                }`}
              >
                <LogOut size={13} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Topbar */}
          <header
            className={`sticky top-0 z-30 px-4 py-3 sm:px-6 flex items-center justify-between border-b ${
              darkMode
                ? 'bg-[#0A0A0A]/95 border-[#262626]'
                : 'bg-[#FAF9F6]/95 border-[#E4E4E0]'
            } backdrop-blur-sm`}
          >
            <div className="flex items-center gap-3">
              <button
                onClick={toggleSidebar}
                aria-label="Open navigation drawer"
                className={`p-2 rounded-lg border text-sm flex items-center justify-center cursor-pointer transition-colors ${
                  darkMode
                    ? 'border-[#262626] bg-[#141414] text-[#F5F5F3] hover:bg-[#1A1A1A]'
                    : 'border-[#E4E4E0] bg-white text-[#111111] hover:bg-[#F3F2EE]'
                }`}
              >
                <Menu size={17} />
              </button>
              <div>
                <h1 className="text-sm sm:text-base font-bold tracking-tight">
                  {title}
                </h1>
                <p
                  className={`text-[11px] ${
                    darkMode ? 'text-[#6E6E68]' : 'text-[#767670]'
                  }`}
                >
                  Inventa FEFO Shelf Control
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div
                className={`hidden items-center gap-2 rounded-full border px-3 py-1 text-xs font-mono md:flex ${
                  darkMode
                    ? 'border-[#262626] bg-[#141414] text-[#A3A39E]'
                    : 'border-[#E4E4E0] bg-white text-[#4A4A46]'
                }`}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-[#15803D] dark:bg-[#4ADE80]" />
                <span>WhatsApp Connected</span>
              </div>
              <button
                onClick={toggleTheme}
                aria-label="Toggle color theme"
                className={`w-9 h-9 rounded-lg border flex items-center justify-center transition-colors cursor-pointer ${
                  darkMode
                    ? 'border-[#262626] bg-[#141414] text-[#F5F5F3] hover:bg-[#1A1A1A]'
                    : 'border-[#E4E4E0] bg-white text-[#4A4A46] hover:bg-[#F3F2EE]'
                }`}
              >
                {darkMode ? <Sun size={15} /> : <Moon size={15} />}
              </button>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto w-full max-w-[1600px] mx-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
