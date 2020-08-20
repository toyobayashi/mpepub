const { Color, RGBA, HSLA } = require('./color.js')

const ColorType = {
  DEFAULT: 0,
  RGB: 1,
  HEX: 2,
  HSL: 3,
  '0': 'DEFAULT',
  '1': 'RGB',
  '2': 'HEX',
  '3': 'HSL'
}

function ThrowInvalidColor (color) {
  throw new TypeError(`Invalid color: ${color}`)
}

function toColor (color) {
  if (color instanceof Color) {
    return color
  }

  if (typeof color !== 'string') {
    if (color.rgba) {
      return new Color(new RGBA(color.rgba.r, color.rgba.g, color.rgba.b, color.rgba.a))
    }
    ThrowInvalidColor(color)
  }
  const c = color.trim()

  let matches
  if (c.charCodeAt(0) === /* CharCode.Hash */ 35) {
    return Color.fromHex(c)
  } else if (matches = c.match(/^rgb\(\s*([0-9]|[1-9][0-9]|[12][0-9][0-9])\s*,\s*([0-9]|[1-9][0-9]|[12][0-9][0-9])\s*,\s*([0-9]|[1-9][0-9]|[12][0-9][0-9])\s*\)$/)) {
    return new Color(new RGBA(Number(matches[1]), Number(matches[2]), Number(matches[3])))
  } else if (matches = c.match(/^rgba\(\s*([0-9]|[1-9][0-9]|[12][0-9][0-9])\s*,\s*([0-9]|[1-9][0-9]|[12][0-9][0-9])\s*,\s*([0-9]|[1-9][0-9]|[12][0-9][0-9])\s*,\s*([01](\.[0-9]+)?)\s*\)$/)) {
    return new Color(new RGBA(Number(matches[1]), Number(matches[2]), Number(matches[3]), Number(matches[4])))
  } else if (matches = c.match(/^hsl\(\s*([0-9]|[1-9][0-9]|[123][0-9][0-9])\s*,\s*([01](\.[0-9]+)?)\s*,\s*([01](\.[0-9]+)?)\s*\)$/)) {
    return new Color(new HSLA(Number(matches[1]), Number(matches[2]), Number(matches[4]), 1))
  } else if (matches = c.match(/^hsl\(\s*([0-9]|[1-9][0-9]|[123][0-9][0-9])\s*,\s*(([0-9]|[1-9][0-9]|100)(\.[0-9]+)?)%\s*,\s*(([0-9]|[1-9][0-9]|100)(\.[0-9]+)?)%\s*\)$/)) {
    return new Color(new HSLA(Number(matches[1]), Number(matches[2]) / 100, Number(matches[5]) / 100, 1))
  } else if (matches = c.match(/^hsla\(\s*([0-9]|[1-9][0-9]|[123][0-9][0-9])\s*,\s*([01](\.[0-9]+)?)\s*,\s*([01](\.[0-9]+)?)\s*,\s*([01](\.[0-9]+)?)\s*\)$/)) {
    return new Color(new HSLA(Number(matches[1]), Number(matches[2]), Number(matches[4]), Number(matches[6])))
  } else if (matches = c.match(/^hsla\(\s*([0-9]|[1-9][0-9]|[123][0-9][0-9])\s*,\s*(([0-9]|[1-9][0-9]|100)(\.[0-9]+)?)%\s*,\s*(([0-9]|[1-9][0-9]|100)(\.[0-9]+)?)%\s*,\s*([01](\.[0-9]+)?)\s*\)$/)) {
    return new Color(new HSLA(Number(matches[1]), Number(matches[2]) / 100, Number(matches[5]) / 100, Number(matches[8])))
  } else {
    ThrowInvalidColor(color)
  }
}

function formatColor (color, type = ColorType.DEFAULT) {
  if (!(color instanceof Color)) {
    try {
      color = toColor(color)
    } catch (err) {
      throw err
    }
  }
  switch (type) {
    case ColorType.DEFAULT: return color.toString()
    case ColorType.RGB: return color.isOpaque() ? Color.Format.CSS.formatRGB(color) : Color.Format.CSS.formatRGBA(color)
    case ColorType.HEX: return color.isOpaque() ? Color.Format.CSS.formatHex(color) : Color.Format.CSS.formatHexA(color)
    case ColorType.HSL: return color.isOpaque() ? Color.Format.CSS.formatHSL(color) : Color.Format.CSS.formatHSLA(color)
    default: return ''
  }
}

module.exports = {
  ColorType,
  toColor,
  formatColor
}
