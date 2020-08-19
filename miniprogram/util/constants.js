/**
 * @template {{ readonly [key: string]: string | number }} T
 * @template {T} U
 * @param {T} obj - enum
 * @returns {U} TypeScript Enum
 */
function createEnum(obj) {
  const res = {}

  const keys = Object.keys(obj)
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    if (typeof obj[key] === 'string') {
      res[key] = obj[key]
    } else if (typeof obj[key] === 'number') {
      res[res[key] = obj[key]] = key
    }
  }

  return res
}

/**
 * @enum {string}
 */
const GlobalKey = createEnum({
  BOOK: 'book',
  BOOK_INFO: 'bookInfo',
  ZIP: 'zip'
})

module.exports = {
  createEnum,
  GlobalKey
}
