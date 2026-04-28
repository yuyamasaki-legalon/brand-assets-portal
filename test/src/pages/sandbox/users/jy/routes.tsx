import { lazy } from "react";
import type { RouteConfig, RouteFileMap } from "../../../../types/routes";

const UserJySandbox = lazy(() => import("./index"));
const AiChat = lazy(() => import("./ai-chat/index"));
const AiChatHome = lazy(() => import("./ai-chat-home/index"));
const Home = lazy(() => import("./home/index"));
const AttendanceAutoInput = lazy(() => import("./attendance-auto-input/index"));

export const routes: RouteConfig[] = [
  {
    path: "/sandbox/jy",
    element: <UserJySandbox />,
  },
  {
    path: "/sandbox/jy/ai-chat",
    element: <AiChat />,
  },
  {
    path: "/sandbox/jy/ai-chat-home",
    element: <AiChatHome />,
  },
  {
    path: "/sandbox/jy/home",
    element: <Home />,
  },
  {
    path: "/sandbox/jy/attendance-auto-input",
    element: <AttendanceAutoInput />,
  },
];

export const routeFileMap: RouteFileMap = {
  "/sandbox/jy": "src/pages/sandbox/users/jy/index.tsx",
};
