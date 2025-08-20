# DataViz ProX 

**DataViz ProX** is a comprehensive, modern web application for advanced data visualization and analytics. Built with React and powered by D3.js, it enables users to upload datasets and create stunning, interactive visualizations from 17+ different chart types. With professional-grade features, real-time interactivity, and enterprise-level export capabilities, DataViz ProX transforms raw data into compelling visual stories.

## ✨ Features

### 📈 **Advanced Chart Types (17+)**
- **Area Charts** - Show cumulative changes over time
- **Bar Charts** - Compare values across categories  
- **Box Plots** - Analyze data distribution and outliers
- **Bubble Charts** - Add third dimension via bubble size
- **Calendar Heatmaps** - Daily/monthly activity patterns
- **Grouped & Stacked Bar Charts** - Complex categorical comparisons
- **Heatmaps** - Visualize correlations and intensity patterns
- **Histograms** - Show frequency distributions
- **Line Charts** - Track trends and time series data
- **100% Stacked Bars** - Percentage compositions
- **Pie Charts** - Display proportional data
- **Radar/Spider Charts** - Multi-variable comparisons
- **Scatter Plots** - Explore relationships between variables
- **Slope Charts** - Before/after comparisons
- **Step Line Charts** - Discrete interval changes
- **Violin Plots** - Advanced distribution analysis

### 🚀 **Data Management**
- **Multi-format Support**: CSV, Excel (.xlsx), JSON
- **Excel Multi-sheet**: Import and select specific worksheets
- **Large Dataset Handling**: Optimized for datasets up to 100MB
- **Smart Data Detection**: Automatic type inference and validation
- **Real-time Data Table**: Search, filter, and edit data on-the-fly
- **Performance Optimization**: Intelligent sampling for large datasets (10,000+ records)

### 🎨 **Professional Customization**
- **Dynamic Color Schemes**: Gradient-based color generation
- **Interactive Styling**: Real-time chart customization
- **Responsive Design**: Works on all devices
- **Dark/Light Themes**: Adaptive color schemes
- **Custom Axis Mapping**: Flexible X, Y, Z, and grouping configurations

### 📤 **Enterprise Export Options**
- **High-Quality Images**: PNG and JPG format
- **Vector Graphics**: SVG for scalable prints
- **Data Exports**: CSV, JSON, Excel formats
- **PDF Reports**: Multi-page chart collections
- **Print-Ready**: Optimized layouts for presentations

### 🔄 **Interactive Features**
- **Real-time Updates**: Live chart refresh on data changes
- **Hover Tooltips**: Detailed data point information
- **Zoom & Pan**: Explore large datasets interactively
- **Crosshair Tools**: Precise data point analysis
- **Animation Effects**: Smooth transitions and loading states

### 🌐 **User Experience**
- **Page Transitions**: Smooth navigation with Framer Motion
- **Progressive Web App**: Fast loading and offline capabilities
- **Accessible Design**: WCAG compliant interface
- **Contact Form**: EmailJS integration with environment variables

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) (v8 or higher)

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/Pushkaraso19/DataVizProX.git
   cd DataVizProX
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Environment Setup**:
   
   Create a `.env` file in the root directory:
   ```bash
   EMAILJS_SERVICE_ID=your_service_id
   EMAILJS_TEMPLATE_ID=your_template_id
   EMAILJS_PUBLIC_KEY=your_public_key
   ```

4. **Start the development server**:

   ```bash
   npm run dev
   ```

5. **Access the application**:

   Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

## 🏗️ Project Structure

