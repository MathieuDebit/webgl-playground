import NetUtils from './utils/net-utils.js'
import GlUtils from './utils/gl-utils.js'


Promise.all([
  NetUtils.loadText('../glsl/vertex.vert'),
  NetUtils.loadText('../glsl/fragment.frag'),
]).then(main)


function main(resources) {
  const canvas = document.querySelector('canvas')
  const canvasInfo = {
    width: window.innerWidth,
    height: window.innerHeight,
  }

  canvas.style.width = `${canvasInfo.width}px`
  canvas.style.height = `${canvasInfo.height}px`
  canvas.width = canvasInfo.width
  canvas.height = canvasInfo.height

  const gl = canvas.getContext('webgl')

  if (!gl) {
    console.error('Unable to initialize WebGL. Your browser or machine may not support it.')
    return
  }

  const vertexSource = resources[0]
  const fragmentSource = resources[1]

  const shaderProgram = GlUtils.initShaderProgram(gl, vertexSource, fragmentSource)

  const programInfo = {
    program: shaderProgram,
    attribLocations: {
      position: gl.getAttribLocation(shaderProgram, 'aPosition'),
      color: gl.getAttribLocation(shaderProgram, 'aColor')
    },
    uniformLocations: {
    },
  }

  const buffers = initBuffers(gl)

  render(gl, programInfo, buffers, canvasInfo)
}


function initBuffers(gl) {
  const vertices = new Float32Array([
    -1.0, -1.0, 0.0, 1.0, 1.0, // x, y, r, g, b
     0.0,  0.0, 0.5, 0.0, 1.0,
     1.0, -1.0, 1.0, 1.0, 0.0,
  ])

  const verticesBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)
  gl.bindBuffer(gl.ARRAY_BUFFER, null)

  return {
    vertices: verticesBuffer,
  }
}


function render(gl, programInfo, buffers, canvasInfo) {
  gl.clearColor(0.13, 0.13, 0.13, 1)
  gl.clear(gl.COLOR_BUFFER_BIT)
  gl.viewport(0, 0, canvasInfo.width, canvasInfo.height)

  gl.useProgram(programInfo.program)
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.vertices)

  gl.enableVertexAttribArray(programInfo.attribLocations.position)
  gl.vertexAttribPointer(programInfo.attribLocations.position, 2, gl.FLOAT, false, 20, 0)

  gl.enableVertexAttribArray(programInfo.attribLocations.color)
  gl.vertexAttribPointer(programInfo.attribLocations.color, 3, gl.FLOAT, false, 20, 8 )

  gl.drawArrays(gl.TRIANGLES, 0, 3)
}
