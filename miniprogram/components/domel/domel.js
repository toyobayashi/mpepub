Component({
  properties: {
    node: {
      type: Object,
      optionalTypes: [String]
    }
  },
  data: {
    svgStyle: ''
  },
  methods: {
    _previewImg () {
      wx.previewImage({
        current: this.properties.node.attrs.src,
        urls: [this.properties.node.attrs.src],
      })
    },
    _jumpA () {
      console.log(this.properties.node)
    },
    _svgImgLoad (e) {
      if (this.properties.node._data) {
        const query = wx.createSelectorQuery().in(this)
        query.select('#domel__svg').boundingClientRect(rect => {
          const minWidth = this.properties.node._data.minWidth
          const minHeight = this.properties.node._data.minHeight
          const scale = minHeight / minWidth
          const height = rect.width * scale
          this.setData({
            svgStyle: `min-height: ${height}px`
          })
        }).exec()
      }
    },
  },
  lifetimes: {
    detached () {
      if (this.data.svgStyle) {
        this.setData({
          svgStyle: ''
        })
      }
    }
  }
})
