const { localStorage, StorageKey } = require('../../util/storage.js')

const fontmap = {
  0: '特小',
  1: '小',
  2: '标准',
  3: '大',
  4: '特大'
}

const fontStrMap = {
  0: '24rpx',
  1: '28rpx',
  2: '32rpx',
  3: '36rpx',
  4: '40rpx',
  '24rpx': 0,
  '28rpx': 1,
  '32rpx': 2,
  '36rpx': 3,
  '40rpx': 4
}

Page({
  data: {
    cBackgroundColor: (localStorage.getItem(StorageKey.CONFIG) || {})['backgroundColor'] || '#c7edcc',
    _config: {},
    fontsizevalue: 2,
    fontsizeStr: fontmap[2],
    fontcolor: '#333',
    bgcolor: '#c7edcc',
  },
  onLoad () {
    const config = localStorage.getItem(StorageKey.CONFIG) || {}
    this.setData({
      _config: config,
      ...(config.color ? { fontcolor: config.color } : {}),
      ...(config.backgroundColor ? { bgcolor: config.backgroundColor } : {}),
      ...(config.fontSize ? {
        fontsizevalue: fontStrMap[config.fontSize],
        fontsizeStr: fontmap[fontStrMap[config.fontSize]]
      } : {}),
    })
  },
  onShow () {
    this.setData({
      cBackgroundColor: (localStorage.getItem(StorageKey.CONFIG) || {})['backgroundColor'] || '#c7edcc'
    })
  },
  fontSizeChanging (e) {
    const v = e.detail.value
    this.setData({
      fontsizeStr: fontmap[v]
    })
  },
  fontSizeChange (e) {
    const v = e.detail.value
    this.setData({
      fontsizeStr: fontmap[v]
    })
    this.saveConfig({ fontSize: fontStrMap[v] })
  },
  onFontColorChange (e) {
    this.setData({
      fontcolor: e.detail
    })
    this.saveConfig({ color: e.detail })
  },
  onBgColorChange (e) {
    this.saveConfig({ backgroundColor: e.detail })
    this.setData({
      bgcolor: e.detail,
      cBackgroundColor: (localStorage.getItem(StorageKey.CONFIG) || {})['backgroundColor']
    })
  },
  saveConfig (config) {
    this.data._config = {
      ...(this.data._config),
      ...config
    }
    localStorage.setItem(StorageKey.CONFIG, this.data._config)
  }
})
