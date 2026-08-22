/**
 * Rotate points on an imaginary cat head, then project them into SVG space.
 *
 * Head space (same as the illustrative coordinates in the brief):
 *   x  left (−) → right (+)
 *   y  up   (−) → down  (+)   — already SVG-like, so we do not flip Y
 *   z  back (−) → front (+)   — the camera looks toward −Z, face sits at +Z
 *
 * Not physically correct. Just enough that turning the head moves each
 * feature according to where it sits on a rounded form.
 */

export type Vec3 = { x: number; y: number; z: number }

/** Angles in degrees. Positive yaw moves the nose to the right. */
export type Rotation = {
  yaw: number
  pitch: number
  roll: number
}

export type Projected = {
  x: number
  y: number
  /** Larger = closer to camera. */
  z: number
  scale: number
  /** ~0..1, how much this point faces the camera. */
  facing: number
}

export const FRAME = {
  width: 200,
  height: 224,
  cx: 100,
  cy: 118,
  radius: 70,
}

const FOCAL = 2.2

function toRad(deg: number) {
  return (deg * Math.PI) / 180
}

export function rotate(p: Vec3, r: Rotation): Vec3 {
  const yaw = toRad(r.yaw)
  const pitch = toRad(r.pitch)
  const roll = toRad(r.roll)

  const cy = Math.cos(yaw)
  const sy = Math.sin(yaw)
  let x = p.x * cy + p.z * sy
  let y = p.y
  let z = -p.x * sy + p.z * cy

  const cp = Math.cos(pitch)
  const sp = Math.sin(pitch)
  const y2 = y * cp - z * sp
  z = y * sp + z * cp
  y = y2

  const cr = Math.cos(roll)
  const sr = Math.sin(roll)
  const x2 = x * cr - y * sr
  y = x * sr + y * cr
  x = x2

  return { x, y, z }
}

export function project(p: Vec3, r: Rotation): Projected {
  const q = rotate(p, r)
  const scale = FOCAL / (FOCAL - q.z * 0.72)
  const facing = clamp(0.18 + q.z * 0.7, 0.12, 1)
  return {
    x: FRAME.cx + q.x * FRAME.radius * scale,
    y: FRAME.cy + q.y * FRAME.radius * scale,
    z: q.z,
    scale,
    facing,
  }
}

/** Screen-space tilt of a feature, in degrees, from a short “up” vector. */
export function tiltAt(p: Vec3, r: Rotation): number {
  const origin = project(p, r)
  const up = project({ x: p.x, y: p.y - 0.12, z: p.z }, r)
  return (Math.atan2(up.x - origin.x, origin.y - up.y) * 180) / Math.PI
}

export function dist(a: { x: number; y: number }, b: { x: number; y: number }) {
  return Math.hypot(b.x - a.x, b.y - a.y)
}

export function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

export function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

/** Round to one decimal so the SVG is readable when inspected. */
export function n(v: number) {
  return Math.round(v * 10) / 10
}

export function closedSpline(points: { x: number; y: number }[]): string {
  const count = points.length
  if (count < 3) return ''
  let d = `M ${n(points[0].x)} ${n(points[0].y)}`
  for (let i = 0; i < count; i++) {
    const p0 = points[(i - 1 + count) % count]
    const p1 = points[i]
    const p2 = points[(i + 1) % count]
    const p3 = points[(i + 2) % count]
    const c1x = p1.x + (p2.x - p0.x) / 6
    const c1y = p1.y + (p2.y - p0.y) / 6
    const c2x = p2.x - (p3.x - p1.x) / 6
    const c2y = p2.y - (p3.y - p1.y) / 6
    d += ` C ${n(c1x)} ${n(c1y)} ${n(c2x)} ${n(c2y)} ${n(p2.x)} ${n(p2.y)}`
  }
  return `${d} Z`
}

export function quad(
  a: { x: number; y: number },
  c: { x: number; y: number },
  b: { x: number; y: number },
) {
  return `M ${n(a.x)} ${n(a.y)} Q ${n(c.x)} ${n(c.y)} ${n(b.x)} ${n(b.y)}`
}
