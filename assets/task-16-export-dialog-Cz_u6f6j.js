var e=`# Task 16 — Export Dialog: Unified Base/Primary export

## Objective

Replace ExportButton (direct download) with a dialog-based export. Single Dialog with Base/Primary tabs inside. Base tab: palette.json download. Primary tab: palette.tokens.js download.

## Files to Create/Modify

- \`components/ExportDialog/index.tsx\` — NEW: Dialog with Base/Primary tabs
- \`components/ExportButton/index.tsx\` — replace with dialog trigger + ExportDialog

## ExportButton (new)

\`\`\`tsx
export const ExportButton = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="subtle" onClick={() => setOpen(true)}>Export</Button>
      <ExportDialog open={open} onOpenChange={setOpen} />
    </>
  );
};
\`\`\`

## ExportDialog structure

\`\`\`tsx
<Dialog open={open} onOpenChange={onOpenChange}>
  <DialogContent width="small">
    <DialogHeader>
      <ContentHeader><ContentHeader.Title>エクスポート</ContentHeader.Title></ContentHeader>
    </DialogHeader>
    <DialogBody>
      <Tabs defaultValue="base">
        <TabList>
          <Tab value="base">Base</Tab>
          <Tab value="primary">Primary</Tab>
        </TabList>
        <TabPanels>
          <TabPanel value="base">
            // description + "palette.json をダウンロード" Button
          </TabPanel>
          <TabPanel value="primary">
            // description + "palette.tokens.js をダウンロード" Button
          </TabPanel>
        </TabPanels>
      </Tabs>
    </DialogBody>
    <DialogFooter>
      <ButtonGroup>
        <Button variant="plain" onClick={() => onOpenChange(false)}>キャンセル</Button>
      </ButtonGroup>
    </DialogFooter>
  </DialogContent>
</Dialog>
\`\`\`

Download logic: create Blob → URL.createObjectURL → anchor click → URL.revokeObjectURL → close dialog.
Disable download buttons when activeProject is null.

## Acceptance Criteria

- Export button opens dialog (not direct download)
- Base tab downloads palette.json and closes dialog
- Primary tab downloads palette.tokens.js and closes dialog
- キャンセル closes without download
- Download buttons disabled when no active project
- pnpm build passes
`;export{e as default};