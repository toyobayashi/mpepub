const env = require('./util/env.js')

App({
  onLaunch: function () {
    if (!env.isDevTool) {
      wx.setEnableDebug({
        enableDebug: env.type !== 'prod',
      })
    }
  },
  globalData: {
    book: null,
    bookInfo: null,
    zip: null
  }
})
