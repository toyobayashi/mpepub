const { base64 } = require('./deps')

function readFileByUrl (info, url) {
  const index = info.resouces.urls.indexOf(url)
  if (index === -1) {
    return null
  }
  const dataurl = info.resouces.replacementUrls[index]
  const b64 = dataurl.substring(dataurl.indexOf(';base64,') + 8)
  return base64.toByteArray(b64)
}

module.exports = {
  readFileByUrl
}
