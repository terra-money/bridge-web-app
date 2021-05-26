// https://gist.github.com/gokulkrishh/242e68d1ee94ad05f488
const deviceWidth = {
  mobile: '575px',
  tablet: '767px',
  laptop: '1024px',
  desktop: '1280px',
}

const media = {
  mobile: `(max-width: ${deviceWidth.mobile})`,
  tablet: `(max-width: ${deviceWidth.tablet})`,
  laptop: `(max-width: ${deviceWidth.laptop})`,
  desktop: `(min-width: ${deviceWidth.desktop})`,
}

const css = { borderRadius: '10px' }

export default { media, css }
