import { LfArrowLeft, LfClock, LfDocumentList, LfSend, LfTrash } from "@legalforce/aegis-icons";
import {
  Link as AegisLink,
  Banner,
  BottomNavigation,
  BottomNavigationItem,
  BottomNavigationLink,
  Button,
  Divider,
  FormControl,
  Icon,
  IconButton,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  Select,
  Text,
  Textarea,
  TimeField,
  Tooltip,
} from "@legalforce/aegis-react";
import { Link } from "react-router-dom";
import styles from "./index.module.css";

const timeFields = [
  { label: "出勤", deletable: false },
  { label: "休憩開始", deletable: false },
  { label: "休憩終了", deletable: false },
  { label: "休憩開始２", deletable: true },
  { label: "休憩終了２", deletable: true },
  { label: "退勤", deletable: false },
];

const locationOptions = [{ label: "場所を選択", value: "" }];

function EditAttendanceScreen() {
  return (
    <div className={styles.screen}>
      {/* Header */}
      <div className={styles.header}>
        <Tooltip title="戻る">
          <IconButton aria-label="戻る" variant="plain" size="small">
            <Icon>
              <LfArrowLeft />
            </Icon>
          </IconButton>
        </Tooltip>
        <Text variant="title.xSmall">勤怠編集　2026/2/9 (月)</Text>
      </div>

      {/* Content */}
      <div className={styles.content}>
        <Banner color="danger" closeButton={false}>
          入力エラーがあります。
        </Banner>

        {/* Time Fields */}
        <div className={styles.timeFields}>
          {timeFields.map((field, index) => (
            <div key={field.label}>
              {index > 0 && <Divider className={styles.divider} />}
              <div className={styles.timeFieldRow}>
                <div className={styles.timeFieldLabel}>
                  <Text variant="body.semiSmall">{field.label}</Text>
                  {field.deletable && (
                    <Tooltip title="削除">
                      <IconButton aria-label={`${field.label}を削除`} variant="plain" size="small">
                        <Icon>
                          <LfTrash />
                        </Icon>
                      </IconButton>
                    </Tooltip>
                  )}
                </div>
                <FormControl error>
                  <TimeField />
                  <FormControl.Caption>選択してください。</FormControl.Caption>
                </FormControl>
              </div>
            </div>
          ))}
        </div>

        {/* Add Break */}
        <div className={styles.addBreakButton}>
          <Button variant="plain" leading={<Text>＋</Text>}>
            休憩を追加
          </Button>
        </div>

        {/* Location Select */}
        <FormControl error>
          <Select options={locationOptions} placeholder="場所を選択" />
          <FormControl.Caption>選択してください。</FormControl.Caption>
        </FormControl>

        {/* Textarea */}
        <FormControl error>
          <Textarea
            defaultValue="TextAreaTextAreaTextAreaTextAreaTextAreaTextAreaTextAreaTextAreaTextAreaTextAreaTextAreaTextAreaTextAreaTextAreaTextAreaTextAreaTextAreaTextAreaTextAreaTextAreaTextAreaTextAreaTextArea"
            minRows={4}
            aria-label="備考"
          />
          <FormControl.Caption>200文字以下にしてください。</FormControl.Caption>
        </FormControl>

        {/* Action Buttons */}
        <div className={styles.actionButtons}>
          <Button width="full">保存</Button>
          <Button variant="plain" width="full">
            キャンセル
          </Button>
          <Button variant="gutterless" color="danger">
            リセット
          </Button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation>
        <BottomNavigationItem>
          <BottomNavigationLink
            icon={
              <Icon>
                <LfClock />
              </Icon>
            }
            aria-current="page"
          >
            勤怠打刻
          </BottomNavigationLink>
        </BottomNavigationItem>
        <BottomNavigationItem>
          <BottomNavigationLink
            icon={
              <Icon>
                <LfDocumentList />
              </Icon>
            }
          >
            勤怠表
          </BottomNavigationLink>
        </BottomNavigationItem>
        <BottomNavigationItem>
          <BottomNavigationLink
            icon={
              <Icon>
                <LfSend />
              </Icon>
            }
          >
            勤怠申請
          </BottomNavigationLink>
        </BottomNavigationItem>
      </BottomNavigation>
    </div>
  );
}

export function EditAttendancePage() {
  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutBody>
          <div className={styles.pageWrapper}>
            <div className={styles.mobileFrame}>
              <EditAttendanceScreen />
            </div>

            <AegisLink asChild>
              <Link to="/sandbox/workon/wataryooou/mobile">Back to mobile</Link>
            </AegisLink>
          </div>
        </PageLayoutBody>
      </PageLayoutContent>
    </PageLayout>
  );
}
