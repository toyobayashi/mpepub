const { getGlobal } = require('../../util/global.js')
const { GlobalKey } = require('../../util/constants.js')
const ZipCache = require('../../util/cache.js')
const { path } = require('../../util/deps.js')
const { elementToJson, parser } = require('../../util/dom.js')

function parseTree (spineIndex) {
  return new Promise((resolve, reject) => {
    const book = getGlobal(GlobalKey.BOOK)
    const cache = getGlobal(GlobalKey.ZIP)
    const info = getGlobal(GlobalKey.BOOK_INFO)
    const filepath = path.posix.join(book.container.directory, info.manifest[info.spine.items[spineIndex].idref].href)
    cache.readFile(filepath, ZipCache.Type.TEXT).then(xml => {
      const doc = parser.parseFromString(xml)
      elementToJson(doc.getElementsByTagName('html')[0].getElementsByTagName('body')[0], filepath, cache).then(resolve).catch(reject)
    })
  })
}

let scrollWaitUpdate = null
let scrollTimer = 0

Page({
  data: {
    toc: [],
    spineIndex: -1,
    tree: null,
    mainHeight: 0,
    percent: '0.00%',
    scrollTop: 0,
    _domCache: {}
  },
  onLoad () {
    console.log('read onLoad')
    const book = getGlobal(GlobalKey.BOOK)
    const info = getGlobal(GlobalKey.BOOK_INFO)
    // const cache = getGlobal(GlobalKey.ZIP)
    console.log(book)
    console.log(info)
    const q = wx.createSelectorQuery()
    q.select('.main').boundingClientRect().exec((res) => {
      console.log(res[0].height)

      this.setData({
        ...(info ? { toc: info.navigation.toc } : {}),
        mainHeight: res[0].height
      })

      if (book) {
        console.log(book.key())
      }
    })

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
      tree: null,
      scrollTop: 0
    })
  },
  _prev () {
    if (this.data.spineIndex === -1) return
    if (this.data.spineIndex === 0) {
      this._showIndex()
    } else {
      const spineIndex = this.data.spineIndex - 1
      this._renderSpine(spineIndex)
    }
  },
  _next () {
    const info = getGlobal(GlobalKey.BOOK_INFO)
    const sections = info.spine.items
    if (this.data.spineIndex >= sections.length - 1) {
      wx.showToast({
        title: '已经到最后啦',
        icon: 'none'
      })
      return
    }

    const spineIndex = this.data.spineIndex + 1
    this._renderSpine(spineIndex)
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
    this._renderSpine(spineIndex)
  },
  _renderSpine (spineIndex) {
    if (this.data._domCache[spineIndex]) {
      this.setData({
        spineIndex,
        tree: this.data._domCache[spineIndex],
        scrollTop: 0
      })
      return Promise.resolve()
    }

    return parseTree(spineIndex).then(tree => {
      this.data._domCache[spineIndex] = tree
      this.setData({
        spineIndex,
        tree,
        scrollTop: 0
      })
    })
  },
  _updateScroll () {
    this.setData(scrollWaitUpdate)
    scrollWaitUpdate = null
  },
  _onScroll (e) {
    const scrollable = e.detail.scrollHeight - this.data.mainHeight
    const percent = (Math.floor(e.detail.scrollTop / scrollable * 10000) / 100).toFixed(2) + '%'
    scrollWaitUpdate = {
      percent
    }
    clearTimeout(scrollTimer)
    scrollTimer = setTimeout(this._updateScroll, 200)
  }
})
