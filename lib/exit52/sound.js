// Optional UI sound via WebAudio (no asset files). Default OFF, only after user toggles.
let enabled = false;
let ctx = null;

export function isSoundEnabled() {
  return enabled;
}
export function setSoundEnabled(v) {
  enabled = !!v;
  if (typeof window !== "undefined") window.__exit52Sound = enabled;
}
function ac() {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}
function tone(freq, dur, type = "sine", gain = 0.05, delay = 0) {
  if (!enabled) return;
  const c = ac();
  if (!c) return;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.value = freq;
  o.connect(g);
  g.connect(c.destination);
  const t = c.currentTime + delay;
  g.gain.setValueAtTime(gain, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.start(t);
  o.stop(t + dur);
}
export function playClick() {
  tone(420, 0.07, "triangle", 0.035);
}
export function playFlip() {
  tone(600, 0.1, "sine", 0.045);
  tone(880, 0.08, "sine", 0.03, 0.05);
}
export function playWheel() {
  if (!enabled) return;
  for (let i = 0; i < 10; i++) tone(300 + i * 20, 0.05, "square", 0.02, i * 0.08);
}
export function playShuffle() {
  if (!enabled) return;
  const c = ac();
  if (!c) return;
  const buffer = c.createBuffer(1, c.sampleRate * 0.35, c.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
  const src = c.createBufferSource();
  const g = c.createGain();
  g.gain.value = 0.04;
  src.buffer = buffer;
  src.connect(g);
  g.connect(c.destination);
  src.start();
}
