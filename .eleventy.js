module.exports = function (eleventyConfig) {
  // Copy the live site's static runtime files alongside the generated HTML.
  eleventyConfig.addPassthroughCopy('styles.css');
  eleventyConfig.addPassthroughCopy('assets');
  eleventyConfig.addPassthroughCopy('uploads');

  return {
    dir: {
      input: '.',
      output: '_site'
    },
    templateFormats: ['html', 'md', 'njk'],
    htmlTemplateEngine: 'liquid',
    markdownTemplateEngine: 'liquid',
    passthroughFileCopy: true
  };
};
