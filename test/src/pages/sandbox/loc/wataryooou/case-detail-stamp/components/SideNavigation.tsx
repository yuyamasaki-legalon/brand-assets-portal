import { LfBook, LfFile, LfInformationCircle, LfLightBulb, LfLink } from "@legalforce/aegis-icons";
import { SideNavigation as AegisSideNavigation, PageLayoutSidebar } from "@legalforce/aegis-react";
import type { PaneType } from "../types";

interface SideNavigationProps {
  paneOpen: boolean;
  paneType: PaneType;
  onSelectPane: (pane: PaneType) => void;
}

export function SideNavigation({ paneOpen, paneType, onSelectPane }: SideNavigationProps) {
  return (
    <PageLayoutSidebar position="end">
      <AegisSideNavigation>
        <AegisSideNavigation.Group>
          <AegisSideNavigation.Item
            icon={LfInformationCircle}
            onClick={() => onSelectPane("case-info")}
            aria-current={paneOpen && paneType === "case-info" ? true : undefined}
          >
            案件情報
          </AegisSideNavigation.Item>
          <AegisSideNavigation.Item
            icon={LfFile}
            onClick={() => onSelectPane("linked-file")}
            aria-current={paneOpen && paneType === "linked-file" ? true : undefined}
          >
            リンク済みファイル
          </AegisSideNavigation.Item>
          <AegisSideNavigation.Item icon={LfLink}>関連案件</AegisSideNavigation.Item>
          <AegisSideNavigation.Item icon={LfBook}>参考情報</AegisSideNavigation.Item>
          <AegisSideNavigation.Item icon={LfLightBulb}>AIサマリー</AegisSideNavigation.Item>
        </AegisSideNavigation.Group>
      </AegisSideNavigation>
    </PageLayoutSidebar>
  );
}
