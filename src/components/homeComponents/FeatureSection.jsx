import { motion } from "framer-motion";
import FeatureCard from "./FeatureCard";

const features = [
    {
        icon: "fas fa-upload",
        title: "Seamless Import",
        subtitle: "Easily upload and process CSV, JSON, and Excel files with our drag-and-drop interface.",
    },
    {
        icon: "fas fa-chart-pie",
        title: "Versatile Charts",
        subtitle: "Create beautiful bar, line, pie, scatter plots and advanced visualizations with a few clicks.",
    },
    {
        icon: "fas fa-user",
        title: "User-Friendly",
        subtitle: "Intuitive interface designed for both beginners and data professionals alike.",
    },
    {
        icon: "fas fa-database",
        title: "Advanced Analytics",
        subtitle: "Leverage D3.js for powerful data processing and create custom visualizations.",
    }
];

const FeatureSection = (props) => {
    const slideUp = {
        hidden: { opacity: 0, y: 40 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { duration: 0.8, ease: "easeOut" }
        }
    };
    return (
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
                    Why Choose <span className="text-emerald-600">DataViz ProX</span>
                </motion.h2>
                <motion.p 
                    className="text-2xl text-gray-600 max-w-3xl mx-auto"
                    variants={slideUp}
                >
                  Our platform combines powerful visualization tools with intuitive design, making data analysis accessible to everyone.
                </motion.p>
            </div>
            
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {features.map((feature, idx) => (
                    <FeatureCard key={idx} isFeature={true} {...feature} />
                ))}
            </div>
        </motion.section>
    );
    
}

export default FeatureSection;