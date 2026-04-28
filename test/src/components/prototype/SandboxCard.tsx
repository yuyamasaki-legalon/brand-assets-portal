import { Badge, Card, CardBody, CardHeader, CardLink, Text } from "@legalforce/aegis-react";
import { Link } from "react-router-dom";
import { getSandboxDocStatus } from "../../hooks/useSandboxDocStatus";

interface SandboxCardProps {
  /** Route path (e.g., "/sandbox/loc/wataryooou") */
  to: string;
  /** Card title */
  title: string;
  /** Card description */
  description: string;
}

/**
 * Enhanced sandbox card with doc status badges (PRD / SPEC).
 * Automatically detects whether the sandbox page has PRD and SPEC files.
 */
export function SandboxCard({ to, title, description }: SandboxCardProps) {
  const { hasPrd, hasSpec } = getSandboxDocStatus(to);

  return (
    <Card>
      <CardHeader>
        <CardLink asChild>
          <Link to={to}>
            <Text variant="title.xSmall">{title}</Text>
          </Link>
        </CardLink>
      </CardHeader>
      <CardBody>
        <Text variant="body.small">{description}</Text>
        {(hasPrd || hasSpec) && (
          <div
            style={{
              display: "flex",
              gap: "var(--aegis-space-xxSmall)",
              marginTop: "var(--aegis-space-xSmall)",
            }}
          >
            {hasPrd && <Badge color="information">PRD</Badge>}
            {hasSpec && <Badge color="success">SPEC</Badge>}
          </div>
        )}
      </CardBody>
    </Card>
  );
}
