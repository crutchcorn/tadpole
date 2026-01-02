const MAX_SVG_CHARS = 500_000;

function stripControlCharsAndWhitespace(value: string): string {
  let out = "";
  for (let i = 0; i < value.length; i++) {
    const code = value.charCodeAt(i);
    // control chars + whitespace + DEL
    if (code <= 0x20 || code === 0x7f) continue;
    out += value[i];
  }
  return out;
}

function normalizeForScan(value: string): string {
  return stripControlCharsAndWhitespace(value).toLowerCase();
}

const FORBIDDEN_BLOCK_TAGS = ["script", "style", "foreignobject", "iframe", "object", "embed"] as const;
const FORBIDDEN_VOID_TAGS = ["link", "meta", "base", "image"] as const;

const FORBIDDEN_SCAN_NEEDLES = [
  "<script",
  "<foreignobject",
  "<iframe",
  "<object",
  "<embed",
  "<link",
  "<meta",
  "<base",
  "<image",
  "javascript:",
  "vbscript:",
  "data:",
  "onload=",
  "onerror=",
  "onclick=",
  "xlink:href=",
  "href=",
  "style=",
];

function stripForbiddenTags(s: string): string {
  let out = s;
  for (const tag of FORBIDDEN_BLOCK_TAGS) {
    // Remove <tag ...>...</tag> first, then any remaining start/self-closing tags.
    out = out.replace(new RegExp(`<\\s*${tag}\\b[\\s\\S]*?<\\s*\\/\\s*${tag}\\s*>`, "gi"), "");
    out = out.replace(new RegExp(`<\\s*${tag}\\b[^>]*\\/?>`, "gi"), "");
  }
  for (const tag of FORBIDDEN_VOID_TAGS) {
    out = out.replace(new RegExp(`<\\s*${tag}\\b[^>]*\\/?>`, "gi"), "");
  }
  return out;
}

function stripForbiddenAttributes(s: string): string {
  let out = s;
  // Remove inline event handlers (onload=, onclick=, etc.)
  out = out.replace(/\s+on[a-z0-9_-]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, "");
  // Remove href / xlink:href completely (no links needed for this app's drawings)
  out = out.replace(/\s+(?:xlink:)?href\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, "");
  // Remove inline styles
  out = out.replace(/\s+style\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, "");
  return out;
}

export function sanitizeSvg(svg: string): string {
  if (svg.length > MAX_SVG_CHARS) throw new Error("SVG too large");

  let out = svg.trim();
  if (!/^<svg[\s>]/i.test(out) || !/<\/svg>\s*$/i.test(out)) throw new Error("Invalid SVG");

  // Strip common wrappers
  out = out.replace(/<\?xml[\s\S]*?\?>/gi, "");
  out = out.replace(/<!doctype[\s\S]*?>/gi, "");

  out = stripForbiddenTags(out);
  out = stripForbiddenAttributes(out);

  // Final scan for disallowed primitives (with control/whitespace-stripping to reduce bypasses)
  const normalized = normalizeForScan(out);
  for (const needle of FORBIDDEN_SCAN_NEEDLES) {
    if (normalized.includes(needle)) throw new Error("Disallowed SVG content");
  }

  // Special-case: allow internal references like url(#id) if they remain after stripping.
  // If any url( exists, reject unless it's immediately followed by '#'.
  for (let urlIndex = normalized.indexOf("url("); urlIndex !== -1; urlIndex = normalized.indexOf("url(", urlIndex + 4)) {
    const after = normalized.slice(urlIndex + 4);
    if (!after.startsWith("#")) throw new Error("Disallowed SVG content");
  }

  return out;
}
