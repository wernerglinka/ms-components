// function to add "target='_blank'" to all external links
const externalLinks = (function() {
  "use strict"

  const init = function () {
    const allExternalLinks = document.querySelectorAll('a[href^="http://"], a[href^="https://"]');
    allExternalLinks.forEach(thisExternalLink => {
      thisExternalLink.setAttribute('target', '_blank');
      thisExternalLink.setAttribute('rel', 'noopener noreferrer');
    });
  };

  return {init};
})();

export default externalLinks;