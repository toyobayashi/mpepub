class ZipCache {
  constructor (zip) {
    this.cache = new Map()
    this.zip = zip
  }

  /**
   * 读 ZIP 中的文件，优先读缓存
   * @param {string} path - 路径
   * @param {ZipCache.Type} type - 读取出来的数据类型
   * @returns {Promise<any>} 返回包含文件内容的 Promise
   */
  readFile (path, type = ZipCache.Type.U8_ARRAY) {
    path = path.charAt(0) === '/' ? path.substring(1) : path
    const entry = this.zip.file(path)
    if (!entry) {
      return Promise.reject(new Error('ENOENT: no such file or directory'))
    }

    if (this.cache.has(path)) {
      const file = this.cache.get(path)
      if (file[type]) {
        return Promise.resolve(file[type])
      } else {
        return entry.async(type).then(data => {
          file[type] = data
          return data
        })
      }
    }

    const file = {}
    this.cache.set(path, file)
    return entry.async(type).then(data => {
      file[type] = data
      return data
    })
  }

  /**
   * 判断文件存在性
   * @param {string} path - 路径
   * @returns {boolean}
   */
  existsSync (path) {
    return !!this.zip.file(path)
  }

  clear () {
    this.cache.clear()
  }
}

/**
 * @enum {string}
 */
ZipCache.Type = {
  TEXT: 'text',
  STRING: 'string',
  ARRAY: 'array',
  U8_ARRAY: 'uint8array',
  ARRAY_BUFFER: 'arraybuffer',
  BASE64: 'base64'
}

module.exports = ZipCache
