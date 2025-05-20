import React from 'react';
import { Github, Code, Eye, DownloadCloud } from 'lucide-react';
import LanguageBar from './LanguageBar';
import '../styles/themes.css';

/**
 * PreviewCard component for displaying GitHub repository preview
 * 
 * @param {Object} props - Component props
 * @param {String} props.repoName - Repository name
 * @param {String} props.repoDescription - Repository description
 * @param {String} props.stars - Number of stars
 * @param {String} props.forks - Number of forks
 * @param {String} props.watchers - Number of watchers (optional)
 * @param {String} props.owner - Repository owner name
 * @param {String} props.avatarUrl - Repository owner avatar URL
 * @param {Array} props.languageBreakdown - Array of language objects
 * @param {Object} props.theme - Theme object with styling classes
 * @param {String} props.pattern - Background pattern name
 * @param {React.RefObject} props.forwardedRef - Ref to be forwarded to the card component
 */
const PreviewCard = ({ 
  repoName, 
  repoDescription, 
  stars, 
  forks,
  watchers,
  owner,
  avatarUrl,
  languageBreakdown, 
  theme,
  pattern = '',
  forwardedRef
}) => {
  // Extract repo name without owner if it includes '/'
  const displayName = repoName.includes('/') ? repoName.split('/')[1] : repoName;
  
  // Process owner name
  const displayOwner = owner || (repoName.includes('/') ? repoName.split('/')[0] : '');
  
  // Get CSS class for selected pattern
  const getPatternClass = () => {
    switch(pattern) {
      case 'dots': return 'pattern-dots';
      case 'lines': return 'pattern-lines';
      case 'hexagons': return 'pattern-hexagons';
      case 'circuit': return 'pattern-circuit';
      default: return '';
    }
  };

  return (
    <div 
      ref={forwardedRef}
      className={`preview-card ${theme.background} ${theme.border}`}
    >
      {pattern && (
        <div className={`preview-pattern ${getPatternClass()}`}></div>
      )}
      
      <div className="preview-content">
        <div className="preview-header">
          {avatarUrl && (
            <div 
              className="preview-avatar" 
              style={{ backgroundImage: `url(${avatarUrl})` }}
            ></div>
          )}
          
          <div className="preview-title-wrapper">
            {displayOwner && (
              <div className={`preview-owner ${theme.stats}`}>
                {displayOwner}
              </div>
            )}
            <h1 className={`preview-title ${theme.title}`}>{displayName}</h1>
          </div>
        </div>
        
        {repoDescription && (
          <p className={`preview-description ${theme.description}`}>{repoDescription}</p>
        )}
        
        <div className="preview-stats">
          <div className="preview-stat">
            <svg className={`preview-icon ${theme.stats}`} fill="currentColor" viewBox="0 0 16 16">
              <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z" />
            </svg>
            <span className={`preview-stat-text ${theme.stats}`}>{stars}</span>
          </div>
          
          <div className="preview-stat">
            <svg className={`preview-icon ${theme.stats}`} fill="currentColor" viewBox="0 0 16 16">
              <path d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z" />
            </svg>
            <span className={`preview-stat-text ${theme.stats}`}>{forks}</span>
          </div>
          
          {watchers && (
            <div className="preview-stat">
              <Eye size={20} className={theme.stats} />
              <span className={`preview-stat-text ${theme.stats}`}>{watchers}</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Language bar */}
      <LanguageBar 
        languages={languageBreakdown} 
        isPreview={true} 
      />
      
      <div className="preview-watermark">
        <Code size={180} />
      </div>
    </div>
  );
};

export default PreviewCard;