const { formatColor, ColorType } = require('../../components/color-picker/color-ex.js')

Page({
  data: {
    colorString: formatColor('#456', ColorType.RGB),
    _type: ColorType.RGB
  },
  onLoad () {
  },
  onShow () {
  },
  onChange (e) {
    this.setData({
      colorString: formatColor(e.detail, this.data._type)
    })
  },
  onFlush (e) {
    console.log(e.detail)
  },
  onPresentation (e) {
    switch (this.data._type) {
      case ColorType.RGB: this.data._type = ColorType.HEX; break
      case ColorType.HEX: this.data._type = ColorType.HSL; break
      case ColorType.HSL: this.data._type = ColorType.RGB; break
      default: break
    }
    this.setData({
      colorString: formatColor(this.data.colorString, this.data._type)
    })
  }
})
