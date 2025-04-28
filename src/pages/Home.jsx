// src/pages/Home.jsx
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// Animation variants
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.8, ease: "easeOut" }
  }
};

const slideUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" }
  }
};

const staggerFeatures = {
  hidden: { opacity: 0 },
  visible: (custom) => ({
    opacity: 1,
    transition: {
      delay: 0.2 + (custom * 0.15),
    }
  })
};

const buttonAnimation = {
  initial: { scale: 1 },
  hover: { 
    scale: 1.05,
    boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.15)",
    transition: { type: "spring", stiffness: 400, damping: 10 }
  },
  tap: { scale: 0.95 }
};

// Custom SVG Chart components
const BarChart = () => (
  <motion.div 
    className="absolute top-0 right-0 w-32 h-24 bg-white rounded-lg shadow-lg p-2"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.5, duration: 0.5 }}
  >
    <div className="text-xs text-gray-500 font-medium mb-1">Sales Growth</div>
    <svg width="100%" height="75%" viewBox="0 0 100 50">
      <rect x="10" y="35" width="10" height="15" fill="#10b981" rx="2" />
      <rect x="25" y="25" width="10" height="25" fill="#10b981" rx="2" />
      <rect x="40" y="30" width="10" height="20" fill="#10b981" rx="2" />
      <rect x="55" y="15" width="10" height="35" fill="#10b981" rx="2" />
      <rect x="70" y="5" width="10" height="45" fill="#10b981" rx="2" />
      <line x1="5" y1="50" x2="95" y2="50" stroke="#e5e7eb" strokeWidth="1" />
    </svg>
  </motion.div>
);

const LineChart = () => (
  <motion.div 
    className="absolute bottom-0 left-10 w-40 h-28 bg-white rounded-lg shadow-lg p-2"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.8, duration: 0.5 }}
  >
    <div className="text-xs text-gray-500 font-medium mb-1">Monthly Revenue</div>
    <svg width="100%" height="75%" viewBox="0 0 100 50">
      <path 
        d="M5,45 Q15,20 25,35 T40,25 T60,35 T75,10 T95,25" 
        fill="none" 
        stroke="#14b8a6" 
        strokeWidth="3" 
        strokeLinecap="round" 
      />
      <line x1="5" y1="50" x2="95" y2="50" stroke="#e5e7eb" strokeWidth="1" />
      <g className="dots">
        <circle cx="5" cy="45" r="3" fill="#14b8a6" />
        <circle cx="25" cy="35" r="3" fill="#14b8a6" />
        <circle cx="40" cy="25" r="3" fill="#14b8a6" />
        <circle cx="60" cy="35" r="3" fill="#14b8a6" />
        <circle cx="75" cy="10" r="3" fill="#14b8a6" />
        <circle cx="95" cy="25" r="3" fill="#14b8a6" />
      </g>
    </svg>
  </motion.div>
);

const PieChart = () => (
  <motion.div 
    className="absolute top-10 left-0 w-28 h-28 bg-white rounded-lg shadow-lg p-2"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.65, duration: 0.5 }}
  >
    <div className="text-xs text-gray-500 font-medium mb-1">Market Share</div>
    <svg width="100%" height="70%" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="40" fill="#f3f4f6" />
      <path d="M50,50 L50,10 A40,40 0 0,1 88.3,65 z" fill="#10b981" />
      <path d="M50,50 L88.3,65 A40,40 0 0,1 30,85 z" fill="#14b8a6" />
      <path d="M50,50 L30,85 A40,40 0 0,1 50,10 z" fill="#0d9488" />
      <circle cx="50" cy="50" r="20" fill="white" />
    </svg>
  </motion.div>
);

const ScatterPlot = () => (
  <motion.div 
    className="absolute bottom-10 right-10 w-32 h-28 bg-white rounded-lg shadow-lg p-2"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.9, duration: 0.5 }}
  >
    <div className="text-xs text-gray-500 font-medium mb-1">Customer Data</div>
    <svg width="100%" height="75%" viewBox="0 0 100 60">
      <rect width="100" height="60" fill="#f9fafb" rx="2" />
      <line x1="5" y1="55" x2="95" y2="55" stroke="#e5e7eb" strokeWidth="1" />
      <line x1="5" y1="5" x2="5" y2="55" stroke="#e5e7eb" strokeWidth="1" />
      <circle cx="20" cy="40" r="3" fill="#10b981" />
      <circle cx="30" cy="20" r="3" fill="#10b981" />
      <circle cx="45" cy="30" r="3" fill="#10b981" />
      <circle cx="55" cy="15" r="3" fill="#10b981" />
      <circle cx="65" cy="35" r="3" fill="#10b981" />
      <circle cx="75" cy="25" r="3" fill="#10b981" />
      <circle cx="85" cy="10" r="3" fill="#10b981" />
    </svg>
  </motion.div>
);

