'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { cn } from '@/lib/utils';

const navLinks = [
  { label: 'About', href: '/about' },
  { label: 'Discography', href: '/discography' },
  { label: 'Events', href: '/events' },
  { label: 'Merch', href: '/merch' },
  { label: 'Media', href: '/media' },
  { label: 'Contact', href: '/contact' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const totalItems = useCartStore((s) => s.getTotalItems());
  const [cartOpen, setCartOpen] = useState(false);
  const prevPathname = useRef(pathname);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const style = document.getElementById('scrollbar-glow-style') || document.createElement('style');
    style.id = 'scrollbar-glow-style';
    style.textContent = scrolled
      ? `::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: rgba(32,96,160,0.8); border-radius: 999px; box-shadow: 0 0 8px 2px rgba(32,96,160,0.9), 0 0 16px 4px rgba(32,96,160,0.5); }`
      : `::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 999px; }`;
    document.head.appendChild(style);
  }, [scrolled]);

  // Close mobile menu on route change
  useEffect(() => {
    if (prevPathname.current !== pathname) {
      setMobileOpen(false);
      prevPathname.current = pathname;
    }
  }, [pathname]);

  const handleCartToggle = () => {
    // Dispatch custom event to open cart drawer
    window.dispatchEvent(new CustomEvent('kpr:cart:open'));
  };

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled
            ? 'bg-bg-base/95 backdrop-blur-md border-b border-accent-dim/20 shadow-[0_4px_20px_rgba(0,0,0,0.4)]'
            : 'bg-transparent'
        )}
      >
        <nav className="container-kpr flex items-center justify-between h-[72px]">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 group shrink-0"
            aria-label="Kelompok Penerbang Roket - Home"
          >
            <div className="relative">
              <div className="w-8 h-8 border border-accent/60 flex items-center justify-center group-hover:border-accent-mid transition-colors duration-300">
                <span
                  className="font-display text-sm text-accent-bright group-hover:text-accent-glow transition-colors duration-300"
                  style={{ letterSpacing: '0.05em' }}
                >
                  KPR
                </span>
              </div>
              <div className="absolute inset-0 bg-accent/10 group-hover:bg-accent/20 transition-colors duration-300" />
            </div>
            <span className="hidden sm:block font-heading font-semibold text-sm text-text-secondary group-hover:text-text-primary transition-colors duration-300 tracking-wider uppercase">
              Kelompok Penerbang Roket
            </span>
          </Link>

          {/* Desktop nav */}
          <ul className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    'font-heading font-medium text-base uppercase tracking-wider transition-colors duration-200 relative group',
                    pathname.startsWith(link.href)
                      ? 'text-accent-bright'
                      : 'text-text-muted hover:text-text-primary'
                  )}
                >
                  {link.label}
                  <span
                    className={cn(
                      'absolute -bottom-1 left-0 h-px bg-accent-mid transition-all duration-300',
                      pathname.startsWith(link.href)
                        ? 'w-full'
                        : 'w-0 group-hover:w-full'
                    )}
                  />
                </Link>
              </li>
            ))}
          </ul>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleCartToggle}
              className="relative flex items-center justify-center w-10 h-10 text-text-muted hover:text-text-primary transition-colors duration-200"
              aria-label={`Cart - ${totalItems} items`}
            >
              <ShoppingBag size={20} />
              {totalItems > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 bg-accent-mid text-bg-base text-[10px] font-mono font-medium rounded-full flex items-center justify-center px-0.5"
                >
                  {totalItems > 99 ? '99+' : totalItems}
                </motion.span>
              )}
            </button>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="lg:hidden flex items-center justify-center w-10 h-10 text-text-muted hover:text-text-primary transition-colors duration-200"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
            >
              <AnimatePresence mode="wait" initial={false}>
                {mobileOpen ? (
                  <motion.span
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <X size={20} />
                  </motion.span>
                ) : (
                  <motion.span
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Menu size={20} />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed top-[72px] left-0 right-0 z-40 bg-bg-base/98 backdrop-blur-md border-b border-accent-dim/20 lg:hidden"
          >
            <nav className="container-kpr py-6">
              <ul className="flex flex-col gap-1">
                {navLinks.map((link, i) => (
                  <motion.li
                    key={link.href}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        'flex items-center gap-3 py-3 px-2 font-heading font-semibold text-lg uppercase tracking-wider border-b border-accent-dim/10 transition-colors duration-200',
                        pathname.startsWith(link.href)
                          ? 'text-accent-bright'
                          : 'text-text-secondary hover:text-text-primary'
                      )}
                    >
                      <span className="font-mono text-xs text-text-faint">
                        0{i + 1}
                      </span>
                      {link.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
