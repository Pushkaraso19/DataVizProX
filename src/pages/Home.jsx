// src/pages/Home.jsx
import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import FeatureHighlights from '../components/homeComponents/FeatureHighlights';
import FeatureSection from "../components/homeComponents/FeatureSection"
import AnalyticsDashboard from '../components/homeComponents/AnalyticsDashboard';
import DemoVideo from '../components/homeComponents/DemoVideo';

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

const Home = () => {
  const [isMdUp, setIsMdUp] = useState(false);

  useEffect(() => {
    const checkScreen = () => setIsMdUp(window.innerWidth >= 1024); 
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  return (
    <div className="mx-auto py-10 lg:py-4 xl:py-2 px-20">
      {/* Hero Section */}
      <div className="min-h-[90vh] flex items-center justify-center md:px-10 lg:px-10">
        <section className="flex flex-col lg:flex-row items-center justify-center gap-12 min-h-screen">
          <motion.div 
            className="lg:w-1/2 space-y-8"
            initial="hidden"
            animate="visible"
            variants={slideUp}
          >
            <div className="relative">
              <h1 className="text-6xl md:text-7xl font-bold text-gray-800 leading-tight relative z-10">
                Transform Your <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">Data</span> into Actionable <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">Insights</span>
              </h1>
            </div>
            
            <p className="text-2xl text-gray-600 leading-relaxed">
              DataViz ProX helps you transform complex data into intuitive, interactive visualizations that tell a compelling story. Discover hidden patterns and make data-driven decisions with confidence.
            </p>

            {/* Key Benefits */}
            <FeatureHighlights />
            
            <div className="pt-4 flex flex-col sm:flex-row gap-4">
              <motion.div
                className="inline-block"
              >
                <Link 
                  to="/dashboard" 
                  className="px-8 py-4 bg-gradient-to-r from-emerald-600/95 to-teal-500/95 text-white rounded-lg text-xl font-medium transition-all duration-200 hover:shadow-lg hover:shadow-emerald-200 inline-flex items-center justify-center w-full sm:w-auto focus:outline-none focus:ring-0 hover:no-underline hover:text-white hover:scale-105 hover:shadow-lg"
                >
                  Start Visualizing
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                  </svg>
                </Link>
              </motion.div>

              {/* <motion.div
                className="inline-block"
              >
                <button 
                  onClick={() => document.getElementById('demo').scrollIntoView({ behavior: 'smooth' })}
                  className="px-8 py-4 bg-white border-2 border-gray-200 text-gray-700 rounded-lg text-lg font-medium transition-all duration-200 hover:scale-105 hover:shadow-lg inline-flex items-center justify-center w-full sm:w-auto focus:outline-none focus:ring-0 no-underline"
                >
                  <i className="fas fa-play mr-2"></i>
                  Watch Demo
                </button>
              </motion.div> */}
                  
            </div>
          </motion.div>
          
          {isMdUp && (
            <motion.div
              className="flex lg:w-1/2 min-h-[30rem] xl:min-h-[34rem] items-center bg-gray-100"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0, x: 50 },
                visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
              }}
            >
              <AnalyticsDashboard />
            </motion.div>
          )}
        </section>
      </div>

      {/* Features Section */}
      <FeatureSection />

      {/* Demo Section
      <section className="py-16 w-full" id="demo">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Watch the Live Demo</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Jump through key chapters and explore how <span className="text-emerald-600 font-semibold">DataViz ProX</span> transforms raw data into beautiful visual insights.
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-xl p-8 mx-auto">
          <DemoVideo />
        </div>
      </section> */}

      {/* CTA Section */}
      <motion.section 
        className="bg-gradient-to-r from-emerald-600/95 to-teal-500/95 rounded-2xl p-12 text-white mb-16"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-2/3 mb-8 md:mb-0">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Not Sure Where to Start?</h2>
            <p className="text-2xl opacity-90">Our team of data visualization experts is ready to help you unlock the full potential of your data.</p>
          </div>
          <motion.div
          >
            <Link to="/contact" className="px-8 py-4 bg-white text-emerald-600 rounded-lg text-lg font-medium transition-all hover:bg-gray-100 inline-flex items-center hover:no-underline  hover:scale-105 hover:shadow-lg">
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