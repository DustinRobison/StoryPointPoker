export const simpleStringOnly = (input: string) => {
  return input.replace(/[^A-Za-z0-9_-]/gi, "");
};
