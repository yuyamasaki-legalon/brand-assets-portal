import { LfArrowsRotate, LfClock, LfDocumentList, LfEllipsisDot, LfSend } from "@legalforce/aegis-icons";
import { LegalOnLogoSymbolLight } from "@legalforce/aegis-logos/react";
import {
  Link as AegisLink,
  BottomNavigation,
  BottomNavigationItem,
  BottomNavigationLink,
  Button,
  DescriptionList,
  DescriptionListDetail,
  DescriptionListItem,
  DescriptionListTerm,
  Icon,
  IconButton,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  StatusLabel,
  Text,
  Tooltip,
} from "@legalforce/aegis-react";
import { Link } from "react-router-dom";
import styles from "./index.module.css";

const timeRecords = [
  { label: "出勤", time: "10 : 00" },
  { label: "休憩開始", time: "13 : 00" },
  { label: "休憩終了", time: "14 : 00" },
];

function AttendanceScreen() {
  return (
    <div className={styles.screen}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <Text variant="title.xSmall">勤怠打刻</Text>
        </div>
        <Tooltip title="メニュー">
          <IconButton aria-label="メニュー" variant="plain" size="small">
            <Icon>
              <LfEllipsisDot />
            </Icon>
          </IconButton>
        </Tooltip>
      </div>

      {/* Content */}
      <div className={styles.content}>
        {/* Refresh + Status */}
        <div className={styles.statusRow}>
          <Button
            variant="plain"
            size="small"
            leading={
              <Icon>
                <LfArrowsRotate />
              </Icon>
            }
          >
            最新状態に更新
          </Button>
          <StatusLabel color="lime">勤務中</StatusLabel>
        </div>

        {/* Logo + Date + Time */}
        <div className={styles.logoSection}>
          <div className={styles.logo}>
            <LegalOnLogoSymbolLight />
          </div>
          <div className={styles.dateTimeGroup}>
            <Text variant="body.semiSmall.bold">2026/2/9 (月)</Text>
            {/* data.large が存在しないため data.medium + fontSize override */}
            <Text variant="data.medium" className={styles.time}>
              XX : 00
            </Text>
          </div>
        </div>

        {/* Time Records */}
        <DescriptionList size="small" bordered className={styles.descriptionList}>
          {timeRecords.map((record) => (
            <DescriptionListItem key={record.label} orientation="horizontal">
              <DescriptionListTerm>{record.label}</DescriptionListTerm>
              <DescriptionListDetail>{record.time}</DescriptionListDetail>
            </DescriptionListItem>
          ))}
        </DescriptionList>

        {/* Action Buttons */}
        <div className={styles.actionButtons}>
          <Button width="full">退勤</Button>
          <Button width="full" variant="subtle">
            休憩開始
          </Button>
        </div>

        <div className={styles.editLink}>
          <Button variant="plain" weight="normal">
            勤怠を編集
          </Button>
        </div>
      </div>

      {/* Bottom Tab Navigation */}
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

export function AttendancePage() {
  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutBody>
          <div className={styles.pageWrapper}>
            <div className={styles.mobileFrame}>
              <AttendanceScreen />
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
