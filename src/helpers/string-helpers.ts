// Only allow letters, numbers, underscore, dash and length of 20
export const simpleStringOnly = (input: string) => {
  return input.replace(/[^A-Za-z0-9_-]/gi, "").slice(0, 20);
};
