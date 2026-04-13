export function normalizeColorName(name: string) {
  return (name || '').toLowerCase().replace(/[^a-z0-9]+/g, '');
}

// Derive imagesByColor map from file names when backend doesn't provide imagesByColor.
// Strategy: for each image URL, check if any normalized color name appears in the filename.
export function deriveImagesByColor(product: any) {
  if (!product || !product.images || !product.variants?.colors) return {};
  const map: Record<string, string[]> = {};
  const colorNames = (product.variants.colors || []).map((c: any) => ({ raw: c.name, norm: normalizeColorName(c.name) }));
  product.images.forEach((img: string) => {
    const filename = img.split('/').pop() || img;
    const fn = filename.toLowerCase();
    let matched = false;
    for (const c of colorNames) {
      if (c.norm && fn.includes(c.norm)) {
        map[c.raw] = map[c.raw] || [];
        map[c.raw].push(img);
        matched = true;
        break;
      }
    }
    if (!matched) {
      // keep as default images under a special key
      map.__default = map.__default || [];
      map.__default.push(img);
    }
  });
  return map;
}
