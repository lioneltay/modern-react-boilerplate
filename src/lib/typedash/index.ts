export function flatten<T>(input: T[][]): T[] {
  return input.reduce((acc, arr) => acc.concat(arr), [])
}

export function isNil<T>(
  value: T | null | undefined
): value is null | undefined {
  return value === undefined || value === null
}

export function notEmpty<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined
}

export function ensureStartsWith(prefix: string, str: string): string {
  return str.startsWith(prefix) ? str : `${prefix}${str}`
}
