// src/components/Footer.jsx
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-1 lg:col-span-1">
            <Link to="/" className="inline-block mb-6">
              <h2 className="text-2xl font-bold">
                DataViz<span className="text-emerald-400">Pro</span>
              </h2>
            </Link>
            <p className="text-gray-400 mb-6">
              Transform your data into clear, actionable insights with our powerful visualization platform.
            </p>
            <div className="flex space-x-4">
              <motion.a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-gray-800 hover:bg-emerald-600 h-10 w-10 rounded-full flex items-center justify-center transition-colors"
                whileHover={{ y: -3 }}
              >
                <i className="fab fa-twitter"></i>
              </motion.a>
              <motion.a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-gray-800 hover:bg-emerald-600 h-10 w-10 rounded-full flex items-center justify-center transition-colors"
                whileHover={{ y: -3 }}
              >
                <i className="fab fa-linkedin-in"></i>
              </motion.a>
              <motion.a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-gray-800 hover:bg-emerald-600 h-10 w-10 rounded-full flex items-center justify-center transition-colors"
                whileHover={{ y: -3 }}
              >
                <i className="fab fa-github"></i>
              </motion.a>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4 text-emerald-400">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-gray-400 hover:text-white transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          
          {/* Contact Info */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4 text-emerald-400">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <i className="fas fa-map-marker-alt text-emerald-400 mt-1 mr-3"></i>
                <span className="text-gray-400">Konkan Gyanpeeth College of Engineering, Sankul, Vengaon Road, Dahivali, Karjat, Raigad, Maharashtra, India, 410201</span>
              </li>
              <li className="flex items-center">
                <i className="fas fa-envelope text-emerald-400 mr-3"></i>
                <a href="mailto:info@datavizpro.com" className="text-gray-400 hover:text-white transition-colors">
                  info.datavizpro@gmail.com
                </a>
              </li>
              <li className="flex items-center">
                <i className="fas fa-phone text-emerald-400 mr-3"></i>
                <a href="tel:+919172220935" className="text-gray-400 hover:text-white transition-colors">
                  +91 91722-20935
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 pt-6 text-center text-gray-500">
          <p>&copy; {year} DataViz Pro. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;