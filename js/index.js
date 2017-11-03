import NetUtils from './utils/net-utils.js'
import GlUtils from './utils/gl-utils.js'


let rotation = 0.0


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
      vertexPosition: gl.getAttribLocation(shaderProgram, 'aPosition'),
      vertexColor: gl.getAttribLocation(shaderProgram, 'aColor')
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
      modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
    },
  }

  const buffers = initBuffers(gl)

  let then = 0
  function render(now) {
    now *= 0.001
    const deltaTime = now - then
    then = now

    drawScene(gl, programInfo, buffers, canvasInfo, deltaTime)

    requestAnimationFrame(render)
  }
  requestAnimationFrame(render)
}


function initBuffers(gl) {
  const vertices = new Float32Array([
   -1.0, -1.0, 1.0, 0.0, 0.0, // x, y, r, g, b
   -1.0,  1.0, 0.0, 1.0, 0.0,
    1.0,  1.0, 0.0, 0.0, 1.0,
    1.0, -1.0, 1.0, 1.0, 1.0,
  ])
  const verticesBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

  const indices = new Uint16Array([
    0, 1, 2,
    0, 2, 3,
  ])
  const indicesBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuffer)
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW)

  return {
    vertices: verticesBuffer,
    indices: indicesBuffer,
  }
}


function drawScene(gl, programInfo, buffers, canvasInfo, deltaTime) {
  gl.viewport(0, 0, canvasInfo.width, canvasInfo.height)
  gl.clearColor(0.13, 0.13, 0.13, 1)
  gl.clearDepth(1.0)
  gl.enable(gl.DEPTH_TEST)
  gl.depthFunc(gl.LEQUAL)
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

  const fieldOfView = 45 * Math.PI / 180
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight
  const zNear = 0.1
  const zFar = 100.0
  const projectionMatrix = mat4.create()

  mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar)

  const modelViewMatrix = mat4.create()

  mat4.translate(modelViewMatrix, modelViewMatrix, [-0.0, 0.0, -6.0])
  mat4.rotate(modelViewMatrix, modelViewMatrix, rotation, [0, 0, 1])
  mat4.rotate(modelViewMatrix, modelViewMatrix, rotation * .7, [0, 1, 0])

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.vertices)

  const { vertexPosition, vertexColor } = programInfo.attribLocations

  gl.enableVertexAttribArray(vertexPosition)
  gl.vertexAttribPointer(vertexPosition, 2, gl.FLOAT, false, 20, 0)

  gl.enableVertexAttribArray(vertexColor)
  gl.vertexAttribPointer(vertexColor, 3, gl.FLOAT, false, 20, 8)

  gl.useProgram(programInfo.program)

  const { uniformLocations } = programInfo
  gl.uniformMatrix4fv(uniformLocations.projectionMatrix, false, projectionMatrix)
  gl.uniformMatrix4fv(uniformLocations.modelViewMatrix, false, modelViewMatrix)

  gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0)

  rotation += deltaTime
}
