const path = require("path");
const fs = require("fs");

const input = fs
  .readFileSync(path.join(__dirname, "input.txt"), "utf8")
  .toString()
  .trim();

// == PART 1 ==

// Function to calculate a result based on input data.
function part1(input) {
  // Destructure the input array into 'times' and 'recordDistances'.
  let [times, recordDistances] = input
    .split("\n") // Split the input string by newline character.
    .map((line) => [...line.matchAll(/\d+/g)].map(Number)); // Extract numbers from each line.

  // Calculate the result using the 'times' array.
  return times.reduce((product, time, i) => {
    let recordDistance = recordDistances[i];

    let recordBeaten = 0;
    // Check for how many times the record has been beaten based on time and distance.
    for (let hold = 1; hold < time; hold++) {
      if (hold * (time - hold) > recordDistance) {
        recordBeaten++;
      }
    }

    // Multiply the running product with the number of records beaten for each time.
    return product * recordBeaten;
  }, 1); // Initial value of the product is 1.
}

// == PART 2 ==

// Function to manipulate input and call part1 function.
function part2(input) {
  // Replace all spaces in the input string.
  return part1(input.replaceAll(" ", ""));
}

// == ASSERTS ==

const example = `Time:      7  15   30
Distance:  9  40  200`;

console.assert(part1(example) === 288);
console.assert(part2(example) === 71503);

const ans1 = part1(input);
const ans2 = part2(input);

console.log({ ans1, ans2 });
