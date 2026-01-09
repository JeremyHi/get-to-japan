'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Plane, User, Menu, LogOut, Settings, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, isAuthenticated, logout, isLoading } = useAuth();
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close user menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    setIsMenuOpen(false);
  };

  return (
    <header className="glass sticky top-0 z-50">
      <div className="container-main">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ rotate: 15 }}
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-sakura-500)] to-[var(--color-sakura-400)] flex items-center justify-center"
            >
              <Plane className="w-5 h-5 text-[var(--color-indigo-950)]" />
            </motion.div>
            <span className="text-display text-xl text-[var(--color-indigo-100)]">
              Just Get Me There
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/how-it-works" className="btn btn-ghost">
              How it Works
            </Link>
            <Link href="/pricing" className="btn btn-ghost">
              Pricing
            </Link>

            {isLoading ? (
              <div className="w-8 h-8 rounded-full bg-[var(--color-indigo-800)] animate-pulse" />
            ) : isAuthenticated && user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[var(--color-indigo-800)] transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--color-ocean-500)] to-[var(--color-ocean-400)] flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm text-[var(--color-indigo-200)] max-w-[120px] truncate">
                    {user.email}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-[var(--color-indigo-400)] transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-56 rounded-xl bg-[var(--color-indigo-900)] border border-[var(--color-indigo-700)] shadow-xl overflow-hidden"
                    >
                      <div className="p-3 border-b border-[var(--color-indigo-800)]">
                        <p className="text-sm font-medium text-[var(--color-indigo-100)] truncate">
                          {user.email}
                        </p>
                        <p className="text-xs text-[var(--color-indigo-500)] mt-0.5 capitalize">
                          {user.subscriptionTier} Plan
                          {!user.emailVerified && (
                            <span className="ml-2 text-[var(--color-warning)]">
                              (Unverified)
                            </span>
                          )}
                        </p>
                      </div>
                      <div className="p-2">
                        <Link
                          href="/account"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[var(--color-indigo-300)] hover:bg-[var(--color-indigo-800)] hover:text-[var(--color-indigo-100)] transition-colors"
                        >
                          <Settings className="w-4 h-4" />
                          Account Settings
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[var(--color-indigo-300)] hover:bg-[var(--color-indigo-800)] hover:text-[var(--color-indigo-100)] transition-colors w-full"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link href="/login" className="btn btn-ghost">
                  Log in
                </Link>
                <Link href="/signup" className="btn btn-primary btn-sm">
                  Get Started
                </Link>
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden btn btn-ghost"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden py-4 border-t border-[var(--color-indigo-800)]"
            >
              <div className="flex flex-col gap-2">
                <Link
                  href="/how-it-works"
                  onClick={() => setIsMenuOpen(false)}
                  className="btn btn-ghost justify-start"
                >
                  How it Works
                </Link>
                <Link
                  href="/pricing"
                  onClick={() => setIsMenuOpen(false)}
                  className="btn btn-ghost justify-start"
                >
                  Pricing
                </Link>

                {isAuthenticated && user ? (
                  <>
                    <div className="my-2 border-t border-[var(--color-indigo-800)]" />
                    <div className="px-3 py-2">
                      <p className="text-sm font-medium text-[var(--color-indigo-200)]">
                        {user.email}
                      </p>
                      <p className="text-xs text-[var(--color-indigo-500)] capitalize">
                        {user.subscriptionTier} Plan
                      </p>
                    </div>
                    <Link
                      href="/account"
                      onClick={() => setIsMenuOpen(false)}
                      className="btn btn-ghost justify-start"
                    >
                      <Settings className="w-4 h-4" />
                      Account Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="btn btn-ghost justify-start text-[var(--color-error)]"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="btn btn-ghost justify-start"
                    >
                      Log in
                    </Link>
                    <Link
                      href="/signup"
                      onClick={() => setIsMenuOpen(false)}
                      className="btn btn-primary"
                    >
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
