import { motion } from 'framer-motion';
import { useRef } from 'react';
import TeamMember from '../components/TeamMember';
import PushkarImg from '../assets/images/Team Members/team_member1.jpg';
import PriyanshuImg from '../assets/images/Team Members/team_member4.jpg';
import KimayaImg from '../assets/images/Team Members/team_member3.jpg';
import FaizaImg from '../assets/images/Team Members/team_member2.jpg';

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

  const features = [
    {
      icon: <DataImportIcon />,
      title: "Versatile Data Import",
      description: "Upload CSV, JSON, Excel files, or connect to APIs and databases for real-time data feeds."
    },
    {
      icon: <BarChartIcon />,
      title: "Advanced Chart Library",
      description: "Create stunning bar, line, pie, scatter, area, radar, and heatmap visualizations with just a few clicks."
    },
    {
      icon: <DataProcessingIcon />,
      title: "Real-time Data Processing",
      description: "Filter, transform, and analyze your data on-the-fly with interactive dashboards and dynamic updates."
    },
    {
      icon: <StyleIcon />,
      title: "Custom Styling",
      description: "Personalize every aspect of your visualizations with custom color palettes, fonts, and themes."
    },
    {
      icon: <EditIcon />,
      title: "Axis Customization",
      description: "Fully customize axes with labels, scales, grids, and transformations to highlight what matters."
    },
    {
      icon: <ExportIcon />,
      title: "Multiple Export Options",
      description: "Export your visualizations as SVG, PNG, PDF or embed them directly into your website."
    }
  ];

  return (
    <div className="bg-gradient-to-b from-[#dff8e1] to-[#c4fbcb] min-h-screen py-16" style={{ fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif' }}>
      <motion.div 
        className="container mx-auto px-4 max-w-6xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Hero Section */}
        <motion.div 
          className="text-center mb-20"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <motion.h1 
            className="text-5xl font-bold mb-6 text-[#388e3c]"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            About Us
          </motion.h1>
          <motion.div 
            className="h-1 w-24 bg-[#4caf50] mx-auto mb-8"
            initial={{ width: 0 }}
            animate={{ width: 100 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          ></motion.div>
          <motion.p 
            className="text-2xl text-[#333] max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Welcome to DataViz Pro, your ultimate tool for advanced data visualization!
          </motion.p>
        </motion.div>
        
        {/* Mission Section */}
        <motion.div 
          className="bg-[#FAF9F6] rounded-xl shadow-lg p-8 mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold mb-6 text-[#388e3c]">Our Mission</h2>
          <p className="text-[#333] leading-relaxed mb-4">
            At DataViz Pro, we believe that data should be accessible and understandable to everyone. Our mission is to empower professionals, researchers, and enthusiasts with the ability to visualize complex data in a simple and effective way.
          </p>
          <p className="text-[#333] leading-relaxed">
            With a focus on user experience and functionality, our platform offers a variety of visualization options tailored to meet diverse needs, making data-driven insights accessible to all.
          </p>
        </motion.div>
        
        {/* Features Section */}
        <motion.section 
          className="mb-20"
          ref={featureRef}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={containerVariants}
        >
          <h2 className="text-3xl font-bold text-center mb-12 text-[#388e3c]">Our Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                className="bg-[#FAF9F6] rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden h-full"
                variants={itemVariants}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="p-6 flex flex-col h-full">
                  <div className="text-[#4caf50] mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold mb-3 text-[#388e3c]">{feature.title}</h3>
                  <p className="text-[#555] flex-grow">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
        
        {/* Team Section */}
        <motion.section 
          className="mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <h2 className="text-3xl font-bold text-center mb-12 text-[#388e3c]">Our Team</h2>
          
          {/* Team Leader */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mb-12"
          >
            <motion.div 
              transition={{ type: "spring", stiffness: 300 }}
            >
              <TeamMember 
                image={PushkarImg}
                name="Pushkar Asodekar"
                role="Team Leader / Project Manager"
                description="As the Team Leader, my focus is on ensuring that our vision for DataViz Pro is realized through effective collaboration and project management. I am dedicated to driving our team's efforts in creating a platform that transforms complex data into insightful visualizations."
                isLeader={true}
              />
            </motion.div>
          </motion.div>
          
          {/* Team Members */}
          <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                image: PriyanshuImg,
                name: "Priyanshu Gupta",
                role: "UX/UI Designer",
                description: "As the UX/UI Designer, I strive to create intuitive and engaging user experiences for DataViz Pro. My goal is to design interfaces that not only look great but also make it easy for users to navigate and interact with our data visualization features."
              },
              {
                image: KimayaImg,
                name: "Kimaya Padave", 
                role: "Research Analyst",
                description: "In my role as a Research Analyst, I dive deep into data trends and analytics to provide valuable insights. My aim is to leverage data-driven research to enhance our visualization tools and ensure they meet the needs of our users effectively."
              },
              {
                image: FaizaImg,
                name: "Faizabi Shaikh",
                role: "Developer",
                description: "In my role as a Developer, I am committed to building robust and scalable solutions for our platform. My focus is on implementing advanced features that enhance functionality and improve the overall performance of DataViz Pro."
              }
            ].map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <TeamMember 
                  image={member.image}
                  name={member.name}
                  role={member.role}
                  description={member.description}
                />
              </motion.div>
            ))}
          </motion.div>
        </motion.section>
      </motion.div>
    </div>
  );
};

export default About;