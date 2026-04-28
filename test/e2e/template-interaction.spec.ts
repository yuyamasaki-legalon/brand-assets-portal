import { expect, test } from "@playwright/test";

/** Hide FloatingSourceCodeViewer to avoid noise in screenshots */
async function hideFloatingViewer(page: import("@playwright/test").Page) {
  await page.addStyleTag({
    content: `[class*="FloatingSourceCodeViewer"], [class*="floating-source-code"] { display: none !important; }`,
  });
}

/** Common setup: navigate, wait for lazy-loaded content, hide floating viewer */
async function setup(page: import("@playwright/test").Page, route: string) {
  await page.goto(route);
  await page.waitForLoadState("domcontentloaded");
  // Wait for lazy-loaded React component to render (main landmark or #root content)
  await page
    .locator("main, [role='main']")
    .first()
    .waitFor({ state: "visible", timeout: 15000 });
  await hideFloatingViewer(page);
  await page.waitForTimeout(500);
}

// =============================================================================
// Dialog
// =============================================================================
test.describe("Interaction - Dialog", () => {
  test("basic dialog open", async ({ page }) => {
    await setup(page, "/template/dialog");
    await page.getByRole("button", { name: "ベーシックダイアログを開く" }).click();
    await page.waitForTimeout(300);
    await expect(page).toHaveScreenshot("interaction-dialog-basic-open.png");
  });

  test("sticky dialog open", async ({ page }) => {
    await setup(page, "/template/dialog");
    await page.getByRole("button", { name: "Sticky ダイアログを開く" }).click();
    await page.waitForTimeout(300);
    await expect(page).toHaveScreenshot("interaction-dialog-sticky-open.png");
  });
});

// =============================================================================
// List Layout - Tabs & Drawer
// =============================================================================
test.describe("Interaction - List Layout", () => {
  test("tab: レビュー中", async ({ page }) => {
    await setup(page, "/template/list-layout");
    await page.getByRole("tab", { name: "レビュー中" }).click();
    await page.waitForTimeout(300);
    await expect(page).toHaveScreenshot("interaction-list-tab-review.png");
  });

  test("tab: 承認済み", async ({ page }) => {
    await setup(page, "/template/list-layout");
    await page.getByRole("tab", { name: "承認済み" }).click();
    await page.waitForTimeout(300);
    await expect(page).toHaveScreenshot("interaction-list-tab-approved.png");
  });

  test("tab: アーカイブ", async ({ page }) => {
    await setup(page, "/template/list-layout");
    await page.getByRole("tab", { name: "アーカイブ" }).click();
    await page.waitForTimeout(300);
    await expect(page).toHaveScreenshot("interaction-list-tab-archive.png");
  });

  test("filter drawer open", async ({ page }) => {
    await setup(page, "/template/list-layout");
    await page.getByRole("button", { name: "フィルター" }).click();
    await page.waitForTimeout(300);
    await expect(page).toHaveScreenshot("interaction-list-drawer-open.png");
  });
});

// =============================================================================
// Detail Layout - Pane Navigation
// =============================================================================
test.describe("Interaction - Detail Layout", () => {
  // NavList items render as icon-only sidebar with text hidden outside viewport.
  // Use exact text match to avoid matching the parent group <li>.
  test("pane: 関連アイテム", async ({ page }) => {
    await setup(page, "/template/detail-layout");
    await page.getByRole("listitem").filter({ hasText: /^関連アイテム$/ }).click();
    await page.waitForTimeout(300);
    await expect(page).toHaveScreenshot("interaction-detail-pane-related.png");
  });

  test("pane: 履歴", async ({ page }) => {
    await setup(page, "/template/detail-layout");
    await page.getByRole("listitem").filter({ hasText: /^履歴$/ }).click();
    await page.waitForTimeout(300);
    await expect(page).toHaveScreenshot("interaction-detail-pane-history.png");
  });

  test("pane: 添付ファイル", async ({ page }) => {
    await setup(page, "/template/detail-layout");
    await page.getByRole("listitem").filter({ hasText: /^添付ファイル$/ }).click();
    await page.waitForTimeout(300);
    await expect(page).toHaveScreenshot("interaction-detail-pane-attachments.png");
  });
});

