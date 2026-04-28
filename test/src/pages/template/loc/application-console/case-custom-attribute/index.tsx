import { LfArrowUpRightFromSquare, LfEllipsisDot, LfPlusLarge, LfQuestionCircle } from "@legalforce/aegis-icons";
import {
  Accordion,
  ActionList,
  ActionListGroup,
  Button,
  Draggable,
  Icon,
  IconButton,
  Link,
  Menu,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  PageLayoutPane,
  Tag,
  Text,
  Tooltip,
} from "@legalforce/aegis-react";
import { useCallback, useState } from "react";
import { LocSidebarLayout } from "../../_shared";
import { Navigation, NavigationHeader } from "../_shared";

// サンプルデータ
type AttributeKind = "singleSelection" | "multipleSelection" | "singleLineText" | "number" | "date";

type AttributeOption = {
  id: string;
  name: string;
};

type CustomAttribute = {
  id: string;
  name: string;
  kind: AttributeKind;
  options: AttributeOption[];
  usedInCase: boolean;
  usedInCaseReceptionForm: boolean;
};

const kindLabels: Record<AttributeKind, string> = {
  singleSelection: "単一選択",
  multipleSelection: "複数選択",
  singleLineText: "テキスト（1行）",
  number: "数値",
  date: "日付",
};

const MAX_CUSTOM_ATTRIBUTES = 50;

const initialAttributes: CustomAttribute[] = [
  {
    id: "1",
    name: "案件の難易度",
    kind: "singleSelection",
    options: [
      { id: "o1", name: "高" },
      { id: "o2", name: "中" },
      { id: "o3", name: "低" },
    ],
    usedInCase: true,
    usedInCaseReceptionForm: true,
  },
  {
    id: "2",
    name: "緊急度",
    kind: "singleSelection",
    options: [
      { id: "o4", name: "緊急" },
      { id: "o5", name: "通常" },
    ],
    usedInCase: true,
    usedInCaseReceptionForm: false,
  },
  {
    id: "3",
    name: "担当部署メモ",
    kind: "singleLineText",
    options: [],
    usedInCase: false,
    usedInCaseReceptionForm: false,
  },
  {
    id: "4",
    name: "想定金額",
    kind: "number",
    options: [],
    usedInCase: false,
    usedInCaseReceptionForm: true,
  },
  {
    id: "5",
    name: "期限日",
    kind: "date",
    options: [],
    usedInCase: false,
    usedInCaseReceptionForm: false,
  },
];

// 使用中タグ
const InUseTag = ({
  usedInCase,
  usedInCaseReceptionForm,
}: {
  usedInCase: boolean;
  usedInCaseReceptionForm: boolean;
}) => {
  if (!usedInCase && !usedInCaseReceptionForm) return null;

  const message =
    usedInCase && usedInCaseReceptionForm
      ? "案件及び案件受付フォームで使用中"
      : usedInCase
        ? "案件で使用中"
        : "案件受付フォームで使用中";

  return (
    <Tag variant="fill" size="small">
      {message}
    </Tag>
  );
};

