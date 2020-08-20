const { createEnum } = require('./constants.js')

class Storage {
  /**
   * @returns {number}
   */
  get length () {
    return wx.getStorageInfoSync().keys.length
  }

  /**
   * @param {number} index
   * @returns {string | null}
   */
  key (index) {
    const i = Number(index)
    if (isNaN(i)) {
      return null
    }
    const r = wx.getStorageInfoSync().keys[index]
    return r === undefined ? null : r
  }

  /**
   * @param {string} key
   * @returns {boolean}
   */
  hasItem (key) {
    return wx.getStorageInfoSync().keys.indexOf(key) !== -1
  }

  /**
   * @param {string} key
   * @returns {any}
   */
  getItem (key) {
    return this.hasItem(key) ? wx.getStorageSync(key) : null
  }

  /**
   * @param {string} key
   * @param {any} value
   * @returns {void}
   */
  setItem (key, value) {
    return wx.setStorageSync(key, value)
  }

  /**
   * @param {string} key
   * @returns {void}
   */
  removeItem (key) {
    return wx.removeStorageSync(key)
  }

  /**
   * @returns {void}
   */
  clear () {
    return wx.clearStorageSync()
  }
}

module.exports = {
  localStorage: new Storage(),
  StorageKey: createEnum({
    CONFIG: 'mpepub_config',
    STATE: 'mpepub_state',
  })
}
