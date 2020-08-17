const { setGlobal, getGlobal } = require('../../util/global.js')
const { GlobalKey } = require('../../util/constants.js')
const ZipCache = require('../../util/cache.js')
const { xmldom } = require('../../util/deps.js')
const { elementToJson } = require('../../util/dom.js')

Page({
  data: {
    tree: null
  },
  onLoad () {
    console.log('read onLoad')
    const info = getGlobal(GlobalKey.BOOK_INFO)
    const cache = getGlobal(GlobalKey.ZIP)
    console.log(info)

    const xmlFile = 'OEBPS/' + info.manifest[info.spine.items[0].idref].href
    cache.readFile(xmlFile, ZipCache.Type.TEXT).then(xml => {
      const parser = new xmldom.DOMParser()
      const doc = parser.parseFromString(xml)
      elementToJson(doc.getElementsByTagName('html')[0].getElementsByTagName('body')[0], xmlFile, cache).then(tree => {
        console.log(xml)
        console.log(tree)
        this.setData({
          tree
        })
      })
    })
  },
  onShow () {
  }
})
