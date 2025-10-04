/**
 * Minimal React type definitions for optional peer dependency
 * Full types will be provided by user's React installation
 */

declare module "react" {
  export function useEffect(
    effect: () => void | (() => void),
    deps?: readonly any[]
  ): void;
}
