import { Toolbar } from "@legalforce/aegis-react";
import type React from "react";
import { AddContentPopover } from "./AddContentView/AddContentPopover";
import type { ComponentKey } from "./AddContentView/types";
import styles from "./ContentAreaEditZone.module.css";

interface Props {
  children: React.ReactNode;
  active: boolean;
  onAdd: (component: ComponentKey) => void;
}

export const ContentAreaEditZone = ({ children, active, onAdd }: Props): React.ReactElement => {
  if (!active) {
    return <>{children}</>;
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.frame}>
        {children}
        <div className={styles.toolbar}>
          <Toolbar>
            <AddContentPopover
              onAdd={onAdd}
              area="contentBody"
              items={[]}
              onRemove={() => undefined}
              onReorder={() => undefined}
              onUpdate={() => undefined}
              variant="solid"
              size="xSmall"
            />
          </Toolbar>
        </div>
      </div>
    </div>
  );
};
