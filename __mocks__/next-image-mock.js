module.exports = ({ src, alt, width, height, ...rest }) => {
  // Return a plain img element string for simple rendering in tests
  return require('react').createElement('img', {
    src: src || '',
    alt: alt || '',
    width,
    height,
    ...rest,
  });
};
