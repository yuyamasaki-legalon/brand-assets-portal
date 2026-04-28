import { Card, CardBody, CardHeader, Table, TableContainer, Text } from "@legalforce/aegis-react";

interface BlockTableProps {
  title: string;
  trailing?: React.ReactNode;
  children: React.ReactNode;
}

export function BlockTable({ title, trailing, children }: BlockTableProps) {
  return (
    <Card variant="fill">
      <CardHeader trailing={trailing}>
        <Text variant="title.small" color="bold">
          {title}
        </Text>
      </CardHeader>
      <CardBody>
        <TableContainer>
          <Table>
            <Table.Body>{children}</Table.Body>
          </Table>
        </TableContainer>
      </CardBody>
    </Card>
  );
}
