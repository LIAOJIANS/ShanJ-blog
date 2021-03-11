
import { Message, MessageBox } from 'element-ui'

export function messages(msg = '操作成功', type = 'success', time = 1000) {
  Message({
    message: msg,
    type: type,
    duration: time
  })
}

export function confirm(options) {
  const { title, titleTop = '提示', successCb, errorCb, initOptions } = options
  let init = {}
  !initOptions && (
    init = {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      center: false
    }
  )
  MessageBox.confirm(title,
    titleTop,
    { ...init }).then(() => {
    successCb?.()
  }).catch(() => {
    errorCb?.()
  })
}
