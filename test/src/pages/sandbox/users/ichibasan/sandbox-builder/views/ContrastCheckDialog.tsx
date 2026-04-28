import {
  Button,
  ContentHeader,
  ContentHeaderTitle,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@legalforce/aegis-react";
import type {
  ComponentOverrides,
  DesignTokenOverrideCategory,
  DesignTokenOverrides,
} from "../token-overrides/design-token-overrides";
import { ContrastCheckView } from "./ContrastCheckView";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  overrides: DesignTokenOverrides;
  componentOverrides?: ComponentOverrides;
  newTokenRefs?: Record<DesignTokenOverrideCategory, Record<string, string>>;
}

export const ContrastCheckDialog = ({ open, onOpenChange, overrides, componentOverrides, newTokenRefs }: Props) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        width="full"
        style={{
          height: "80vh",
          maxHeight: "calc(100vh - 32px)",
          display: "grid",
          gridTemplateRows: "auto minmax(0, 1fr) auto",
        }}
      >
        <DialogHeader>
          <ContentHeader>
            <ContentHeaderTitle>Contrast Check</ContentHeaderTitle>
          </ContentHeader>
        </DialogHeader>
        <div
          style={{
            minHeight: 0,
            minWidth: 0,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            gap: "var(--aegis-space-large)",
            paddingBlock: "var(--aegis-space-xSmall)",
            paddingInline: "var(--aegis-space-xLarge)",
          }}
        >
          {open ? (
            <ContrastCheckView
              overrides={overrides}
              componentOverrides={componentOverrides}
              newTokenRefs={newTokenRefs}
            />
          ) : null}
        </div>
        <DialogFooter>
          <Button variant="plain" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
