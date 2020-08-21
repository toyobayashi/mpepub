const { ePub } = require('../../util/deps.js')
const { setGlobal, getGlobal } = require('../../util/global.js')
const { GlobalKey } = require('../../util/constants.js')
const ZipCache = require('../../util/cache.js')
const { localStorage, StorageKey } = require('../../util/storage.js')

Page({
  data: {
    cBackgroundColor: (localStorage.getItem(StorageKey.CONFIG) || {})['backgroundColor'] || ''
  },
  onLoad () {
    console.log('index onLoad')
  },
  onShow () {
    this.setData({
      cBackgroundColor: (localStorage.getItem(StorageKey.CONFIG) || {})['backgroundColor'] || ''
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
        book.open(data)

        const info = setGlobal(GlobalKey.BOOK_INFO, {})

        book.loaded.manifest.then(manifest => {
          console.log('manifest')
          info.manifest = manifest
        })

        book.loaded.metadata.then(meta => {
          console.log('meta')
          info.meta = meta
        })

        book.loaded.spine.then(spine => {
          console.log('spine')
          info.spine = spine
        })

        book.loaded.cover.then(cover => {
          console.log('cover')
          info.cover = cover
        })
        
        book.loaded.resources.then(resources => {
          console.log('resources')
          info.resources = resources
        })

        book.loaded.pageList.then(pageList => {
          console.log('pageList')
          info.pageList = pageList
        })

        book.loaded.navigation.then(navigation => {
          console.log('navigation')
          info.navigation = navigation
        })

        book.ready.then(() => {
          setGlobal(GlobalKey.ZIP, new ZipCache(book.archive.zip))
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