```
DataViz-ProX/
├── public/
│   └── data/                      # Sample datasets
├── src/
│   ├── assets/
│   │   └── images/               # App logos and team photos
│   ├── components/
│   │   ├── dashboardComponents/  # Chart and data components
│   │   │   ├── ChartArea.jsx    # Main charting engine (D3.js)
│   │   │   ├── ChartTypes.jsx   # Chart type definitions
│   │   │   ├── ChartIcons.jsx   # SVG chart icons
│   │   │   ├── DataTable.jsx    # Interactive data table
│   │   │   └── FileUpload.jsx   # Multi-format file handler
│   │   ├── homeComponents/      # Landing page components
│   │   ├── Header.jsx           # Navigation bar
│   │   ├── Footer.jsx           # Footer component
│   │   └── PageTransition.jsx   # Route animations
│   ├── pages/
│   │   ├── Home.jsx             # Landing page
│   │   ├── Dashboard.jsx        # Main visualization workspace
│   │   ├── DemoPage.jsx         # Chart demos and guides
│   │   ├── About.jsx            # About page
│   │   └── Contact.jsx          # Contact form (EmailJS)
│   ├── utils/
│   │   ├── chartUtils.js        # Chart helper functions
│   │   └── tooltipUtils.js      # Tooltip utilities
│   ├── App.jsx                  # Main app component
│   └── main.jsx                 # App entry point
├── .env                         # Environment variables (gitignored)
├── .gitignore                   # Git ignore rules
├── package.json                 # Dependencies and scripts
├── tailwind.config.js           # Tailwind CSS configuration
├── vite.config.js              # Vite build configuration
└── README.md                    # This file
```

## 🛠️ Technologies & Dependencies

### **Core Framework**
- **React 18.3.1** - Modern React with hooks and concurrent features
- **Vite 6.3.2** - Next-generation frontend tooling
- **React Router Dom 7.5.2** - Client-side routing

### **Data Visualization**
- **D3.js 7.8.5** - Powerful data visualization library
- **Custom Chart Engine** - 17+ chart types with advanced interactions

### **UI/UX**
- **Tailwind CSS 3.4.17** - Utility-first CSS framework
- **Framer Motion 12.8.0** - Production-ready motion library
- **Lucide React 0.501.0** - Beautiful & consistent icon library

### **Data Processing**
- **ExcelJS 4.4.0** - Excel file reading/writing
- **CSV Parser** - Built-in CSV handling
- **JSON Support** - Native JSON processing

### **Export & Communication**
- **html2canvas 1.4.1** - HTML to canvas conversion
- **jsPDF 3.0.1** - PDF generation
- **EmailJS Browser 4.4.1** - Email service integration

### **Development Tools**
- **ESLint** - Code linting and formatting
- **PostCSS & Autoprefixer** - CSS processing
- **TypeScript Support** - Type checking capabilities

## 🎯 Usage Examples

### 1. **Upload Data**
- Drag & drop CSV/Excel files
- Select specific Excel worksheets
- Preview data in interactive table

### 2. **Create Visualizations**
- Choose from 17+ chart types
- Map data columns to chart axes
- Customize colors and styling

### 3. **Interactive Analysis**
- Hover for detailed tooltips
- Zoom and pan large datasets
- Use crosshair tools for precision

### 4. **Export Results**
- Download as PNG/SVG images
- Export data as CSV/Excel/JSON
- Generate PDF reports

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `EMAILJS_SERVICE_ID` | EmailJS service identifier | Yes (for contact form) |
| `EMAILJS_TEMPLATE_ID` | EmailJS template identifier | Yes (for contact form) |
| `EMAILJS_PUBLIC_KEY` | EmailJS public key | Yes (for contact form) |

### Customization

- **Colors**: Modify theme colors in `tailwind.config.js`
- **Chart Types**: Add new charts in `src/components/dashboardComponents/ChartTypes.jsx`
- **Styling**: Customize components with Tailwind classes

## 🚀 Performance Features

- **Large Dataset Optimization**: Automatic sampling for 10,000+ records
- **Lazy Loading**: Components load on demand
- **Memory Management**: Efficient D3.js memory usage
- **Responsive Images**: Optimized asset loading
- **Bundle Splitting**: Code splitting for faster initial loads

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🐛 Troubleshooting

### Common Issues

**Large File Upload Fails**
- Check file size (max 100MB)
- Ensure proper file format (CSV/Excel/JSON)

**Charts Not Rendering**
- Verify data format matches chart requirements
- Check browser console for errors

**Export Issues**
- Ensure sufficient browser memory
- Try smaller datasets or different export formats

## 📱 Browser Support

- **Chrome** 90+
- **Firefox** 88+
- **Safari** 14+
- **Edge** 90+

## 📄 License

This project is licensed under the [MIT License](LICENSE).

## 👨‍💻 Author

**Pushkar Aso**
- GitHub: [@Pushkaraso19](https://github.com/Pushkaraso19)
- Project: [DataVizProX](https://github.com/Pushkaraso19/DataVizProX)

---

## 🌟 Show your support

Give a ⭐️ if this project helped you!
