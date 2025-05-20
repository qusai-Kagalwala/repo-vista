import React from 'react';
import '../styles/languages.css';

/**
 * LanguageBar component for displaying language breakdown
 * 
 * @param {Object} props - Component props
 * @param {Array} props.languages - Array of language objects with name, percentage, and color
 * @param {Boolean} props.isPreview - Whether this is rendered in the preview card
 * @param {Function} props.onLanguageClick - Optional click handler for each language section
 */
const LanguageBar = ({ languages, isPreview = false, onLanguageClick }) => {
  // If no languages provided, show a placeholder
  if (!languages || languages.length === 0) {
    return (
      <div className={`language-bar ${isPreview ? 'preview-language-bar' : ''}`}>
        <div className="language-bar-item lang-javascript" style={{ width: '100%' }}></div>
      </div>
    );
  }

  return (
    <div className={`language-bar ${isPreview ? 'preview-language-bar' : ''}`}>
      {languages.map((lang, index) => (
        <div 
          key={index} 
          className={`language-bar-item ${lang.color} ${isPreview ? 'preview-language-bar-item' : ''}`} 
          style={{ width: `${lang.percentage}%` }}
          data-tooltip={`${lang.name}: ${lang.percentage}%`}
          onClick={onLanguageClick ? () => onLanguageClick(index) : undefined}
          role={onLanguageClick ? "button" : undefined}
          tabIndex={onLanguageClick ? 0 : undefined}
        >
          {!isPreview && (
            <div className="language-bar-tooltip">
              {lang.name}: {lang.percentage}%
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default LanguageBar;