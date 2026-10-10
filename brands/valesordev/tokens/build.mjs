// Builds dist/tokens.css and dist/assets/fonts/ from tokens.json. No dependencies.
// Entry point: `make build-brand-valesordev` (brand.mk). Fails on a missing font file or a contrast miss.
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const kit = join(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(kit, 'dist')
const tokens = JSON.parse(readFileSync(join(kit, 'tokens', 'tokens.json'), 'utf8'))

const get = (path) => path.split('.').reduce((node, key) => node?.[key], tokens)
const resolve = (value) =>
  String(value).replace(/\{([^}]+)\}/g, (_, ref) => {
    const leaf = get(ref)
    if (!leaf || leaf.value === undefined) throw new Error(`unknown token reference {${ref}}`)
    return resolve(leaf.value)
  })

const lines = []
const decl = (name, value) => lines.push(`  --${name}: ${value};`)

// Color, space, layout, line, alias: one custom property per leaf.
for (const group of ['color', 'space', 'layout', 'line', 'alias']) {
  for (const [key, leaf] of Object.entries(tokens[group])) {
    if (group === 'layout' && key.startsWith('inset-')) continue
    decl(group === 'alias' ? key : `${group}-${key}`, resolve(leaf.value))
  }
}
decl('layout-inset', resolve(tokens.layout['inset-narrow'].value))

// Font stacks.
for (const [key, font] of Object.entries(tokens.font)) {
  decl(`font-${key}`, `"${font.family}", ${font.fallback}`)
}

// Type roles. Size is a multiple of the body size, so the scale moves as one.
decl('type-base', tokens.type.base.value)
for (const [role, spec] of Object.entries(tokens.type)) {
  if (role === 'base') continue
  decl(`type-${role}-family`, `var(--font-${spec.family.value})`)
  decl(`type-${role}-size`, `calc(var(--type-base) * ${spec.scale.value})`)
  decl(`type-${role}-line-height`, spec['line-height'].value)
  decl(`type-${role}-tracking`, spec.tracking.value)
  if (spec.transform) decl(`type-${role}-transform`, spec.transform.value)
}

// Self-hosted faces, referenced relative to tokens.css; the files are built beside it.
const faces = []
for (const font of Object.values(tokens.font)) {
  for (const file of font.files) {
    const from = join(kit, file.src)
    if (!existsSync(from)) throw new Error(`missing font file ${file.src}`)
    if (readFileSync(from).subarray(0, 4).toString('latin1') !== 'wOF2') throw new Error(`${file.src} is not a WOFF2 file`)
    const to = join(dist, file.src)
    mkdirSync(dirname(to), { recursive: true })
    copyFileSync(from, to)
    faces.push(
      `@font-face {\n  font-family: "${font.family}";\n  font-style: ${file.style};\n  font-weight: ${file.weight};\n  font-display: swap;\n  src: url("${file.src}") format("woff2");\n}`,
    )
  }
  const license = join(kit, font.licenseFile)
  if (!existsSync(license)) throw new Error(`missing licence file ${font.licenseFile}`)
  mkdirSync(dirname(join(dist, font.licenseFile)), { recursive: true })
  copyFileSync(license, join(dist, font.licenseFile))
}

// Contrast (WCAG 2.1 relative luminance). A miss fails the build.
const channel = (c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
const luminance = (hex) => {
  const n = parseInt(hex.slice(1), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => channel(v / 255)).reduce((s, v, i) => s + v * [0.2126, 0.7152, 0.0722][i], 0)
}
const ratio = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}
const ROLES = ['paper', 'ink', 'ink-muted', 'rule', 'accent']
if (Object.keys(tokens.color).join() !== ROLES.join()) {
  throw new Error(`color roles must be exactly ${ROLES.join(', ')} (no ink-faint, no rule-strong)`)
}
for (const [key, leaf] of Object.entries(tokens.color)) {
  if (!/^#[0-9A-Fa-f]{6}$/.test(leaf.value)) throw new Error(`color.${key} must be a 6-digit hex, got ${leaf.value}`)
}
// Every colour role used for text must be checked against paper; rule is a decorative hairline.
const checked = new Set(tokens.contrast.map((pair) => pair.fg))
for (const role of ROLES.filter((r) => r !== 'paper' && r !== 'rule')) {
  if (!checked.has(`color.${role}`)) throw new Error(`color.${role} has no entry in contrast`)
}
const misses = []
for (const pair of tokens.contrast) {
  const fg = resolve(get(pair.fg).value)
  const bg = resolve(get(pair.bg).value)
  const r = ratio(fg, bg)
  console.log(`contrast ${pair.fg} ${fg} on ${pair.bg} ${bg}: ${r.toFixed(2)}:1 (min ${pair.min})`)
  if (r < pair.min) misses.push(`${pair.fg} on ${pair.bg} is ${r.toFixed(2)}:1, needs ${pair.min}:1`)
}
if (misses.length) throw new Error(`contrast: ${misses.join('; ')}`)

const wide = tokens.layout['breakpoint-wide'].value
const css = [
  '/* Generated from tokens/tokens.json by tokens/build.mjs. Do not edit. Light theme only. */',
  ...faces,
  `:root {\n${lines.join('\n')}\n}`,
  `@media (min-width: ${wide}) {\n  :root {\n    --layout-inset: ${resolve(tokens.layout['inset-wide'].value)};\n  }\n}`,
  '',
].join('\n\n')

mkdirSync(dist, { recursive: true })
writeFileSync(join(dist, 'tokens.css'), css)
console.log('wrote brands/valesordev/dist/tokens.css')
