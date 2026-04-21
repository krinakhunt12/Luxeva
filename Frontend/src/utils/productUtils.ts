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

/**
 * Returns a user-friendly label for an offer (e.g., "10% OFF", "Save ₹500")
 */
export function getOfferLabel(product: any) {
  const offer = product.appliedOffer;
  if (!offer) {
    if (product.originalPrice && product.price < product.originalPrice) {
      const diff = product.originalPrice - product.price;
      const pct = Math.round((diff / product.originalPrice) * 100);
      return `${pct}% OFF`;
    }
    return null;
  }

  // Simplified to only percentage
  const pct = offer.percentage || offer.amount || 0;
  return `${pct}% OFF`;
}

/**
 * Returns formatted prices and discount percentage
 */
export function getPriceDetails(product: any) {
  const currentPrice = Number(product.price);
  const originalPrice = product.originalPrice ? Number(product.originalPrice) : null;
  const hasDiscount = originalPrice && originalPrice > currentPrice;
  const discountPercent = hasDiscount ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100) : 0;

  return {
    currentPrice,
    originalPrice,
    hasDiscount,
    discountPercent,
    formattedCurrent: `₹${currentPrice.toLocaleString()}`,
    formattedOriginal: originalPrice ? `₹${originalPrice.toLocaleString()}` : null
  };
}