const AnalyticsDashboard = () => (
  <motion.div 
    className="relative w-full h-full bg-gray-100 rounded-2xl shadow-2xl overflow-hidden"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 1 }}
  >
    {/* Dashboard Header */}
    <div className="bg-white h-12 w-full flex items-center px-4 border-b border-gray-200">
      <div className="w-3 h-3 bg-red-400 rounded-full mr-2"></div>
      <div className="w-3 h-3 bg-yellow-400 rounded-full mr-2"></div>
      <div className="w-3 h-3 bg-green-400 rounded-full mr-4"></div>
      <div className="flex-1 bg-gray-100 h-6 rounded-md"></div>
    </div>
    
    {/* Dashboard Body */}
    <div className="p-4 relative h-[calc(100%-3rem)]">
      {/* Main Chart Area */}
      <motion.div 
        className="bg-white rounded-lg shadow h-1/2 mb-4 p-3 relative overflow-hidden"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.2, duration: 0.7 }}
      >
        <div className="text-sm text-gray-700 font-medium mb-2">Performance Overview</div>
        {/* Main Chart */}
        <svg width="100%" height="80%" preserveAspectRatio="none" viewBox="0 0 100 50">
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.4"/>
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.1"/>
            </linearGradient>
          </defs>
          <path 
            d="M0,25 C10,20 20,35 30,30 S40,20 50,25 S60,35 70,15 S80,5 90,15 L90,50 L0,50 Z" 
            fill="url(#gradient)" 
          />
          <path 
            d="M0,25 C10,20 20,35 30,30 S40,20 50,25 S60,35 70,15 S80,5 90,15" 
            fill="none" 
            stroke="#10b981" 
            strokeWidth="2" 
          />
        </svg>
      </motion.div>
      
      {/* Stats Grid */}
      <motion.div 
        className="grid grid-cols-3 gap-3 h-1/3"
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1 }
        }}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.5, staggerChildren: 0.1 }}
      >
        <motion.div 
          className="bg-white rounded-lg shadow p-3"
          variants={{
            hidden: { y: 20, opacity: 0 },
            visible: { y: 0, opacity: 1 }
          }}
        >
          <div className="text-xs text-gray-500">Users</div>
          <div className="text-lg font-bold text-gray-800">8,249</div>
          <div className="text-xs text-emerald-600">↑ 12%</div>
        </motion.div>
        <motion.div 
          className="bg-white rounded-lg shadow p-3"
          variants={{
            hidden: { y: 20, opacity: 0 },
            visible: { y: 0, opacity: 1 }
          }}
        >
          <div className="text-xs text-gray-500">Revenue</div>
          <div className="text-lg font-bold text-gray-800">$12,840</div>
          <div className="text-xs text-emerald-600">↑ 8%</div>
        </motion.div>
        <motion.div 
          className="bg-white rounded-lg shadow p-3"
          variants={{
            hidden: { y: 20, opacity: 0 },
            visible: { y: 0, opacity: 1 }
          }}
        >
          <div className="text-xs text-gray-500">Conversion</div>
          <div className="text-lg font-bold text-gray-800">24.3%</div>
          <div className="text-xs text-emerald-600">↑ 4%</div>
        </motion.div>
      </motion.div>
    </div>
    
    {/* Floating Chart Elements */}
    <BarChart />
    <LineChart />
    <PieChart />
    <ScatterPlot />
    
    {/* Animated Data Points */}
    <motion.div 
      className="absolute top-1/4 right-1/3 w-4 h-4 bg-emerald-500 rounded-full"
      animate={{ 
        y: [0, -10, 0],
        opacity: [1, 0.7, 1]
      }}
      transition={{ 
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse"
      }}
    />
    <motion.div 
      className="absolute bottom-1/3 left-1/4 w-3 h-3 bg-teal-500 rounded-full"
      animate={{ 
        y: [0, -8, 0],
        opacity: [1, 0.7, 1]
      }}
      transition={{ 
        duration: 1.5,
        repeat: Infinity,
        repeatType: "reverse",
        delay: 0.5
      }}
    />
  </motion.div>
);

