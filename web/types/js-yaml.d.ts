// Minimal type shim for the subset of js-yaml v3 used in lib/launches.ts.
// Avoids adding @types/js-yaml as a dev dependency for a single transitive
// module. js-yaml v3 ships an untyped JS bundle via gray-matter.
declare module "js-yaml" {
  export interface LoadOptions {
    schema?: unknown;
    filename?: string;
    onWarning?: (e: Error) => void;
    json?: boolean;
  }

  export const JSON_SCHEMA: unknown;
  export const FAILSAFE_SCHEMA: unknown;
  export const CORE_SCHEMA: unknown;
  export const DEFAULT_SAFE_SCHEMA: unknown;
  export const DEFAULT_FULL_SCHEMA: unknown;

  export function load(input: string, options?: LoadOptions): unknown;
  export function safeLoad(input: string, options?: LoadOptions): unknown;
  export function dump(input: unknown, options?: Record<string, unknown>): string;

  const _default: {
    load: typeof load;
    safeLoad: typeof safeLoad;
    dump: typeof dump;
    JSON_SCHEMA: typeof JSON_SCHEMA;
    FAILSAFE_SCHEMA: typeof FAILSAFE_SCHEMA;
    CORE_SCHEMA: typeof CORE_SCHEMA;
  };
  export default _default;
}