// =============================================================================
// PageLayout - Pane Toggle
// =============================================================================
test.describe("Interaction - PageLayout WithPane", () => {
  test("pane toggle", async ({ page }) => {
    await setup(page, "/template/pagelayout/with-pane");
    // Default state may have pane open or closed; toggle it
    const toggleButton = page.getByRole("button", { name: /Open Pane|Close Pane/ });
    const buttonText = await toggleButton.textContent();
    await toggleButton.click();
    await page.waitForTimeout(300);
    const suffix = buttonText?.includes("Open") ? "opened" : "closed";
    await expect(page).toHaveScreenshot(`interaction-pagelayout-pane-${suffix}.png`);
  });
});

// =============================================================================
// DealOn Deal Detail - Tabs
// =============================================================================
test.describe("Interaction - DealOn Deal Detail Tabs", () => {
  const tabs = ["アラート", "タスク", "ミーティング", "議事録", "ファイル", "メッセージ", "アクティビティ", "ジョブ"];

  for (const tabName of tabs) {
    test(`tab: ${tabName}`, async ({ page }) => {
      await setup(page, "/template/dealon/deal-detail");
      await page.getByRole("tab", { name: tabName }).click();
      await page.waitForTimeout(300);
      await expect(page).toHaveScreenshot(`interaction-dealon-detail-tab-${tabName}.png`);
    });
  }
});

// =============================================================================
// Chat Layout - Pane Toggle
// =============================================================================
test.describe("Interaction - Chat Layout", () => {
  test("pane open", async ({ page }) => {
    await setup(page, "/template/chat-layout");
    await page.getByRole("button", { name: "パネルを開く" }).click();
    await page.waitForTimeout(300);
    await expect(page).toHaveScreenshot("interaction-chat-layout-pane-open.png");
  });
});

// =============================================================================
// States - Error Fetch
// =============================================================================
test.describe("Interaction - States Error Fetch", () => {
  test("error state", async ({ page }) => {
    await setup(page, "/template/states/error/fetch");
    await page.getByRole("button", { name: "取得失敗をシミュレート" }).click();
    // Wait for simulated fetch error (typically ~1500ms)
    await page.waitForTimeout(2000);
    await expect(page).toHaveScreenshot("interaction-states-error-fetch-error.png");
  });

  test("success after retry", async ({ page }) => {
    await setup(page, "/template/states/error/fetch");
    await page.getByRole("button", { name: "取得成功をシミュレート" }).click();
    await page.waitForTimeout(2000);
    await expect(page).toHaveScreenshot("interaction-states-error-fetch-success.png");
  });
});

// =============================================================================
// States - Error Dialog
// =============================================================================
test.describe("Interaction - States Error Dialog", () => {
  test("dialog open", async ({ page }) => {
    await setup(page, "/template/states/error/dialog");
    await page.getByRole("button", { name: "Dialog を開く" }).click();
    await page.waitForTimeout(300);
    await expect(page).toHaveScreenshot("interaction-states-error-dialog-open.png");
  });

  test("dialog with error", async ({ page }) => {
    await setup(page, "/template/states/error/dialog");
    await page.getByRole("button", { name: "Dialog を開く" }).click();
    await page.waitForTimeout(300);
    // Fill input to enable the save button, then submit to trigger error
    await page.getByRole("textbox").first().fill("テスト入力");
    await page.waitForTimeout(300);
    await page.getByRole("button", { name: "保存" }).click();
    // Wait for simulated error response
    await page.waitForTimeout(2000);
    await expect(page).toHaveScreenshot("interaction-states-error-dialog-error.png");
  });
});

// =============================================================================
// States - Feedback Snackbar
// =============================================================================
test.describe("Interaction - States Feedback Snackbar", () => {
  test("success snackbar", async ({ page }) => {
    await setup(page, "/template/states/feedback/snackbar");
    await page.getByRole("button", { name: "保存しました" }).click();
    await page.waitForTimeout(500);
    await expect(page).toHaveScreenshot("interaction-states-snackbar-success.png");
  });

  test("error snackbar", async ({ page }) => {
    await setup(page, "/template/states/feedback/snackbar");
    await page.getByRole("button", { name: "汎用エラー" }).click();
    await page.waitForTimeout(500);
    await expect(page).toHaveScreenshot("interaction-states-snackbar-error.png");
  });

  test("action snackbar", async ({ page }) => {
    await setup(page, "/template/states/feedback/snackbar");
    await page.getByRole("button", { name: "アクション付き" }).click();
    await page.waitForTimeout(500);
    await expect(page).toHaveScreenshot("interaction-states-snackbar-action.png");
  });
});
