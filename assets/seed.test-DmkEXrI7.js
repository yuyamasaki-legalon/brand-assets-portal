var e=`import { describe, expect, it } from "vitest";
import { AEGIS_FIXED_LIGHTNESS } from "../store/types";
import { importFromPaletteJson } from "./seed";

// ---------------------------------------------------------------------------
// importFromPaletteJson
// ---------------------------------------------------------------------------

describe("importFromPaletteJson", () => {
  // --- project shell ---

  it("uses 'Aegis Default' as the default project name", () => {
    expect(importFromPaletteJson({}).name).toBe("Aegis Default");
  });

  it("accepts a custom project name", () => {
    expect(importFromPaletteJson({}, "My Palette").name).toBe("My Palette");
  });

  it("assigns a UUID-shaped id", () => {
    expect(importFromPaletteJson({}).id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
  });

  it("each call produces a unique id", () => {
    const a = importFromPaletteJson({});
    const b = importFromPaletteJson({});
    expect(a.id).not.toBe(b.id);
  });

  it("has ISO-formatted createdAt and updatedAt", () => {
    const project = importFromPaletteJson({});
    expect(project.createdAt).toMatch(/^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}/);
    expect(project.updatedAt).toMatch(/^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}/);
  });

  it("createdAt equals updatedAt on import", () => {
    const project = importFromPaletteJson({});
    expect(project.createdAt).toBe(project.updatedAt);
  });

  // --- empty input ---

  it("produces an empty colorFamilies array for empty JSON", () => {
    expect(importFromPaletteJson({}).colorFamilies).toEqual([]);
  });

  // --- family parsing ---

  it("creates one ColorFamily per top-level key", () => {
    const json = { Blue: { "500": "#0000ff" }, Red: { "500": "#ff0000" } };
    expect(importFromPaletteJson(json).colorFamilies).toHaveLength(2);
  });

  it("sets family name from the JSON key", () => {
    const json = { "primary-blue": { "500": "#0000ff" } };
    expect(importFromPaletteJson(json).colorFamilies[0].name).toBe("primary-blue");
  });

  it("each family gets a unique UUID id", () => {
    const json = { Blue: { "500": "#0000ff" }, Red: { "500": "#ff0000" } };
    const families = importFromPaletteJson(json).colorFamilies;
    expect(families[0].id).not.toBe(families[1].id);
    expect(families[0].id).toMatch(/^[0-9a-f]{8}-/);
  });

  // --- tone parsing ---

  it("parses tone value from the JSON key as a number", () => {
    const json = { Blue: { "500": "#0000ff" } };
    expect(importFromPaletteJson(json).colorFamilies[0].tones[0].value).toBe(500);
  });

  it("preserves the hex value from JSON", () => {
    const json = { Blue: { "500": "#3b82f6" } };
    expect(importFromPaletteJson(json).colorFamilies[0].tones[0].hex).toBe("#3b82f6");
  });

  it("filters out non-numeric tone keys", () => {
    const json = { Blue: { "500": "#0000ff", invalid: "#aabbcc", "100": "#e0e7ff" } };
    const tones = importFromPaletteJson(json).colorFamilies[0].tones;
    expect(tones.map((t) => t.value)).not.toContain(Number.NaN);
    expect(tones).toHaveLength(2);
  });

  it("sorts tones ascending by value", () => {
    const json = { Blue: { "700": "#0000aa", "100": "#e0e7ff", "500": "#0000ff" } };
    const values = importFromPaletteJson(json).colorFamilies[0].tones.map((t) => t.value);
    expect(values).toEqual([100, 500, 700]);
  });

  // --- lightness resolution ---

  it("uses AEGIS_FIXED_LIGHTNESS when tone key is a known value", () => {
    const json = { Blue: { "500": "#0000ff" } };
    const tone = importFromPaletteJson(json).colorFamilies[0].tones[0];
    expect(tone.lightness).toBe(AEGIS_FIXED_LIGHTNESS["500"]);
  });

  it("uses AEGIS_FIXED_LIGHTNESS for all standard tone values (50–900)", () => {
    const standard: Record<string, string> = {
      "50": "#ffffff",
      "100": "#eeeeee",
      "200": "#dddddd",
      "300": "#cccccc",
      "400": "#bbbbbb",
      "500": "#aaaaaa",
      "600": "#999999",
      "700": "#888888",
      "800": "#777777",
      "900": "#666666",
    };
    const tones = importFromPaletteJson({ Gray: standard }).colorFamilies[0].tones;
    for (const tone of tones) {
      const fixed = AEGIS_FIXED_LIGHTNESS[String(tone.value)];
      if (fixed !== undefined) {
        expect(tone.lightness).toBe(fixed);
      }
    }
  });

  it("falls back to hexToOklchChannels lightness for unknown tone values", () => {
    const json = { Blue: { "999": "#808080" } };
    const tone = importFromPaletteJson(json).colorFamilies[0].tones[0];
    // AEGIS_FIXED_LIGHTNESS["999"] is undefined, so derived from hex
    expect(AEGIS_FIXED_LIGHTNESS["999"]).toBeUndefined();
    expect(tone.lightness).toBeGreaterThan(0);
    expect(tone.lightness).toBeLessThan(100);
  });

  // --- other tone fields ---

  it("sets alphaMode to 'none' for all tones", () => {
    const json = { Blue: { "500": "#0000ff", "100": "#e0e7ff" } };
    const tones = importFromPaletteJson(json).colorFamilies[0].tones;
    expect(tones.every((t) => t.alphaMode === "none")).toBe(true);
  });

  it("chroma and hue are finite numbers (not NaN)", () => {
    const json = { Blue: { "500": "#3b82f6" } };
    const tone = importFromPaletteJson(json).colorFamilies[0].tones[0];
    expect(Number.isFinite(tone.chroma)).toBe(true);
    expect(Number.isFinite(tone.hue)).toBe(true);
  });

  it("family with no tones (empty object) produces an empty tones array", () => {
    const json = { Blank: {} };
    expect(importFromPaletteJson(json).colorFamilies[0].tones).toEqual([]);
  });
});
`;export{e as default};