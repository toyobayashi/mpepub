const { Color, HSVA, RGBA } = require('./color.js')

const isLighter = Color.prototype.isLighter

const dpr = wx.getSystemInfoSync().pixelRatio

function revertColorInstance (fakeColor) {
  if (fakeColor instanceof Color) return fakeColor
  const { r: rr, g: gg, b: bb, a: aa } = fakeColor.rgba
  return new Color(new RGBA(rr, gg, bb, aa))
}

Component({
  properties: {
    color: {
      type: Object,
      value: Color.fromHex('#0000')
    },
    presentation: {
      type: String,
      value: 'aa'
    }
  },
  data: {
    innerColor: Color.fromHex('#0000'),
    backgroundColor: Color.white,
    originalColor: Color.fromHex('#0000'),

    saturationBoxDown: false,
    opacityStripDown: false,
    hueStripDown: false,

    opacityStripSliderTop: '',
    hueStripSliderTop: '',

    selectionStyle: {
      top: '',
      left: ''
    },

    canvasWidth: '',
    canvasHeight: '',

    // computed

    pickedColorClass: '',
    pickedColorStyle: '',
    originalColorStyle: '',
    opacityOverlayStyle: '',

    _canvasRect: null,
    _opacityStrip: null,
    _opacitySlider: null,
    _hueStrip: null,
    _hueSlider: null,
  },
  observers: {
    innerColor (__innerColor) {
      __innerColor = revertColorInstance(__innerColor)
      const pickedColorClass = (__innerColor.rgba.a < 0.5 ? isLighter.call(this.data.backgroundColor) : isLighter.call(this.data.innerColor)) ? 'light' : ''

      const pickedColor = Color.Format.CSS.format(__innerColor) || ''
      const pickedColorStyle = pickedColor ? `background-color:${pickedColor}` : ''

      const { r, g, b } = __innerColor.rgba;
      const opaque = new Color(new RGBA(r, g, b, 1));
      const transparent = new Color(new RGBA(r, g, b, 0));
      const opacityOverlayStyle = `background: linear-gradient(to bottom, ${opaque} 0%, ${transparent} 100%)`
      
      this.setData({
        pickedColorClass,
        pickedColorStyle,
        opacityOverlayStyle
      })
      this.triggerEvent('change', __innerColor)
      if (this.data._canvasRect) {
        this._paint(this.data._canvasRect, __innerColor)
      }
    },
    originalColor (__originalColor) {
      __originalColor = revertColorInstance(__originalColor)
      const oc = Color.Format.CSS.format(__originalColor) || ''
      const originalColorStyle = oc ? `background-color:${oc}` : ''
      this.setData({
        originalColorStyle
      })
    }
  },
  methods: {
    _onPresentation () {
      this.triggerEvent('presentation', this.properties.presentation)
    },
    _revertColor () {
      const c = revertColorInstance(this.data.originalColor)
      this.setData({
        innerColor: c
      })
      // this.triggerEvent('change', this.innerColor)
      this._hueSliderPosition(c)
      this._opacitySliderPosition(c)
      this.triggerEvent('flush', c)
    },
    _paint (canvas, color) {
      const hsva = color.hsva;
      const saturatedColor = new Color(new HSVA(hsva.h, 1, 1, 1));
      const ctx = canvas.getContext('2d');

      const whiteGradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
      whiteGradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
      whiteGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.5)');
      whiteGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

      const blackGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      blackGradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
      blackGradient.addColorStop(1, 'rgba(0, 0, 0, 1)');

      ctx.rect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = Color.Format.CSS.format(saturatedColor);
      ctx.fill();
      ctx.fillStyle = whiteGradient;
      ctx.fill();
      ctx.fillStyle = blackGradient;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(this.data.selectionStyle.left,this.data.selectionStyle.top,10,0,360,false);
      ctx.lineWidth = 2;
      ctx.strokeStyle = isLighter.call(color) ? 'black' : 'white';
      ctx.stroke();
      ctx.closePath();
    },
    _selectionStyle (s, v, width, height) {
      this.setData({
        selectionStyle: {
          left: s * width * dpr,
          top: (height - v * height) * dpr
        }
      }/* , () => {
        this._paint(this.data._canvasRect, this.data.innerColor)
      } */)
    },
    _saturationChange (left, top) {
      const width = this.data._saturationBoxRect.width
      const height = this.data._saturationBoxRect.height
      const s = Math.max(0, Math.min(1, left / width))
      const v = Math.max(0, Math.min(1, 1 - (top / height)))

      this._selectionStyle(s, v, width, height)

      const hsva = revertColorInstance(this.data.innerColor).hsva;
      this.setData({
        innerColor: new Color(new HSVA(hsva.h, s, v, hsva.a))
      })
    },
    _saturationBoxMouseDown (e) {
      const left = this.data._canvasRect._left
      const top = this.data._canvasRect._top
      const x = e.changedTouches[0].pageX - left
      const y = e.changedTouches[0].pageY - top
      this._saturationChange(x, y)
    },
    _saturationBoxMouseMove (e) {
      const left = this.data._canvasRect._left
      const top = this.data._canvasRect._top
      const x = e.changedTouches[0].pageX - left
      const y = e.changedTouches[0].pageY - top
      this._saturationChange(x, y)
    },
    _saturationBoxMouseUp (e) {
      this.triggerEvent('flush', revertColorInstance(this.data.innerColor))
    },
    _stripChange (v, ref) {
      const height = this.data['_' + ref + 'Strip'].height - this.data['_' + ref + 'Slider'].height
      const value = Math.max(0, Math.min(1, 1 - (v / height)))

      const innerColor = revertColorInstance(this.data.innerColor)
      if (ref === 'opacity') {
        const hsva = innerColor.hsva
        this.setData({
          innerColor: new Color(new HSVA(hsva.h, hsva.s, hsva.v, value)),
          [ref + 'StripSliderTop']: `${(1 - value) * height}px`
        })
      } else if (ref === 'hue') {
        const hsva = innerColor.hsva
        const h = (1 - value) * 360
        this.setData({
          innerColor: new Color(new HSVA(h === 360 ? 0 : h, hsva.s, hsva.v, hsva.a)),
          [ref + 'StripSliderTop']: `${(1 - value) * height}px`
        })
      }
    },
    _opacityStripMouseDown (e) {
      const top = this.data._opacityStrip.top
      const y = e.changedTouches[0].pageY - top
      this._stripChange(y, 'opacity')
    },
    _opacityStripMouseMove (e) {
      const top = this.data._opacityStrip.top
      const y = e.changedTouches[0].pageY - top
      this._stripChange(y, 'opacity')
    },
    _opacityStripMouseUp () {
      this.triggerEvent('flush', revertColorInstance(this.data.innerColor))
    },
    _hueStripMouseDown (e) {
      const top = this.data._hueStrip.top
      const y = e.changedTouches[0].pageY - top
      this._stripChange(y, 'hue')
    },
    _hueStripMouseMove (e) {
      const top = this.data._hueStrip.top
      const y = e.changedTouches[0].pageY - top
      this._stripChange(y, 'hue')
    },
    _hueStripMouseUp () {
      this.triggerEvent('flush', revertColorInstance(this.data.innerColor))
    },
    _hueSliderPosition (color) {
      const value = 1 - (color.hsva.h / 360)
      this.setData({
        hueStripSliderTop: `${(1 - value) * this.data._hueStrip.height}px`
      })
    },
    _opacitySliderPosition (color) {
      const value = color.hsva.a
      this.setData({
        opacityStripSliderTop: `${(1 - value) * this.data._opacityStrip.height}px`
      })
    }
  },
  lifetimes: {
    attached () {
      const query = this.createSelectorQuery()
      query.select('#canvas')
        .fields({ node: true, size: true })
        .exec((res) => {
          this.data._canvasRect = res[0].node
          const canvas = res[0].node
          
          const q = this.createSelectorQuery()
          q.select('.saturation-wrap').fields({ size: true }).exec(box => {
            this.data._saturationBoxRect = box[0]
            const width = box[0].width
            const height = box[0].height
            canvas.width = width * dpr
            canvas.height = height * dpr
            this.setData({
              canvasWidth: width,
              canvasHeight: height
            })
            const innerColor = revertColorInstance(this.data.innerColor)
            const hsva = innerColor.hsva;
            this._selectionStyle(hsva.s, hsva.v, width, height);
            this._paint(canvas, innerColor)
            this._hueSliderPosition(innerColor)
            this._opacitySliderPosition(innerColor)
          })
        })
      const stripQuery = this.createSelectorQuery()
      stripQuery.selectAll('.strip').boundingClientRect().exec(res => {
        this.data._opacityStrip = res[0][0]
        this.data._hueStrip = res[0][1]
      })
      const sliderQuery = this.createSelectorQuery()
      sliderQuery.selectAll('.slider').boundingClientRect().exec(res => {
        this.data._opacitySlider = res[0][0]
        this.data._hueSlider = res[0][1]
      })
      this.setData({
        innerColor: this.properties.color,
        originalColor: this.properties.color,
      })
    }
  }
})
