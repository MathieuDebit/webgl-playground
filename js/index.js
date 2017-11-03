import NetUtils from './utils/net-utils.js'

// metrics stuff
let CANVAS_WIDTH  = window.innerWidth
let CANVAS_HEIGHT = window.innerHeight

// canvas & context
let cvs
let gl

// shader stuff
let vertexSource
let fragmentSource
let program

// buffer stuff
let vertices
let verticesBuffer
let positionAttribLoc
let colorAttribLoc

function initGL() {
  cvs = document.querySelector( 'canvas' )
  gl = cvs.getContext('webgl')

  cvs.style.width  = CANVAS_WIDTH + 'px'
  cvs.style.height = CANVAS_HEIGHT + 'px'
  cvs.width        = CANVAS_WIDTH
  cvs.height       = CANVAS_HEIGHT
}

function initShaders() {
  const vShader = gl.createShader( gl.VERTEX_SHADER )
  gl.shaderSource(vShader, vertexSource)
  gl.compileShader(vShader)
  if ( !gl.getShaderParameter( vShader, gl.COMPILE_STATUS ) ) {
    console.error( 'Vertex Shader init:', gl.getShaderInfoLog(vShader) )
  }

  const fShader = gl.createShader( gl.FRAGMENT_SHADER )
  gl.shaderSource(fShader, fragmentSource)
  gl.compileShader(fShader)
  if ( !gl.getShaderParameter( fShader, gl.COMPILE_STATUS ) ) {
    console.error( 'Fragment Shader init:', gl.getShaderInfoLog(fShader) )
  }

  program = gl.createProgram();
  gl.attachShader(program, vShader)
  gl.attachShader(program, fShader)
  gl.linkProgram(program)
  if ( !gl.getProgramParameter(program, gl.LINK_STATUS) ) {
    console.error( 'Program init:', gl.getProgramInfoLog( program ) )
  }

  // bind it on the context for operations
  gl.useProgram( program )

  // you can get attributes location at that point
  positionAttribLoc = gl.getAttribLocation( program, 'aPosition' )
  colorAttribLoc = gl.getAttribLocation( program, 'aColor' )
}

function initBuffers() {
  vertices = new Float32Array([
    -1.0, -1.0, 1.0, 0.0, 0.0, // x, y, r, g, b
     0.0,  0.0, 1.0, 1.0, 0.0,
     1.0, -1.0, 0.0, 1.0, 1.0,
  ])

  verticesBuffer = gl.createBuffer()
  gl.bindBuffer( gl.ARRAY_BUFFER, verticesBuffer )
  gl.bufferData( gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW )
  gl.bindBuffer( gl.ARRAY_BUFFER, null )
}

function render() {
  gl.clearColor( 0.13, 0.13, 0.13, 1 )
  gl.clear( gl.COLOR_BUFFER_BIT )
  gl.viewport( 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT )

  gl.useProgram( program )
  gl.bindBuffer( gl.ARRAY_BUFFER, verticesBuffer )

  gl.enableVertexAttribArray( positionAttribLoc )
  gl.vertexAttribPointer( positionAttribLoc, 2, gl.FLOAT, false, 20, 0 )

  gl.enableVertexAttribArray( colorAttribLoc )
  gl.vertexAttribPointer( colorAttribLoc, 3, gl.FLOAT, false, 20, 8 )

  gl.drawArrays( gl.TRIANGLES, 0, 3 )
}

function onResourcesLoaded( resources ) {
  vertexSource   = resources[0]
  fragmentSource = resources[1]

  initGL()
  initShaders()
  initBuffers()

  render()
}

Promise.all([
  NetUtils.loadText( '../glsl/vertex.vert' ),
  NetUtils.loadText( '../glsl/fragment.frag' ),
]).then( onResourcesLoaded )
