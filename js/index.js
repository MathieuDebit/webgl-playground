import NetUtils from './utils/net-utils.js'
import GlUtils from './utils/gl-utils.js'


let rotation = 0.0

const opts = {
  fov: 45,
  speedX: 0,
  speedY: 0,
}
const gui = new dat.GUI()
gui.add(opts, 'fov', 0, 180)
gui.add(opts, 'speedX', -10, 10)
gui.add(opts, 'speedY', -10, 10)


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
      vertexColor: gl.getAttribLocation(shaderProgram, 'aColor'),
      textureCoord: gl.getAttribLocation(shaderProgram, 'aTextureCoord'),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
      modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
      uSampler: gl.getUniformLocation(shaderProgram, 'uSampler'),
    },
  }

  const buffers = initBuffers(gl)
  const texture = GlUtils.loadTexture(gl, '../assets/images/tronche-de-cake.png')

  let then = 0
  function render(now) {
    now *= 0.001
    const deltaTime = now - then
    then = now

    drawScene(gl, programInfo, buffers, texture, canvasInfo, deltaTime)

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

  const textureCoord = new Float32Array([
    0.0,  1.0,
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
  ])
  const textureCoordBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, textureCoord, gl.STATIC_DRAW)

  return {
    vertices: verticesBuffer,
    indices: indicesBuffer,
    textureCoord: textureCoordBuffer,
  }
}


function drawScene(gl, programInfo, buffers, texture, canvasInfo, deltaTime) {
  gl.viewport(0, 0, canvasInfo.width, canvasInfo.height)
  gl.clearColor(0.13, 0.13, 0.13, 1)
  gl.clearDepth(1.0)
  gl.enable(gl.DEPTH_TEST)
  gl.depthFunc(gl.LEQUAL)
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

  const fieldOfView = opts.fov * Math.PI / 180
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight
  const zNear = 0.1
  const zFar = 100.0
  const projectionMatrix = mat4.create()

  mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar)

  const modelViewMatrix = mat4.create()

  mat4.translate(modelViewMatrix, modelViewMatrix, [-0.0, 0.0, -6.0])
  mat4.rotate(modelViewMatrix, modelViewMatrix, rotation * opts.speedX, [0, 0, 1])
  mat4.rotate(modelViewMatrix, modelViewMatrix, rotation * opts.speedY, [0, 1, 0])

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.vertices)

  const { vertexPosition, vertexColor, textureCoord } = programInfo.attribLocations

  gl.enableVertexAttribArray(vertexPosition)
  gl.vertexAttribPointer(vertexPosition, 2, gl.FLOAT, false, 20, 0)

  gl.enableVertexAttribArray(vertexColor)
  gl.vertexAttribPointer(vertexColor, 3, gl.FLOAT, false, 20, 8)

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.textureCoord)
  gl.enableVertexAttribArray(textureCoord)
  gl.vertexAttribPointer(textureCoord, 2, gl.FLOAT, false, 0, 0)

  gl.useProgram(programInfo.program)

  const { uniformLocations } = programInfo
  gl.uniformMatrix4fv(uniformLocations.projectionMatrix, false, projectionMatrix)
  gl.uniformMatrix4fv(uniformLocations.modelViewMatrix, false, modelViewMatrix)

  gl.activeTexture(gl.TEXTURE0)
  gl.bindTexture(gl.TEXTURE_2D, texture)
  gl.uniform1i(programInfo.uniformLocations.uSampler, 0)

  gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0)

  rotation += deltaTime
}

Promise.all([
  NetUtils.loadText('../glsl/vertex.vert'),
  NetUtils.loadText('../glsl/fragment.frag'),
]).then(main)
