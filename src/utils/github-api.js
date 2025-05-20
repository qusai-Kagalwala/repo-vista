/**
 * GitHub API Integration Utilities
 * 
 * This module provides functions for interacting with the GitHub API to fetch
 * repository data, language statistics, user information, and more.
 */

// GitHub API token (from environment variable)
// For development, store this in a .env file (REACT_APP_GITHUB_TOKEN=your_token)
// For production, implement a backend proxy to keep your token secure
const GITHUB_TOKEN = process.env.REACT_APP_GITHUB_TOKEN;

// GitHub API base URL
const API_BASE_URL = 'https://api.github.com';

/**
 * Create headers for GitHub API requests
 * @returns {Object} - Headers object with Authorization if token exists
 */
const createHeaders = () => {
  const headers = {
    'Accept': 'application/vnd.github.v3+json'
  };
  
  if (GITHUB_TOKEN) {
    headers['Authorization'] = `token ${GITHUB_TOKEN}`;
  }
  
  return headers;
};

/**
 * Check GitHub API rate limit
 * @returns {Promise<Object>} - Rate limit information
 */
export const checkRateLimit = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/rate_limit`, {
      headers: createHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    return {
      core: {
        limit: data.resources.core.limit,
        remaining: data.resources.core.remaining,
        reset: new Date(data.resources.core.reset * 1000)
      },
      search: {
        limit: data.resources.search.limit,
        remaining: data.resources.search.remaining,
        reset: new Date(data.resources.search.reset * 1000)
      }
    };
  } catch (error) {
    console.error('Error checking rate limit:', error);
    throw error;
  }
};

/**
 * Fetch repository data from GitHub API
 * @param {String} username - GitHub username
 * @param {String} repoName - Repository name
 * @returns {Promise<Object>} - Repository data
 */
export const fetchRepositoryData = async (username, repoName) => {
  try {
    // Format the API URL
    const apiUrl = `${API_BASE_URL}/repos/${username}/${repoName}`;
    
    // Make the request with auth headers
    const response = await fetch(apiUrl, {
      headers: createHeaders()
    });
    
    if (response.status === 404) {
      throw new Error(`Repository not found: ${username}/${repoName}`);
    }
    
    if (response.status === 403 && response.headers.get('X-RateLimit-Remaining') === '0') {
      const resetTime = new Date(Number(response.headers.get('X-RateLimit-Reset')) * 1000);
      throw new Error(`API rate limit exceeded. Limit resets at ${resetTime.toLocaleTimeString()}`);
    }
    
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }
    
    // Parse the response as JSON
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching repository data:", error);
    throw error;
  }
};

/**
 * Fetch language statistics for a repository
 * @param {String} username - GitHub username
 * @param {String} repoName - Repository name
 * @returns {Promise<Object>} - Language statistics
 */
export const fetchLanguageStatistics = async (username, repoName) => {
  try {
    // Format the API URL for languages
    const apiUrl = `${API_BASE_URL}/repos/${username}/${repoName}/languages`;
    
    // Make the request
    const response = await fetch(apiUrl, {
      headers: createHeaders()
    });
    
    if (response.status === 404) {
      throw new Error(`Repository not found: ${username}/${repoName}`);
    }
    
    if (response.status === 403 && response.headers.get('X-RateLimit-Remaining') === '0') {
      const resetTime = new Date(Number(response.headers.get('X-RateLimit-Reset')) * 1000);
      throw new Error(`API rate limit exceeded. Limit resets at ${resetTime.toLocaleTimeString()}`);
    }
    
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }
    
    // Parse the response as JSON
    const data = await response.json();
    
    // Calculate percentages
    const total = Object.values(data).reduce((sum, value) => sum + value, 0);
    const languagePercentages = {};
    
    for (const [language, bytes] of Object.entries(data)) {
      languagePercentages[language] = parseFloat(((bytes / total) * 100).toFixed(1));
    }
    
    return languagePercentages;
  } catch (error) {
    console.error("Error fetching language statistics:", error);
    throw error;
  }
};

/**
 * Convert language statistics to the format used by the app
 * @param {Object} languageStats - Language statistics from GitHub API
 * @param {Object} languageColors - Language color mapping
 * @returns {Array} - Formatted language breakdown array
 */
export const formatLanguageBreakdown = (languageStats, languageColors) => {
  // Handle empty language stats
  if (!languageStats || Object.keys(languageStats).length === 0) {
    return [];
  }
  
  // Sort languages by percentage (descending)
  const sortedLanguages = Object.entries(languageStats)
    .sort(([, percentA], [, percentB]) => percentB - percentA);
  
  // Format as language breakdown array (limit to top 6 languages)
  const formattedLanguages = sortedLanguages.slice(0, 6).map(([name, percentage]) => ({
    name,
    percentage,
    color: languageColors[name] || 'lang-other' // Use default color if not found
  }));
  
  // Ensure total is exactly 100%
  const total = formattedLanguages.reduce((sum, lang) => sum + lang.percentage, 0);
  if (total !== 100 && formattedLanguages.length > 0) {
    // Add or subtract the difference from the largest language
    const largestLanguage = formattedLanguages.reduce(
      (max, lang) => lang.percentage > max.percentage ? lang : max,
      { percentage: 0 }
    );
    
    const index = formattedLanguages.indexOf(largestLanguage);
    if (index !== -1) {
      formattedLanguages[index].percentage += (100 - total);
    }
  }
  
  return formattedLanguages;
};

/**
 * Fetch GitHub user avatar
 * @param {String} username - GitHub username
 * @returns {Promise<String>} - Avatar URL
 */
export const fetchUserAvatar = async (username) => {
  try {
    // Format the API URL
    const apiUrl = `${API_BASE_URL}/users/${username}`;
    
    // Make the request
    const response = await fetch(apiUrl, {
      headers: createHeaders()
    });
    
    if (response.status === 404) {
      throw new Error(`User not found: ${username}`);
    }
    
    if (response.status === 403 && response.headers.get('X-RateLimit-Remaining') === '0') {
      const resetTime = new Date(Number(response.headers.get('X-RateLimit-Reset')) * 1000);
      throw new Error(`API rate limit exceeded. Limit resets at ${resetTime.toLocaleTimeString()}`);
    }
    
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }
    
    // Parse the response as JSON
    const data = await response.json();
    return data.avatar_url;
  } catch (error) {
    console.error("Error fetching user avatar:", error);
    throw error;
  }
};

/**
 * Extract username and repository name from a GitHub URL
 * @param {String} url - GitHub repository URL
 * @returns {Object|null} - Object with username and repoName or null if invalid
 */
export const parseGitHubUrl = (url) => {
  if (!url || !url.includes('github.com')) return null;
  
  try {
    // Remove protocol and domain
    const urlWithoutProtocol = url.replace(/^(https?:\/\/)?(www\.)?github\.com\//, '');
    
    // Split remaining path
    const pathParts = urlWithoutProtocol.split('/');
    
    if (pathParts.length >= 2) {
      const username = pathParts[0];
      // Remove any additional paths, query params, or hash fragments
      const repoName = pathParts[1].split('#')[0].split('?')[0];
      
      if (username && repoName) {
        return { username, repoName };
      }
    }
  } catch (error) {
    console.error("Error parsing GitHub URL:", error);
  }
  
  return null;
};

/**
 * Load all repository data in one call
 * @param {String} username - GitHub username
 * @param {String} repoName - Repository name
 * @returns {Promise<Object>} - All repository data
 */
export const loadRepositoryData = async (username, repoName) => {
  try {
    // Fetch all data in parallel
    const [repoData, languageStats, avatarUrl] = await Promise.all([
      fetchRepositoryData(username, repoName),
      fetchLanguageStatistics(username, repoName),
      fetchUserAvatar(username)
    ]);
    
    return {
      repoData,
      languageStats,
      avatarUrl
    };
  } catch (error) {
    console.error("Error loading repository data:", error);
    throw error;
  }
};

/**
 * Search for repositories
 * @param {String} query - Search query
 * @param {Number} perPage - Results per page (max 100)
 * @param {Number} page - Page number
 * @returns {Promise<Object>} - Search results
 */
export const searchRepositories = async (query, perPage = 10, page = 1) => {
  try {
    // Format the API URL
    const apiUrl = `${API_BASE_URL}/search/repositories?q=${encodeURIComponent(query)}&per_page=${perPage}&page=${page}`;
    
    // Make the request
    const response = await fetch(apiUrl, {
      headers: createHeaders()
    });
    
    if (response.status === 403 && response.headers.get('X-RateLimit-Remaining') === '0') {
      const resetTime = new Date(Number(response.headers.get('X-RateLimit-Reset')) * 1000);
      throw new Error(`API rate limit exceeded. Limit resets at ${resetTime.toLocaleTimeString()}`);
    }
    
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }
    
    // Parse the response as JSON
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error searching repositories:", error);
    throw error;
  }
};

/**
 * Fetch contributors for a repository
 * @param {String} username - GitHub username
 * @param {String} repoName - Repository name
 * @param {Number} perPage - Results per page (max 100)
 * @returns {Promise<Array>} - Contributors list
 */
export const fetchContributors = async (username, repoName, perPage = 10) => {
  try {
    // Format the API URL
    const apiUrl = `${API_BASE_URL}/repos/${username}/${repoName}/contributors?per_page=${perPage}`;
    
    // Make the request
    const response = await fetch(apiUrl, {
      headers: createHeaders()
    });
    
    if (response.status === 404) {
      throw new Error(`Repository not found: ${username}/${repoName}`);
    }
    
    if (response.status === 403 && response.headers.get('X-RateLimit-Remaining') === '0') {
      const resetTime = new Date(Number(response.headers.get('X-RateLimit-Reset')) * 1000);
      throw new Error(`API rate limit exceeded. Limit resets at ${resetTime.toLocaleTimeString()}`);
    }
    
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }
    
    // Parse the response as JSON
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching contributors:", error);
    throw error;
  }
};

/**
 * Check if the current client has a valid GitHub token
 * @returns {Boolean} - True if a token is present
 */
export const hasAuthToken = () => {
  return !!GITHUB_TOKEN;
};

/**
 * Get authentication status information
 * @returns {Promise<Object>} - Authentication status info
 */
export const getAuthStatus = async () => {
  // If no token, return unauthenticated status
  if (!GITHUB_TOKEN) {
    return {
      authenticated: false,
      rateLimitInfo: {
        limit: 60,
        remaining: null,
        resetTime: null
      }
    };
  }
  
  try {
    // Check rate limit (this also validates the token)
    const rateLimit = await checkRateLimit();
    
    return {
      authenticated: true,
      rateLimitInfo: {
        limit: rateLimit.core.limit,
        remaining: rateLimit.core.remaining,
        resetTime: rateLimit.core.reset
      }
    };
  } catch (error) {
    // If there's an error, the token might be invalid
    console.error("Error getting auth status:", error);
    return {
      authenticated: false,
      rateLimitInfo: {
        limit: 60,
        remaining: null,
        resetTime: null
      },
      error: error.message
    };
  }
};