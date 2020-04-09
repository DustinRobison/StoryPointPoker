export const simpleStringOnly = input => {
  return input.replace(/[^A-Za-z0-9_-]/gi, "");
};
