/******************************************************************************
  INTERFACE
******************************************************************************/
module.exports = {
  makeSVGicon,
  setFavicon,
}
/******************************************************************************
  API
******************************************************************************/
function makeSVGicon (svgURL, callback) {
  const img = document.createElement('img')
  // @XXX: better? https://github.com/tsayen/dom-to-image/tree/master/src
  img.onload = event => {
    canvas.width = img.width
    canvas.height = img.height
    var ctx = canvas.getContext('2d')
    ctx.globalCompositeOperation = 'destination-over'
    const dim = [0, 0, canvas.width, canvas.height]
    ctx.drawImage(img, ...dim)
    drawTriangles(ctx, dim)
    const faviconURL = canvas.toDataURL()
    callback(null, faviconURL)
  }
  img.onerror = event => callback(event)
  img.setAttribute('crossOrigin', 'anonymous')
  img.setAttribute('src', svgURL)
}
function setFavicon (faviconURL) {
  const favicon =  (favicon => {
    if (!favicon) {
      favicon = document.createElement('link')
      favicon.setAttribute('rel', 'icon')
      favicon.setAttribute('type', 'image/png')
      document.head.appendChild(favicon)
    }
    return favicon
  })(document.querySelector('link[rel*="icon"]'))
  favicon.setAttribute('href', faviconURL)
}
/******************************************************************************
  HELPERS
******************************************************************************/
const canvas = document.createElement('canvas')
const drawTriangles = (ctx, dim) => {
  const [ top, left, right, bottom ] = dim
  const length = 50
  var triangles = [
    [left, top, left, length, length, top, "#FF0000"],
    [left, bottom, left, bottom - length, length, bottom, "#00FF00"],
    [right, top, right, length, right - length, top, "#0000FF"],
    [right, bottom, right, bottom - length, right - length, bottom, "#FF00FF"],
    [0, 0, 0, length, length, 0, "#FF0000"],
    [0, 0, 0, length, length, 0, "#FF0000"],
  ]
  for (var i = 0, tr; i < 4; i++) {
    tr = triangles[i]
    ctx.lineWidth = 10
    ctx.strokeStyle = '#000000'
    ctx.fillStyle = tr[6]
    ctx.beginPath()
    ctx.moveTo(tr[0], tr[1])
    ctx.lineTo(tr[2], tr[3])
    ctx.stroke()
    ctx.lineTo(tr[4], tr[5])
    ctx.stroke()
    ctx.closePath()
    ctx.stroke()
    ctx.fill()
  }
}
