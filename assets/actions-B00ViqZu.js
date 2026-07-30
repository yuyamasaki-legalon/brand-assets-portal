var e=`import type { Gamut, PaletteProject, ToneEntry } from "./types";

export type PaletteLabAction =
  | { type: "ADD_PROJECT"; payload: { name: string } }
  | { type: "DELETE_PROJECT"; payload: { projectId: string } }
  | { type: "SELECT_PROJECT"; payload: { projectId: string } }
  | { type: "ADD_FAMILY"; payload: { name: string } }
  | { type: "DELETE_FAMILY"; payload: { familyId: string } }
  | { type: "SELECT_FAMILY"; payload: { familyId: string } }
  | { type: "RENAME_FAMILY"; payload: { familyId: string; name: string } }
  | { type: "ADD_TONE"; payload: { familyId: string; toneValue: number } }
  | { type: "DELETE_TONE"; payload: { familyId: string; toneValue: number } }
  | {
      type: "UPDATE_TONE";
      payload: {
        familyId: string;
        toneValue: number;
        patch: Partial<Pick<ToneEntry, "lightness" | "chroma" | "hue" | "hex" | "alphaMode">>;
      };
    }
  | { type: "IMPORT_PALETTE"; payload: { project: PaletteProject } }
  | { type: "SELECT_TONE"; payload: { toneValue: number } }
  | {
      type: "UPDATE_TONE_BULK";
      payload: {
        toneValue: number;
        patch: Partial<Pick<ToneEntry, "lightness" | "chroma" | "hue" | "hex" | "alphaMode">>;
      };
    }
  | { type: "SET_PRIMARY_BASE_TONE"; payload: { familyId: string; baseTone: number | null } }
  | { type: "RENAME_PROJECT"; payload: { projectId: string; name: string } }
  | { type: "DUPLICATE_FAMILY"; payload: { familyId: string } }
  | { type: "DUPLICATE_PROJECT"; payload: { projectId: string } }
  | { type: "PUSH_UNDO_SNAPSHOT" }
  | {
      type: "UPDATE_TONE_DRAG";
      payload: {
        familyId: string;
        toneValue: number;
        patch: Partial<Pick<ToneEntry, "lightness" | "chroma" | "hue" | "hex" | "alphaMode">>;
      };
    }
  | {
      type: "UPDATE_TONE_BULK_DRAG";
      payload: {
        toneValue: number;
        patch: Partial<Pick<ToneEntry, "lightness" | "chroma" | "hue" | "hex" | "alphaMode">>;
      };
    }
  | { type: "SET_GAMUT"; payload: Gamut }
  | { type: "SET_APP_BG_LIGHTNESS"; payload: { lightness: number } }
  | { type: "SET_TOKEN_OVERRIDE"; payload: { tokenName: string; value: string | null } }
  | { type: "SET_PANE_BACKGROUND_REF"; payload: { ref: string } };
`;export{e as default};