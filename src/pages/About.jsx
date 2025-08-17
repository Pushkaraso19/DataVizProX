import { motion } from 'framer-motion';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Github, Linkedin } from 'lucide-react';
import PushkarImg from '../assets/images/Team Members/team_member1.jpg';

// SVG Icons as components
const BarChartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="12" width="6" height="8"></rect>
    <rect x="9" y="8" width="6" height="12"></rect>
    <rect x="15" y="4" width="6" height="16"></rect>
  </svg>
);

const DataImportIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="7 10 12 15 17 10"></polyline>
    <line x1="12" y1="15" x2="12" y2="3"></line>
  </svg>
);

const DataProcessingIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="2" y1="12" x2="22" y2="12"></line>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
  </svg>
);

const StyleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <circle cx="8" cy="8" r="2"></circle>
    <circle cx="16" cy="8" r="2"></circle>
    <circle cx="16" cy="16" r="2"></circle>
    <circle cx="8" cy="16" r="2"></circle>
  </svg>
);

const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
  </svg>
);

const ExportIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="17 8 12 3 7 8"></polyline>
    <line x1="12" y1="3" x2="12" y2="15"></line>
  </svg>
);

const About = () => {
  const navigate = useNavigate();
  const featureRef = useRef(null);
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

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

  const features = [
    {
      icon: <DataImportIcon />,
      title: "Versatile Data Import",
      description: "Upload CSV, JSON, Excel files (including multi-sheet Excel support), or connect to APIs and databases for real-time data feeds."
    },
    {
      icon: <BarChartIcon />,
      title: "Advanced Chart Library",
      description: "Create stunning bar, line, pie, scatter, area, radar, and heatmap visualizations with just a few clicks."
    },
    {
      icon: <DataProcessingIcon />,
      title: "Large File Handling",
      description: "Effortlessly upload and process files with hundreds of thousands of rows, using chunked processing and progress indicators for smooth performance."
    },
    {
      icon: <StyleIcon />,
      title: "Multi-Sheet Excel Support",
      description: "Upload Excel files with multiple sheets and select which sheets to visualize."
    },
    {
      icon: <EditIcon />,
      title: "Smart Data Sampling",
      description: "Automatic data sampling for massive datasets to keep your experience fast and responsive."
    },
    {
      icon: <DataProcessingIcon />,
      title: "Real-time Data Processing",
      description: "Filter, transform, and analyze your data on-the-fly with interactive dashboards and dynamic updates."
    },
    {
      icon: <EditIcon />,
      title: "Advanced Table Editing",
      description: "Edit data directly in tables, with instant updates and smart pagination for large datasets."
    },
    {
      icon: <StyleIcon />,
      title: "Custom Styling & Themes",
      description: "Personalize every aspect of your visualizations with custom color palettes, gradients, fonts, and dark/light themes."
    },
    {
      icon: <EditIcon />,
      title: "Axis Customization",
      description: "Fully customize axes with labels, scales, grids, and transformations to highlight what matters."
    },
    {
      icon: <ExportIcon />,
      title: "Multiple Export Options",
      description: "Export your visualizations and tables as SVG, PNG, PDF, CSV, or Excel, or embed them directly into your website."
    },
    {
      icon: <StyleIcon />,
      title: "Responsive Design",
      description: "Enjoy a seamless experience on any device, from desktop to mobile."
    },
    {
      icon: <DataProcessingIcon />,
      title: "Performance Warnings & Tips",
      description: "Get real-time feedback and tips when working with large datasets for optimal performance."
    },
    {
      icon: <BarChartIcon />,
      title: "Interactive Chart Controls",
      description: "Zoom, pan, and filter your charts interactively for deeper insights."
    },
    {
      icon: <StyleIcon />,
      title: "Accessibility Focus",
      description: "Designed with accessibility in mind for all users."
    }
  ];

  return (
    <div className="bg-gradient-to-b from-[#dff8e1] to-[#c4fbcb] min-h-screen py-20">
      <motion.div 
        className="container mx-auto px-6 max-w-7xl"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        {/* Hero Section */}
        <motion.div 
          className="text-center mb-20"
          variants={slideUp}
        >
          
          <motion.h1 
            className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-gray-800"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            About{' '}
            <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
              DataViz ProX
            </span>
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Empowering professionals and enthusiasts to transform complex data into beautiful, 
            interactive visualizations that drive informed decision-making.
          </motion.p>
        </motion.div>
        
        {/* Mission Section */}
        <motion.div 
          className="mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div 
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
              whileHover={{ y: -5 }}
            >
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-800">Our Mission</h3>
              </div>
              <p className="text-gray-600 leading-relaxed mb-6">
                At DataViz ProX, we believe that data should be accessible and understandable to everyone. 
                Our mission is to empower professionals, researchers, and enthusiasts with the ability to 
                visualize complex data in a simple and effective way.
              </p>
              <div className="flex items-center text-emerald-600">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></div>
                <span className="font-semibold">Making Data Accessible</span>
              </div>
            </motion.div>
            
            <motion.div 
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
              whileHover={{ y: -5 }}
            >
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-800">Our Vision</h3>
              </div>
              <p className="text-gray-600 leading-relaxed mb-6">
                With a focus on user experience and functionality, our platform offers a variety of 
                visualization options tailored to meet diverse needs, making data-driven insights 
                accessible to all and transforming raw data into meaningful stories.
              </p>
              <div className="flex items-center text-teal-600">
                <div className="w-2 h-2 bg-teal-500 rounded-full mr-3"></div>
                <span className="font-semibold">Driving Innovation</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
        
        {/* Features Section */}
        <motion.section 
          className="mb-20"
          ref={featureRef}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.1 }}
          variants={containerVariants}
        >
          <div className="text-center mb-16">
            <motion.div 
              className="inline-flex items-center bg-white/60 backdrop-blur-sm rounded-full px-4 py-2 mb-6"
              variants={itemVariants}
            >
              <span className="text-emerald-600 font-semibold text-sm">POWERFUL FEATURES</span>
            </motion.div>
            <motion.h2 
              className="text-4xl md:text-5xl font-bold text-gray-800 mb-6"
              variants={itemVariants}
            >
              Everything You Need to{' '}
              <span className="text-emerald-600">Visualize Data</span>
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-600 max-w-3xl mx-auto"
              variants={itemVariants}
            >
              Comprehensive tools designed to make your data visualization journey seamless and impactful.
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl  group"
                variants={itemVariants}
                whileHover={{ y: -8 }}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.1 }}
              >
                <div className="w-16 h-16 p-2 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 mb-6 group-hover:bg-emerald-200 transition-colors duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-800">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>
        
        {/* Developer Section */}
        <section className="mb-32 relative overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0 opacity-10 pointer-events-none select-none">
            <div className="absolute top-24 left-16 w-36 h-36 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-24 right-16 w-44 h-44 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
          </div>

          {/* Section Header */}
          <motion.div 
            className="text-center mb-20"
            variants={itemVariants}
          >
            <motion.div 
              className="inline-flex items-center bg-gradient-to-r from-emerald-500/10 to-teal-500/10 backdrop-blur-md rounded-full px-7 py-3 mb-6 border border-emerald-300/40"
              whileHover={{ scale: 1.07 }}
            >
              <div className="w-3 h-3 bg-emerald-500 rounded-full mr-3 animate-pulse"></div>
              <span className="text-emerald-700 font-semibold text-sm tracking-wide">MEET THE CREATOR</span>
            </motion.div>
            <motion.h2 
              className="text-4xl md:text-5xl font-extrabold text-gray-900"
              variants={itemVariants}
            >
              Built with Passion by{' '}
              <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                Pushkar Asodekar
              </span>
            </motion.h2>
          </motion.div>

          {/* Main Content */}
          <div className="max-w-8xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center px-6 lg:px-16">
            {/* Developer Image */}
            <motion.div
              className="relative group flex justify-center lg:justify-start"
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9 }}
            >
              <motion.div
                className="relative"
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.5 }}
              >
                {/* Floating Gradient Orbs */}
                <div className="absolute -top-8 -left-8 w-20 h-20 bg-gradient-to-br from-emerald-400/20 to-teal-500/20 rounded-2xl rotate-12 blur-2xl animate-pulse"></div>
                <div className="absolute -bottom-6 -right-6 w-16 h-16 bg-gradient-to-br from-teal-400/25 to-emerald-500/25 rounded-xl -rotate-12 blur-xl animate-pulse delay-1000"></div>

                {/* Profile Image with Clean Shadow - Made Larger */}
                <div className="relative w-[25rem] h-[25rem] rounded-full overflow-hidden shadow-[0_8px_32px_rgba(16,185,129,0.15)] border-4 border-white bg-gradient-to-tr from-emerald-500 to-teal-500 p-1">
                  <div className="w-full h-full rounded-full overflow-hidden bg-white">
                    <img
                      src={PushkarImg}
                      alt="Pushkar Asodekar"
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-emerald-900/20 group-hover:to-emerald-900/30 transition-all duration-300"></div>
                  </div>
                </div>

                {/* Name Badge with Left-Right Layout - Optimized */}
                <motion.div
                  className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-white text-gray-900 px-6 py-4 rounded-2xl border border-emerald-100 min-w-[300px] shadow-[0_8px_24px_rgba(16,185,129,0.12)]"
                  initial={{ scale: 0, y: 20 }}
                  whileInView={{ scale: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center justify-between gap-4">
                    {/* Name and Title on Left */}
                    <div className="text-left">
                      <div className="font-bold text-xl text-gray-900 mb-0.5">Pushkar Asodekar</div>
                      <div className="text-emerald-600 text-sm font-semibold tracking-wide">Full Stack Developer</div>
                    </div>
                    
                    {/* Enhanced Social Buttons on Right */}
                    <div className="flex gap-2">
                      <motion.a
                        href="https://github.com/Pushkaraso19"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700 text-white rounded-full flex items-center justify-center border-2 border-emerald-300 shadow-[0_4px_12px_rgba(16,185,129,0.3)] transition-all duration-300 outline-none focus:outline-none hover:shadow-[0_6px_18px_rgba(16,185,129,0.4)] hover:border-emerald-200"
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                        style={{ textDecoration: 'none' }}
                      >
                        <Github size={16} className="text-white transition-transform duration-300" />
                      </motion.a>

                      <motion.a
                        href="https://www.linkedin.com/in/pushkar-asodekar/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 bg-gradient-to-br from-teal-500 via-teal-600 to-teal-700 text-white rounded-full flex items-center justify-center border-2 border-teal-300 shadow-[0_4px_12px_rgba(20,184,166,0.3)] transition-all duration-300 outline-none focus:outline-none focus:ring-0 hover:shadow-[0_6px_18px_rgba(20,184,166,0.4)] hover:border-teal-200"
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                        style={{ textDecoration: 'none' }}
                      >
                        <Linkedin size={16} className="text-white transition-transform duration-300" />
                      </motion.a>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Developer Info */}
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9 }}
              className="space-y-12 text-center lg:text-left"
            >
              {/* Intro Text */}
              <div className="space-y-8">
                <p className="text-3xl text-gray-700 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-medium">
                  Hi, I'm <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Pushkar</span>, a passionate full stack developer transforming raw data into intuitive visual experiences. I believe in making powerful data tools accessible to everyone.
                </p>
              </div>

              {/* Enhanced Philosophy Card */}
              <motion.div
                className="relative overflow-hidden bg-gradient-to-br from-emerald-50/90 to-teal-50/90 rounded-3xl p-5 border border-emerald-200/50 shadow-[0_20px_40px_rgba(16,185,129,0.08)] backdrop-blur-sm"
                variants={itemVariants}
                whileHover={{ scale: 1.02, y: -4 }}
                transition={{ duration: 0.4 }}
              >
                {/* Decorative background */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-100/20 to-teal-100/20 pointer-events-none"></div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-emerald-200/20 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
                
                <div className="flex items-start gap-8 text-left relative z-10">
                  {/* Larger Icon */}
                  
                  <div className="flex-1">
                    {/* Better Badge */}
                    <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-semibold mb-4 border border-emerald-200">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                      My Philosophy
                    </div>
                    
                    <p className="text-xxl text-gray-700 italic leading-relaxed font-medium">
                      "Data should be for everyone — not just analysts. My goal is to simplify data visualization and make it accessible to anyone who wants to tell a story with their data."
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>

        </section>
        
        {/* CTA Section */}
        <motion.div 
          className="relative bg-gradient-to-r from-emerald-600/95 to-teal-500/95 rounded-2xl shadow-xl overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Background decorative elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-8 -right-8 w-16 h-16 bg-white/10 rounded-full animate-pulse" />
            <div className="absolute -bottom-6 -left-6 w-12 h-12 bg-white/10 rounded-full animate-pulse" style={{ animationDelay: "1s" }} />
            <div className="absolute top-1/3 left-1/3 w-8 h-8 bg-white/5 rounded-full animate-pulse" style={{ animationDelay: "2s" }} />
          </div>
          
          <div className="relative p-8 md:p-10">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              {/* Left: Text Content */}
              <motion.div
                className="text-white"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mr-3">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold">Ready to Get Started?</h2>
                </div>
                <p className="text-emerald-50 leading-relaxed text-lg">
                  Transform your data into compelling stories in minutes. 
                  Join thousands who trust DataViz ProX.
                </p>
              </motion.div>
              
              {/* Right: Buttons */}
              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-end"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <motion.button 
                  className="bg-white text-emerald-600 font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all hover:bg-gray-50"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/dashboard')}
                >
                  Start Visualizing
                </motion.button>
                
                <motion.button 
                  className="border-2 border-white text-white font-bold py-3 px-6 rounded-xl hover:bg-white hover:text-emerald-600 transition-all"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => featureRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                >
                  View Features
                </motion.button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default About;