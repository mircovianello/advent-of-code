const path = require("path");
const fs = require("fs");

const input = fs
  .readFileSync(path.join(__dirname, "input.txt"), "utf8")
  .toString()
  .trim();

// == PART 1 ==
function part1(input) {
  return (
    input
      // Split the input string into an array of lines
      .split("\n")

      // Map each line to an array of characters
      .map((line) => [...line])

      // Flatten the 2D array, duplicating rows where all cells are "."
      .flatMap((row) =>
        row.every((cell) => cell === ".") ? [row, row] : [row]
      )

      // Map each row, duplicating cells where all cells in the column are "."
      .map((row, _, space) =>
        row.flatMap((cell, x) =>
          space.every((r) => r[x] === ".") ? [cell, cell] : [cell]
        )
      )

      // Reduce to an array of coordinates where the value is "#"
      .reduce(
        (galaxies, row, y) => [
          ...galaxies,
          ...row
            .map((cell, x) => (cell === "#" ? [x, y] : undefined))
            .filter(Boolean),
        ],
        []
      )

      // Reduce to the sum of Manhattan distances between galaxy coordinates
      .reduce((sum, [x1, y1], index, galaxies) => {
        galaxies.slice(0, index).forEach(([x2, y2]) => {
          // Add the Manhattan distance between two galaxy coordinates
          sum += Math.abs(x1 - x2) + Math.abs(y1 - y2);
        });
        return sum;
      }, 0)
  );
}

// == PART 2 ==
function part2(input, expansion = 1000000) {
  // Convert the input string to a 2D array of characters
  let space = input
    .split("\n")
    .map((line) => [...line])

    // Replace rows without "#" with "$"
    .map((row) =>
      row.every((cell) => cell !== "#") ? row.map(() => "$") : row
    )

    // Replace cells without "#" in columns with "$"
    .map((row, _, space) =>
      row.map((cell, x) => (space.every((r) => r[x] !== "#") ? "$" : cell))
    );

  return (
    space
      // Reduce to an array of coordinates where the value is "#"
      .reduce(
        (galaxies, row, y) => [
          ...galaxies,
          ...row
            .map((cell, x) => (cell === "#" ? [x, y] : undefined))
            .filter(Boolean),
        ],
        []
      )

      // Reduce to the sum of expanded distances between galaxy coordinates
      .reduce((sum, [x1, y1], index, galaxies) => {
        galaxies.slice(0, index).forEach(([x2, y2]) => {
          // Loop through x-coordinates between x1 and x2
          for (let x = Math.min(x1, x2); x < Math.max(x1, x2); x++) {
            if (space[y1][x] === "$")
              sum += expansion; // Increment sum by expansion if the cell is "$"
            else sum++;
          }

          // Loop through y-coordinates between y1 and y2
          for (let y = Math.min(y1, y2); y < Math.max(y1, y2); y++) {
            if (space[y][x1] === "$")
              sum += expansion; // Increment sum by expansion if the cell is "$"
            else sum++;
          }
        });
        return sum;
      }, 0)
  );
}

// == ASSERTS ==

let example = `...#......
.......#..
#.........
..........
......#...
.#........
.........#
..........
.......#..
#...#.....`;

console.assert(part1(example) === 374);

console.assert(part2(example, 2) === 374);
console.assert(part2(example, 10) === 1030);
console.assert(part2(example, 100) === 8410);

const ans1 = part1(input);
const ans2 = part2(input);

console.log({ ans1, ans2 });
