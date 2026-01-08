'use client';

import { motion } from 'framer-motion';
import { Plane, User, Menu } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
            <Link href="/login" className="btn btn-ghost">
              Log in
            </Link>
            <Link href="/signup" className="btn btn-primary btn-sm">
              Get Started
            </Link>
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
        {isMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden py-4 border-t border-[var(--color-indigo-800)]"
          >
            <div className="flex flex-col gap-2">
              <Link href="/how-it-works" className="btn btn-ghost justify-start">
                How it Works
              </Link>
              <Link href="/pricing" className="btn btn-ghost justify-start">
                Pricing
              </Link>
              <Link href="/login" className="btn btn-ghost justify-start">
                Log in
              </Link>
              <Link href="/signup" className="btn btn-primary">
                Get Started
              </Link>
            </div>
          </motion.nav>
        )}
      </div>
    </header>
  );
}
