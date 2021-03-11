export function _cutPictures(url) { // 裁剪上传图
  const Img = new Image()
  let dataURL = ''
  Img.src = url
  const p = new Promise(function(resolve, reject) { // 确保图片完整，采用异步剪切
    Img.onload = function() {
      const canvas = document.createElement('canvas')
      const ImgWidth = Img.width // 图片宽度
      const ImgHeight = Img.height // 图片高度
      const ratio = ImgWidth / ImgHeight // 宽高比
      let newWidth = ImgWidth // 赋值宽度
      let newHeight = ImgHeight // 赋值高度
      const width = 278 // 最大宽度
      const height = 168 // 最大高度
      // 按等比例缩小
      if (ImgWidth > width) { // 如果它宽度大于定义宽度
        newWidth = width
        newHeight = width / ratio
      } else if (newHeight > height) {
        newHeight = width
      } else {
        newWidth = width
        newHeight = width
      }
      canvas.width = width
      canvas.height = height
      canvas.getContext('2d').drawImage(Img, 0, 0, newWidth, newHeight) // 将图片绘制到canvas中
      dataURL = canvas.toDataURL('image/jpeg', 0.5) // 转换图片为dataURL
      resolve(dataURL)
    }
  })
  return p
}

export function _dataURL2File(dataURL, filename) { // base64转换为file
  var arr = dataURL.split(','); var mime = arr[0].match(/:(.*?);/)[1]
  var bstr = atob(arr[1]); var n = bstr.length; var u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new File([u8arr], filename, { type: mime })
}

export function _getObjectURL(file) { // 获取图片的URL
  var url = null
  if (window.createObjectURL !== undefined) {
    url = window.createObjectURL(file)
  } else if (window.URL !== undefined) { // 兼容火狐
    url = window.URL.createObjectURL(file)
  } else if (window.webkitURL !== undefined) { // 兼容谷歌
    url = window.webkitURL.createObjectURL(file)
  }
  return url
}