// 属性アイテム
const AttributeItem = ({ attribute }: { attribute: CustomAttribute }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--aegis-space-xSmall)",
        paddingBlock: "var(--aegis-space-xSmall)",
        paddingInlineStart: "var(--aegis-space-xSmall)",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "var(--aegis-space-medium)",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--aegis-space-x3Small)",
          }}
        >
          <Text variant="title.xSmall" as="h2">
            {attribute.name}
          </Text>
          <Text variant="caption.small" as="p" color="subtle">
            {kindLabels[attribute.kind]}
          </Text>
        </div>
        <div
          style={{
            display: "flex",
            gap: "var(--aegis-space-xxSmall)",
            alignItems: "center",
          }}
        >
          <InUseTag usedInCase={attribute.usedInCase} usedInCaseReceptionForm={attribute.usedInCaseReceptionForm} />
          <Menu placement="bottom-end">
            <Menu.Anchor>
              <Tooltip title="オプション">
                <IconButton variant="plain" aria-label="オプション" size="small">
                  <Icon>
                    <LfEllipsisDot />
                  </Icon>
                </IconButton>
              </Tooltip>
            </Menu.Anchor>
            <Menu.Box width="xSmall">
              <ActionList size="medium">
                <ActionListGroup>
                  <ActionList.Item>
                    <ActionList.Body>編集</ActionList.Body>
                  </ActionList.Item>
                </ActionListGroup>
                <ActionListGroup>
                  <ActionList.Item color="danger">
                    <ActionList.Body>削除</ActionList.Body>
                  </ActionList.Item>
                </ActionListGroup>
              </ActionList>
            </Menu.Box>
          </Menu>
        </div>
      </div>
      {attribute.options.length > 0 && (
        <Accordion>
          <Accordion.Item>
            <Accordion.Button>
              <Text variant="component.medium.bold">選択肢を表示</Text>
            </Accordion.Button>
            <Accordion.Panel>
              <ol
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--aegis-space-xxSmall)",
                  paddingBlock: "var(--aegis-space-xSmall)",
                  listStyle: "none",
                }}
              >
                {attribute.options.map((option) => (
                  <li key={option.id}>
                    <Text variant="body.medium">{option.name}</Text>
                  </li>
                ))}
              </ol>
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      )}
    </div>
  );
};

const CaseCustomAttributeTemplate = () => {
  const [attributes, setAttributes] = useState<CustomAttribute[]>(initialAttributes);

  const handleReorder = useCallback((newAttributes: CustomAttribute[]) => {
    setAttributes(newAttributes);
  }, []);

  const canAdd = attributes.length < MAX_CUSTOM_ATTRIBUTES;

  return (
    <LocSidebarLayout activeId="cases">
      <PageLayout>
        <PageLayoutPane>
          <PageLayoutHeader>
            <NavigationHeader />
          </PageLayoutHeader>
          <PageLayoutBody>
            <Navigation currentPage="case-custom-attribute" />
          </PageLayoutBody>
        </PageLayoutPane>
        <PageLayoutContent align="start" maxWidth="medium">
          <PageLayoutHeader>
            <Text as="h1" variant="title.large">
              案件カスタム項目
            </Text>
          </PageLayoutHeader>
          <PageLayoutBody>
            {/* リードテキスト */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--aegis-space-xSmall)",
              }}
            >
              <Text as="p" variant="body.medium" whiteSpace="pre-wrap">
                {`案件に登録する項目を${MAX_CUSTOM_ATTRIBUTES}個まで追加できます。（例：案件の難易度、緊急度）\n登録した項目は案件受付フォームでも使用でき、案件情報に自動で連携されます。`}
              </Text>
              <div>
                <Link
                  href="#"
                  leading={LfQuestionCircle}
                  trailing={LfArrowUpRightFromSquare}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  案件カスタム項目の設定
                </Link>
              </div>
            </div>

            {/* コンテンツ */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--aegis-space-large)",
                paddingBlockStart: "var(--aegis-space-large)",
              }}
            >
              <div>
                <Button color="neutral" leading={LfPlusLarge} variant="solid" disabled={!canAdd}>
                  案件カスタム項目を追加
                </Button>
              </div>
              <Draggable onReorder={handleReorder} values={attributes} bordered getId={(attr) => attr.id}>
                {attributes.map((attribute) => (
                  <Draggable.Item key={attribute.id} id={attribute.id}>
                    <AttributeItem attribute={attribute} />
                  </Draggable.Item>
                ))}
              </Draggable>
            </div>
          </PageLayoutBody>
        </PageLayoutContent>
      </PageLayout>
    </LocSidebarLayout>
  );
};

export default CaseCustomAttributeTemplate;
