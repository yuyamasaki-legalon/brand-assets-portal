import { expect, it } from "vitest";
import { defaultProducts, type Product } from "./catalog-types";
import { compareProductFilters } from "./product-filter-order";

it("uses the requested sidebar order despite old or edited CMS order values", () => {
  const products = defaultProducts.map((product, index) => ({ ...product, order: 99 - index })).reverse();
  const before = structuredClone(products);
  expect([...products].sort(compareProductFilters).map((product) => product.id)).toEqual([
    "LegalOn",
    "GovernOn",
    "DocumentOn",
    "TrustOn",
    "WorkOn",
    "DealOn",
    "LearningOn",
    "On Technologies",
    "Shared",
  ]);
  expect(products).toEqual(before);
});

it("preserves additional product labels, state and relative CMS order", () => {
  const extras: Product[] = [
    { id: "extra-two", label: "追加2", state: "active", order: 20 },
    { id: "extra-one", label: "追加1", state: "ended", order: 10 },
  ];
  expect([...extras, ...defaultProducts].sort(compareProductFilters).slice(-2)).toEqual([extras[1], extras[0]]);
});
