const modalVideo = (function() {
  let player;

  // initialize all video links
  const initVideoLinks = function() {
    const videoOverlay = document.getElementById("video-overlay");
    const closeVideoOverlay = videoOverlay.querySelector('.close');

    // delegate click event listeners for modal videos to the document
    // as the content of the body will be replaced by SWUP
    document.addEventListener("click", e => {
      if (e.target.matches(".js-modal-video, .js-modal-video * ")) {
        const thisTrigger = e.target.closest(".js-modal-video");
        const requestedVideoID = thisTrigger.dataset.videoid;
        const startTime = thisTrigger.dataset.startTime;
        const endTime = thisTrigger.dataset.endTime;

        e.preventDefault();
        e.stopPropagation();

        // fade in the overlay
        videoOverlay.addEventListener('animationend', () => {
          videoOverlay.classList.add('is-open');
          videoOverlay.classList.remove('fadein');
        }, { once: true });
        videoOverlay.classList.add('fadein');

        // prevent scrolling under the overlay
        document.body.classList.add('modal-active');
        
        // we are using the same player for all videos
        // load the appropriate video ID
        // check whether the requested videoId is equal to what the player has already loaded
        // if not load new video, otherwise play existing video
        if (requestedVideoID === player.getVideoEmbedCode()) {
          player.playVideo();
        } else {
          player.loadVideoById({
            videoId: requestedVideoID,
            startSeconds: startTime || null,
            endSeconds: endTime || null,
          });
        }
        // we might have muted a previous video. set the default level
        player.setVolume(50);
      }

    });

    // the video overlay is outside the content area, thus is permanent for all pages
    // ergo we can attach the event handler directly to the element
    
    // close video overlay when close link is clicked
    closeVideoOverlay.addEventListener("click", () => {
      // fadeout sound as we close the overlay
      let currentVolume = player.getVolume();
      const fadeout = setInterval(() => {
        if (currentVolume <= 0) {
          // use pauseVideo rather than stopVideo to minimize
          // previous video flashes when starting the new video
          player.pauseVideo();
          clearInterval(fadeout);
        }
        currentVolume -= 5;
        player.setVolume(currentVolume);
      }, 100);
      
      // fadeout the overlay
      videoOverlay.addEventListener('animationend', () => {
        videoOverlay.classList.remove('is-open');
        videoOverlay.classList.remove('fadeout');
      }, { once: true });
      videoOverlay.classList.add('fadeout')
      
      // allow scrolling again
      document.body.classList.remove('modal-active');
    });
  };

  // control player by events like end of play
  const onPlayerStateChange = function(event) {
    const videoOverlay = document.getElementById("video-overlay");

    // player states
    // "unstarted"               = -1
    // YT.PlayerState.ENDED      =  0
    // YT.PlayerState.PLAYING    =  1
    // YT.PlayerState.PAUSED     =  2
    // YT.PlayerState.BUFFERING  =  3
    // YT.PlayerState.CUED       =  5

    switch (event.data) {
      case YT.PlayerState.PAUSED:
        break;

      case YT.PlayerState.PLAYING:
        break;

      case YT.PlayerState.ENDED:
        videoOverlay.addEventListener('animationend', () => {
          videoOverlay.classList.remove('is-open');
          videoOverlay.classList.remove('fadeout');
        }, { once: true });
        videoOverlay.classList.add('fadeout')
        
        document.body.classList.remove('modal-active');
        break;

      case YT.PlayerState.CUED:
        break;

      default:
    }
  };

  const init = function() {
    const modalVideoTriggers = document.querySelectorAll('.js-modal-video');
    // if no video trigger links on page return
    if (modalVideoTriggers.length < 1) {
      return;
    }

    // initialize all video players on a page
    // videoAPIReady is a defered javascript object for when the Youtube API has been loaded
    window.videoAPIReady.then(() => {
      
      // create an video overlay and add to DOM if it doesn't already exist
      if (!document.querySelector('#video-overlay')) {
        const newVideoOverlay = `
        <div id="video-overlay" class="js-video-overlay">
            <span class="close">[Close]</span>
            <div class="responsive-wrapper">
                <div class="video-container">
                    <div id="ytvideo"></div>
                </div>
            </div>
        </div>
      `;
        document.body.insertAdjacentHTML('beforeend', newVideoOverlay);
      }
      
      const videoId = modalVideoTriggers[0].dataset.videoid;
      const startTime = modalVideoTriggers[0].dataset.startTime;
      const endTime = modalVideoTriggers[0].dataset.endTime;

      // reference https://developers.google.com/youtube/player_parameters?playerVersion=HTML5
      const playerVars = {
        autoplay: 0,
        start: startTime || null, // if no start or end time is specified go trom 0 to end
        end: endTime || null, // start/stop via js commands
        controls: 1, // show video controls
        enablejsapi: 1, // enable the js api so we can control then player with js
        wmode: 'opaque', // allow other elements to cover video, e.g. dropdowns or pop-ups
        origin: window.location.origin, // prevent "Failed to execute 'postMessage' on 'DOMWindow'" error
        rel: 0, // disable other video suggestions after video end
      };

      // create the video player object
      player = new YT.Player('ytvideo', {
        videoId: videoId,
        playerVars,
        events: {
          onReady: initVideoLinks,
          onStateChange: onPlayerStateChange,
        },
      });
    });
  };

  return {
    init,
  };
})();

export default modalVideo;