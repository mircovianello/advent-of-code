const path = require("path");
const fs = require("fs");

const input = fs
  .readFileSync(path.join(__dirname, "input.txt"), "utf8")
  .toString()
  .trim();

// == SHARED ==

// Function to parse the input string and extract game information
function parseInput(input) {
  return input.split("\n").map((line) => {
    // Use regular expression to match lines starting with "Game", capturing the ID and cubes part
    let [, id, cubes] = line.match(/^Game (\d+): (.*)$/);
    return {
      // Return an object with the ID (converted to a number) and cubes (an array)
      id: Number(id),
      cubes: [...cubes.matchAll(/(\d+) (\w+)/g)].map(([, count, color]) => ({
        // For each cube, return an object with count (converted to a number) and color
        count: Number(count),
        color,
      })),
    };
  });
}

// == PART 1 ==

// Function to calculate the sum of IDs for games with valid cube counts
function part1(input) {
  // Define maximum allowed cube counts for each color
  let MAX_CUBES = { red: 12, green: 13, blue: 14 };

  // Parse the input and filter games based on cube counts
  return (
    parseInput(input)
      .filter(({ cubes }) =>
        cubes.every(({ count, color }) => count <= MAX_CUBES[color])
      )
      // Sum the IDs of valid games
      .reduce((sum, { id }) => sum + id, 0)
  );
}

// == PART 2 ==

// Function to calculate the product of maximum cube counts for each color across all games
function part2(input) {
  return (
    parseInput(input)
      .map(({ cubes }) =>
        cubes.reduce(
          // Update maxCounts with the maximum count for each color
          (maxCounts, { count, color }) => ({
            ...maxCounts,
            [color]: Math.max(maxCounts[color], count),
          }),
          { red: 0, green: 0, blue: 0 }
        )
      )
      // Calculate the product of maximum counts for each color across all games
      .map(({ red, green, blue }) => red * green * blue)
      // Sum the calculated products
      .reduce((sum, power) => sum + power, 0)
  );
}

// == ASSERTS ==

console.assert(
  part1(
    `Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green`
  ) === 8
);

console.assert(
  part2(
    `Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green`
  ) === 2286
);

const ans1 = part1(input);
const ans2 = part2(input);

console.log({ ans1, ans2 });
