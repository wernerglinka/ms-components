// NOTE: main.js is called at the end of the document body - no DOMContentLoaded event needed
import Swup from 'swup';

import loadResponsiveImage from './modules/load-responsive-image';
import navigation from './modules/navigation';
import modalVideo from "./modules/modal-video";
import externalLinks from "./modules/external-links";




function initPage() {
  // load the youTube video JS api
  // https://developers.google.com/youtube/iframe_api_reference
  // This code loads the IFrame Player API code asynchronously.
  const tag = document.createElement('script');
  tag.src = 'https://www.youtube.com/iframe_api';
  const firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  // use a promise to manage the async onYouTubeIframeAPIReady function
  window.videoAPIReady = new Promise(resolve => {
    // upon YouTube API Ready we resolve the promise
    // we can then initialize video players in other modules
    // e.g. videoAPIReady.then(() => {})
    window.onYouTubeIframeAPIReady = () => resolve();
  });

  navigation.init();
  loadResponsiveImage.init();
  modalVideo.init();
  //externalLinks.init();
};

(function() {
  const options = {
    // disable SWUP from intercepting anchor links and external links
    linkSelector:
      'a[href^="/"]:not([data-no-swup]), a[href^="' + window.location.origin + '"]:not([data-no-swup])'
  };
  const swup = new Swup(options);

  initPage();

})();