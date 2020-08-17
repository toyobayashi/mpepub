const ePub = require('../../lib/epub.legacy.js')

var book = ePub({
  replacements: 'base64'
})
console.log(book)

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    coverImage: '',
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    console.log('index onLoad')
  },
  selectEpub: function(e) {
    console.log(1)
    var _this = this
    wx.chooseMessageFile({
      count: 1,
      type: 'file',
      success (res) {
        const tempFilePaths = res.tempFiles
        const fs = wx.getFileSystemManager()
        const data = fs.readFileSync(tempFilePaths[0].path)

        book.open(data)
        book.ready.then(res => {
          console.log(res)
          console.log(book)
          var cover = book.archive.zip.file(res[3].substr(1))
          cover.async('base64').then(content => {
            _this.setData({
              coverImage: 'data:image/jpg;base64,' + content
            })
          })
        })

        book.loaded.spine.then((spine) => {
          console.log(spine.get(0))
          spine.each((item) => {
            console.log(item.url)
            var entry = book.archive.zip.file(item.url.substr(1))
            entry.async('string').then(content => {
              console.log(content)
            })
            // item.load().then((contents) => {
            //   console.log(contents);
            // });
          });
        });
      }
    })
  }
})
