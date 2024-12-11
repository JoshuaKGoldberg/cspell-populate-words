// Extracted out to make it possible to mock during tests
// https://github.com/vitest-dev/vitest/issues/6953
export const resolve = (specifier: string) => import.meta.resolve(specifier);
