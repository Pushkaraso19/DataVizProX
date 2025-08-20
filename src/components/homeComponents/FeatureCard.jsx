  import { motion } from "framer-motion";

  const FeatureCard = (props) => {
    const staggerFeatures = {
      hidden: { opacity: 0 },
      visible: (custom) => ({
        opacity: 1,
        transition: {
          delay: 0.2 + (custom * 0.15),
        }
      })
    };
    return props.isFeature ? (
      <motion.div 
        custom={0} 
        variants={staggerFeatures}
        className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all"
      >
        <div className="bg-emerald-100  pl-2 rounded-full w-16 h-16 flex items-center justify-center mb-6">
          <i className={`${props.icon} text-2xl text-emerald-600`}></i>
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-3">{props.title}</h3>
        <p className="text-gray-600 text-xl">{props.subtitle}</p>
      </motion.div>
    ) : (
      <div className="flex items-center space-x-3 bg-white/50 backdrop-blur-sm rounded-lg p-4">
        <div className="w-11 h-11 pl-2 bg-emerald-100 rounded-xl flex items-center justify-center">
          <i className={`${props.icon} text-emerald-600 text-lg`}></i>
        </div>
        <div>
          <div className="font-semibold text-gray-800 text-md">{props.title}</div>
          <div className="text-gray-600 text-base">{props.subtitle}</div>
        </div>
      </div>
    );
  };

  export default FeatureCard;
