/**
 * Route protection configuration.
 *
 * Each entry defines a path prefix that requires authentication.
 * If `roles` is provided, only users whose role is in the list are allowed.
 * If `roles` is omitted, any authenticated user can access the route.
 */

export interface RouteRule {
  /** Path prefix to match (e.g. "/dashboard" matches "/dashboard" and "/dashboard/settings") */
  path: string;
  /** Allowed roles. Omit to allow any authenticated user. */
  roles?: string[];
}

/**
 * Protected routes – add new entries here as the app grows.
 * Order does not matter; the first matching rule wins.
 */
export const protectedRoutes: RouteRule[] = [
  // Any authenticated user
  { path: "/dashboard" },

  // Admin-only area
  { path: "/admin", roles: ["ADMIN"] },
];

/**
 * Finds the first route rule whose path prefix matches the given pathname.
 * Returns `undefined` when the path is not protected.
 */
export function findRouteRule(pathname: string): RouteRule | undefined {
  return protectedRoutes.find(
    (rule) => pathname === rule.path || pathname.startsWith(rule.path + "/"),
  );
}
