module.exports = {
  isDevTool: wx.getSystemInfoSync().platform === 'devtools',
  // type: 'dev',
  type: 'prod',
}
