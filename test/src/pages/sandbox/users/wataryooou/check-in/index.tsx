import { LfEllipsisDot, LfHome, LfMagnifyingGlass, LfMegaphone, LfSetting, LfShare } from "@legalforce/aegis-icons";
import {
  Button,
  ButtonGroup,
  Combobox,
  ContentHeader,
  Form,
  FormControl,
  Header,
  Icon,
  IconButton,
  Menu,
  MenuContent,
  MenuItem,
  MenuTrigger,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  Radio,
  RadioGroup,
  Select,
  snackbar,
  Text,
  TextField,
  TimeField,
} from "@legalforce/aegis-react";
import styles from "./index.module.css";

const officeOptions = [
  { label: "Tokyo Office", value: "tokyo" },
  { label: "Osaka Office", value: "osaka" },
  { label: "Fukuoka Office", value: "fukuoka" },
];

const deskOptions = [
  { label: "5F Focus Area", value: "5f-focus-area" },
  { label: "5F Window Seats", value: "5f-window-seats" },
  { label: "6F Meeting Lounge", value: "6f-meeting-lounge" },
  { label: "6F Quiet Area", value: "6f-quiet-area" },
];

export default function CheckInPage() {
  return (
    <div className={styles.screen}>
      <div className={styles.frame}>
        <Header bordered>
          <Header.Item>
            <Header.Title>Check in</Header.Title>
          </Header.Item>
          <Header.Spacer />
          <Header.Item>
            <Menu>
              <MenuTrigger>
                <IconButton aria-label="Open menu">
                  <Icon>
                    <LfEllipsisDot />
                  </Icon>
                </IconButton>
              </MenuTrigger>
              <MenuContent align="end">
                <MenuItem
                  leading={
                    <Icon>
                      <LfShare />
                    </Icon>
                  }
                >
                  Share
                </MenuItem>
                <MenuItem
                  leading={
                    <Icon>
                      <LfMegaphone />
                    </Icon>
                  }
                >
                  Report
                </MenuItem>
              </MenuContent>
            </Menu>
          </Header.Item>
        </Header>

        <div className={styles.pageArea}>
          <PageLayout className={styles.pageLayout}>
            <PageLayoutContent>
              <PageLayoutHeader>
                <ContentHeader>
                  <ContentHeader.Title as="h2">Welcome!</ContentHeader.Title>
                  <ContentHeader.Description>
                    Share where you plan to sit today so teammates and visitors can find you easily.
                  </ContentHeader.Description>
                </ContentHeader>
              </PageLayoutHeader>
              <PageLayoutBody>
                <Form>
                  <FormControl>
                    <FormControl.Label>Name</FormControl.Label>
                    <TextField />
                  </FormControl>
                  <FormControl>
                    <FormControl.Label>Office</FormControl.Label>
                    <Select options={officeOptions} />
                  </FormControl>
                  <FormControl>
                    <FormControl.Label>Desk / Area</FormControl.Label>
                    <Combobox options={deskOptions} />
                  </FormControl>
                  <FormControl>
                    <FormControl.Label>Expected departure</FormControl.Label>
                    <TimeField />
                  </FormControl>
                  <RadioGroup defaultValue="workday" title="Visit type">
                    <Radio value="workday">Workday</Radio>
                    <Radio value="meeting">Meeting</Radio>
                    <Radio value="guest">Guest visit</Radio>
                  </RadioGroup>
                </Form>

                <div className={styles.actionGroup}>
                  <ButtonGroup fill orientation="vertical">
                    <Button
                      onClick={() => {
                        snackbar.show({ message: "Checked in successfully!" });
                      }}
                    >
                      Check in
                    </Button>
                    <Button variant="plain">Cancel</Button>
                  </ButtonGroup>
                </div>
              </PageLayoutBody>
            </PageLayoutContent>
          </PageLayout>
        </div>

        <nav aria-label="Primary navigation" className={styles.bottomNavigation}>
          <button
            aria-current="page"
            className={`${styles.navigationButton} ${styles.navigationButtonActive}`}
            type="button"
          >
            <Icon>
              <LfHome />
            </Icon>
            <Text as="span" variant="label.small">
              Home
            </Text>
          </button>
          <button className={styles.navigationButton} type="button">
            <Icon>
              <LfMagnifyingGlass />
            </Icon>
            <Text as="span" variant="label.small">
              Search
            </Text>
          </button>
          <button className={styles.navigationButton} type="button">
            <Icon>
              <LfSetting />
            </Icon>
            <Text as="span" variant="label.small">
              Settings
            </Text>
          </button>
        </nav>
      </div>
    </div>
  );
}
