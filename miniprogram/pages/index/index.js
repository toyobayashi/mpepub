const { ePub } = require('../../util/deps.js')
const { setGlobal, getGlobal, removeGlobal } = require('../../util/global.js')
const { GlobalKey } = require('../../util/constants.js')
const ZipCache = require('../../util/cache.js')
const { localStorage, StorageKey } = require('../../util/storage.js')
const { alert, showLoading, hideLoading } = require('../../util/modal.js')
const { Md5 } = require('../../lib/md5.js')

/**
 * @param {ArrayBuffer} arrrayBuffer
 * @returns {string} 
 */
function arrayBufferToHex (arrrayBuffer) {
  const u8array = new Uint8Array(arrrayBuffer)
  let str = ''
  for (let i = 0; i < u8array.length; i++) {
    str += ('00' + u8array[i].toString(16)).slice(-2)
  }
  return str
}

Page({
  data: {
    cBackgroundColor: ''
  },
  onLoad () {
  },
  onShow () {
    this.setData({
      cBackgroundColor: (localStorage.getItem(StorageKey.CONFIG) || {})['backgroundColor'] || '#c7edcc'
    })
    const book = getGlobal(GlobalKey.BOOK)
    if (book) {
      book.destroy()
      setGlobal(GlobalKey.BOOK, null)
    }
    const zip = getGlobal(GlobalKey.ZIP)
    if (zip) {
      zip.clear()
      setGlobal(GlobalKey.ZIP, null)
    }
    setGlobal(GlobalKey.BOOK_INFO, null)
  },
  goConfig () {
    wx.navigateTo({
      url: '/pages/config/config',
    })
  },
  selectEpub (e) {
    wx.chooseMessageFile({
      count: 1,
      type: 'file',
      success: (res) => {
        const tempFilePaths = res.tempFiles
        const fs = wx.getFileSystemManager()
        const data = fs.readFileSync(tempFilePaths[0].path)

        const book = setGlobal(GlobalKey.BOOK, ePub({
          replacements: 'base64'
        }))

        book.__hash = arrayBufferToHex(new Md5().update(data).digest())

        showLoading()
        book.open(data).catch(() => {
          hideLoading()
          removeGlobal(GlobalKey.BOOK)
          removeGlobal(GlobalKey.BOOK_INFO)
          alert('不是有效的 EPUB 文件')
        })

        const info = setGlobal(GlobalKey.BOOK_INFO, {})

        book.loaded.manifest.then(manifest => {
          info.manifest = manifest
        })

        book.loaded.metadata.then(meta => {
          info.meta = meta
        })

        book.loaded.spine.then(spine => {
          info.spine = spine
        })

        book.loaded.cover.then(cover => {
          info.cover = cover
        })
        
        book.loaded.resources.then(resources => {
          info.resources = resources
        })

        book.loaded.pageList.then(pageList => {
          info.pageList = pageList
        })

        book.loaded.navigation.then(navigation => {
          info.navigation = navigation
        })

        book.ready.then(() => {
          setGlobal(GlobalKey.ZIP, new ZipCache(book.archive.zip))
          hideLoading()
          wx.navigateTo({
            url: '/pages/read/read',
          })
        })

        // book.ready.then(res => {
        //   console.log(res)
        //   console.log(book)
        //   var cover = book.archive.zip.file(res[3].substr(1))
        //   cover.async('base64').then(content => {
        //     this.setData({
        //       coverImage: 'data:image/jpg;base64,' + content
        //     })
        //   })
        // })

        // book.loaded.spine.then((spine) => {
        //   console.log(spine.get(0))
        //   spine.each((item) => {
        //     console.log(item.url)
        //     // var entry = book.archive.zip.file(item.url.substr(1))
        //     // entry.async('string').then(content => {
        //     //   console.log(content)
        //     // })
        //     // item.load().then((contents) => {
        //     //   console.log(contents);
        //     // });
        //   });
        // });
      }
    })
  }
})
