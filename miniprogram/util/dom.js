const { path, mime, xmldom, base64, text } = require('./deps.js')
const oid = require('./oid.js')
const ZipCache = require('./cache.js')

const parser = new xmldom.DOMParser()
const serializer = new xmldom.XMLSerializer()

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

  if (name === 'svg') {
    const images = el.getElementsByTagName('image')
    let wh = null
    for (let i = 0; i < images.length; i++) {
      const img = images[i]
      const targetFile = path.posix.join(path.posix.dirname(filename), img.getAttribute('xlink:href'))
      const mimeType = mime.getType(path.posix.extname(targetFile))
      const b64 = await cache.readFile(targetFile, ZipCache.Type.BASE64)
      img.setAttribute('xlink:href', `data:${mimeType};base64,${b64}`)
      
      if (img.hasAttribute('width')) {
        wh = wh || {}
        wh.minWidth = (wh.minWidth || 0) + Number(img.getAttribute('width')) || 0
      }
      if (img.hasAttribute('height')) {
        wh = wh || {}
        wh.minHeight = (wh.minHeight || 0) + Number(img.getAttribute('height')) || 0
      }
    }

    let style = ''
    if (wh && wh.minWidth) {
      style += `min-width: ${wh.minWidth}px;`
    }
    if (wh && wh.minHeight) {
      style += `min-height: ${wh.minHeight}px;`
    }

    const svgstr = serializer.serializeToString(el)
    const svgb64 = base64.fromByteArray(new text.TextEncoder().encode(svgstr))
    const dataurl = `data:${mime.getType('.svg')};base64,${svgb64}`
    return {
      type: 'node',
      name: 'svg',
      _data: wh,
      attrs: {
        src: dataurl
      },
      children: [],
      key: oid.generate()
    }
  }

  for (let i = 0; i < el.attributes.length; i++) {
    const attrNode = el.attributes[i];
    attrs[attrNode.nodeName] = attrNode.nodeValue
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
  elementToJson,
  parser,
  serializer
}
