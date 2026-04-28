import { LfArrowRightArrowLeft } from "@legalforce/aegis-icons";
import { Button, Divider, Form, FormControl, Popover, Select, Text, Toolbar, Tooltip } from "@legalforce/aegis-react";
import { useState } from "react";
import { MOCK_CATEGORIES, MOCK_GOVERNING_LAWS, MOCK_LANGUAGES, MOCK_POSITIONS } from "../mock/data";

export const RulesCondition = () => {
  const [language, setLanguage] = useState("ja");
  const [category, setCategory] = useState("nda");
  const [position, setPosition] = useState("recipient");
  const [governingLaw, setGoverningLaw] = useState("japan");

  const conditionLabel = `${MOCK_LANGUAGES.find((l) => l.value === language)?.label} / ${MOCK_CATEGORIES.find((c) => c.value === category)?.label} / ${MOCK_POSITIONS.find((p) => p.value === position)?.label}`;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--aegis-space-small)",
      }}
    >
      <Toolbar>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Tooltip title={conditionLabel} placement="bottom">
            <Text variant="label.medium.bold" numberOfLines={1}>
              {conditionLabel}
            </Text>
          </Tooltip>
          <Popover placement="bottom-end">
            <Popover.Anchor>
              <Button size="small" variant="plain" leading={LfArrowRightArrowLeft}>
                表示を切り替え
              </Button>
            </Popover.Anchor>
            <Popover.Content>
              <Popover.Header />
              <Popover.Body>
                <Form>
                  <FormControl>
                    <FormControl.Label>言語</FormControl.Label>
                    <Select
                      value={language}
                      options={MOCK_LANGUAGES.map((l) => ({ value: l.value, label: l.label }))}
                      onChange={setLanguage}
                    />
                  </FormControl>
                  <FormControl>
                    <FormControl.Label>契約タイプ</FormControl.Label>
                    <Select
                      value={category}
                      options={MOCK_CATEGORIES.map((c) => ({ value: c.value, label: c.label }))}
                      onChange={setCategory}
                    />
                  </FormControl>
                  <FormControl>
                    <FormControl.Label>立場</FormControl.Label>
                    <Select
                      value={position}
                      options={MOCK_POSITIONS.map((p) => ({ value: p.value, label: p.label }))}
                      onChange={setPosition}
                    />
                  </FormControl>
                  <FormControl>
                    <FormControl.Label>準拠法</FormControl.Label>
                    <Select
                      value={governingLaw}
                      options={MOCK_GOVERNING_LAWS.map((g) => ({ value: g.value, label: g.label }))}
                      onChange={setGoverningLaw}
                    />
                  </FormControl>
                </Form>
              </Popover.Body>
            </Popover.Content>
          </Popover>
        </div>
      </Toolbar>
      <Divider />
    </div>
  );
};
