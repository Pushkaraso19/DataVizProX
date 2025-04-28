import { NavLink } from 'react-router-dom';
import logo from '../assets/images/logo.png';

const Header = () => {
  return (
    <header>
      <nav className="absolute w-[99%] top-0 left-0 bg-[#027c68] py-4 px-8 m-2 z-50 shadow-lg rounded-lg">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <NavLink
            to="/"
            className="flex items-center space-x-4 no-underline hover:no-underline"
          >
            <img src={logo} alt="DataViz Pro Logo" className="h-20" />
            <span className="text-5xl font-bold text-[#c4fbcb]">
              DataViz<span className="text-[#34d399]">Pro</span>
            </span>
          </NavLink>

          {/* Navigation Links */}
          <ul className="flex items-center space-x-10">
            {[
              { to: '/', icon: 'fa-home', label: 'Home' },
              { to: '/dashboard', icon: 'fa-chart-line', label: 'Dashboard' },
              { to: '/about', icon: 'fa-info-circle', label: 'About' },
              { to: '/contact', icon: 'fa-envelope', label: 'Contact' },
            ].map(({ to, icon, label }) => (
              <li key={label}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  `text-3xl font-medium transition-colors duration-300 focus:outline-none ${
                    isActive
                      ? 'text-[#81c784] underline'
                      : 'text-[#c4fbcb] hover:text-[#34d399] hover:underline'
                  }`
                }
              >
                <i className={`fas ${icon} mr-2`}></i>
                {label}
              </NavLink>

              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;