/* Liquid tangerine: soft metaballs that flow, merge and split, and reach toward the pointer.
   WebGL2 fragment shader on one quad. Pauses off screen. Returns a stop() function, or null without WebGL2. */
const VERT = `#version 300 es
in vec2 p; out vec2 uv; void main(){ uv = p * .5 + .5; gl_Position = vec4(p, 0., 1.); }`;
const FRAG = `#version 300 es
precision highp float;
in vec2 uv; out vec4 o;
uniform vec2 uRes, uPtr; uniform float uT, uPull, uIn;
float field(vec2 q, vec2 c, float r){ vec2 d = q - c; return r * r / (dot(d, d) + 1e-4); }
void main(){
  float a = uRes.x / uRes.y;
  vec2 q = (uv - .5) * vec2(a, 1.);
  float t = uT * .35;
  float f = 0.;
  for (int i = 0; i < 7; i++){
    float fi = float(i);
    vec2 c = vec2(sin(t * (.7 + fi * .13) + fi * 1.9) * (.22 + .05 * fi), cos(t * (.6 + fi * .11) + fi * 2.4) * (.26 + .03 * fi));
    c *= vec2(a * .9, 1.);
    float r = .085 + .035 * sin(t * 1.3 + fi * 3.1) + .03 * fract(fi * .618);
    f += field(q, c, r * uIn);
  }
  vec2 pp = (uPtr - .5) * vec2(a, 1.);
  f += field(q, pp, .12 * uPull * uIn);
  float edge = smoothstep(.95, 1.05, f);
  vec3 deep = vec3(1., .30, .07), hot = vec3(1., .48, .18), light = vec3(1., .74, .52);
  float core = smoothstep(1., 3.2, f);
  vec3 col = mix(hot, deep, core);
  float rim = smoothstep(1.05, 1.0, f) * edge;
  col = mix(col, light, rim * .65);
  float hl = smoothstep(.35, 0., length(q - pp * .6 - vec2(-.08, .1))) * .18;
  col += hl * edge;
  o = vec4(col, edge);
}`;

export function initFluid(canvas, host) {
  const gl = canvas.getContext("webgl2", { premultipliedAlpha: false, alpha: true, antialias: true });
  if (!gl) return null;
  const sh = (t, s) => { const x = gl.createShader(t); gl.shaderSource(x, s); gl.compileShader(x); if (!gl.getShaderParameter(x, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(x)); return x; };
  const pr = gl.createProgram();
  try { gl.attachShader(pr, sh(gl.VERTEX_SHADER, VERT)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FRAG)); } catch (e) { console.warn(e); return null; }
  gl.bindAttribLocation(pr, 0, "p"); gl.linkProgram(pr); gl.useProgram(pr);
  const U = (n) => gl.getUniformLocation(pr, n);
  const uRes = U("uRes"), uPtr = U("uPtr"), uT = U("uT"), uPull = U("uPull"), uIn = U("uIn");
  const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  const resize = () => { const d = Math.min(devicePixelRatio || 1, 2), w = canvas.clientWidth * d, h = canvas.clientHeight * d; if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; } };
  const ro = new ResizeObserver(resize); ro.observe(canvas); resize();
  const ptr = { x: .5, y: .5, tx: .5, ty: .5, pull: 0, tp: 0 };
  let last = 0;
  const onMove = (e) => { const r = canvas.getBoundingClientRect(); ptr.tx = (e.clientX - r.left) / r.width; ptr.ty = 1 - (e.clientY - r.top) / r.height; ptr.tp = 1; last = performance.now(); };
  const onLeave = () => (ptr.tp = 0);
  host.addEventListener("pointermove", onMove); host.addEventListener("pointerleave", onLeave);
  let vis = true; const io = new IntersectionObserver(([e]) => (vis = e.isIntersecting)); io.observe(canvas);
  const t0 = performance.now(); let grow = 0, raf = 0;
  const frame = (now) => {
    raf = requestAnimationFrame(frame);
    if (!vis) return;
    const t = (now - t0) / 1000;
    if (now - last > 2500) { ptr.tx = .5 + Math.sin(t * .5) * .25; ptr.ty = .5 + Math.cos(t * .37) * .2; ptr.tp = .7; }
    ptr.x += (ptr.tx - ptr.x) * .06; ptr.y += (ptr.ty - ptr.y) * .06; ptr.pull += (ptr.tp - ptr.pull) * .05;
    grow += (1 - grow) * .03;
    gl.viewport(0, 0, canvas.width, canvas.height); gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform2f(uRes, canvas.width, canvas.height); gl.uniform2f(uPtr, ptr.x, ptr.y);
    gl.uniform1f(uT, t); gl.uniform1f(uPull, ptr.pull); gl.uniform1f(uIn, grow);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  };
  raf = requestAnimationFrame(frame);
  return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); host.removeEventListener("pointermove", onMove); host.removeEventListener("pointerleave", onLeave); };
}
