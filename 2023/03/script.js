const path = require("path");
const fs = require("fs");

const input = fs
  .readFileSync(path.join(__dirname, "input.txt"), "utf8")
  .toString()
  .trim();

// == SHARED ==

// Function to parse the input and extract schematic information
function parseSchematics(input) {
  // Initialize arrays to store numbers and symbols
  let numbers = [];
  let symbols = [];

  // Split input into lines
  let lines = input.split("\n");

  // Extract symbols from each row and create symbol objects with coordinates and adjacentNumbers array
  symbols = lines.flatMap((row, y) =>
    [...row.matchAll(/[^\d\.]/g)].map(({ 0: symbol, index: x }) => ({
      x,
      y,
      symbol,
      adjacentNumbers: [],
    }))
  );

  // Extract numbers from each row and create number objects with adjacentSymbols array
  numbers = lines.flatMap((row, y) =>
    [...row.matchAll(/\d+/g)].map(({ 0: number, index: startX }) => ({
      number: Number(number),
      adjacentSymbols: symbols.filter(
        ({ x: symbolX, y: symbolY }) =>
          symbolX >= startX - 1 &&
          symbolX <= startX + number.length &&
          symbolY >= y - 1 &&
          symbolY <= y + 1
      ),
    }))
  );

  // Connect numbers with their adjacent symbols
  numbers.forEach((number) =>
    number.adjacentSymbols.forEach((symbol) =>
      symbol.adjacentNumbers.push(number)
    )
  );

  // Return an object containing arrays of numbers and symbols
  return { numbers, symbols };
}

// == PART 1 ==

// Function to calculate the sum of numbers connected to symbols
function part1(input) {
  return parseSchematics(input)
    .numbers.filter(({ adjacentSymbols }) => adjacentSymbols.length > 0)
    .reduce((sum, { number }) => sum + number, 0);
}

// == PART 2 ==

// Function to calculate the sum of gear ratios for specific symbols in the schematic
function part2(input) {
  // Use the parseSchematics function to extract schematic information
  return (
    parseSchematics(input)
      // Filter symbols to only include those with the symbol "*" (asterisk)
      .symbols.filter(({ symbol }) => symbol === "*")
      // Further filter symbols to only include those with exactly 2 adjacent numbers
      .filter(({ adjacentNumbers }) => adjacentNumbers.length === 2)
      // Map each qualifying symbol to the product of the two adjacent numbers
      .map(
        ({ adjacentNumbers: [{ number: number1 }, { number: number2 }] }) =>
          number1 * number2
      )
      // Sum up the calculated gear ratios
      .reduce((sum, gearRatio) => sum + gearRatio, 0)
  );
}

// == ASSERTS ==

console.assert(
  part1(`
467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..
`) === 4361
);

console.assert(
  part2(`
467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..
`) === 467835
);

const ans1 = part1(input);
const ans2 = part2(input);

console.log({ ans1, ans2 });
