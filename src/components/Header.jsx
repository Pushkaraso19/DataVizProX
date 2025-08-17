import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import logo from '../assets/images/logo.png';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigationItems = [
    { to: '/', icon: 'fa-home', label: 'Home' },
    { to: '/dashboard', icon: 'fa-chart-line', label: 'Dashboard' },
    { to: '/about', icon: 'fa-info-circle', label: 'About' },
    { to: '/contact', icon: 'fa-envelope', label: 'Contact' },
  ];

  return (
    <header className="absolute w-full top-0 left-0 z-50 transition-all duration-300">
      <nav className={`mx-2 mt-2 rounded-xl transition-all duration-500 bg-gradient-to-r from-emerald-600/95 to-teal-500/95 backdrop-blur-lg shadow-2xl`}>
        <div className="relative z-50 px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            {/* Logo Section */}
            <NavLink
              to="/"
              className="flex items-center space-x-3 group no-underline hover:no-underline transition-transform duration-300 focus:no-underline active:no-underline focus:text-white active:text-white focus:ring-0 focus:border-none active:ring-0 active:border-none"
            >
              <div className="relative">
                <img 
                  src={logo} 
                  alt="DataViz ProX Logo" 
                  className="h-20 w-20"
                />
              </div>
              <div className="flex flex-col mt-1 ">
                <span className={`text-3xl font-bold transition-colors duration-300 text-emerald-50`}>
                  DataViz<span className={`text-emerald-400`}> ProX</span>
                </span>
                <span className={`font-medium transition-colors duration-300 text-emerald-50`}>
                  Visualize Your Data
                </span>
              </div>
            </NavLink>

            {/* Desktop Navigation */}
            <div className="flex items-center space-x-4 max-lg:hidden">
              {navigationItems.map(({ to, icon, label }) => (
                <NavLink
                  key={label}
                  to={to}
                  className={({ isActive }) => {
                    const baseClasses = "relative px-4 py-2 rounded-xl font-medium transition-all duration-300 group flex items-center space-x-2 text-emerald-50 no-underline hover:no-underline focus:no-underline active:no-underline focus:text-white active:text-white focus:ring-0 focus:border-none active:ring-0 active:border-none";
                    return `${baseClasses} ${
                      isActive ? 'bg-white/20 text-white backdrop-blur-sm shadow-lg hover:text-white no-underline hover:no-underline' : 'text-emerald-50 hover:bg-white/10 hover:text-white'
                    }`;
                  }}
                >
                  {({ isActive }) => (
                    <>
                      <i className={`fas ${icon}  transition-transform duration-300 group-hover:scale-110`}></i>
                      <span>{label}</span>
                      {/* {isActive && (
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-5 h-1 bg-current rounded-l"></div>
                      )} */}
                    </>
                  )}
                </NavLink>
              ))}
              
              {/* CTA Button */}
              <div className="ml-4 pl-4 border-l border-white/20">
                <NavLink
                  to="/dashboard"
                  className={`px-6 py-2 rounded-xl font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center space-x-2 bg-white text-emerald-600 no-underline hover:no-underline hover:text-emerald-600 focus:no-underline active:no-underline focus:text-emerald-600 active:text-emerald-600 focus:ring-0 focus:border-none active:ring-0 active:border-none`}
                >
                  <i className="fas fa-rocket text-l"></i>
                  <span className="text-l">Get Started</span>
                </NavLink>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`lg:hidden p-2 rounded-xl transition-all duration-300 text-white hover:bg-white/10`}
              aria-expanded={isMobileMenuOpen}
              aria-label="Toggle mobile menu"
            >
              <div className="relative w-6 h-6">
                <span className={`absolute left-0 w-full h-0.5 bg-current transform transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 top-2.5' : 'top-1'}`} />
                <span className={`absolute left-0 w-full h-0.5 bg-current transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : 'top-2.5'}`} />
                <span className={`absolute left-0 w-full h-0.5 bg-current transform transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 top-2.5' : 'top-4'}`} />                                         
              </div>
            </button>
          </div>

          {/* Mobile Navigation */}
          <div className={`lg:hidden mt-4 z-50 ${isMobileMenuOpen ? 'block' : 'hidden'} `}>
            <div className={`py-4 border-t border-white/20`}>
              <div className="space-y-2">
                {navigationItems.map(({ to, icon, label }) => (
                  <NavLink
                    key={label}
                    to={to}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) => {
                      const baseClasses = "flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-300";
                      return `${baseClasses} ${
                        isActive ? 'bg-white/20 text-white shadow-lg' : 'text-emerald-50 hover:bg-white/10 hover:text-white'
                      }`;
                    }}
                  >
                    <i className={`fas ${icon} text-sm`}></i>
                    <span>{label}</span>
                  </NavLink>
                ))}
                
                {/* Mobile CTA */}
                <div className="pt-4 mt-4 border-t border-white/20">
                  <NavLink
                    to="/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-xl font-medium transition-all duration-300 bg-white text-emerald-600 hover:bg-emerald-50`}
                  >
                    <i className="fas fa-rocket text-sm text-gradient-text"></i>
                    <span>Get Started</span>
                  </NavLink>
                </div>
              </div>
            </div>
          </div>

          {/* Backdrop for mobile menu */}
          {isMobileMenuOpen && (
            <div 
              className="lg:hidden fixed inset z-30"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-hidden="true"
            ></div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
