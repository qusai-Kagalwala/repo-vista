import React, { useState, useRef, useEffect } from 'react';
import { Download, Copy, CheckCircle, Plus, Minus, RefreshCw, Github } from 'lucide-react';
import LanguageBar from './LanguageBar';
import PreviewCard from './PreviewCard';
import ThemeSelector from './ThemeSelector';
import { 
  parseGitHubUrl,
  loadRepositoryData,
  formatLanguageBreakdown
} from '../utils/github-api';

// Import styles
import '../styles/main.css';
import '../styles/themes.css';
import '../styles/languages.css';

/**
 * Main GitHub Preview Generator Component with API integration
 */
const GitHubPreviewGenerator = () => {
  // State for repository details
  const [repoName, setRepoName] = useState('');
  const [repoDescription, setRepoDescription] = useState('');
  const [selectedTheme, setSelectedTheme] = useState('dark');
  const [selectedPattern, setSelectedPattern] = useState('dots');
  const [stars, setStars] = useState('0');
  const [forks, setForks] = useState('0');
  const [watchers, setWatchers] = useState('0');
  const [owner, setOwner] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const canvasRef = useRef(null);
  
  // Language breakdown state
  const [languageBreakdown, setLanguageBreakdown] = useState([
    { name: 'JavaScript', percentage: 62, color: 'lang-javascript' },
    { name: 'TypeScript', percentage: 23, color: 'lang-typescript' },
    { name: 'CSS', percentage: 10, color: 'lang-css' },
    { name: 'HTML', percentage: 5, color: 'lang-html' }
  ]);

  // Default repository - used when the page loads initially
  useEffect(() => {
    if (!repoName) {
      setRepoName('github/explorer');
      setRepoDescription('Discover GitHub repositories effortlessly');
      fetchRepositoryData('github/explorer');
    }
  }, [repoName]);

  // Function to validate and process the avatar URL
  const validateAndProcessAvatarUrl = (url) => {
    if (!url) return '';
    
    // If it's already a valid URL, use it directly
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    
    // If it's just a username, generate GitHub avatar URL
    if (!url.includes('/') && !url.includes('.')) {
      return `https://github.com/${url}.png`;
    }
    
    // Otherwise, assume it's a relative URL and convert to absolute
    return `https://${url}`;
  };
  
  // Update avatar URL whenever the owner changes
  useEffect(() => {
    if (owner && !avatarUrl) {
      setAvatarUrl(`https://github.com/${owner}.png`);
    }
  }, [owner, avatarUrl]);
  
  // Process avatar URL before sending to preview
  const processedAvatarUrl = validateAndProcessAvatarUrl(avatarUrl);

  // Theme definitions
  const themes = {
    dark: {
      background: 'theme-dark-bg',
      title: 'theme-dark-title',
      description: 'theme-dark-description',
      accent: 'theme-dark-accent',
      stats: 'theme-dark-stats',
      border: 'theme-dark-border'
    },
    light: {
      background: 'theme-light-bg',
      title: 'theme-light-title',
      description: 'theme-light-description',
      accent: 'theme-light-accent',
      stats: 'theme-light-stats',
      border: 'theme-light-border'
    },
    gradient: {
      background: 'theme-gradient-bg',
      title: 'theme-gradient-title',
      description: 'theme-gradient-description',
      accent: 'theme-gradient-accent',
      stats: 'theme-gradient-stats',
      border: 'theme-gradient-border'
    },
    github: {
      background: 'theme-github-bg',
      title: 'theme-github-title',
      description: 'theme-github-description',
      accent: 'theme-github-accent',
      stats: 'theme-github-stats',
      border: 'theme-github-border'
    },
    sunset: {
      background: 'theme-sunset-bg',
      title: 'theme-sunset-title',
      description: 'theme-sunset-description',
      accent: 'theme-sunset-accent',
      stats: 'theme-sunset-stats',
      border: 'theme-sunset-border'
    },
    ocean: {
      background: 'theme-ocean-bg',
      title: 'theme-ocean-title',
      description: 'theme-ocean-description',
      accent: 'theme-ocean-accent',
      stats: 'theme-ocean-stats',
      border: 'theme-ocean-border'
    },
    forest: {
      background: 'theme-forest-bg',
      title: 'theme-forest-title',
      description: 'theme-forest-description',
      accent: 'theme-forest-accent',
      stats: 'theme-forest-stats',
      border: 'theme-forest-border'
    }
  };

  // Language color mapping
  const languageColors = {
    JavaScript: 'lang-javascript',
    TypeScript: 'lang-typescript',
    Python: 'lang-python',
    Java: 'lang-java',
    Ruby: 'lang-ruby',
    'C#': 'lang-csharp',
    PHP: 'lang-php',
    Go: 'lang-go',
    Rust: 'lang-rust',
    Swift: 'lang-swift',
    Kotlin: 'lang-kotlin',
    Dart: 'lang-dart',
    CSS: 'lang-css',
    HTML: 'lang-html',
    Shell: 'lang-shell',
    C: 'lang-c',
    'C++': 'lang-cpp',
    'Jupyter Notebook': 'lang-jupyter',
    Vue: 'lang-vue',
    JSX: 'lang-jsx',
    Markdown: 'lang-markdown',
    Elixir: 'lang-elixir',
    Haskell: 'lang-haskell',
    Perl: 'lang-perl',
    R: 'lang-r',
    Lua: 'lang-lua',
    Clojure: 'lang-clojure',
    Scala: 'lang-scala',
    SCSS: 'lang-scss',
    'F#': 'lang-fsharp',
    PowerShell: 'lang-powershell',
    Assembly: 'lang-assembly',
    'Objective-C': 'lang-objectivec',
    Groovy: 'lang-groovy',
    Dockerfile: 'lang-dockerfile',
    Julia: 'lang-julia',
    MATLAB: 'lang-matlab'
  };

  // Available language options
  const languageOptions = Object.keys(languageColors);
  
  // Function to add a new language to the breakdown
  const addLanguage = () => {
    if (languageBreakdown.length >= 6) return; // Limit to 6 languages for visual clarity
    
    const unusedLanguages = languageOptions.filter(
      lang => !languageBreakdown.some(item => item.name === lang)
    );
    
    if (unusedLanguages.length === 0) return;
    
    // Redistribute percentages to make room for new language
    const newPercentage = 5;
    const remaining = 100 - newPercentage;
    const updated = languageBreakdown.map(lang => ({
      ...lang,
      percentage: Math.round((lang.percentage / 100) * remaining)
    }));
    
    setLanguageBreakdown([
      ...updated,
      { 
        name: unusedLanguages[0], 
        percentage: newPercentage, 
        color: languageColors[unusedLanguages[0]] || 'lang-other'
      }
    ]);
  };
  
  // Function to remove a language from the breakdown
  const removeLanguage = (index) => {
    if (languageBreakdown.length <= 1) return;
    
    const removedPercentage = languageBreakdown[index].percentage;
    const remaining = languageBreakdown.filter((_, i) => i !== index);
    const total = remaining.reduce((sum, lang) => sum + lang.percentage, 0);
    
    // Redistribute the removed language's percentage
    const updated = remaining.map(lang => ({
      ...lang,
      percentage: Math.round(lang.percentage + (lang.percentage / total) * removedPercentage)
    }));
    
    // Ensure total is exactly 100%
    const adjustedTotal = updated.reduce((sum, lang) => sum + lang.percentage, 0);
    if (adjustedTotal !== 100 && updated.length > 0) {
      updated[0].percentage += (100 - adjustedTotal);
    }
    
    setLanguageBreakdown(updated);
  };

  // Function to update a language's properties
  const updateLanguage = (index, field, value) => {
    const updated = [...languageBreakdown];
    
    if (field === 'name') {
      updated[index] = {
        ...updated[index],
        name: value,
        color: languageColors[value] || 'lang-other'
      };
      setLanguageBreakdown(updated);
    } else if (field === 'percentage') {
      let newValue = parseInt(value) || 0;
      
      // Ensure percentage is between 1 and 99
      newValue = Math.min(Math.max(newValue, 1), 99);
      
      // Calculate the difference
      const diff = newValue - updated[index].percentage;
      
      // Apply the difference by adjusting other percentages proportionally
      if (diff !== 0) {
        const others = updated.filter((_, i) => i !== index);
        const othersTotal = others.reduce((sum, lang) => sum + lang.percentage, 0);
        
        // Calculate adjustment factor for other languages
        const factor = (othersTotal - diff) / othersTotal;
        
        for (let i = 0; i < updated.length; i++) {
          if (i === index) {
            updated[i].percentage = newValue;
          } else {
            // Adjust other percentages proportionally
            updated[i].percentage = Math.max(1, Math.round(updated[i].percentage * factor));
          }
        }
        
        // Ensure total is exactly 100%
        const adjustedTotal = updated.reduce((sum, lang) => sum + lang.percentage, 0);
        if (adjustedTotal !== 100) {
          // Find the largest percentage (besides the one being edited) to adjust
          const largestIndex = updated
            .map((lang, i) => i !== index ? { index: i, percentage: lang.percentage } : { index: -1, percentage: 0 })
            .reduce((max, curr) => curr.percentage > max.percentage ? curr : max, { index: -1, percentage: 0 })
            .index;
          
          if (largestIndex >= 0) {
            updated[largestIndex].percentage += (100 - adjustedTotal);
          }
        }
      }
      
      setLanguageBreakdown(updated);
    }
  };

  // Function to download the preview as an image
  const downloadImage = () => {
    if (!canvasRef.current) return;
    
    // Import html2canvas library
    import('html2canvas').then(({ default: html2canvas }) => {
      html2canvas(canvasRef.current, {
        scale: 2, // Higher scale for better quality
        backgroundColor: null,
        logging: false
      }).then(canvas => {
        // Convert canvas to Blob
        canvas.toBlob(blob => {
          // Create download link
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `${repoName.replace('/', '-')}-preview.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }, 'image/png');
      });
    }).catch(err => {
      console.error('Error loading html2canvas:', err);
      alert('Failed to generate image. Please try again.');
    });
  };

  // Function to copy the image to clipboard
  const copyAsImage = () => {
    if (!canvasRef.current) return;
    
    import('html2canvas').then(({ default: html2canvas }) => {
      html2canvas(canvasRef.current, {
        scale: 2,
        backgroundColor: null,
        logging: false
      }).then(canvas => {
        canvas.toBlob(blob => {
          try {
            // Use Clipboard API if available
            if (navigator.clipboard && navigator.clipboard.write) {
              const item = new ClipboardItem({ 'image/png': blob });
              navigator.clipboard.write([item]).then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }).catch(err => {
                console.error('Error copying to clipboard:', err);
                alert('Failed to copy to clipboard. Try using the download button instead.');
              });
            } else {
              // Fallback - show an alert
              alert('Clipboard functionality is not available. Please use the download button instead.');
            }
          } catch (err) {
            console.error('Error copying to clipboard:', err);
            alert('Failed to copy to clipboard. Try using the download button instead.');
          }
        }, 'image/png');
      });
    }).catch(err => {
      console.error('Error loading html2canvas:', err);
      alert('Failed to generate image. Please try again.');
    });
  };
  
  // Fetch repository data from GitHub API
  const fetchRepositoryData = async (repoFullName) => {
    setLoading(true);
    setError('');
    
    try {
      // Parse repo name to get username and repo
      let username, repoName;
      
      if (repoFullName.includes('/')) {
        [username, repoName] = repoFullName.split('/');
      } else {
        // If no slash, assume it's just the repo name
        // This won't work with the GitHub API, but we'll handle that in the catch block
        username = '';
        repoName = repoFullName;
      }
      
      if (!username || !repoName) {
        throw new Error('Please enter a valid repository in the format "username/repository"');
      }
      
      // Load all repository data
      const data = await loadRepositoryData(username, repoName);
      
      // Update state with fetched data
      const { repoData, languageStats, avatarUrl } = data;
      
      setRepoName(repoData.full_name);
      setRepoDescription(repoData.description || '');
      setStars(repoData.stargazers_count.toString());
      setForks(repoData.forks_count.toString());
      setWatchers(repoData.watchers_count.toString());
      setOwner(repoData.owner.login);
      setAvatarUrl(avatarUrl);
      
      // Format language breakdown
      const formattedLanguages = formatLanguageBreakdown(languageStats, languageColors);
      setLanguageBreakdown(formattedLanguages);
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching repository data:', error);
      setError(error.message || 'Failed to fetch repository data');
      setLoading(false);
    }
  };
  
  // Handle GitHub URL input
  const handleGitHubUrlSubmit = (e) => {
    e.preventDefault();
    
    const url = document.getElementById('repo-url')?.value;
    if (!url) {
      setError('Please enter a GitHub repository URL');
      return;
    }
    
    // Parse GitHub URL
    const repoInfo = parseGitHubUrl(url);
    if (!repoInfo) {
      setError('Invalid GitHub URL. Please enter a valid repository URL (e.g., https://github.com/username/repository)');
      return;
    }
    
    const { username, repoName } = repoInfo;
    fetchRepositoryData(`${username}/${repoName}`);
  };
  
  // Handle manual input
  const handleManualRepoSubmit = (e) => {
    e.preventDefault();
    
    if (!repoName) {
      setError('Please enter a repository name');
      return;
    }
    
    if (!repoName.includes('/')) {
      setError('Please enter a repository name in the format "username/repository"');
      return;
    }
    
    fetchRepositoryData(repoName);
  };

  // Get current theme
  const theme = themes[selectedTheme];

  return (
    <div className="container my-5">
      <header className="text-center mb-5">
        <h1 className="title">GitHub Social Preview Generator</h1>
        <p className="subtitle">Create beautiful preview images for your GitHub repositories</p>
      </header>
      
      <div className="row">
        {/* Left Column - Controls */}
        <div className="col-md-6 mb-4">
          {/* GitHub URL Input */}
          <div className="card mb-4">
            <div className="card-body">
              <h2 className="section-title mb-3">GitHub Repository</h2>
              <p className="text-muted mb-3">
                Enter a GitHub repository URL to automatically fetch repository data
              </p>
              
              <form onSubmit={handleGitHubUrlSubmit}>
                <div className="input-group mb-3">
                  <input
                    type="text"
                    placeholder="https://github.com/username/repository"
                    className="form-control"
                    id="repo-url"
                  />
                  <button 
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="loading-spinner"></div>
                    ) : (
                      <>
                        <RefreshCw size={16} className="me-1" />
                        Fetch
                      </>
                    )}
                  </button>
                </div>
              </form>
              
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
            </div>
          </div>
          
          {/* Repository Details */}
          <div className="card mb-4">
            <div className="card-body">
              <h2 className="section-title mb-3">Repository Details</h2>
              
              <form onSubmit={handleManualRepoSubmit}>
                <div className="mb-3">
                  <label className="form-label">Repository Name</label>
                  <div className="input-group">
                    <input
                      type="text"
                      value={repoName}
                      onChange={(e) => setRepoName(e.target.value)}
                      className="form-control"
                      placeholder="username/repository"
                    />
                    <button 
                      type="submit" 
                      className="btn btn-outline-secondary"
                      disabled={loading}
                    >
                      <RefreshCw size={16} />
                    </button>
                  </div>
                </div>
                
                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    value={repoDescription}
                    onChange={(e) => setRepoDescription(e.target.value)}
                    className="form-control"
                    rows={3}
                    placeholder="A brief description of your repository"
                  />
                </div>
                
                <div className="row">
                  <div className="col-4">
                    <div className="mb-3">
                      <label className="form-label">Stars</label>
                      <input
                        type="text"
                        value={stars}
                        onChange={(e) => setStars(e.target.value)}
                        className="form-control"
                        placeholder="0"
                      />
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="mb-3">
                      <label className="form-label">Forks</label>
                      <input
                        type="text"
                        value={forks}
                        onChange={(e) => setForks(e.target.value)}
                        className="form-control"
                        placeholder="0"
                      />
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="mb-3">
                      <label className="form-label">Watchers</label>
                      <input
                        type="text"
                        value={watchers}
                        onChange={(e) => setWatchers(e.target.value)}
                        className="form-control"
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="mb-3">
                  <label className="form-label">Avatar URL (username or full URL)</label>
                  <input
                    type="text"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    className="form-control"
                    placeholder="username or https://example.com/avatar.png"
                  />
                  <small className="text-muted">Enter a GitHub username or full image URL</small>
                </div>
              </form>
            </div>
          </div>
          
          {/* Languages */}
          <div className="card mb-4">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="section-title">Languages</h2>
                <div>
                  <button 
                    onClick={addLanguage}
                    className="btn btn-sm btn-light rounded-circle"
                    title="Add Language"
                    disabled={languageBreakdown.length >= 6}
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
              
              {languageBreakdown.map((lang, index) => (
                <div key={index} className="d-flex align-items-center mb-3">
                  <div className={`lang-dot ${lang.color}`}></div>
                  
                  <select
                    value={lang.name}
                    onChange={(e) => updateLanguage(index, 'name', e.target.value)}
                    className="form-select form-select-sm mx-2 flex-grow-1"
                  >
                    {languageOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                  
                  <div className="d-flex align-items-center" style={{width: "100px"}}>
                    <input
                      type="number"
                      min="1"
                      max="99"
                      value={lang.percentage}
                      onChange={(e) => updateLanguage(index, 'percentage', e.target.value)}
                      className="form-control form-control-sm"
                    />
                    <span className="small text-muted ms-1">%</span>
                  </div>
                  
                  <button 
                    onClick={() => removeLanguage(index)}
                    className="btn btn-sm btn-light ms-2 rounded-circle"
                    title="Remove Language"
                    disabled={languageBreakdown.length <= 1}
                  >
                    <Minus size={14} />
                  </button>
                </div>
              ))}
              
              <LanguageBar languages={languageBreakdown} />
              
              <div className="text-muted small fst-italic mt-1">
                Total: 100%
              </div>
            </div>
          </div>
          
          {/* Theme Selector */}
          <ThemeSelector 
            selectedTheme={selectedTheme} 
            onThemeChange={setSelectedTheme} 
            themes={themes}
            selectedPattern={selectedPattern}
            onPatternChange={setSelectedPattern}
          />
          
          {/* Action Buttons */}
          <div className="d-flex gap-2">
            <button 
              onClick={downloadImage}
              className="btn btn-primary flex-grow-1"
            >
              <Download size={16} className="me-1" />
              Download PNG
            </button>
            <button 
              onClick={copyAsImage}
              className="btn btn-outline-secondary"
            >
              {copied ? <CheckCircle size={16} className="me-1" /> : <Copy size={16} className="me-1" />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>
        
        {/* Right Column - Preview */}
        <div className="col-md-6">
          <div className="sticky-top" style={{ top: '20px' }}>
            <h2 className="section-title mb-3">Preview</h2>
            
            <div className="position-relative">
              {loading && (
                <div className="loading-overlay">
                  <div className="loading-spinner"></div>
                </div>
              )}
              
              <PreviewCard 
                repoName={repoName}
                repoDescription={repoDescription}
                stars={stars}
                forks={forks}
                watchers={watchers}
                owner={owner}
                avatarUrl={processedAvatarUrl}
                languageBreakdown={languageBreakdown}
                theme={theme}
                pattern={selectedPattern}
                forwardedRef={canvasRef}
              />
            </div>
            
            <div className="text-muted small fst-italic mt-3">
              <div><strong>Tip:</strong> Click "Download PNG" to save this image, then upload it to your GitHub repository's social preview.</div>
              <div className="mt-2">
                <a href="https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/customizing-your-repositorys-social-media-preview" target="_blank" rel="noreferrer" className="text-decoration-none">
                  <Github size={14} className="me-1" />
                  How to set your GitHub social preview
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GitHubPreviewGenerator;