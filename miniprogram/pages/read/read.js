const { getGlobal } = require('../../util/global.js')
const { GlobalKey } = require('../../util/constants.js')
const ZipCache = require('../../util/cache.js')
const { path } = require('../../util/deps.js')
const { elementToJson, parser } = require('../../util/dom.js')
const { showToast, showModal, showLoading, hideLoading } = require('../../util/modal.js')
const { localStorage, StorageKey } = require('../../util/storage.js')

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

const config = (localStorage.getItem(StorageKey.CONFIG) || {})

Page({
  data: {
    cBackgroundColor: config['backgroundColor'] || '#c7edcc',
    cFontSize: config['fontSize'] || '32rpx',
    cColor: config['color'] || '#333',
    toc: [],
    spineIndex: -1,
    tree: null,
    mainHeight: 0,
    percent: '100.00%',
    totalSpineLength: 0,
    scrollTop: 0,
    backIndex: -1,
    _innerScrollTop: 0,
    _domCache: {},
  },
  onLoad () {
    const book = getGlobal(GlobalKey.BOOK)
    const info = getGlobal(GlobalKey.BOOK_INFO)
    // const cache = getGlobal(GlobalKey.ZIP)
    // console.log(book)
    // console.log(info)
    wx.setNavigationBarTitle({
      title: info.meta.title,
    })
    const q = wx.createSelectorQuery()
    q.select('.main').boundingClientRect().exec((res) => {
      this.setData({
        ...(info ? {
          toc: info.navigation.toc,
          totalSpineLength: info.spine.items.length
        } : {}),
        mainHeight: res[0].height
      })

      if (book) {
        const bookKey = book.key() + ':' + book.__hash
        delete book.__hash
        const state = localStorage.getItem(StorageKey.STATE) || {}
        if (!state[bookKey]) {
          const newState = {
            ...state,
            [bookKey]: {
              spineIndex: -1,
              scrollTop: 0
            } 
          }
          localStorage.setItem(StorageKey.STATE, newState)
        } else if (state[bookKey].spineIndex !== -1) {
          showModal('是否回到上次阅读的地方？', '提示', true).then((res) => {
            if (res.cancel) return
            if (state[bookKey].spineIndex === -1) {
              this.setData({
                spineIndex: -1,
                tree: null,
                scrollTop: state[bookKey].scrollTop
              })
            } else {
              this._renderSpine(state[bookKey].spineIndex, state[bookKey].scrollTop)
            }
          })
        }
      }
    })

    // book.locations.generate(10000).then((locations) => {
    //   console.log(locations)
    //   console.log(book.locations.save())
    // });
  },
  onShow () {
    const config = (localStorage.getItem(StorageKey.CONFIG) || {})
    this.setData({
      cBackgroundColor: config['backgroundColor'] || '#c7edcc',
      cFontSize: config['fontSize'] || '32rpx',
      cColor: config['color'] || '#333',
    })
  },
  _goConfig () {
    wx.navigateTo({
      url: '/pages/config/config',
    })
  },
  _showIndex () {
    showLoading()
    this.setData({
      spineIndex: -1,
      backIndex: this.data.spineIndex/* ,
      tree: null,
      scrollTop: 0 */
    }, hideLoading)
  },
  _back () {
    showLoading()
    this.setData({
      spineIndex: this.data.backIndex,
      backIndex: -1,
      scrollTop: this.data._innerScrollTop
    }, hideLoading)
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
      showToast('已经到最后啦')
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
  _saveReadingPosition (spineIndex, scrollTop) {
    const book = getGlobal(GlobalKey.BOOK)
    const bookKey = book.key()
    const state = localStorage.getItem(StorageKey.STATE) || {}
    state[bookKey] = state[bookKey] || {}
    if (spineIndex !== null) {
      state[bookKey]['spineIndex'] = spineIndex
    }
    state[bookKey]['scrollTop'] = scrollTop
    localStorage.setItem(StorageKey.STATE, state)
  },
  _renderSpine (spineIndex, scrollTop = 0) {
    return new Promise((resolve) => {
      showLoading()
      if (this.data._domCache[spineIndex]) {
        this.setData({
          backIndex: -1,
          spineIndex,
          tree: this.data._domCache[spineIndex],
          scrollTop
        }, () => {
          hideLoading()
          resolve()
        })
        this._saveReadingPosition(spineIndex, scrollTop)
        return
      }

      parseTree(spineIndex).then(tree => {
        this.data._domCache[spineIndex] = tree
        this.setData({
          backIndex: -1,
          spineIndex,
          tree,
          scrollTop
        }, () => {
          hideLoading()
          resolve()
        })
        this._saveReadingPosition(spineIndex, scrollTop)
      })
    })
  },
  _updateScroll (scrollTop) {
    this.setData(scrollWaitUpdate)
    scrollWaitUpdate = null
    this._saveReadingPosition(null, scrollTop)
  },
  _onScroll (e) {
    const scrollable = e.detail.scrollHeight - this.data.mainHeight
    if (scrollable === 0) {
      this.data._innerScrollTop = 0
      scrollWaitUpdate = {
        percent: '100.00%'
      }
    } else {
      const percent = (Math.floor(e.detail.scrollTop / scrollable * 10000) / 100).toFixed(2) + '%'
      this.data._innerScrollTop = e.detail.scrollTop
      scrollWaitUpdate = {
        percent
      }
    }

    clearTimeout(scrollTimer)
    scrollTimer = setTimeout(() => {
      this._updateScroll(e.detail.scrollTop)
    }, 200)
  }
})
