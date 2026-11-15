"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";
import { TOTEMS } from "../lib/content";

const J = {
  totem: "_totem_1pamk_1",
  embedded: "_embedded_1pamk_30",
  backdrop: "_backdrop_1pamk_57",
  stage: "_stage_1pamk_69",
  stageImg: "_stageImg_1pamk_376",
  nameBack: "_nameBack_1pamk_14",
  nameFront: "_nameFront_1pamk_13",
  nameInner: "_nameInner_1pamk_116",
  scrim: "_scrim_1pamk_138",
  topbar: "_topbar_1pamk_164",
  oneLiner: "_oneLiner_1pamk_177",
  number: "_number_1pamk_185",
  paren: "_paren_1pamk_194",
  digit: "_digit_1pamk_195",
  divider: "_divider_1pamk_203",
  bottom: "_bottom_1pamk_215",
  title: "_title_1pamk_227",
  titleLine: "_titleLine_1pamk_236",
  selector: "_selector_1pamk_237",
  pitch: "_pitch_1pamk_244",
  pills: "_pills_1pamk_251",
  pill: "_pill_1pamk_251",
  pillOn: "_pillOn_1pamk_274",
  colontitle: "_colontitle_1pamk_160",
  hideCursor: "_hideCursor_1pamk_20",
};

