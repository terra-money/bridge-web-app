import { isBrowser, isChrome, isEdgeChromium } from 'react-device-detect'

// https://gist.github.com/gokulkrishh/242e68d1ee94ad05f488
const deviceWidth = {
  mobile: '767px',
  tablet: '1024px',
  laptop: '1280px',
  desktop: '1281px',
}

const media = {
  mobile: `(max-width: ${deviceWidth.mobile})`,
  tablet: `(max-width: ${deviceWidth.tablet})`,
  laptop: `(max-width: ${deviceWidth.laptop})`,
  desktop: `(min-width: ${deviceWidth.desktop})`,
}

const css = { borderRadius: '10px' }

const isSupportBrowser = isBrowser && (isChrome || isEdgeChromium)

export default { media, css, isSupportBrowser }
