const path = require("path");
const fs = require("fs");

const input = fs
  .readFileSync(path.join(__dirname, "input.txt"), "utf8")
  .toString()
  .trim();

// == PART 1 ==

function part1(input) {
  return input
    .split("\n") // Split the input string into an array of lines using the newline character as the delimiter
    .map((line) => {
      // Map over each line in the array
      let [, a] = line.match(/(\d)/); // Use a regular expression to extract the first digit from the line and assign it to variable 'a'
      let [, b] = line.match(/.*(\d)/); // Use a regular expression to extract the last digit from the line and assign it to variable 'b'
      return Number(`${a}${b}`); // Concatenate 'a' and 'b' and convert the result to a number, then return that number
    })
    .reduce((acc, n) => acc + n, 0); // Sum all the numbers obtained from the map operation using the reduce function, starting from an initial value of 0
}

// == PART 2 ==

function part2(input) {
  const NUMBERS = {
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
    six: 6,
    seven: 7,
    eight: 8,
    nine: 9,
  };

  return input
    .split("\n") // Split the input string into an array of lines using the newline character as the delimiter
    .map((line) => {
      // Map over each line in the array
      let [, a] = line.match(`(\\d|${Object.keys(NUMBERS).join("|")})`); // Use a regular expression to extract the first digit or named number from the line and assign it to variable 'a'
      let [, b] = line.match(`.*(\\d|${Object.keys(NUMBERS).join("|")})`); // Use a regular expression to extract the last digit or named number from the line and assign it to variable 'b'
      if (a in NUMBERS) a = NUMBERS[a]; // If 'a' is a named number, replace it with its corresponding numeric value
      if (b in NUMBERS) b = NUMBERS[b]; // If 'b' is a named number, replace it with its corresponding numeric value
      return Number(`${a}${b}`); // Concatenate 'a' and 'b', convert the result to a number, and return that number
    })
    .reduce((acc, n) => acc + n, 0); // Sum all the numbers obtained from the map operation using the reduce function, starting from an initial value of 0
}

// == ASSERTS ==

console.assert(
  part1(
    `1abc2
    pqr3stu8vwx
    a1b2c3d4e5f
  treb7uchet`
  ) === 142
);

console.assert(
  part2(
    `two1nine
  eightwothree
  abcone2threexyz
  xtwone3four
  4nineeightseven2
  zoneight234
  7pqrstsixteen`
  ) === 281
);

const ans1 = part1(input);
const ans2 = part2(input);

console.log({ ans1, ans2 });
