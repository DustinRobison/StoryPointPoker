export const lettersAndNumbersOnly = input => {
  return input.toLowerCase().replace(/[^A-Za-z0-9]/gi, "");
};