const Home = () => {
  return (
    <div className="container mx-auto px-4 py-4">
      {/* Hero Section */}
      <section className="flex flex-col lg:flex-row items-center justify-between gap-12 min-h-screen pt-2">
        <motion.div 
          className="lg:w-1/2 space-y-6"
          initial="hidden"
          animate="visible"
          variants={slideUp}
        >
          <div className="relative">
            <div className="absolute -left-6 -top-6 w-32 h-32 bg-emerald-100 rounded-full opacity-50 animate-pulse" />
            <div className="absolute right-12 bottom-0 w-16 h-16 bg-teal-100 rounded-full opacity-40 animate-pulse" style={{ animationDelay: "1s" }} />
            <h1 className="text-6xl md:text-7xl font-bold text-gray-800 leading-tight relative z-10">
              Transform Your <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">Data</span> into Actionable <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">Insights</span>
            </h1>
          </div>
          
          <p className="text-2xl text-gray-600 leading-relaxed">
            DataViz Pro helps you transform complex data into intuitive, interactive visualizations that tell a compelling story. Discover hidden patterns and make data-driven decisions with confidence.
          </p>
          
          <div className="pt-8 flex flex-col sm:flex-row gap-4">
            <motion.div
              variants={buttonAnimation}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
              className="inline-block"
            >
              <Link 
                to="/dashboard" 
                className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-500 text-white rounded-lg text-lg font-medium transition-all hover:shadow-lg hover:shadow-emerald-200 inline-flex items-center justify-center w-full sm:w-auto"
              >
                Start Visualizing
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                </svg>
              </Link>
            </motion.div>
          </div>
        </motion.div>
        
        <motion.div 
          className="lg:w-1/2 h-80 md:h-96"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          <div className="relative w-full h-full">
            <div className="absolute -right-8 -bottom-8 w-64 h-64 bg-emerald-100 rounded-full opacity-30" />
            <div className="absolute left-0 top-0 w-28 h-28 bg-teal-100 rounded-full opacity-40" />
            
            {/* Custom Analytics Dashboard Graphic */}
            <div className="relative z-10 w-full h-full">
              <AnalyticsDashboard />
            </div>
            
            {/* Decorative Elements */}
            <motion.div 
              className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full"
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, 0]
              }}
              transition={{ 
                duration: 5,
                repeat: Infinity,
                repeatType: "reverse" 
              }}
            >
              <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <path fill="#10b981" d="M42.9,-66.2C55.9,-54.3,67.2,-42.6,74.6,-28.1C82,-13.6,85.5,3.7,83.1,20.9C80.7,38.1,72.3,55.1,59.2,65.7C46.1,76.3,28.4,80.6,11.5,80.8C-5.4,81,-21.5,77,-34.3,68.7C-47.1,60.4,-56.6,47.7,-64.4,33.8C-72.3,19.9,-78.5,4.7,-78,-10.6C-77.5,-25.9,-70.3,-41.3,-58.6,-53.7C-46.9,-66.1,-30.7,-75.4,-14.6,-76C1.5,-76.6,29.9,-78.1,42.9,-66.2Z" transform="translate(100 100)" />
              </svg>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <motion.section 
        className="py-12"
        initial="hidden"
        animate="visible"
      >
        <div className="text-center mb-16">
          <motion.h2 
            className="text-4xl font-bold text-gray-800 mb-4"
            variants={slideUp}
          >
            Why Choose <span className="text-emerald-600">DataViz Pro</span>
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-600 max-w-3xl mx-auto"
            variants={slideUp}
          >
            Our platform combines powerful visualization tools with intuitive design, making data analysis accessible to everyone.
          </motion.p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <motion.div 
            custom={0} 
            variants={staggerFeatures}
            className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            <div className="bg-emerald-100 rounded-full w-16 h-16 flex items-center justify-center mb-6">
              <i className="fas fa-upload text-2xl text-emerald-600"></i>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">Seamless Import</h3>
            <p className="text-gray-600">Easily upload and process CSV, JSON, and Excel files with our drag-and-drop interface.</p>
          </motion.div>
          
          <motion.div 
            custom={1} 
            variants={staggerFeatures}
            className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            <div className="bg-emerald-100 rounded-full w-16 h-16 flex items-center justify-center mb-6">
              <i className="fas fa-chart-pie text-2xl text-emerald-600"></i>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">Versatile Charts</h3>
            <p className="text-gray-600">Create beautiful bar, line, pie, scatter plots and advanced visualizations with a few clicks.</p>
          </motion.div>
          
          <motion.div 
            custom={2} 
            variants={staggerFeatures}
            className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            <div className="bg-emerald-100 rounded-full w-16 h-16 flex items-center justify-center mb-6">
              <i className="fas fa-user text-2xl text-emerald-600"></i>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">User-Friendly</h3>
            <p className="text-gray-600">Intuitive interface designed for both beginners and data professionals alike.</p>
          </motion.div>
          
          <motion.div 
            custom={3} 
            variants={staggerFeatures}
            className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            <div className="bg-emerald-100 rounded-full w-16 h-16 flex items-center justify-center mb-6">
              <i className="fas fa-database text-2xl text-emerald-600"></i>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">Advanced Analytics</h3>
            <p className="text-gray-600">Leverage D3.js for powerful data processing and create custom visualizations.</p>
          </motion.div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        className="bg-gradient-to-r from-emerald-600 to-teal-500 rounded-2xl p-12 text-white mb-16"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-2/3 mb-8 md:mb-0">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Not Sure Where to Start?</h2>
            <p className="text-xl opacity-90">Our team of data visualization experts is ready to help you unlock the full potential of your data.</p>
          </div>
          <motion.div
            variants={buttonAnimation}
            initial="initial"
            whileHover="hover"
            whileTap="tap"
          >
            <Link to="/contact" className="px-8 py-4 bg-white text-emerald-600 rounded-lg text-lg font-medium transition-all hover:bg-gray-100 inline-flex items-center">
              Contact Us
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </Link>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default Home;