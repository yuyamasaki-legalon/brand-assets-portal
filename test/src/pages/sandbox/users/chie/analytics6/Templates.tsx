import { LfCloseLarge, LfCopy, LfDownload, LfFilter } from "@legalforce/aegis-icons";
import {
  Link as AegisLink,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardHeader,
  ContentHeader,
  DataTable,
  type DataTableColumnDef,
  Icon,
  IconButton,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutFooter,
  PageLayoutHeader,
  PageLayoutPane,
  Tab,
} from "@legalforce/aegis-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Placeholder } from "../../../../../components/Placeholder";

type SampleRow = {
  id: string;
  name: string;
  role: string;
  status: string;
};

const sampleData: SampleRow[] = [
  { id: "1", name: "John Doe", role: "Developer", status: "Active" },
  { id: "2", name: "Jane Smith", role: "Designer", status: "Active" },
  { id: "3", name: "Peter Jones", role: "Manager", status: "Inactive" },
  { id: "4", name: "Mary Williams", role: "QA", status: "Active" },
];

const chartData = [
  { name: "Page A", uv: 4000, pv: 2400, amt: 2400 },
  { name: "Page B", uv: 3000, pv: 1398, amt: 2210 },
  { name: "Page C", uv: 2000, pv: 9800, amt: 2290 },
  { name: "Page D", uv: 2780, pv: 3908, amt: 2000 },
  { name: "Page E", uv: 1890, pv: 4800, amt: 2181 },
  { name: "Page F", uv: 2390, pv: 3800, amt: 2500 },
  { name: "Page G", uv: 3490, pv: 4300, amt: 2100 },
];

const columns: DataTableColumnDef<SampleRow, string>[] = [
  {
    id: "name",
    name: "Name",
    getValue: (row) => row.name,
  },
  {
    id: "role",
    name: "Role",
    getValue: (row) => row.role,
  },
  {
    id: "status",
    name: "Status",
    getValue: (row) => row.status,
  },
];

export default function Templates() {
  const [paneOpen, setPaneOpen] = useState(false);

  return (
    <>
      <PageLayoutContent minWidth="medium">
        <PageLayoutHeader>
          <ContentHeader
            trailing={
              <Button
                leading={
                  <Icon>
                    <LfFilter />
                  </Icon>
                }
                size="medium"
                onClick={() => setPaneOpen(!paneOpen)}
              >
                開く
              </Button>
            }
          >
            <ContentHeader.Title>テンプレート</ContentHeader.Title>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "var(--aegis-space-large)",
            }}
          >
            <Card variant="outline" style={{ flex: "1 0 100%" }}>
              <CardHeader
                trailing={
                  <ButtonGroup>
                    <IconButton aria-label="Copy" size="small">
                      <Icon>
                        <LfCopy />
                      </Icon>
                    </IconButton>
                    <IconButton aria-label="Download" size="small">
                      <Icon>
                        <LfDownload />
                      </Icon>
                    </IconButton>
                  </ButtonGroup>
                }
              >
                <ContentHeader.Title>Full-width Card with DataTable</ContentHeader.Title>
              </CardHeader>
              <CardBody>
                <DataTable columns={columns} rows={sampleData} />
              </CardBody>
            </Card>
            <Card variant="outline" style={{ flex: "1 1 calc(50% - var(--aegis-space-large) / 2)" }}>
              <CardHeader
                trailing={
                  <ButtonGroup>
                    <IconButton aria-label="Copy" size="small">
                      <Icon>
                        <LfCopy />
                      </Icon>
                    </IconButton>
                    <IconButton aria-label="Download" size="small">
                      <Icon>
                        <LfDownload />
                      </Icon>
                    </IconButton>
                  </ButtonGroup>
                }
              >
                <ContentHeader.Title>Half-width Card</ContentHeader.Title>
              </CardHeader>
              <CardBody>
                <Placeholder>Half-width content</Placeholder>
              </CardBody>
            </Card>
            <Card variant="outline" style={{ flex: "1 1 calc(50% - var(--aegis-space-large) / 2)" }}>
              <CardHeader
                trailing={
                  <ButtonGroup>
                    <IconButton aria-label="Copy" size="small">
                      <Icon>
                        <LfCopy />
                      </Icon>
                    </IconButton>
                    <IconButton aria-label="Download" size="small">
                      <Icon>
                        <LfDownload />
                      </Icon>
                    </IconButton>
                  </ButtonGroup>
                }
              >
                <ContentHeader.Title>Half-width Card</ContentHeader.Title>
              </CardHeader>
              <CardBody>
                <Placeholder>Half-width content</Placeholder>
              </CardBody>
            </Card>
            <Card variant="outline" style={{ flex: "1 0 100%" }}>
              <CardHeader
                trailing={
                  <ButtonGroup>
                    <IconButton aria-label="Copy" size="small">
                      <Icon>
                        <LfCopy />
                      </Icon>
                    </IconButton>
                    <IconButton aria-label="Download" size="small">
                      <Icon>
                        <LfDownload />
                      </Icon>
                    </IconButton>
                  </ButtonGroup>
                }
              >
                <ContentHeader.Title>Another Full-width Card with Chart</ContentHeader.Title>
              </CardHeader>
              <CardBody>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="pv" fill="#8884d8" />
                    <Bar dataKey="uv" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardBody>
            </Card>
          </div>
        </PageLayoutBody>
        <PageLayoutFooter>
          <AegisLink asChild>
            <Link to="/sandbox">← Back to Sandbox</Link>
          </AegisLink>
        </PageLayoutFooter>
      </PageLayoutContent>
      <PageLayoutPane position="end" aria-label="End Pane" open={paneOpen} resizable>
        <PageLayoutHeader>
          <ContentHeader
            size="medium"
            trailing={
              <IconButton aria-label="閉じる" onClick={() => setPaneOpen(false)}>
                <Icon>
                  <LfCloseLarge />
                </Icon>
              </IconButton>
            }
          >
            <ContentHeader.Title>フィルター</ContentHeader.Title>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <Tab.Group size="small">
            <Tab.List>
              <Tab>Tab A</Tab>
              <Tab>Tab B</Tab>
              <Tab>Tab C</Tab>
            </Tab.List>
            <Tab.Panels>
              <Tab.Panel>
                <Placeholder>Panel A</Placeholder>
              </Tab.Panel>
              <Tab.Panel>
                <Placeholder>Panel B</Placeholder>
              </Tab.Panel>
              <Tab.Panel>
                <Placeholder>Panel C</Placeholder>
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </PageLayoutBody>
      </PageLayoutPane>
    </>
  );
}
