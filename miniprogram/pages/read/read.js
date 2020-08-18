const { setGlobal, getGlobal } = require('../../util/global.js')
const { GlobalKey } = require('../../util/constants.js')
const ZipCache = require('../../util/cache.js')
const { xmldom, path } = require('../../util/deps.js')
const { elementToJson } = require('../../util/dom.js')

Page({
  data: {
    toc: [],
    spineIndex: -1,
    tree: null
  },
  onLoad () {
    console.log('read onLoad')
    const book = getGlobal(GlobalKey.BOOK)
    const info = getGlobal(GlobalKey.BOOK_INFO)
    // const cache = getGlobal(GlobalKey.ZIP)
    console.log(book)
    console.log(info)
    this.setData({
      toc: info.navigation.toc
    })
    console.log(book.key())
    // book.locations.generate(10000).then((locations) => {
    //   console.log(locations)
    //   console.log(book.locations.save())
    // });
  },
  onShow () {
  },
  onTocTap (e) {
    const book = getGlobal(GlobalKey.BOOK)
    const cache = getGlobal(GlobalKey.ZIP)
    const info = getGlobal(GlobalKey.BOOK_INFO)
    const toc = this.data.toc[e.target.dataset.index]
    const filepath = path.posix.join(book.container.directory, toc.href)
    const spineIndex = info.spine.items.find(s => s.idref === path.posix.basename(toc.href))
    cache.readFile(filepath, ZipCache.Type.TEXT).then(xml => {
      const parser = new xmldom.DOMParser()
      const doc = parser.parseFromString(xml)
      elementToJson(doc.getElementsByTagName('html')[0].getElementsByTagName('body')[0], filepath, cache).then(tree => {
        console.log(xml)
        console.log(tree)
        this.setData({
          spineIndex,
          tree
        })
      })
    })
  }
})