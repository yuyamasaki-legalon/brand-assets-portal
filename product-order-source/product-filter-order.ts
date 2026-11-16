import type { Product } from "./catalog-types";

const productFilterOrder = [
  "LegalOn",
  "GovernOn",
  "DocumentOn",
  "TrustOn",
  "WorkOn",
  "DealOn",
  "LearningOn",
  "On Technologies",
  "Shared",
];

// Keep the requested sidebar order even when an older CMS catalogue is loaded.
// Additional products retain their CMS-defined relative order after these brands.
export function compareProductFilters(a: Product, b: Product) {
  const rank = (id: string) => {
    const index = productFilterOrder.indexOf(id);
    return index < 0 ? productFilterOrder.length : index;
  };
  return rank(a.id) - rank(b.id) || a.order - b.order;
}
