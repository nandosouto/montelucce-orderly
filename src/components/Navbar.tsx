
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronDown, Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/' },
    { name: 'Orders', path: '/orders' },
    { name: 'Calculator', path: '/calculator' },
    { name: 'Revenue', path: '/revenue' },
  ];

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <header className="bg-montelucce-black border-b border-montelucce-yellow/20 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <img 
                src="https://i.ibb.co/w3zTz78/montelucce.png" 
                alt="Montelucce" 
                className="h-10 w-auto object-contain"
              />
            </Link>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:block">
            <ul className="flex space-x-4">
              {navItems.map((item) => (
                <li key={item.name}>
                  <Link 
                    to={item.path}
                    className="relative px-3 py-2 text-montelucce-light-gray hover:text-montelucce-yellow transition-colors duration-200 group"
                  >
                    {location.pathname === item.path && (
                      <motion.span 
                        layoutId="activeNavIndicator"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-montelucce-yellow" 
                      />
                    )}
                    {item.name}
                    <span className="absolute inset-x-0 -bottom-1 h-px bg-montelucce-yellow/20 transform scale-x-0 group-hover:scale-x-100 transition-transform" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-montelucce-light-gray hover:text-montelucce-yellow focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile navigation */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          className="md:hidden"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-montelucce-yellow/10">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`block px-3 py-2 rounded-md ${
                  location.pathname === item.path
                    ? 'text-montelucce-yellow bg-montelucce-yellow/10'
                    : 'text-montelucce-light-gray hover:text-montelucce-yellow hover:bg-montelucce-yellow/5'
                } transition-colors duration-200`}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </header>
  );
};

export default Navbar;
