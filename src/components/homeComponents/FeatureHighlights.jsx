import { motion } from "framer-motion";
import FeatureCard from "./FeatureCard";

const features = [
  {
    icon: "fas fa-bolt",
    title: "Lightning Fast",
    subtitle: "Process large datasets in milliseconds with optimized rendering.",
  },
  {
    icon: "fas fa-palette",
    title: "Beautiful Charts",
    subtitle: "15+ customizable chart types including heatmaps and radar charts.",
  },
  {
    icon: "fas fa-share-alt",
    title: "Easy Sharing",
    subtitle: "Export charts as PNG, SVG, or share via unique links instantly.",
  },
  {
    icon: "fas fa-table",
    title: "Data Grid View",
    subtitle: "Interact with raw tabular data alongside visual insights.",
  },
  {
    icon: "fas fa-cogs",
    title: "Advanced Customization",
    subtitle: "Tweak colors, tooltips, labels, and interactivity to your needs.",
  },
  {
    icon: "fas fa-mobile-alt",
    title: "Mobile Responsive",
    subtitle: "Perfectly adapts to all screen sizes for seamless experiences.",
  },
];


const FeatureHighlights = () => {
  return (
    <motion.div 
        className="grid grid-cols-2 sm:grid-cols-2 gap-4 py-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
    >
      {features.map((feature, idx) => (
        <FeatureCard key={idx} {...feature} />
      ))}
    </motion.div>
  );
};

export default FeatureHighlights;
