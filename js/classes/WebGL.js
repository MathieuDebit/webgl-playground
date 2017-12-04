export default class WebGL {
  constructor() {
    this.context = null

    this.init()
  }
  init() {
    const canvas = document.createElement('canvas')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    canvas.style.position = 'fixed'
    canvas.style.top = 0
    canvas.style.left = 0
    canvas.style.zIndex = -1
    document.body.appendChild(canvas)

    this.context = canvas.getContext('webgl')
    if (!this.context) {
      throw new Error('[WebGL] Unable to initialize WebGL. Your browser or machine may not support it.')
      return null
    }
    this.context.clearColor(0.0, 0.0, 0.0, 1.0)
    this.context.clear(this.context.COLOR_BUFFER_BIT)
  }
}
