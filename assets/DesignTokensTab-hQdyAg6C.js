var e=`import { Button, Code, SegmentedControl, Table, TableContainer } from "@legalforce/aegis-react";
import type { ChangeEvent } from "react";
import { useMemo, useRef, useState } from "react";

import { TOKEN_REFS } from "../../color/contrast";
import type { DesignTokenOverrideCategory } from "../../color/contrast/specs";
import type { TokenData } from "../../utils/parseAegisV2Css";
import { parseAegisV2TokenRefs } from "../../utils/parseAegisV2Css";

type Props = {
  v3Data: TokenData | null;
  onV3Upload: (data: TokenData) => void;
};

const SEGMENTS = ["All", "Background", "Foreground", "Border"] as const;
const CATEGORIES: DesignTokenOverrideCategory[] = ["background", "foreground", "border"];

const COL_WIDTH = "25%";

const DiffCell = ({ value, hasDiff }: { value: string; hasDiff: boolean }) => {
  if (!hasDiff) return <>{value}</>;
  return <Code>{value === "—" ? "--" : value}</Code>;
};

export const DesignTokensTab = ({ v3Data, onV3Upload }: Props) => {
  const [segmentIndex, setSegmentIndex] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const v2Data = useMemo(() => parseAegisV2TokenRefs(), []);

  const activeCategories = useMemo<DesignTokenOverrideCategory[]>(
    () => (segmentIndex === 0 ? CATEGORIES : [CATEGORIES[segmentIndex - 1]]),
    [segmentIndex],
  );

  const rows = useMemo(() => {
    return activeCategories.flatMap((category) => {
      const seen = new Set<string>();
      const keys: string[] = [];
      for (const k of Object.keys(TOKEN_REFS[category] ?? {})) {
        if (!seen.has(k)) {
          seen.add(k);
          keys.push(k);
        }
      }
      for (const k of Object.keys(v2Data[category] ?? {})) {
        if (!seen.has(k)) {
          seen.add(k);
          keys.push(k);
        }
      }
      if (v3Data) {
        for (const k of Object.keys(v3Data[category] ?? {})) {
          if (!seen.has(k)) {
            seen.add(k);
            keys.push(k);
          }
        }
      }
      return keys.map((key) => {
        const v2 = v2Data[category]?.[key] ?? "—";
        const v3 = v3Data?.[category]?.[key] ?? "—";
        const pl = (TOKEN_REFS[category] as Record<string, string>)[key] ?? "—";
        // v2 as baseline: highlight v3/PL cells that deviate from v2
        const v3Diff = v3Data !== null && v3 !== v2;
        const plDiff = pl !== v2;
        return { category, key, v2, v3, pl, v3Diff, plDiff };
      });
    });
  }, [activeCategories, v2Data, v3Data]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target?.result as string) as TokenData;
        onV3Upload(parsed);
      } catch {
        // ignore invalid JSON
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const showCategoryPrefix = segmentIndex === 0;

  return (
    <div
      style={{
        display: "grid",
        gap: "var(--aegis-space-small)",
        gridTemplateRows: "auto minmax(0, 1fr)",
        height: "100%",
        minHeight: 0,
      }}
    >
      <div
        style={{
          alignItems: "center",
          display: "flex",
          gap: "var(--aegis-space-medium)",
          justifyContent: "space-between",
        }}
      >
        <SegmentedControl index={segmentIndex} onChange={setSegmentIndex}>
          {SEGMENTS.map((label) => (
            <SegmentedControl.Button key={label}>{label}</SegmentedControl.Button>
          ))}
        </SegmentedControl>
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          <Button
            variant={v3Data ? "subtle" : "solid"}
            color="neutral"
            size="medium"
            onClick={() => fileInputRef.current?.click()}
          >
            {v3Data ? "Update v3 JSON" : "Upload v3 Figma JSON"}
          </Button>
        </div>
      </div>
      <div style={{ minHeight: 0, overflow: "auto" }}>
        <TableContainer>
          <Table size="small">
            <Table.Head>
              <Table.Row>
                <Table.Cell style={{ width: COL_WIDTH }}>Token</Table.Cell>
                <Table.Cell style={{ width: COL_WIDTH }}>Aegis v2</Table.Cell>
                <Table.Cell style={{ width: COL_WIDTH }}>Aegis v3 (figma)</Table.Cell>
                <Table.Cell style={{ width: COL_WIDTH }}>Palette Lab</Table.Cell>
              </Table.Row>
            </Table.Head>
            <Table.Body>
              {rows.map(({ category, key, v2, v3, pl, v3Diff, plDiff }) => (
                <Table.Row key={\`\${category}-\${key}\`}>
                  <Table.Cell>{showCategoryPrefix ? \`\${category}.\${key}\` : key}</Table.Cell>
                  <Table.Cell>{v2}</Table.Cell>
                  <Table.Cell>
                    <DiffCell value={v3} hasDiff={v3Diff} />
                  </Table.Cell>
                  <Table.Cell>
                    <DiffCell value={pl} hasDiff={plDiff} />
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};
`;export{e as default};