const BACKDROP_FRAG = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;
float hash21(vec2 p){vec3 p3=fract(vec3(p.xyx)*0.1031);p3+=dot(p3,p3.yzx+33.33);return fract((p3.x+p3.y)*p3.z);}
float valueNoise(vec2 p){vec2 i=floor(p);vec2 f=fract(p);f=f*f*(3.0-2.0*f);
float a=hash21(i);float b=hash21(i+vec2(1.,0.));float c=hash21(i+vec2(0.,1.));float d=hash21(i+vec2(1.,1.));
return mix(mix(a,b,f.x),mix(c,d,f.x),f.y);}
float fbm(vec2 p){float v=0.;float amp=.5;for(int i=0;i<4;i++){v+=valueNoise(p)*amp;p=p*2.03+7.1;amp*=.5;}return v;}
void main(){
  float aspect=uRes.x/uRes.y;
  vec2 uv=vec2(gl_FragCoord.x/uRes.x,1.0-gl_FragCoord.y/uRes.y);
  vec2 p=vec2(uv.x*aspect,uv.y);
  float t=uTime*0.05;
  vec2 q=vec2(fbm(p*1.7+vec2(0.0,t)),fbm(p*1.7+vec2(4.6,-t)));
  vec2 r=vec2(fbm(p*1.7+2.2*q+vec2(1.7,9.2)),fbm(p*1.7+2.2*q+vec2(8.3,2.8)));
  float n=fbm(p*1.7+2.6*r);n=smoothstep(0.35,1.0,n);
  vec2 m=vec2(uMouse.x*aspect,uMouse.y);
  float glow=exp(-dot(p-m,p-m)*2.4);
  float vig=1.0-0.45*length(uv-0.5);
  float field=n*vig;
  vec3 col=vec3(0.006,0.006,0.008);
  col+=vec3(0.085,0.062,0.028)*field;
  col+=vec3(0.015,0.020,0.040)*field*(1.0-glow);
  col+=vec3(0.20,0.135,0.06)*glow*(0.35+0.7*field);
  gl_FragColor=vec4(col,1.0);
}`;

const VS = "attribute vec2 aPos; void main(){ gl_Position=vec4(aPos,0.0,1.0); }";

function Backdrop({ className }: { className: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl");
    if (!gl) return;
    const mk = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, mk(gl.VERTEX_SHADER, VS));
    gl.attachShader(prog, mk(gl.FRAGMENT_SHADER, BACKDROP_FRAG));
    gl.linkProgram(prog);
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "aPos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const uRes = gl.getUniformLocation(prog, "uRes");
    const uTime = gl.getUniformLocation(prog, "uTime");
    const uMouse = gl.getUniformLocation(prog, "uMouse");
    const mouse = { x: 0.5, y: 0.5 };
    const onMove = (e: PointerEvent) => {
      mouse.x = e.clientX / window.innerWidth;
      mouse.y = e.clientY / window.innerHeight;
    };
    window.addEventListener("pointermove", onMove);
    let raf = 0;
    let onScreen = true;
    const io = new IntersectionObserver(([e]) => (onScreen = e.isIntersecting));
    io.observe(canvas);
    const start = performance.now();
    const draw = () => {
      raf = requestAnimationFrame(draw);
      if (!onScreen) return;
      const r = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio, 2);
      const w = Math.max(1, Math.round(r.width * dpr));
      const h = Math.max(1, Math.round(r.height * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      gl.viewport(0, 0, w, h);
      gl.uniform2f(uRes, w, h);
      gl.uniform1f(uTime, (performance.now() - start) / 1000);
      gl.uniform2f(uMouse, mouse.x, 1 - mouse.y);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    draw();
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, []);
  return <canvas ref={ref} className={className} aria-hidden />;
}

function Model({ slug, className }: { slug: string; className: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
    camera.position.set(0, 1.1, 6.2);
    camera.lookAt(0, 0.9, 0);

    scene.add(new THREE.AmbientLight(0xffffff, 1.6));
    const key = new THREE.DirectionalLight(0xfff0d0, 3.2);
    key.position.set(3, 5, 4);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0x8899ff, 1.1);
    rim.position.set(-4, 2, -3);
    scene.add(rim);

    let raf = 0;
    let obj: THREE.Object3D | null = null;
    let dead = false;
    const loader = new GLTFLoader();
    loader.setMeshoptDecoder(MeshoptDecoder);
    loader.load(`/3d/${slug}-web.glb`, (gltf) => {
      if (dead) return;
      obj = gltf.scene;
      const box = new THREE.Box3().setFromObject(obj);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
      obj.position.sub(center);
      obj.position.y += size.y / 2;
      scene.add(obj);
    });

    const resize = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    let onScreen = true;
    const io = new IntersectionObserver(([e]) => (onScreen = e.isIntersecting));
    io.observe(canvas);

    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!onScreen) return;
      if (obj) obj.rotation.y += 0.004;
      renderer.render(scene, camera);
    };
    tick();
    return () => {
      dead = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      renderer.dispose();
    };
  }, [slug]);
  return <canvas ref={ref} className={className} aria-hidden />;
}

export default function Totem() {
  const [sel, setSel] = useState(0);
  const t = TOTEMS[sel];

  return (
    <section className={J.totem}>
      <div className={`_colontitle_1ghgf_1 _dark_1ghgf_21 ${J.colontitle}`} aria-hidden>
        <span>About Totems</span>
        <span className="_right_1ghgf_18">Chapter 05</span>
      </div>
      <Backdrop className={J.backdrop} />
      <div className={J.nameBack} aria-hidden>
        <span className={J.nameInner}>{t.name}</span>
      </div>
      <Model key={t.slug} slug={t.slug} className={J.stage} />
      <div className={J.scrim} aria-hidden />
      <h2 className={J.nameFront}>
        <span className={J.nameInner}>{t.epithet}</span>
      </h2>
      <div className={J.topbar}>
        <p id="totem-panel" role="tabpanel" aria-live="polite" className={J.oneLiner}>
          {t.name} — pick the one you're trying to become.
        </p>
        <span className={J.number}>
          <span className={J.paren}>(</span>
          <span className={J.digit}>{sel + 1}</span>
          <span className={J.paren}>)</span>
        </span>
      </div>
      <div className={J.divider} aria-hidden />
      <div className={J.bottom} data-controls>
        <h3 className={J.title}>
          <span className={J.titleLine}>Six totems.</span>
          <span className={J.titleLine}>One&apos;s yours.</span>
        </h3>
        <div className={J.selector}>
          <p className={J.pitch}>
            You pick one when you start. It levels up as you do, and it&apos;s the face you wear the
            whole way. Pick the one you&apos;re trying to become.
          </p>
          <div className={J.pills} role="tablist" aria-label="Totems">
            {TOTEMS.map((item, i) => (
              <button
                key={item.slug}
                role="tab"
                aria-selected={i === sel}
                tabIndex={i === sel ? 0 : -1}
                className={`${J.pill} ${i === sel ? J.pillOn : ""}`}
                onClick={() => setSel(i)}
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
