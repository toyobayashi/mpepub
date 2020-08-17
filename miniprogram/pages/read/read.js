const { setGlobal, getGlobal } = require('../../util/global.js')
const { GlobalKey } = require('../../util/constants.js')
const ZipCache = require('../../util/cache.js')
const { xmldom } = require('../../util/deps.js')

Page({
  data: {
    coverSrc: ''
  },
  onLoad () {
    console.log('read onLoad')
    const info = getGlobal(GlobalKey.BOOK_INFO)
    const cache = getGlobal(GlobalKey.ZIP)
    console.log(info)

    // cache.readFile(info.cover, ZipCache.Type.BASE64).then(b64 => {
    //   this.setData({
    //     coverSrc: 'data:image/jpg;base64,' + b64
    //   })
    // })

    const xmlFile = 'OEBPS/' + info.manifest[info.spine.items[0].idref].href
    cache.readFile(xmlFile, ZipCache.Type.TEXT).then(xml => {
      const parser = new xmldom.DOMParser()
      const doc = parser.parseFromString(xml)
      console.log(xml)
      console.log(doc)
    })
  },
  onShow () {
  }
})
