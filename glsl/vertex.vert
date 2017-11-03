attribute vec2 aPosition;
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
attribute vec3 aColor;
varying lowp vec3 vColor;

void main() {
  gl_Position = uProjectionMatrix * uModelViewMatrix * vec4( aPosition, 0.0, 1.0 );
  vColor = aColor;
}
