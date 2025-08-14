import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, change, icon, delay = 0 }) => (
  <motion.div 
    className="bg-white rounded-lg shadow-lg p-4"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs text-gray-500 font-medium">{title}</p>
        <p className="text-xl font-bold text-gray-800 mt-1">{value}</p>
        <p className={`text-xs mt-1 ${change >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
          {change >= 0 ? '↗' : '↘'} {Math.abs(change)}% from last month
        </p>
      </div>
      <div className={`w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center ${change >= 0 ? 'bg-emerald-100' : 'bg-red-100'}`}>
        <span className={`text-emerald-600 text-3xl pb-1 ${change >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>{change >= 0 ? '↗' : '↘'}</span>
      </div>
    </div>
  </motion.div>
);

const ChartCard = ({ title, children, className = "", delay = 0 }) => (
  <motion.div 
    className={`bg-white rounded-lg shadow-lg p-4 ${className}`}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
  >
    <div className="text-sm text-gray-700 font-medium mb-3">{title}</div>
    {children}
  </motion.div>
);

const AnalyticsDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [heatmapMatrix, setHeatmapMatrix] = useState([]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
  const matrix = Array.from({ length: 8 }, () =>
    Array.from({ length: 8 }, () => Math.floor(Math.random() * 100))
  );
  setHeatmapMatrix(matrix);
}, []);


  return (
    <motion.div 
      className="relative w-full min-h-[20rem] xl:min-h-[26rem] bg-gray-100 rounded-2xl shadow-2xl overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Header */}
      <div className="bg-white h-12 w-full flex items-center px-4 border-b border-gray-200">
        {["bg-red-400", "bg-yellow-400", "bg-green-400"].map((color, i) => (
          <div key={i} className={`w-3 h-3 ${color} rounded-full mr-2`}></div>
        ))}
        <div className="flex-1 bg-gray-100 h-6 rounded-md mr-4"></div>
        <div className="text-lg text-gray-500">
          {currentTime.toLocaleTimeString()}
        </div>
      </div>

      <div className="p-4 relative min-h-[10rem] xl:min-h-[12rem]">
        {/* Main Performance Chart */}
        <div className="flex flex-col lg:flex-row gap-4 mb-4">
          <ChartCard title="Performance Overview" className="flex-1 h-56" delay={0.2}>
            <svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 100 50">
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.4"/>
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.1"/>
                </linearGradient>
              </defs>
              <path d="M0,25 C10,20 20,35 30,30 S40,20 50,25 S60,35 70,15 S80,5 90,15 L90,50 L0,50 Z" fill="url(#gradient)" />
              <path d="M0,25 C10,20 20,35 30,30 S40,20 50,25 S60,35 70,15 S80,5 90,15" fill="none" stroke="#10b981" strokeWidth="2" />
              {[{cx:10,cy:22},{cx:30,cy:30},{cx:50,cy:25},{cx:70,cy:15},{cx:90,cy:15}].map((pt, i) => (
                <circle key={i} cx={pt.cx} cy={pt.cy} r="1.8" fill="#10b981" />
              ))}
            </svg>
          </ChartCard>

          <ChartCard title="User Engagement Heatmap" className="flex-1 h-56" delay={0.3}>
            <svg width="100%" height="100%" viewBox="0 0 100 100">
              {heatmapMatrix.map((row, rowIndex) =>
                row.map((value, colIndex) => {
                  const fill = `rgba(16, 185, 129, ${value / 100})`;
                  return (
                    <rect 
                      key={`${rowIndex}-${colIndex}`} 
                      x={colIndex * 10} 
                      y={rowIndex * 10} 
                      width="10" 
                      height="10" 
                      fill={fill} 
                    />
                  );
                })
              )}
            </svg>
          </ChartCard>
        </div>


        {/* Key Metrics */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6"
          initial="hidden"
          animate="visible"
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
          transition={{ delay: 0.5, staggerChildren: 0.1 }}
        >
          {[
            { title: "Users", value: "8,249", change: 12, icon: "👥" },
            { title: "Revenue", value: "$12,840", change: 8, icon: "💰" },
            { title: "Conversion", value: "24.3%", change: 4, icon: "📈" },
            { title: "Bounce Rate", value: "47%", change: -2, icon: "🏃" },
            { title: "Sessions", value: "32,190", change: 6, icon: "🕒" },
            { title: "Avg. Time", value: "2m 45s", change: 3, icon: "⏱️" },
            { title: "New Users", value: "4,523", change: 9, icon: "✨" }
          ].map((stat, i) => (
            <StatCard
              key={i}
              title={stat.title}
              value={stat.value}
              change={stat.change}
              delay={i * 0.1}
            />
          ))}

        </motion.div>

        {/* Floating Mini Charts */}
        <motion.div 
          className="absolute top-0 right-0 w-32 h-24 bg-white rounded-lg shadow-lg p-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <div className="text-xs text-gray-500 font-medium mb-1">Sales Growth</div>
          <svg width="100%" height="75%" viewBox="0 0 100 50">
            {[35, 25, 30, 15, 5].map((height, i) => (
              <rect key={i} x={10 + i * 15} y={height} width="10" height={50 - height} fill="#10b981" rx="2" />
            ))}
            <line x1="5" y1="50" x2="95" y2="50" stroke="#e5e7eb" strokeWidth="1" />
          </svg>
        </motion.div>

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

        <motion.div 
          className="absolute bottom-0 left-10 w-40 h-28 bg-white rounded-lg shadow-lg p-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <div className="text-xs text-gray-500 font-medium mb-1">Monthly Revenue</div>
          <svg width="100%" height="75%" viewBox="0 0 100 60" overflow="visible">
            <path 
              d="M5,45 Q15,20 25,35 T40,25 T60,35 T75,25 T95,25" 
              fill="none" 
              stroke="#14b8a6" 
              strokeWidth="3" 
              strokeLinecap="round" 
            />
            <line x1="5" y1="50" x2="95" y2="50" stroke="#e5e7eb" strokeWidth="1" />
            {[{x:5,y:45},{x:25,y:35},{x:40,y:25},{x:60,y:35},{x:75,y:10},{x:95,y:25}].map((point,i) => (
              <circle key={i} cx={point.x} cy={point.y} r="3" fill="#14b8a6" />
            ))}
          </svg>
        </motion.div>

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
            {[{cx:20,cy:40},{cx:30,cy:20},{cx:45,cy:30},{cx:55,cy:15},{cx:65,cy:35},{cx:75,cy:25},{cx:85,cy:10}].map((pt,i) => (
              <circle key={i} cx={pt.cx} cy={pt.cy} r="3" fill="#10b981" />
            ))}
          </svg>
        </motion.div>

        {/* Animated Floating Dots */}
        <motion.div 
          className="absolute top-1/4 right-1/2 w-4 h-4 bg-emerald-500 rounded-full"
          animate={{ y: [0, -10, 0], opacity: [1, 0.7, 1] }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
        />
        <motion.div 
          className="absolute bottom-1/3 left-1/4 w-3 h-3 bg-teal-500 rounded-full"
          animate={{ y: [0, -8, 0], opacity: [1, 0.7, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse", delay: 0.5 }}
        />
      </div>
    </motion.div>
  );
};

export default AnalyticsDashboard;