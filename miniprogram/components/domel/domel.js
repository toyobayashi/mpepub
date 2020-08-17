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
        current: this.properties.node.attr.src,
        urls: [this.properties.node.attr.src],
      })
    }
  }
})
