
import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';

interface LayoutProps {
  children: React.ReactNode;
  fullWidth?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, fullWidth = false }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-vidsmith-border backdrop-blur-sm bg-vidsmith-darker/70 sticky top-0 z-10">
        <div className={`mx-auto px-4 py-4 flex items-center justify-between ${fullWidth ? 'w-full' : 'container'}`}>
          <Link to="/">
            <Logo />
          </Link>
          <nav className="hidden md:flex items-center space-x-8">
            <a href="/#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
            <a href="/#how-it-works" className="text-gray-300 hover:text-white transition-colors">How It Works</a>
            <Link to="/upload" className="btn-primary">Get Started</Link>
          </nav>
          <button className="block md:hidden text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        </div>
      </header>
      <main className="flex-grow bg-gradient-to-b from-vidsmith-darker to-black">
        {children}
      </main>
      <footer className="border-t border-vidsmith-border py-6">
        <div className="container mx-auto px-4 text-center text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} CreAItive. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
