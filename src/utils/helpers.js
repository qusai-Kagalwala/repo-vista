/**
 * Helper functions for calculating and redistributing language percentages
 */

/**
 * Ensures the total of all language percentages equals 100%
 * 
 * @param {Array} languages - Array of language objects with percentages
 * @return {Array} - Adjusted array with total percentage of 100%
 */
export const normalizePercentages = (languages) => {
    if (!languages || languages.length === 0) return [];
    
    const total = languages.reduce((sum, lang) => sum + lang.percentage, 0);
    
    // If already equals 100, return as is
    if (total === 100) return languages;
    
    // Find language with highest percentage to adjust
    const largestIndex = languages
      .map((lang, i) => ({ index: i, percentage: lang.percentage }))
      .reduce((max, curr) => curr.percentage > max.percentage ? curr : max, { index: -1, percentage: 0 })
      .index;
    
    const result = [...languages];
    if (largestIndex >= 0) {
      result[largestIndex].percentage += (100 - total);
    }
    
    return result;
  };
  
  /**
   * Redistributes percentages when a language is added
   * 
   * @param {Array} languages - Current language array
   * @param {Object} newLanguage - New language to add
   * @param {Number} newPercentage - Percentage to allocate to new language
   * @return {Array} - New array with redistributed percentages
   */
  export const addLanguageWithRedistribution = (languages, newLanguage, newPercentage = 5) => {
    if (!languages || languages.length === 0) {
      return [{ ...newLanguage, percentage: 100 }];
    }
    
    // Calculate remaining percentage
    const remaining = 100 - newPercentage;
    
    // Scale down existing language percentages proportionally
    const updated = languages.map(lang => ({
      ...lang,
      percentage: Math.round((lang.percentage / 100) * remaining)
    }));
    
    // Add new language
    const result = [
      ...updated,
      { ...newLanguage, percentage: newPercentage }
    ];
    
    // Make sure total is exactly 100%
    return normalizePercentages(result);
  };
  
  /**
   * Redistributes percentages when a language is removed
   * 
   * @param {Array} languages - Current language array
   * @param {Number} indexToRemove - Index of language to remove
   * @return {Array} - New array with redistributed percentages
   */
  export const removeLanguageWithRedistribution = (languages, indexToRemove) => {
    if (!languages || languages.length <= 1 || indexToRemove < 0 || indexToRemove >= languages.length) {
      return languages;
    }
    
    const removedPercentage = languages[indexToRemove].percentage;
    const remaining = languages.filter((_, i) => i !== indexToRemove);
    const total = remaining.reduce((sum, lang) => sum + lang.percentage, 0);
    
    // Redistribute removed percentage proportionally
    const updated = remaining.map(lang => ({
      ...lang,
      percentage: Math.round(lang.percentage + (lang.percentage / total) * removedPercentage)
    }));
    
    // Make sure total is exactly 100%
    return normalizePercentages(updated);
  };
  
  /**
   * Updates a language percentage and redistributes other percentages accordingly
   * 
   * @param {Array} languages - Current language array
   * @param {Number} index - Index of language to update
   * @param {Number} newPercentage - New percentage value
   * @return {Array} - Updated array with redistributed percentages
   */
  export const updateLanguagePercentage = (languages, index, newPercentage) => {
    if (!languages || languages.length === 0 || index < 0 || index >= languages.length) {
      return languages;
    }
    
    // Ensure percentage is between 1 and 99
    const validatedPercentage = Math.min(Math.max(parseInt(newPercentage) || 0, 1), 99);
    
    // Calculate the difference
    const diff = validatedPercentage - languages[index].percentage;
    
    // If no change, return original array
    if (diff === 0) return languages;
    
    const result = [...languages];
    result[index].percentage = validatedPercentage;
    
    // Apply the difference by adjusting other percentages proportionally
    const others = languages.filter((_, i) => i !== index);
    const othersTotal = others.reduce((sum, lang) => sum + lang.percentage, 0);
    
    // Calculate adjustment factor for other languages
    const factor = (othersTotal - diff) / othersTotal;
    
    for (let i = 0; i < result.length; i++) {
      if (i !== index) {
        // Adjust other percentages proportionally, ensuring minimum of 1%
        result[i].percentage = Math.max(1, Math.round(result[i].percentage * factor));
      }
    }
    
    // Make sure total is exactly 100%
    return normalizePercentages(result);
  };
  
  /**
   * Extracts a GitHub username and repository name from a URL
   * 
   * @param {String} url - GitHub repository URL
   * @return {Object|null} - Object with username and repo name or null if invalid
   */
  export const extractRepoInfoFromUrl = (url) => {
    if (!url || !url.includes('github.com')) return null;
    
    try {
      const urlParts = url.split('/');
      if (urlParts.length >= 5) {
        const username = urlParts[3];
        const repo = urlParts[4].split('#')[0].split('?')[0];
        
        if (username && repo) {
          return { username, repo };
        }
      }
    } catch (error) {
      console.error('Error parsing GitHub URL:', error);
    }
    
    return null;
  };