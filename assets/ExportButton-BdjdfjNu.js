var e=`import { LfDownload } from "@legalforce/aegis-icons";
import { Button } from "@legalforce/aegis-react";
import { useState } from "react";

import { ExportDialog } from "../ExportDialog";

type ExportButtonProps = {
  tokenOverrides: Record<string, string>;
};

export const ExportButton = ({ tokenOverrides }: ExportButtonProps) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button leading={LfDownload} onClick={() => setOpen(true)} variant="subtle">
        Download
      </Button>
      <ExportDialog onOpenChange={setOpen} open={open} tokenOverrides={tokenOverrides} />
    </>
  );
};
`;export{e as default};