const { Color, HSVA, RGBA } = require('./color.js')
const { toColor } = require('./color-ex.js')

const isLighter = Color.prototype.isLighter

const dpr = wx.getSystemInfoSync().pixelRatio

Component({
  options: {
    pureDataPattern: /^_/
  },
  properties: {
    initialColor: {
      type: Object,
      optionalTypes: [String],
      value: '#0000'
    },
    presentation: {
      type: String,
      value: 'aa'
    }
  },

  data: {
    // _innerColor
    _backgroundColor: Color.white,
    // _originalColor

    opacityStripSliderTop: '',
    hueStripSliderTop: '',

    _selectionStyle: {
      top: 0,
      left: 0
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
  methods: {
    setOriginalColor (color) {
      this.data._originalColor = toColor(color)
    },
    _watchData () {
      let originalColor = null
      let innerColor = null

      Object.defineProperties(this.data, {
        _originalColor: {
          configurable: true,
          enumerable: true,
          get: () => originalColor,
          set: (newColor) => {
            newColor = toColor(newColor)
            originalColor = newColor
            const oc = Color.Format.CSS.format(newColor) || ''
            const originalColorStyle = oc ? `background-color:${oc}` : ''
            this.setData({
              originalColorStyle
            })
          }
        },
        _innerColor: {
          configurable: true,
          enumerable: true,
          get: () => innerColor,
          set: (newColor) => {
            newColor = toColor(newColor)
            innerColor = newColor
            const pickedColorClass = (newColor.rgba.a < 0.5 ? isLighter.call(this.data._backgroundColor) : isLighter.call(innerColor)) ? 'light' : ''
    
            const pickedColor = Color.Format.CSS.format(newColor) || ''
            const pickedColorStyle = pickedColor ? `background-color:${pickedColor}` : ''
    
            const { r, g, b } = newColor.rgba;
            const opaque = new Color(new RGBA(r, g, b, 1));
            const transparent = new Color(new RGBA(r, g, b, 0));
            const opacityOverlayStyle = `background: linear-gradient(to bottom, ${opaque} 0%, ${transparent} 100%)`
    
            this.setData({
              pickedColorClass,
              pickedColorStyle,
              opacityOverlayStyle
            })
            this.triggerEvent('change', newColor)
            if (this.data._canvasRect) {
              this._paint(this.data._canvasRect, newColor)
            }
          }
        }
      })
    },
    _onPresentation () {
      this.triggerEvent('presentation', this.properties.presentation)
    },
    _revertColor () {
      const c = this.data._originalColor
      this.data._innerColor = c
      const hsva = c.hsva;
      this._updateSelectionPosition(hsva.s, hsva.v, this.data._saturationBoxRect.width, this.data._saturationBoxRect.height);
      this._paint(this.data._canvasRect, c)
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
      ctx.arc(this.data._selectionStyle.left,this.data._selectionStyle.top,10,0,360,false);
      ctx.lineWidth = 2;
      ctx.strokeStyle = isLighter.call(color) ? 'black' : 'white';
      ctx.stroke();
      ctx.closePath();
    },
    _updateSelectionPosition (s, v, width, height) {
      this.data._selectionStyle.left = s * width * dpr
      this.data._selectionStyle.top = (height - v * height) * dpr
    },
    _saturationChange (left, top) {
      const width = this.data._saturationBoxRect.width
      const height = this.data._saturationBoxRect.height
      const s = Math.max(0, Math.min(1, left / width))
      const v = Math.max(0, Math.min(1, 1 - (top / height)))

      this._updateSelectionPosition(s, v, width, height)

      // this._paint(this.data._canvasRect, this.data._innerColor)
      const hsva = this.data._innerColor.hsva
      this.data._innerColor = new Color(new HSVA(hsva.h, s, v, hsva.a))
    },
    _saturationBoxMouseDown (e) {
      this._saturationChange(
        e.changedTouches[0].pageX - this.data._canvasRect._left,
        e.changedTouches[0].pageY - this.data._canvasRect._top
      )
    },
    _saturationBoxMouseMove (e) {
      this._saturationChange(
        e.changedTouches[0].pageX - this.data._canvasRect._left,
        e.changedTouches[0].pageY - this.data._canvasRect._top
      )
    },
    _saturationBoxMouseUp (e) {
      this.triggerEvent('flush', this.data._innerColor)
    },
    _stripChange (v, ref) {
      const height = this.data['_' + ref + 'Strip'].height - this.data['_' + ref + 'Slider'].height
      const value = Math.max(0, Math.min(1, 1 - (v / height)))

      const innerColor = this.data._innerColor
      if (ref === 'opacity') {
        const hsva = innerColor.hsva
        this.data._innerColor = new Color(new HSVA(hsva.h, hsva.s, hsva.v, value))
        this.setData({
          [ref + 'StripSliderTop']: `${(1 - value) * height}px`
        })
      } else if (ref === 'hue') {
        const hsva = innerColor.hsva
        const h = (1 - value) * 360
        this.data._innerColor = new Color(new HSVA(h === 360 ? 0 : h, hsva.s, hsva.v, hsva.a))
        this.setData({
          [ref + 'StripSliderTop']: `${(1 - value) * height}px`
        })
      }
    },
    _opacityStripMouseDown (e) {
      this._stripChange(e.changedTouches[0].pageY - this.data._opacityStrip.top, 'opacity')
    },
    _opacityStripMouseMove (e) {
      this._stripChange(e.changedTouches[0].pageY - this.data._opacityStrip.top, 'opacity')
    },
    _opacityStripMouseUp () {
      this.triggerEvent('flush', this.data._innerColor)
    },
    _hueStripMouseDown (e) {
      this._stripChange(e.changedTouches[0].pageY - this.data._hueStrip.top, 'hue')
    },
    _hueStripMouseMove (e) {
      this._stripChange(e.changedTouches[0].pageY - this.data._hueStrip.top, 'hue')
    },
    _hueStripMouseUp () {
      this.triggerEvent('flush', this.data._innerColor)
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
            const innerColor = this.data._innerColor
            const hsva = innerColor.hsva;
            this._updateSelectionPosition(hsva.s, hsva.v, width, height);
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

      this._watchData()

      const initialColor = this.properties.initialColor || '#0000'
      this.setOriginalColor(initialColor)
      this.data._innerColor = toColor(initialColor)
    }
  }
})
