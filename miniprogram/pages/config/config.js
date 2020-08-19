const { Color } = require('../../components/color-picker/color.js')

Page({
  data: {
    color: Color.fromHex('#456'),
    colorString: Color.fromHex('#456').toString()
  },
  onLoad () {
  },
  onShow () {
  },
  onChange (e) {
    this.setData({
      color: e.detail,
      colorString: e.detail.toString()
    })
  },
  onFlush (e) {
    console.log(e.detail)
  },
  onPresentation (e) {
    console.log(e.detail)
  }
})
