"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GUILD_LIST, QUESTS } from "../lib/content";

const CARD_W = 345;
const CARD_H = 490;
const PLANE_W = 2.4;
const PLANE_H = (CARD_H / CARD_W) * PLANE_W;
const COUNT = 18;

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

const VERT = `
uniform float uBend;
uniform float uCardH;
varying vec2 vUv;
void main() {
  vUv = uv;
  vec3 p = position;
  p.z -= uBend * position.x * position.x;
  p.z -= uBend * 0.35 * position.y * position.y;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
}`;

const FRAG = `
precision highp float;
uniform sampler2D uTex;
uniform sampler2D uBack;
uniform float uSmear;
uniform vec2 uDir;
uniform float uDim;
varying vec2 vUv;
void main() {
  if (!gl_FrontFacing) {
    vec4 b = texture2D(uBack, vUv);
    gl_FragColor = vec4(b.rgb * max(uDim, 0.7), b.a);
    return;
  }
  if (uSmear < 0.0008) {
    vec4 c0 = texture2D(uTex, vUv);
    c0.rgb *= uDim;
    gl_FragColor = c0;
    return;
  }
  vec4 acc = vec4(0.0);
  float total = 0.0;
  for (int i = 0; i < 7; i++) {
    float t = float(i) / 6.0 - 0.5;
    float w = 1.0 - abs(t) * 1.3;
    if (w <= 0.0) continue;
    acc += texture2D(uTex, vUv + uDir * t * uSmear) * w;
    total += w;
  }
  vec4 c = acc / total;
  c.rgb *= uDim;
  gl_FragColor = c;
}`;

const CAT_COLOR: Record<string, string> = {
  Uncomfortable: "#ff6b5e",
  Exposure: "#5e9cff",
  Social: "#46c98e",
  Creative: "#c77dff",
};

function wrap(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxW: number,
  lh: number,
  maxLines = 99,
) {
  const words = text.split(" ");
  let line = "";
  let yy = y;
  let n = 0;
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (ctx.measureText(test).width > maxW && line) {
      ctx.fillText(line, x, yy);
      yy += lh;
      line = w;
      if (++n >= maxLines) return yy;
    } else line = test;
  }
  if (line) ctx.fillText(line, x, yy);
  return yy + lh;
}

function paintCard(i: number): HTMLCanvasElement {
  const dpr = 2;
  const c = document.createElement("canvas");
  c.width = CARD_W * dpr;
  c.height = CARD_H * dpr;
  const x = c.getContext("2d")!;
  x.setTransform(dpr, 0, 0, dpr, 0, 0);
  x.beginPath();
  x.roundRect(0, 0, CARD_W, CARD_H, 20);
  x.fillStyle = "#efefef";
  x.fill();
  x.save();
  x.clip();

  const q = QUESTS[i % QUESTS.length];
  const guild = GUILD_LIST[i % GUILD_LIST.length].name;

  x.beginPath();
  x.arc(44, 52, 28, 0, Math.PI * 2);
  x.fillStyle = CAT_COLOR[q.category] ?? "#c9a24a";
  x.fill();
  x.font = "700 26px system-ui, sans-serif";
  x.fillStyle = "#fff";
  x.textAlign = "center";
  x.textBaseline = "middle";
  x.fillText(q.category[0], 44, 53);

  x.textAlign = "left";
  x.textBaseline = "alphabetic";
  x.font = "400 16px system-ui, sans-serif";
  x.fillStyle = "#838383";
  x.fillText(guild, 16, 106);

  x.font = "700 33px system-ui, sans-serif";
  x.fillStyle = "#000";
  let y = wrap(x, q.text, 16, 142, CARD_W - 32, 32);
  x.font = "400 16px system-ui, sans-serif";
  x.fillStyle = "#464646";
  wrap(x, q.body, 16, y + 14, CARD_W - 32, 20);

  for (let a = 0; a < 3; a++) {
    x.beginPath();
    x.arc(32 + a * 22, CARD_H - 87, 12, 0, Math.PI * 2);
    x.fillStyle = ["#d9d9d9", "#c4c4c4", "#b0b0b0"][a];
    x.fill();
  }
  x.fillStyle = "#f2f2f2";
  x.fillRect(0, CARD_H - 38, CARD_W, 38);
  x.font = "400 12px system-ui, sans-serif";
  x.fillStyle = "#838383";
  x.textAlign = "center";
  x.fillText("In-person beats text for anything that matters.", CARD_W / 2, CARD_H - 22);
  x.restore();
  return c;
}

function paintBack(i: number): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = CARD_W;
  c.height = CARD_H;
  const x = c.getContext("2d")!;
  x.fillStyle = "#111";
  x.fillRect(0, 0, CARD_W, CARD_H);
  return c;
}

