export function pickProjectUpdateFields<T extends Record<string, unknown>>(
  parsed: T,
  submitted: Record<string, unknown>,
): Partial<T> & { id: unknown } {
  const partial: Record<string, unknown> = { id: parsed.id };
  for (const key of Object.keys(submitted)) {
    if (key in parsed) partial[key] = parsed[key];
  }
  return partial as Partial<T> & { id: unknown };
}