/* Hero: the showreel through an anamorphic lens, in WebGL2.
   - a blue flare streak sweeps across, then opens vertically into a 2.39 letterbox
   - the pointer drags a fluid trail through the image (advected velocity field)
     that bends the picture and splits colour horizontally, like anamorphic glass
   - oval bokeh drift in front, horizontal flare follows the pointer, film grain
   Falls back to the plain <video> when WebGL2 is missing or motion is reduced. */
window.HeroGL = (() => {
  const VERT = `#version 300 es
  in vec2 p; out vec2 vUv;
  void main(){ vUv = p * .5 + .5; gl_Position = vec4(p, 0., 1.); }`;

  const SIM = `#version 300 es
  precision highp float;
  in vec2 vUv; out vec4 o;
  uniform sampler2D uPrev; uniform vec2 uMouse, uVel; uniform float uAspect, uForce;
  void main(){
    vec2 vel = texture(uPrev, vUv).xy;
    vec4 c = texture(uPrev, vUv - vel * .012);          // advect by own velocity
    c.xy *= .962; c.z *= .955;                          // dissipate
    vec2 d = vUv - uMouse; d.x *= uAspect;
    float g = exp(-dot(d, d) / .0028);
    c.xy += uVel * g * uForce;
    c.z  += length(uVel) * g * uForce * 1.5;
    o = clamp(c, -1., 1.);
  }`;

  const VIEW = `#version 300 es
  precision highp float;
  in vec2 vUv; out vec4 o;
  uniform sampler2D uVideo, uTrail;
  uniform vec2 uRes, uMouse;
  uniform float uTime, uOpen, uSweep, uFull, uFlare, uVA, uHasTrail, uReady, uBoxR, uCy;
  float hash(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
  void main(){
    vec2 uv = vUv;
    float boxH = min(1., (uRes.x / uBoxR) / uRes.y);
    float hBase = mix(boxH, 1., uFull);
    float half_ = hBase * uOpen * .5;
    float cy = mix(uCy, .5, uFull);
    float dy = abs(uv.y - cy);
    float inside = 1. - smoothstep(half_ - 1.5 / uRes.y, half_ + .5 / uRes.y, dy);

    // video coords: cover the full (unmasked) box so the open does not zoom
    vec2 l = vec2(uv.x, (uv.y - cy) / hBase + .5);
    float ba = uRes.x / (hBase * uRes.y);
    vec2 vuv = l;
    if (ba > uVA) vuv.y = .5 + (l.y - .5) * uVA / ba; else vuv.x = .5 + (l.x - .5) * ba / uVA;
    // gentle barrel, stronger at the frame edges
    vec2 cc = vuv - .5; vuv = .5 + cc * (1. - .035 * dot(cc, cc) * 4.);

    vec3 t = uHasTrail > .5 ? texture(uTrail, uv).xyz : vec3(0.);
    float mag = clamp(length(t.xy), 0., 1.);
    vec2 off = t.xy * .07;
    float ca = .0016 + mag * .028 + t.z * .01;          // horizontal (anamorphic) colour split
    vec3 col;
    col.r = texture(uVideo, vuv - off + vec2(ca, 0.)).r;
    col.g = texture(uVideo, vuv - off).g;
    col.b = texture(uVideo, vuv - off - vec2(ca, 0.)).b;
    col *= uReady;

    // grade: lift blacks toward blue, keep highlights warm
    col = col * vec3(1.02, 1., .97) + vec3(.004, .01, .02) * (1. - col);
    float vig = smoothstep(1.25, .2, length((uv - .5) * vec2(1., uRes.y / uRes.x * 1.6)));
    col *= mix(.55, 1., vig);

    // oval bokeh drifting in front of the lens
    vec3 bok = vec3(0.);
    for (int i = 0; i < 7; i++) {
      float fi = float(i);
      vec2 c = vec2(fract(.13 + fi * .171 + uTime * (.006 + fi * .0013)), cy + sin(uTime * .21 + fi * 1.7) * .22 * hBase);
      vec2 q = (uv - c) * vec2(uRes.x / uRes.y * .62, 1.);
      float r = .045 + .03 * fract(fi * .37);
      float d = length(q);
      float disc = smoothstep(r, r * .82, d) * (.55 + .45 * smoothstep(r * .7, r, d));
      bok += disc * mix(vec3(.49, .77, 1.), vec3(1., .78, .55), step(.6, fract(fi * .53))) * .12;
    }
    col += bok * inside;

    // horizontal flare that follows the pointer
    float fy = exp(-abs(uv.y - uMouse.y) * uRes.y * .18);
    float fx = .25 + .75 * exp(-abs(uv.x - uMouse.x) * 2.6);
    col += vec3(.49, .77, 1.) * fy * fx * (.18 + mag * .9) * uFlare * inside;

    col = mix(vec3(.027, .031, .039), col, inside);   // bars match the page ground

    // the opening streak: sweeps out from the centre, then rides the letterbox edges
    float sweep = 1. - smoothstep(uSweep * .62, uSweep * .62 + .08, abs(uv.x - .5));
    float edge = exp(-abs(dy - half_) * uRes.y * .22) * (1. - uFull);
    float core = exp(-abs(dy - half_) * uRes.y * 1.2);
    vec3 streak = vec3(.62, .84, 1.) * (edge * .55 + core * .9) * sweep * (1. - uOpen * .65);
    col += streak + vec3(.49, .77, 1.) * edge * .12 * uOpen * (1. - uFull);

    col += (hash(uv * uRes + fract(uTime) * 91.7) - .5) * .045;   // grain
    o = vec4(col, 1.);
  }`;

  function init(canvas, video, hero) {
    const gl = canvas.getContext("webgl2", { antialias: false, premultipliedAlpha: false, alpha: false });
    if (!gl) return null;
    const floatOK = !!gl.getExtension("EXT_color_buffer_float");
    gl.getExtension("OES_texture_float_linear");

    const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s)); return s; };
    const prog = (fs) => { const p = gl.createProgram(); gl.attachShader(p, sh(gl.VERTEX_SHADER, VERT)); gl.attachShader(p, sh(gl.FRAGMENT_SHADER, fs)); gl.bindAttribLocation(p, 0, "p"); gl.linkProgram(p); if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p)); const u = {}; const n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS); for (let i = 0; i < n; i++) { const a = gl.getActiveUniform(p, i); u[a.name] = gl.getUniformLocation(p, a.name); } return { p, u }; };
    let view, sim;
    try { view = prog(VIEW); sim = floatOK ? prog(SIM) : null; } catch (e) { console.warn(e); return null; }

    const vao = gl.createVertexArray(); gl.bindVertexArray(vao);
    const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    const vtex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, vtex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 255]));

    // ping-pong trail targets
    let fbos = [], tw = 0, th = 0;
    function makeTargets() {
      fbos.forEach((f) => { gl.deleteTexture(f.t); gl.deleteFramebuffer(f.f); });
      fbos = [];
      if (!sim) return;
      tw = Math.max(64, canvas.width >> 2); th = Math.max(64, canvas.height >> 2);
      for (let i = 0; i < 2; i++) {
        const t = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, t);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, tw, th, 0, gl.RGBA, gl.HALF_FLOAT, null);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        const f = gl.createFramebuffer(); gl.bindFramebuffer(gl.FRAMEBUFFER, f); gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, t, 0);
        gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
        fbos.push({ t, f });
      }
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }

    const state = { open: 0, sweep: 0, full: 0, flare: 0, ready: 0 };
    const mouse = { x: .5, y: .5, tx: .5, ty: .5, vx: 0, vy: 0, px: .5, py: .5 };
    function resize() {
      const dpr = Math.min(devicePixelRatio || 1, 1.5);
      const w = Math.round(hero.clientWidth * dpr), h = Math.round(hero.clientHeight * dpr);
      if (w === canvas.width && h === canvas.height) return;
      canvas.width = w; canvas.height = h; makeTargets();
    }
    resize();
    new ResizeObserver(resize).observe(hero);

    hero.addEventListener("pointermove", (e) => {
      const r = hero.getBoundingClientRect();
      mouse.tx = (e.clientX - r.left) / r.width; mouse.ty = 1 - (e.clientY - r.top) / r.height;
    });
    // with no pointer, the lens drifts on its own so the liquid is never dead
    let lastMove = 0; hero.addEventListener("pointermove", () => (lastMove = performance.now()));

    let visible = true;
    new IntersectionObserver(([e]) => (visible = e.isIntersecting)).observe(hero);

    let src = 0, t0 = performance.now();
    function frame(now) {
      requestAnimationFrame(frame);
      if (!visible) return;
      const time = (now - t0) / 1000;
      if (now - lastMove > 2200) { mouse.tx = .5 + Math.sin(time * .35) * .32; mouse.ty = .5 + Math.sin(time * .53) * .12; }
      mouse.x += (mouse.tx - mouse.x) * .18; mouse.y += (mouse.ty - mouse.y) * .18;
      mouse.vx = (mouse.x - mouse.px) * 9; mouse.vy = (mouse.y - mouse.py) * 9; mouse.px = mouse.x; mouse.py = mouse.y;

      if (video.readyState >= 2) {
        gl.bindTexture(gl.TEXTURE_2D, vtex);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video);
        if (state.ready < 1) state.ready = Math.min(1, state.ready + .04);
      }

      if (sim && fbos.length) {
        gl.useProgram(sim.p); gl.viewport(0, 0, tw, th);
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbos[1 - src].f);
        gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, fbos[src].t);
        gl.uniform1i(sim.u.uPrev, 0);
        gl.uniform2f(sim.u.uMouse, mouse.x, mouse.y);
        gl.uniform2f(sim.u.uVel, mouse.vx, mouse.vy);
        gl.uniform1f(sim.u.uAspect, canvas.width / canvas.height);
        gl.uniform1f(sim.u.uForce, state.open);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        src = 1 - src;
      }

      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.useProgram(view.p);
      gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, vtex); gl.uniform1i(view.u.uVideo, 0);
      gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, fbos.length ? fbos[src].t : vtex); gl.uniform1i(view.u.uTrail, 1);
      gl.uniform2f(view.u.uRes, canvas.width, canvas.height);
      gl.uniform2f(view.u.uMouse, mouse.x, mouse.y);
      gl.uniform1f(view.u.uTime, time);
      gl.uniform1f(view.u.uOpen, state.open);
      gl.uniform1f(view.u.uSweep, state.sweep);
      gl.uniform1f(view.u.uFull, state.full);
      gl.uniform1f(view.u.uFlare, state.flare);
      gl.uniform1f(view.u.uVA, (video.videoWidth || 16) / (video.videoHeight || 9));
      gl.uniform1f(view.u.uHasTrail, fbos.length ? 1 : 0);
      gl.uniform1f(view.u.uReady, state.ready);
      const phone = canvas.width / canvas.height < 0.9;
      gl.uniform1f(view.u.uBoxR, phone ? 0.82 : 2.39); // phones get a tall frame
      gl.uniform1f(view.u.uCy, phone ? 0.6 : 0.5);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
    requestAnimationFrame(frame);
    return state;
  }
  return { init };
})();
