const path = require("path");
const fs = require("fs");

const input = fs
  .readFileSync(path.join(__dirname, "input.txt"), "utf8")
  .toString()
  .trim();

// == PART 1 ==

// This function takes an input string and performs a series of operations on it.
function part1(input) {
  // This inner function predicts the next value in a sequence based on the differences between consecutive elements.
  function predictNextValue(sequence) {
    // If all elements in the sequence are 0, return 0.
    if (sequence.every((n) => n === 0)) return 0;

    // Calculate the differences between consecutive elements in the sequence.
    let differences = sequence
      .slice(0, -1)
      .map((_, i) => sequence[i + 1] - sequence[i]);

    // Recursively call predictNextValue on the differences and add it to the last element in the sequence.
    return sequence.at(-1) + predictNextValue(differences);
  }

  // Split the input string into lines, then split each line into an array of numbers.
  // Apply the predictNextValue function to each array and sum up the results.
  return input
    .split("\n")
    .map((line) => line.split(" ").map(Number))
    .map(predictNextValue)
    .reduce((sum, n) => sum + n, 0);
}

// == PART 2 ==

// This function takes an input string and performs a different set of operations on it.
function part2(input) {
  // This inner function predicts the previous value in a sequence based on the differences between consecutive elements.
  function predictPreviousValue(sequence) {
    // If all elements in the sequence are 0, return 0.
    if (sequence.every((n) => n === 0)) return 0;

    // Calculate the differences between consecutive elements in the sequence.
    let differences = sequence
      .slice(0, -1)
      .map((_, i) => sequence[i + 1] - sequence[i]);

    // Recursively call predictPreviousValue on the differences and subtract it from the first element in the sequence.
    return sequence[0] - predictPreviousValue(differences);
  }

  // Split the input string into lines, then split each line into an array of numbers.
  // Apply the predictPreviousValue function to each array and sum up the results.
  return input
    .split("\n")
    .map((line) => line.split(" ").map(Number))
    .map(predictPreviousValue)
    .reduce((sum, n) => sum + n, 0);
}

// == ASSERTS ==

console.assert(
  part1("0 3 6 9 12 15\n1 3 6 10 15 21\n10 13 16 21 30 45") === 114
);
console.assert(part2("0 3 6 9 12 15\n1 3 6 10 15 21\n10 13 16 21 30 45") === 2);

const ans1 = part1(input);
const ans2 = part2(input);

console.log({ ans1, ans2 });
