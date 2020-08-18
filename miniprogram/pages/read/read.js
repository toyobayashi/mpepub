const { setGlobal, getGlobal } = require('../../util/global.js')
const { GlobalKey } = require('../../util/constants.js')
const ZipCache = require('../../util/cache.js')
const { xmldom, path } = require('../../util/deps.js')
const { elementToJson } = require('../../util/dom.js')

function parseTree (spineIndex) {
  return new Promise((resolve, reject) => {
    const book = getGlobal(GlobalKey.BOOK)
    const cache = getGlobal(GlobalKey.ZIP)
    const info = getGlobal(GlobalKey.BOOK_INFO)
    const filepath = path.posix.join(book.container.directory, info.manifest[info.spine.items[spineIndex].idref].href)
    cache.readFile(filepath, ZipCache.Type.TEXT).then(xml => {
      const parser = new xmldom.DOMParser()
      const doc = parser.parseFromString(xml)
      elementToJson(doc.getElementsByTagName('html')[0].getElementsByTagName('body')[0], filepath, cache).then(resolve).catch(reject)
    })
  })
}

Page({
  data: {
    toc: [],
    spineIndex: -1,
    tree: null,
    _domCache: {}
  },
  onLoad () {
    console.log('read onLoad')
    const book = getGlobal(GlobalKey.BOOK)
    const info = getGlobal(GlobalKey.BOOK_INFO)
    // const cache = getGlobal(GlobalKey.ZIP)
    console.log(book)
    console.log(info)
    if (info) {
      this.setData({
        toc: info.navigation.toc
      })
    }
    if (book) {
      console.log(book.key())
    }
    // book.locations.generate(10000).then((locations) => {
    //   console.log(locations)
    //   console.log(book.locations.save())
    // });
  },
  onShow () {
  },
  _showIndex () {
    this.setData({
      spineIndex: -1,
      tree: null
    })
  },
  _prev () {
    if (this.data.spineIndex === -1) return
    if (this.data.spineIndex === 0) {
      this._showIndex()
    } else {
      const spineIndex = this.data.spineIndex - 1
      if (this.data._domCache[spineIndex]) {
        this.setData({
          spineIndex,
          tree: this.data._domCache[spineIndex]
        })
      } else {
        parseTree(spineIndex).then(tree => {
          this.data._domCache[spineIndex] = tree
          this.setData({
            spineIndex,
            tree
          })
        })
      }
    }
  },
  _next () {
    const info = getGlobal(GlobalKey.BOOK_INFO)
    const sections = info.spine.items
    if (this.data.spineIndex >= sections.length - 1) return

    const spineIndex = this.data.spineIndex + 1
    if (this.data._domCache[spineIndex]) {
      this.setData({
        spineIndex,
        tree: this.data._domCache[spineIndex]
      })
    } else {
      parseTree(spineIndex).then(tree => {
        this.data._domCache[spineIndex] = tree
        this.setData({
          spineIndex,
          tree
        })
      })
    }
  },
  onTocTap (e) {
    const book = getGlobal(GlobalKey.BOOK)
    const cache = getGlobal(GlobalKey.ZIP)
    const info = getGlobal(GlobalKey.BOOK_INFO)
    const toc = this.data.toc[e.target.dataset.index]
    let spineIndex = -1
    for (let i = 0; i < info.spine.items.length; i++) {
      const s = info.spine.items[i]
      if (s.href === toc.href) {
        spineIndex = i
        break
      }
    }
    if (spineIndex === -1) {
      // TODO
      return
    }
    if (this.data._domCache[spineIndex]) {
      this.setData({
        spineIndex,
        tree: this.data._domCache[spineIndex]
      })
    } else {
      parseTree(spineIndex).then(tree => {
        this.data._domCache[spineIndex] = tree
        this.setData({
          spineIndex,
          tree
        })
      })
    }
  }
})
