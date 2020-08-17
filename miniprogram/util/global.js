const app = getApp()

function getGlobal (key) {
  return app.globalData[key]
}

function setGlobal (key, value) {
  app.globalData[key] = value
  return value
}

function removeGlobal (key) {
  delete app.globalData[key]
}

module.exports = {
  getGlobal,
  setGlobal,
  removeGlobal
}
