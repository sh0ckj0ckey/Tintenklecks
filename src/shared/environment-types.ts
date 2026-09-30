/**
 * Operating system platform.
 *
 * Named here rather than using the raw `process.platform` values
 * such as `win32` and `darwin`. Unsupported platforms are reported as `unknown`.
 */
export type Platform = 'windows' | 'macos' | 'linux' | 'unknown'
