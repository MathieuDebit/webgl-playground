varying lowp vec3 vColor;

varying highp vec2 vTextureCoord;
uniform sampler2D uSampler;


void main() {
  // gl_FragColor = vec4(vColor, 1.0);
  gl_FragColor = texture2D(uSampler, vTextureCoord);
}
