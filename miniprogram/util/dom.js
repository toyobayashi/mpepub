const { path, mime } = require('./deps.js')
const oid = require('./oid.js')
const ZipCache = require('./cache.js')

/**
 * 把 DOM 解析成 JSON
 * @typedef {{ type: 'node'; name: string; attrs: { [key: string]: string }; children: MpNode[]; } | { type: 'text'; text: string; }} MpNode
 * @param {any} el - 元素
 * @param {string} filename - 文件名
 * @param {ZipCache} cache - 缓存
 * @returns {Promise<MpNode>}
 */
async function elementToJson (el, filename, cache) {
  if (!Object.prototype.hasOwnProperty.call(el, 'childNodes')) {
    const text = el.nodeValue.trim()
    return {
      type: 'text',
      text: text,
      key: oid.generate()
    }
  }
  const attrs = {}
  const children = []
  const name = el.tagName.toLowerCase()
  for (let i = 0; i < el.attributes.length; i++) {
    const attrNode = el.attributes[i];
    attrs[attrNode.localName] = attrNode.nodeValue
  }
  for (let x = 0; x < el.childNodes.length; x++) {
    const item = el.childNodes[x];
    if (Object.prototype.hasOwnProperty.call(item, 'childNodes')) {
      children.push(await elementToJson(item, filename, cache))
    } else {
      const text = item.nodeValue.trim()
      if (text) {
        children.push({
          type: 'text',
          text: text,
          key: oid.generate()
        })
      }
    }
  }

  if (name === 'img' && typeof attrs.src === 'string' && !path.isAbsolute(attrs.src)) {
    const targetFile = path.posix.join(path.posix.dirname(filename), attrs.src)
    const mimeType = mime.getType(path.posix.extname(targetFile))
    const b64 = await cache.readFile(targetFile, ZipCache.Type.BASE64)
    attrs.src = `data:${mimeType};base64,${b64}`
  }

  return {
    type: 'node',
    name,
    attrs,
    children,
    key: oid.generate()
  }
}

module.exports = {
  elementToJson
}
