/**
 * Prefix a public asset path with the deploy basePath. On GitHub Pages the
 * site lives under /PH-A-FitLog/, and next/image does not add the prefix to
 * unoptimized src attributes — so public images go through this helper.
 * NEXT_PUBLIC_BASE_PATH is inlined at build time ("" locally).
 */
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

export function assetUrl(path) {
  return `${BASE_PATH}${path}`;
}
