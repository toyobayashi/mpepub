const { formatColor, ColorType } = require('../color-picker/color-ex.js')

Component({
  options: {
    pureDataPattern: /^_/
  },
  properties: {
    pickedColor: {
      type: Object,
      optionalTypes: [String],
      value: '#0000',
      observer (v) {
        this.setData({
          innerColor: formatColor(v, this.data._type),
          colorString: formatColor(v, this.data._type)
        })
      }
    },
    title: {
      type: String
    }
  },
  data: {
    _type: ColorType.RGB,
    colorString: '',
    _fontcolorTemp: null,
    modalShow: false
  },
  methods: {
    onChange (e) {
      this.setData({
        colorString: formatColor(e.detail, this.data._type)
      })
    },
    onFlush (e) {
      this.data._fontcolorTemp = formatColor(e.detail, ColorType.RGB)
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
    },
    showModal () {
      this.data._fontcolorTemp = this.innerColor
      this.setData({
        modalShow: true
      })
    },
    onConfirm () {
      const innerColor = this.data._fontcolorTemp
      this.setData({
        innerColor,
        modalShow: false
      })
      this.data._fontcolorTemp = null
      this.triggerEvent('change', innerColor)
    },
    onCancel () {
      this.setData({
        modalShow: false
      })
    }
  },
  lifetimes: {
    attached () {
      this.setData({
        innerColor: formatColor(this.properties.pickedColor, this.data._type),
        colorString: formatColor(this.properties.pickedColor, this.data._type)
      })
    }
  }
})
