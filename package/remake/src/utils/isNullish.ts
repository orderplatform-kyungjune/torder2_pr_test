/**
 * Checks if a value is nullish (null or undefined).
 * @param value The value to check.
 * @returns True if the value is nullish, false otherwise.
 */
// eslint-disable-next-line import/prefer-default-export
export const isNullish = <T>(value: T | null | undefined): value is null | undefined => value === null || value === undefined;
