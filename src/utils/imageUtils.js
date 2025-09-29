/**
 * Converts a regular image URL to a hero-sized background image
 * @param {string} url - The original image URL
 * @returns {string} - The converted hero image URL
 */
export const toHero = (url) => {
  if (!url) return "";

  if (url.includes("picsum.photos")) {
    return url.replace(/\/\d+\/\d+/, "/1920/1080");
  }

  return url.replace(/w=\d+/i, "w=1920");
};

/**
 * Generates a placeholder image URL
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @param {string} text - Text to display on placeholder
 * @returns {string} - Placeholder image URL
 */
export const generatePlaceholder = (width, height, text = "No Image") => {
  return `https://via.placeholder.com/${width}x${height}/333/fff?text=${encodeURIComponent(
    text
  )}`;
};
