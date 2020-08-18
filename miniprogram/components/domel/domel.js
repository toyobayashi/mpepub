Component({
  properties: {
    node: {
      type: Object,
      optionalTypes: [String]
    }
  },
  methods: {
    _previewImg () {
      wx.previewImage({
        current: this.properties.node.attrs.src,
        urls: [this.properties.node.attrs.src],
      })
    }
  }
})
