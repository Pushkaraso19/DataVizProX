const ChartIcons = {
  bar: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
      <rect x="3" y="10" width="3" height="10" />
      <rect x="8" y="4" width="3" height="16" />
      <rect x="13" y="7" width="3" height="13" />
      <rect x="18" y="12" width="3" height="8" />
    </svg>
  ),
  groupedBar: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
      <rect x="3" y="14" width="2" height="6" fill="currentColor" />
      <rect x="6" y="12" width="2" height="8" fill="currentColor" />
      <rect x="9" y="10" width="2" height="10" fill="currentColor" />
      <rect x="12" y="8" width="2" height="12" fill="currentColor" />
      <rect x="15" y="14" width="2" height="6" fill="currentColor" fillOpacity="0.6" />
      <rect x="18" y="12" width="2" height="8" fill="currentColor" fillOpacity="0.6" />
      <rect x="21" y="10" width="2" height="10" fill="currentColor" fillOpacity="0.6" />
    </svg>
  ),
  line: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="3,17 9,11 14,13 21,5" />
      <circle cx="3" cy="17" r="1.5" fill="currentColor" />
      <circle cx="9" cy="11" r="1.5" fill="currentColor" />
      <circle cx="14" cy="13" r="1.5" fill="currentColor" />
      <circle cx="21" cy="5" r="1.5" fill="currentColor" />
    </svg>
  ),
  area: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
      <path d="M3,17 L9,11 L14,13 L21,5 L21,20 L3,20 Z" fillOpacity="0.6" />
      <polyline points="3,17 9,11 14,13 21,5" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  pie: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
      <path d="M12,2 A10,10 0 0,1 22,12 L12,12 Z" fill="currentColor" />
      <path d="M12,12 L12,22 A10,10 0 0,1 4,6 Z" fill="currentColor" fillOpacity="0.7" />
      <path d="M12,12 L4,6 A10,10 0 0,1 12,2 Z" fill="currentColor" fillOpacity="0.4" />
    </svg>
  ),
  stackedBar: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
      <rect x="3" y="14" width="3" height="6" fill="currentColor" />
      <rect x="3" y="8" width="3" height="6" fill="currentColor" fillOpacity="0.6" />
      <rect x="8" y="12" width="3" height="8" fill="currentColor" />
      <rect x="8" y="4" width="3" height="8" fill="currentColor" fillOpacity="0.6" />
      <rect x="13" y="10" width="3" height="10" fill="currentColor" />
      <rect x="13" y="5" width="3" height="5" fill="currentColor" fillOpacity="0.6" />
      <rect x="18" y="16" width="3" height="4" fill="currentColor" />
      <rect x="18" y="9" width="3" height="7" fill="currentColor" fillOpacity="0.6" />
    </svg>
  ),
  stackedBar100: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
      <rect x="3" y="4" width="3" height="6" fill="currentColor" fillOpacity="0.3" />
      <rect x="3" y="10" width="3" height="6" fill="currentColor" fillOpacity="0.6" />
      <rect x="3" y="16" width="3" height="4" fill="currentColor" />
      <rect x="8" y="4" width="3" height="8" fill="currentColor" fillOpacity="0.3" />
      <rect x="8" y="12" width="3" height="5" fill="currentColor" fillOpacity="0.6" />
      <rect x="8" y="17" width="3" height="3" fill="currentColor" />
      <rect x="13" y="4" width="3" height="4" fill="currentColor" fillOpacity="0.3" />
      <rect x="13" y="8" width="3" height="8" fill="currentColor" fillOpacity="0.6" />
      <rect x="13" y="16" width="3" height="4" fill="currentColor" />
      <rect x="18" y="4" width="3" height="5" fill="currentColor" fillOpacity="0.3" />
      <rect x="18" y="9" width="3" height="7" fill="currentColor" fillOpacity="0.6" />
      <rect x="18" y="16" width="3" height="4" fill="currentColor" />
    </svg>
  ),
  scatter: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
      <circle cx="5" cy="18" r="1.5" />
      <circle cx="8" cy="12" r="1.5" />
      <circle cx="11" cy="17" r="1.5" />
      <circle cx="14" cy="9" r="1.5" />
      <circle cx="17" cy="14" r="1.5" />
      <circle cx="20" cy="6" r="1.5" />
    </svg>
  ),
  bubble: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
      <circle cx="5" cy="18" r="1" />
      <circle cx="8" cy="12" r="2" />
      <circle cx="12" cy="17" r="1.5" />
      <circle cx="14" cy="9" r="3" />
      <circle cx="19" cy="14" r="2" />
    </svg>
  ),
  histogram: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
      <rect x="2" y="16" width="2" height="4" />
      <rect x="5" y="12" width="2" height="8" />
      <rect x="8" y="14" width="2" height="6" />
      <rect x="11" y="8" width="2" height="12" />
      <rect x="14" y="10" width="2" height="10" />
      <rect x="17" y="16" width="2" height="4" />
      <rect x="20" y="18" width="2" height="2" />
    </svg>
  ),
  boxPlot: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="1.5" fill="none">
      <line x1="6" y1="4" x2="6" y2="8" />
      <line x1="6" y1="20" x2="6" y2="16" />
      <line x1="4" y1="4" x2="8" y2="4" />
      <line x1="4" y1="20" x2="8" y2="20" />
      <rect x="4" y="8" width="4" height="8" fill="currentColor" fillOpacity="0.2" />
      <line x1="4" y1="12" x2="8" y2="12" stroke="currentColor" strokeWidth="1.5" />
      
      <line x1="18" y1="6" x2="18" y2="10" />
      <line x1="18" y1="18" x2="18" y2="14" />
      <line x1="16" y1="6" x2="20" y2="6" />
      <line x1="16" y1="18" x2="20" y2="18" />
      <rect x="16" y="10" width="4" height="4" fill="currentColor" fillOpacity="0.2" />
      <line x1="16" y1="12" x2="20" y2="12" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  heatmap: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
      <rect x="3" y="3" width="3" height="3" fill="currentColor" fillOpacity="0.2" />
      <rect x="7" y="3" width="3" height="3" fill="currentColor" fillOpacity="0.6" />
      <rect x="11" y="3" width="3" height="3" fill="currentColor" fillOpacity="0.8" />
      <rect x="15" y="3" width="3" height="3" fill="currentColor" fillOpacity="0.4" />
      <rect x="19" y="3" width="3" height="3" fill="currentColor" fillOpacity="0.1" />
      
      <rect x="3" y="7" width="3" height="3" fill="currentColor" fillOpacity="0.7" />
      <rect x="7" y="7" width="3" height="3" fill="currentColor" fillOpacity="0.9" />
      <rect x="11" y="7" width="3" height="3" fill="currentColor" />
      <rect x="15" y="7" width="3" height="3" fill="currentColor" fillOpacity="0.5" />
      <rect x="19" y="7" width="3" height="3" fill="currentColor" fillOpacity="0.3" />
      
      <rect x="3" y="11" width="3" height="3" fill="currentColor" fillOpacity="0.5" />
      <rect x="7" y="11" width="3" height="3" fill="currentColor" fillOpacity="0.7" />
      <rect x="11" y="11" width="3" height="3" fill="currentColor" fillOpacity="0.3" />
      <rect x="15" y="11" width="3" height="3" fill="currentColor" fillOpacity="0.2" />
      <rect x="19" y="11" width="3" height="3" fill="currentColor" fillOpacity="0.6" />
      
      <rect x="3" y="15" width="3" height="3" fill="currentColor" fillOpacity="0.3" />
      <rect x="7" y="15" width="3" height="3" fill="currentColor" fillOpacity="0.2" />
      <rect x="11" y="15" width="3" height="3" fill="currentColor" fillOpacity="0.4" />
      <rect x="15" y="15" width="3" height="3" fill="currentColor" fillOpacity="0.9" />
      <rect x="19" y="15" width="3" height="3" fill="currentColor" fillOpacity="0.8" />
    </svg>
  ),
  calendarHeatmap: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
      <rect x="3" y="3" width="2" height="2" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="0.5" />
      <rect x="6" y="3" width="2" height="2" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="0.5" />
      <rect x="9" y="3" width="2" height="2" fill="currentColor" fillOpacity="0.7" stroke="currentColor" strokeWidth="0.5" />
      <rect x="12" y="3" width="2" height="2" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="0.5" />
      <rect x="15" y="3" width="2" height="2" fill="currentColor" fillOpacity="0.5" stroke="currentColor" strokeWidth="0.5" />
      
      <rect x="3" y="6" width="2" height="2" fill="currentColor" fillOpacity="0.6" stroke="currentColor" strokeWidth="0.5" />
      <rect x="6" y="6" width="2" height="2" fill="currentColor" fillOpacity="0.9" stroke="currentColor" strokeWidth="0.5" />
      <rect x="9" y="6" width="2" height="2" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="0.5" />
      <rect x="12" y="6" width="2" height="2" fill="currentColor" fillOpacity="0.8" stroke="currentColor" strokeWidth="0.5" />
      <rect x="15" y="6" width="2" height="2" fill="currentColor" fillOpacity="0.4" stroke="currentColor" strokeWidth="0.5" />
      
      <rect x="3" y="9" width="2" height="2" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="0.5" />
      <rect x="6" y="9" width="2" height="2" fill="currentColor" fillOpacity="0.7" stroke="currentColor" strokeWidth="0.5" />
      <rect x="9" y="9" width="2" height="2" fill="currentColor" stroke="currentColor" strokeWidth="0.5" />
      <rect x="12" y="9" width="2" height="2" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="0.5" />
      <rect x="15" y="9" width="2" height="2" fill="currentColor" fillOpacity="0.5" stroke="currentColor" strokeWidth="0.5" />
      
      <rect x="18" y="3" width="2" height="2" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="0.5" />
      <rect x="18" y="6" width="2" height="2" fill="currentColor" fillOpacity="0.4" stroke="currentColor" strokeWidth="0.5" />
      <rect x="18" y="9" width="2" height="2" fill="currentColor" fillOpacity="0.6" stroke="currentColor" strokeWidth="0.5" />
    </svg>
  ),
  radar: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1">
      <circle cx="12" cy="12" r="2" fill="currentColor" />
      <circle cx="12" cy="12" r="6" fill="none" />
      <circle cx="12" cy="12" r="10" fill="none" />
      <line x1="12" y1="2" x2="12" y2="22" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <line x1="4" y1="4" x2="20" y2="20" />
      <line x1="20" y1="4" x2="4" y2="20" />
      <path d="M12,12 L18,8 L16,15 L8,18 L6,10 Z" fill="currentColor" fillOpacity="0.3" stroke="currentColor" />
    </svg>
  ),
  sunburst: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
      <circle cx="12" cy="12" r="3" fill="currentColor" />
      <path d="M12,9 A3,3 0 0,1 15,12 L12,12 Z" fill="currentColor" fillOpacity="0.8" stroke="currentColor" strokeWidth="0.5" />
      <path d="M12,9 A3,3 0 0,0 9,12 L12,12 Z" fill="currentColor" fillOpacity="0.6" stroke="currentColor" strokeWidth="0.5" />
      <path d="M15,12 A3,3 0 0,1 12,15 L12,12 Z" fill="currentColor" fillOpacity="0.4" stroke="currentColor" strokeWidth="0.5" />
      <path d="M12,15 A3,3 0 0,1 9,12 L12,12 Z" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="0.5" />
      
      <path d="M12,6 A6,6 0 0,1 18,12 L15,12 A3,3 0 0,0 12,9 Z" fill="currentColor" fillOpacity="0.7" stroke="currentColor" strokeWidth="0.5" />
      <path d="M12,6 A6,6 0 0,0 6,12 L9,12 A3,3 0 0,1 12,9 Z" fill="currentColor" fillOpacity="0.5" stroke="currentColor" strokeWidth="0.5" />
      <path d="M18,12 A6,6 0 0,1 12,18 L12,15 A3,3 0 0,0 15,12 Z" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="0.5" />
      <path d="M12,18 A6,6 0 0,1 6,12 L9,12 A3,3 0 0,0 12,15 Z" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="0.5" />
    </svg>
  ),
  stepLine: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="3,17 7,17 7,13 12,13 12,8 17,8 17,5 21,5" />
      <circle cx="3" cy="17" r="1.5" fill="currentColor" />
      <circle cx="7" cy="17" r="1.5" fill="currentColor" />
      <circle cx="7" cy="13" r="1.5" fill="currentColor" />
      <circle cx="12" cy="13" r="1.5" fill="currentColor" />
      <circle cx="12" cy="8" r="1.5" fill="currentColor" />
      <circle cx="17" cy="8" r="1.5" fill="currentColor" />
      <circle cx="17" cy="5" r="1.5" fill="currentColor" />
      <circle cx="21" cy="5" r="1.5" fill="currentColor" />
    </svg>
  ),
  slopeChart: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <line x1="6" y1="5" x2="18" y2="8" />
      <line x1="6" y1="10" x2="18" y2="15" />
      <line x1="6" y1="17" x2="18" y2="20" />
      <circle cx="6" cy="5" r="1.5" fill="currentColor" />
      <circle cx="18" cy="8" r="1.5" fill="currentColor" />
      <circle cx="6" cy="10" r="1.5" fill="currentColor" />
      <circle cx="18" cy="15" r="1.5" fill="currentColor" />
      <circle cx="6" cy="17" r="1.5" fill="currentColor" />
      <circle cx="18" cy="20" r="1.5" fill="currentColor" />
    </svg>
  ),
  violinPlot: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
      <path d="M6,4 C8,4 8,12 6,12 C4,12 4,4 6,4 Z" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="1" />
      <path d="M6,12 C8,12 8,20 6,20 C4,20 4,12 6,12 Z" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="1" />
      <line x1="6" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="1" />
      <line x1="5" y1="10" x2="7" y2="10" stroke="currentColor" strokeWidth="1" />
      <line x1="5" y1="14" x2="7" y2="14" stroke="currentColor" strokeWidth="1" />
      
      <path d="M18,4 C20,4 20,12 18,12 C16,12 16,4 18,4 Z" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="1" />
      <path d="M18,12 C20,12 20,20 18,20 C16,20 16,12 18,12 Z" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="1" />
      <line x1="18" y1="8" x2="18" y2="16" stroke="currentColor" strokeWidth="1" />
      <line x1="17" y1="10" x2="19" y2="10" stroke="currentColor" strokeWidth="1" />
      <line x1="17" y1="14" x2="19" y2="14" stroke="currentColor" strokeWidth="1" />
    </svg>
  )
};

export default ChartIcons;