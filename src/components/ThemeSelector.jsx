import React from 'react';
import '../styles/themes.css';

/**
 * ThemeSelector component for choosing between different preview themes
 * 
 * @param {Object} props - Component props
 * @param {String} props.selectedTheme - Currently selected theme
 * @param {Function} props.onThemeChange - Function to call when theme is changed
 * @param {Object} props.themes - Theme definitions object
 * @param {String} props.selectedPattern - Currently selected pattern
 * @param {Function} props.onPatternChange - Function to call when pattern is changed
 */
const ThemeSelector = ({ 
  selectedTheme, 
  onThemeChange, 
  themes,
  selectedPattern,
  onPatternChange 
}) => {
  if (!themes || Object.keys(themes).length === 0) {
    return <div>No themes available</div>;
  }

  // Background patterns
  const patterns = [
    { id: '', name: 'None' },
    { id: 'dots', name: 'Dots' },
    { id: 'lines', name: 'Lines' },
    { id: 'hexagons', name: 'Hexagons' },
    { id: 'circuit', name: 'Circuit' }
  ];

  // Get pattern class for preview
  const getPatternClass = (patternId) => {
    switch(patternId) {
      case 'dots': return 'pattern-dots';
      case 'lines': return 'pattern-lines';
      case 'hexagons': return 'pattern-hexagons';
      case 'circuit': return 'pattern-circuit';
      default: return '';
    }
  };

  return (
    <div className="card mb-4">
      <div className="card-body">
        <h2 className="section-title mb-4">Theme & Pattern</h2>
        
        <h3 className="h5 mb-3">Color Theme</h3>
        <div className="row">
          {Object.keys(themes).map(themeName => (
            <div className="col-md-4 col-6 mb-3" key={themeName}>
              <button
                onClick={() => onThemeChange(themeName)}
                className={`theme-btn ${
                  selectedTheme === themeName 
                    ? 'theme-btn-selected' 
                    : ''
                }`}
                aria-pressed={selectedTheme === themeName}
              >
                <div className={`theme-preview ${themes[themeName].background}`}>
                  {selectedPattern && (
                    <div className={`theme-preview-pattern ${getPatternClass(selectedPattern)}`}></div>
                  )}
                </div>
                <p className="mt-2 text-capitalize">{themeName}</p>
              </button>
            </div>
          ))}
        </div>
        
        <h3 className="h5 mb-3 mt-4">Background Pattern</h3>
        <div className="row">
          {patterns.map(pattern => (
            <div className="col-4 col-md-3 mb-3" key={pattern.id}>
              <button
                onClick={() => onPatternChange(pattern.id)}
                className={`theme-btn ${
                  selectedPattern === pattern.id 
                    ? 'theme-btn-selected' 
                    : ''
                }`}
                aria-pressed={selectedPattern === pattern.id}
              >
                <div className={`theme-preview ${themes[selectedTheme].background}`}>
                  {pattern.id && (
                    <div className={`theme-preview-pattern ${getPatternClass(pattern.id)}`}></div>
                  )}
                </div>
                <p className="mt-2">{pattern.name}</p>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ThemeSelector;