export default function Spiral({
  progress,
  active = true,
}: {
  progress: () => number;
  active?: boolean;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const cfg = { angleStep: 0.65, radius: 3, squish: 0.7, gapX: -0.05, gapY: 0.4, edgeTwist: -0.06, cardScale: 0.5, bend: 0.06, autoSpeed: 0.15, mouseTilt: 0.12, magnet: 0.1 };

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0, 0);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.z = 9;

    const group = new THREE.Group();
    scene.add(group);

    const geo = new THREE.PlaneGeometry(PLANE_W, PLANE_H, 24, 16);
    const fronts: THREE.Texture[] = [];
    const backs: THREE.Texture[] = [];
    const meshes: THREE.Mesh[] = [];

    for (let i = 0; i < COUNT; i++) {
      const tex = new THREE.CanvasTexture(paintCard(i));
      tex.colorSpace = THREE.NoColorSpace;
      const back = new THREE.CanvasTexture(paintBack(i));
      back.colorSpace = THREE.NoColorSpace;
      fronts.push(tex);
      backs.push(back);
      const mat = new THREE.ShaderMaterial({
        uniforms: {
          uTex: { value: tex },
          uBack: { value: back },
          uBend: { value: cfg.bend },
          uSmear: { value: 0 },
          uDir: { value: new THREE.Vector2(0, 1) },
          uDim: { value: 1 },
          uCardH: { value: PLANE_H },
        },
        vertexShader: VERT,
        fragmentShader: FRAG,
        transparent: true,
        side: THREE.DoubleSide,
        depthTest: false,
        depthWrite: false,
      });
      const mesh = new THREE.Mesh(geo, mat);
      group.add(mesh);
      meshes.push(mesh);
    }

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
    let first = true;
    const io = new IntersectionObserver(([e]) => (onScreen = e.isIntersecting));
    io.observe(canvas);
    canvas.style.opacity = "0";
    canvas.style.transition = "opacity .2s linear";

    const mouse = { x: 0, y: 0 };
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      mouse.y = -(((e.clientY - r.top) / r.height) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove);
    let dragY: number | null = null;
    let rot = 0;
    const onDown = (e: PointerEvent) => (dragY = e.clientY);
    const onUp = () => (dragY = null);
    const onDrag = (e: PointerEvent) => {
      if (dragY === null) return;
      rot += -(e.clientY - dragY) * 0.006;
      dragY = e.clientY;
    };
    const onWheel = (e: WheelEvent) => {
      if (!e.shiftKey) return;
      rot += e.deltaY * 0.0016;
    };
    canvas.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointermove", onDrag);
    canvas.addEventListener("wheel", onWheel, { passive: true });

    let raf = 0;
    let last = performance.now();
    let auto = 0;
    let moveX = 0;
    let moveY = 0;
    let intro = 0;

    const tick = () => {
      raf = requestAnimationFrame(tick);
      const now = performance.now();
      const dt = Math.min(0.05, (now - last) / 1000) || 0.016;
      last = now;
      if (!active || !onScreen) return;

      const sp = progress();
      const freeze = smooth(0.18, 0.72, sp);
      const flat = smooth(1.18, 1.7, sp);
      const out = smooth(2.15, 2.6, sp);
      const radius = cfg.radius;
      const spin = 1;

      intro = Math.min(1, intro + (reduced ? 1 : dt / 1.6));

      if (!reduced && flat < 0.999) auto += cfg.autoSpeed * dt * (1 - freeze) * spin;
      const base = auto + rot;
      const visible = 1 - out;

      moveX += (mouse.x * cfg.mouseTilt - moveX) * Math.min(1, dt * 4);
      moveY += (mouse.y * cfg.mouseTilt - moveY) * Math.min(1, dt * 4);
      group.rotation.x = moveX * (1 - flat);
      group.rotation.z = -moveY * (1 - flat);

      const halfH = Math.tan(((38 * Math.PI) / 180) / 2) * camera.position.z;
      const halfW = halfH * camera.aspect;
      const mx = mouse.x * halfW;
      const my = mouse.y * halfH;
      const mid = COUNT / 2;

      for (let i = 0; i < COUNT; i++) {
        const rel = i - mid;
        const angle = (rel - (base % 1)) * cfg.angleStep;
        const cosA = Math.cos(angle);
        const sinA = Math.sin(angle);
        let x = radius * sinA + rel * cfg.gapX;
        let y = rel * cfg.gapY;
        const z = radius * cosA * cfg.squish;
        const pull = Math.exp(-((mx - x) ** 2 + (my - y) ** 2) / 9) * cfg.magnet * (1 - freeze);
        x += (mx - x) * pull;
        y += (my - y) * pull;

        const depth = Math.max(0.32, 0.5 + 0.5 * cosA);
        // entrance: cards fly out from the centre, outer ones last
        const ie = intro >= 1 ? 1 : smooth(0, 1, (intro - (Math.abs(rel) / mid) * 0.45) / 0.55);
        const m = meshes[i];
        m.position.set(
          (x + (0 - x) * flat) * ie,
          (y + (0.55 * out) + (0 - y) * flat) * ie,
          (z + (0 - z) * flat) * ie,
        );
        m.rotation.set(0, angle + (0 - angle) * flat, -sinA * cfg.edgeTwist + (0 - -sinA * cfg.edgeTwist) * flat);
        m.scale.setScalar(
          cfg.cardScale * 1.15 * (1 + (0.5 - cfg.cardScale * 1.15) * flat) * visible * (0.55 + 0.45 * ie),
        );
        const u = (m.material as THREE.ShaderMaterial).uniforms;
        u.uBend.value = cfg.bend * (1 - flat);
        u.uDim.value = depth + (1 - depth) * flat;
        u.uSmear.value = 0;
        m.renderOrder = Math.round((z * 100) * (1 - flat) + (50 - Math.abs(rel)) * 2 * flat);
      }
      renderer.render(scene, camera);
      if (first) {
        first = false;
        canvas.style.opacity = "1";
      }
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointermove", onDrag);
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("wheel", onWheel);
      geo.dispose();
      meshes.forEach((m) => (m.material as THREE.Material).dispose());
      fronts.forEach((t) => t.dispose());
      backs.forEach((t) => t.dispose());
      renderer.dispose();
    };
  }, [progress, active]);

  return <canvas ref={ref} style={{ width: "100%", height: "100%", display: "block" }} aria-hidden />;
}
