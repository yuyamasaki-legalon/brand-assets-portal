import { expect, test } from "@playwright/test";

/**
 * Component-level visual regression tests.
 *
 * Takes screenshots of specific regions (not full page) to detect
 * aegis-react component regressions precisely without being affected
 * by unrelated page-level changes.
 */

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
// List Layout - DataTable
// =============================================================================
test.describe("Component - List Layout", () => {
  test("DataTable", async ({ page }) => {
    await setup(page, "/template/list-layout");
    const table = page.getByRole("table").first();
    await expect(table).toHaveScreenshot("component-list-datatable.png", {
      timeout: 15000,
      animations: "disabled",
    });
  });

  test("Tab bar", async ({ page }) => {
    await setup(page, "/template/list-layout");
    const tabList = page.getByRole("tablist").first();
    await expect(tabList).toHaveScreenshot("component-list-tabbar.png");
  });
});

// =============================================================================
// Detail Layout - Header & Sidebar
// =============================================================================
test.describe("Component - Detail Layout", () => {
  test("header", async ({ page }) => {
    await setup(page, "/template/detail-layout");
    const header = page.locator("header").first();
    await expect(header).toHaveScreenshot("component-detail-header.png");
  });
});

// =============================================================================
// Form Template - Form Area
// =============================================================================
test.describe("Component - Form Template", () => {
  test("form controls", async ({ page }) => {
    await setup(page, "/template/form-template");
    const form = page.locator("form").first();
    await expect(form).toHaveScreenshot("component-form-controls.png");
  });
});

// =============================================================================
// States - Empty State Patterns
// =============================================================================
test.describe("Component - Empty State", () => {
  test("empty state patterns", async ({ page }) => {
    await setup(page, "/template/states/empty/patterns");
    // Capture the main content area which contains all EmptyState variants
    const body = page.locator("main").first();
    await expect(body).toHaveScreenshot("component-empty-state-patterns.png");
  });
});

// =============================================================================
// States - Loading Skeleton
// =============================================================================
test.describe("Component - Loading Skeleton", () => {
  test("skeleton patterns", async ({ page }) => {
    await setup(page, "/template/states/loading/skeleton");
    const body = page.locator("main").first();
    await expect(body).toHaveScreenshot("component-loading-skeleton.png");
  });
});

// =============================================================================
// Dashboard Layout - KPI Cards
// =============================================================================
test.describe("Component - Dashboard Layout", () => {
  test("dashboard content", async ({ page }) => {
    await setup(page, "/template/dashboard-layout");
    const body = page.locator("main").first();
    await expect(body).toHaveScreenshot("component-dashboard-content.png");
  });
});

// =============================================================================
// Settings Layout - NavList Sidebar
// =============================================================================
test.describe("Component - Settings Layout", () => {
  test("sidebar navigation", async ({ page }) => {
    await setup(page, "/template/settings-layout");
    const sidebar = page.getByRole("list").first();
    await expect(sidebar).toHaveScreenshot("component-settings-sidebar.png");
  });
});

// =============================================================================
// Chat Layout - Message Area
// =============================================================================
test.describe("Component - Chat Layout", () => {
  test("chat message area", async ({ page }) => {
    await setup(page, "/template/chat-layout");
    const main = page.locator("main").first();
    await expect(main).toHaveScreenshot("component-chat-messages.png");
  });
});
