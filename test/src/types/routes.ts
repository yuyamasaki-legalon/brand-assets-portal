import type { ReactElement } from "react";

/**
 * Route configuration interface
 */
export interface RouteConfig {
  path: string;
  element: ReactElement;
}

/**
 * Route file mapping for source code viewer
 */
export type RouteFileMap = Record<string, string>;

/**
 * Module that exports routes
 */
export interface RouteModule {
  routes: RouteConfig[];
  routeFileMap: RouteFileMap;
}
