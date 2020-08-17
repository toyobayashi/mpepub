const { path, mime } = require('./deps.js')
const oid = require('./oid.js')
const ZipCache = require('./cache.js')

async function elementToJson (el, filename, cache) {
  const attr = {}
  const children = []
  const tag = el.tagName.toLowerCase()
  for (let i = 0; i < el.attributes.length; i++) {
    const attrNode = el.attributes[i];
    attr[attrNode.localName] = attrNode.nodeValue
  }
  for (let x = 0; x < el.childNodes.length; x++) {
    const item = el.childNodes[x];
    if (Object.prototype.hasOwnProperty.call(item, 'childNodes')) {
      children.push(await elementToJson(item, filename, cache))
    } else {
      if (item.nodeValue.trim()) {
        children.push(item.nodeValue)
      }
    }
  }

  if (tag === 'img' && typeof attr.src === 'string' && !path.isAbsolute(attr.src)) {
    const targetFile = path.posix.join(path.posix.dirname(filename), attr.src)
    const mimeType = mime.getType(path.posix.extname(targetFile))
    const b64 = await cache.readFile(targetFile, ZipCache.Type.BASE64)
    attr.src = `data:${mimeType};base64,${b64}`
  }

  return {
    tag,
    attr,
    children,
    key: oid.generate()
  }
}

module.exports = {
  elementToJson
}
