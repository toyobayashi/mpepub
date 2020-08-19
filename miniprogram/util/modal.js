const { promisify } = require('./promisify.js')

const _showLoading = promisify(wx.showLoading, wx)
const _showToast = promisify(wx.showToast, wx)
const _showModal = promisify(wx.showModal, wx)
const _showActionSheet = promisify(wx.showActionSheet, wx)

const hideLoading = wx.hideLoading
const hideToast = wx.hideToast

function showLoading(title) {
  return _showLoading({
    title: title || '努力加载中',
    mask: true
  })
}

function showToast(message, durationOrIcon, ic) {
  const duration = typeof durationOrIcon === 'number' ? durationOrIcon : 1500
  const icon = typeof durationOrIcon === 'string' ? durationOrIcon : (ic || 'none')
  return _showToast({
    mask: false,
    title: message,
    duration,
    icon,
    position: 'bottom'
  })
}

function alert(message) {
  return showModal(message, '提示', false)
}

function showModal(content, title, showCancel) {
  return _showModal({
    title: title || '提示',
    content: content || '',
    showCancel: showCancel || false,
    confirmColor: '#4293f4'
  })
}

function showActionSheet(itemList) {
  return _showActionSheet({
    itemList: itemList || [],
    itemColor: '#4293f4'
  })
}

module.exports = {
  _showLoading,
  _showToast,
  _showModal,
  _showActionSheet,
  hideLoading,
  hideToast,
  showLoading,
  showToast,
  alert,
  showModal,
  showActionSheet
}
