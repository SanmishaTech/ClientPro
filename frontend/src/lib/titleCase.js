// utils/titleCase.js

export const toTitleCase = (str) => {
  const lowerCaseWords = [
    "a",
    "an",
    "and",
    "but",
    "for",
    "nor",
    "or",
    "so",
    "the",
    "to",
    "in",
    "on",
    "at",
    "by",
    "with",
    "as",
    "of",
  ];

  return str
    .split(" ") // Split by spaces
    .map((word, index, arr) => {
      // Capitalize the first and last word, or words not in the lowercaseWords array
      if (
        index === 0 || // First word
        index === arr.length - 1 || // Last word
        !lowerCaseWords.includes(word.toLowerCase()) // If it's not in the exceptions
      ) {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(); // Capitalize
      }
      return word.toLowerCase(); // Leave small words in lowercase
    })
    .join(" "); // Rejoin the words into a sentence
};
