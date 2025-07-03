# String Art Generator App 🎨

A professional, feature-rich React Native app that transforms your photos into beautiful circular string art patterns with realistic algorithms and comprehensive export options.

![String Art Preview](https://img.shields.io/badge/Platform-React%20Native-blue) ![Version](https://img.shields.io/badge/Version-1.0.0-green) ![License](https://img.shields.io/badge/License-MIT-yellow)

## ✨ Features

### 🎯 Core Functionality
- **Advanced Image Processing**: Sobel edge detection with Gaussian blur preprocessing
- **Smart Algorithm**: Intelligent thread path generation using actual image data (not random)
- **Multiple Patterns**: Circle, square, heart, star, and custom shape support
- **Real-time Animation**: Smooth thread drawing animation with performance optimization
- **Responsive Design**: Adapts to all screen sizes and orientations

### 🛠️ Professional Tools
- **Comprehensive Settings**: 
  - Nail count (50-1000)
  - Maximum lines (50-1000) 
  - Neighbor avoidance (0-10)
  - Thread colors (8 preset options)
  - Pattern optimization toggle
  - Animation speed control
  - Visual customization options

### � Export Options
- **Text Export**: Detailed pattern instructions with nail connections
- **SVG Export**: Vector graphics with metadata and customization
- **Animated SVG**: Time-based animation for web display
- **Laser Cutting Templates**: Precision templates for physical creation
- **CSV Export**: Spreadsheet-compatible connection data
- **Statistics Export**: Comprehensive pattern analysis
- **JSON Project Files**: Complete project backup and sharing

### 💾 Project Management
- **Multi-Project Support**: Save and manage multiple projects
- **Auto-Backup**: Automatic file system backup
- **Project Statistics**: Detailed analytics and usage data
- **Import/Export**: Share projects between devices
- **Project Duplication**: Easy pattern variation creation

### 🎨 Advanced Algorithms
- **Edge Detection**: Multi-stage image processing pipeline
- **Pattern Optimization**: Genetic algorithm-inspired improvement
- **Quality Scoring**: Automatic pattern quality assessment
- **Nail Placement**: Multiple distribution algorithms (even, fibonacci, random)
- **Thread Routing**: Smart path finding with usage balancing

## 🚀 Getting Started

### Prerequisites
- React Native development environment
- Android Studio (for Android)
- Xcode (for iOS)
- Node.js 16+

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/StringArtApp.git
   cd StringArtApp
   ```

2. **Install dependencies**
   ```bash
   npm install
   # For iOS
   cd ios && pod install && cd ..
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Run on device/emulator**
   ```bash
   # Android
   npm run android
   
   # iOS
   npm run ios
   ```

### Development Commands

```bash
# Linting
npm run lint
npm run lint:fix

# Testing
npm test

# Build for production
npm run build:android

# Clean build
npm run clean
```

## 📱 App Structure

```
src/
├── components/          # Reusable UI components
│   └── StringArtCanvas.js   # SVG rendering component
├── screens/            # Main app screens
│   ├── HomeScreen.js       # Image selection and main UI
│   ├── PreviewScreen.js    # Pattern preview and controls
│   └── SettingsScreen.js   # Configuration options
├── core/               # Business logic and algorithms
│   ├── imageProcessor.js   # Edge detection and preprocessing
│   ├── threadAlgorithm.js  # Pattern generation algorithms
│   ├── nailGenerator.js    # Nail placement algorithms
│   ├── exporter.js         # File export utilities
│   ├── svgExporter.js      # SVG generation
│   └── projectSaver.js     # Project management
├── models/             # Data structures
│   ├── Line.js            # Thread line model
│   └── Nail.js            # Nail position model
└── utils/              # Helper functions
    └── mathUtils.js        # Mathematical utilities
```

## 🎯 Algorithm Details

### Image Processing Pipeline
1. **Image Loading**: Resize and optimize for processing
2. **Grayscale Conversion**: Luminance-based conversion
3. **Gaussian Blur**: Noise reduction preprocessing
4. **Edge Detection**: Sobel operator implementation
5. **Edge Enhancement**: Multi-iteration strengthening

### Thread Algorithm
1. **Nail Generation**: Multiple distribution patterns
2. **Scoring System**: Pixel intensity-based line scoring
3. **Path Optimization**: Greedy algorithm with usage balancing
4. **Quality Assessment**: Pattern effectiveness measurement
5. **Post-Processing**: Fine-tuning and validation

### Performance Optimizations
- **Incremental Rendering**: Batch SVG element updates
- **Memory Management**: Efficient data structures
- **Background Processing**: Non-blocking calculations
- **Animation Optimization**: Smooth 60fps animations

## 🔧 Configuration

### Pattern Settings
- **Nail Count**: Controls pattern detail and processing time
- **Max Lines**: Limits pattern complexity
- **Neighbor Avoidance**: Prevents clustered connections
- **Optimization**: Enables post-processing improvements

### Visual Customization
- **Thread Colors**: RGB color selection
- **Background**: Canvas appearance options
- **Nail Display**: Show/hide nail positions
- **Animation Speed**: Rendering timing control

## 📊 Export Formats

### Text Export (.txt)
```
# String Art Pattern Export
# Generated on: 2024-01-15 10:30:00
# Total lines: 150

# Line connections (from_nail_id -> to_nail_id)
1: 0 -> 75
2: 75 -> 125
...
```

### SVG Export (.svg)
- Vector graphics with proper metadata
- Scalable for any output size
- Web-compatible format
- Customizable styling

### Project Files (.json)
- Complete pattern data
- Settings preservation
- Cross-device compatibility
- Version tracking

## 🎨 Creative Applications

### Physical String Art
1. Export laser cutting template
2. Cut circular board with nail holes
3. Insert nails at marked positions
4. Follow exported connection sequence
5. Create physical string art masterpiece

### Digital Art
- Web portfolio integration
- Animation presentations
- Educational demonstrations
- Algorithmic art exploration

## 🧪 Development Features

### Code Quality
- **ESLint**: Consistent code style
- **Prettier**: Automatic formatting
- **TypeScript Ready**: Type safety preparation
- **Jest Testing**: Unit test framework

### Performance Monitoring
- **Flipper Integration**: Real-time debugging
- **Performance Profiling**: Optimization insights
- **Memory Tracking**: Leak prevention
- **Crash Reporting**: Production monitoring

## 🐛 Troubleshooting

### Common Issues

**App crashes on image selection**
- Check storage permissions
- Verify image format support
- Try smaller image files

**Pattern generation is slow**
- Reduce nail count
- Lower maximum lines
- Disable optimization

**Export fails**
- Check storage permissions
- Ensure sufficient disk space
- Try alternative export format

### Performance Tips
- Use 500x500px images or smaller
- Start with 200 nails for testing
- Enable optimization only for final patterns
- Clear app data if experiencing issues

## 🔄 Version History

### v1.0.0 (Current)
- ✅ Complete algorithm rewrite with real image processing
- ✅ Professional UI/UX design
- ✅ Comprehensive export functionality
- ✅ Multi-project support
- ✅ Advanced settings and customization
- ✅ Performance optimizations
- ✅ Error handling and validation
- ✅ Multiple nail patterns (circle, square, heart, star)
- ✅ Pattern optimization algorithms
- ✅ Responsive design for all devices

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### Development Setup
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 💡 Future Enhancements

- [ ] TypeScript migration
- [ ] Advanced pattern shapes (polygons, custom curves)
- [ ] Machine learning pattern optimization
- [ ] Real-time collaborative editing
- [ ] Cloud project synchronization
- [ ] 3D visualization mode
- [ ] Video export capabilities
- [ ] Integration with physical CNC machines

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/yourusername/StringArtApp/issues) page
2. Create a new issue with detailed information
3. Include device information and steps to reproduce

---

**Made with ❤️ and algorithms**

Transform your memories into mathematical art! 🎨➡️📐
