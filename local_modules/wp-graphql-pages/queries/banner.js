module.exports = `Pagebuilder_Sections_Banner {
    component
    animateSection
    backgroundColor
    inContainer
    marginBottom
    marginTop
    paddingTop
    paddingBottom
    targetId
    title
    header
    subTitle
    prose
    mediaType
    audio {
      bgImage
      aspectRatio
      mpeg
      ogg
    }
    image {
      src
      altText
      aspectRatio
    }
    lottieData {
      src
      control {
        loop
        autoplay
      }
    }
    video {
      src
      id
      tn
      aspectRatio
    }
    hasCtas
    ctas {
      label
      url
      isExternal
      isButton
      buttonStyle
      isVideoTrigger
      videoId
    }
  }
`