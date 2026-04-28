import { expect, test } from "@playwright/test";

/**
 * All template routes organized by product area.
 * Dynamic routes (:id) use sample values.
 */
const templateRoutes = {
  base: ["/template", "/template/chat", "/template/dialog", "/template/chat-layout", "/template/dashboard-layout", "/template/form-template"],
  pagelayout: [
    "/template/pagelayout",
    "/template/pagelayout/basic",
    "/template/pagelayout/with-sidebar",
    "/template/pagelayout/with-pane",
    "/template/pagelayout/with-resizable-pane",
    "/template/pagelayout/scroll-inside",
    "/template/pagelayout/with-sticky-container",
    "/template/pagelayout/with-sidebar-and-pane",
    "/template/pagelayout/with-sidebar-and-pane-start",
  ],
  layoutPattern: [
    "/template/list-layout",
    "/template/settings-layout",
    "/template/detail-layout",
    "/template/fill-layout",
    "/template/form-layout",
  ],
  states: [
    "/template/states",
    "/template/states/loading",
    "/template/states/loading/skeleton",
    "/template/states/loading/progress",
    "/template/states/loading/component",
    "/template/states/error",
    "/template/states/error/fetch",
    "/template/states/error/validation",
    "/template/states/error/submission",
    "/template/states/error/dialog",
    "/template/states/error/boundary",
    "/template/states/empty",
    "/template/states/empty/patterns",
    "/template/states/feedback",
    "/template/states/feedback/snackbar",
    "/template/states/feedback/disabled",
  ],
  loc: [
    "/template/dashboard",
    "/template/dashboard/contract-review",
    "/template/case-reception-form",
    "/template/root",
    "/template/root/not-found",
    "/template/root/server-error",
    "/template/root/maintenance",
    "/template/esign",
    "/template/esign/envelope-list",
    "/template/loc/case",
    "/template/loc/case/detail",
    "/template/loc/application-console",
    "/template/loc/application-console/case-custom-attribute",
    "/template/loc/application-console/case-automation",
    "/template/loc/application-console/case-notification-config",
    "/template/loc/application-console/case-reception-form",
    "/template/loc/application-console/case-reception-form/edit",
    "/template/loc/application-console/reception-mail-address",
    "/template/loc/application-console/case-reception-space",
    "/template/loc/application-console/case-reception-form-allowed-ip-address",
    "/template/loc/application-console/case-mail-allowed-domain",
    "/template/loc/word-addin",
    "/template/loc/word-addin-standalone",
    "/template/loc/loa",
    "/template/loc/loa/history",
    "/template/loc/loa/prompt-library",
    "/template/loc/loa/playbook",
    "/template/loc/review",
    "/template/loc/review-console",
    "/template/loc/review-console/rules",
    "/template/loc/review-console/my-playbook",
    "/template/loc/manual-correction",
    "/template/loc/manual-correction/detail",
    "/template/file-management",
    "/template/file-management/detail/sample-001",
    "/template/legalon-template",
    "/template/legalon-template/category",
    "/template/legalon-template/sample-001",
    "/template/management-console",
    "/template/management-console/mfa",
    "/template/management-console/slack",
    "/template/management-console/teams",
    "/template/management-console/sso",
    "/template/management-console/company-info",
    "/template/management-console/departments",
    "/template/management-console/users",
    "/template/management-console/user-groups",
    "/template/management-console/spaces",
    "/template/personal-setting",
    "/template/personal-setting/profile",
    "/template/personal-setting/contract-notification",
    "/template/personal-setting/legal-notification",
    "/template/personal-setting/legalscape",
    "/template/setting-page",
  ],
  workon: [
    "/template/workon/employee-registration",
    "/template/workon/procedure",
    "/template/workon/setting",
    "/template/workon/setting/invite",
    "/template/workon/setting/account",
    "/template/workon/setting/permission-management",
    "/template/workon/profile",
    "/template/workon/profile/employee",
    "/template/workon/profile/personal-info",
    "/template/workon/profile/additional-info",
    "/template/workon/profile/family-info",
    "/template/workon/profile/tax-insurance",
    "/template/workon/profile/payment-deduction",
    "/template/workon/profile/salary-bonus-detail",
    "/template/workon/profile/leave-of-absence",
    "/template/workon/profile/department-assignment",
    "/template/workon/profile/custom",
  ],
  dealon: [
    "/template/dealon/layout",
    "/template/dealon/deal-list",
    "/template/dealon/deal-detail",
    "/template/dealon/settings-profile",
    "/template/dealon/settings-users",
  ],
};

/** Hide FloatingSourceCodeViewer to avoid noise in screenshots */
async function hideFloatingViewer(page: import("@playwright/test").Page) {
  await page.addStyleTag({
    content: `[class*="FloatingSourceCodeViewer"], [class*="floating-source-code"] { display: none !important; }`,
  });
}

for (const [area, routes] of Object.entries(templateRoutes)) {
  test.describe(`Template Visual Regression - ${area}`, () => {
    for (const route of routes) {
      const testName = route.replace("/template", "").replace(/^\//, "") || "index";

      test(testName, async ({ page }) => {
        await page.goto(route);
        await page.waitForLoadState("networkidle");
        await hideFloatingViewer(page);
        await page.waitForTimeout(500);
        await expect(page).toHaveScreenshot(`${area}-${testName.replace(/\//g, "-")}.png`);
      });
    }
  });
}
