const path = require("path");
const fs = require("fs");

const input = fs
  .readFileSync(path.join(__dirname, "input.txt"), "utf8")
  .toString()
  .trim();

const inputEG1Pt1 = fs
  .readFileSync(path.join(__dirname, "inputEG1Pt1.txt"), "utf8")
  .toString()
  .trim();

const inputEG1Pt2 = fs
  .readFileSync(path.join(__dirname, "inputEG1Pt2.txt"), "utf8")
  .toString()
  .trim();

const inputEG2Pt2 = fs
  .readFileSync(path.join(__dirname, "inputEG2Pt2.txt"), "utf8")
  .toString()
  .trim();

// == SHARED ==

// Constants defining directions and corresponding movements
const DIRECTIONS = {
  UP: 0,
  RIGHT: 1,
  DOWN: 2,
  LEFT: 3,
  MOVEMENTS: [
    { x: 0, y: -1 },
    { x: 1, y: 0 },
    { x: 0, y: 1 },
    { x: -1, y: 0 },
  ],
};

// Object defining movements for different pipe characters
const PIPEMOVEMENT = {
  "|": (direction) => direction,
  "-": (direction) => direction,
  S: (direction) => direction,
  L: (direction) =>
    direction == DIRECTIONS.LEFT ? DIRECTIONS.UP : DIRECTIONS.RIGHT,
  J: (direction) =>
    direction == DIRECTIONS.RIGHT ? DIRECTIONS.UP : DIRECTIONS.LEFT,
  F: (direction) =>
    direction == DIRECTIONS.LEFT ? DIRECTIONS.DOWN : DIRECTIONS.RIGHT,
  7: (direction) =>
    direction == DIRECTIONS.RIGHT ? DIRECTIONS.DOWN : DIRECTIONS.LEFT,
};

// == PART 1 ==

// Function to find the number of steps in a loop starting from 'S'
function part1(input) {
  const grid = input.split(/\n/).map((line) => line.split(""));
  let current = { x: 0, y: 0, direction: 0 };

  // Find the starting position and direction of 'S'
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] == "S") {
        current.x = x;
        current.y = y;
        // Determine the initial direction based on neighboring characters
        if (grid[y][x - 1].match(/[FL-]/)) current.direction = DIRECTIONS.LEFT;
        if (grid[y][x + 1].match(/[7J-]/)) current.direction = DIRECTIONS.RIGHT;
        if (grid[y - 1][x].match(/[F7|]/)) current.direction = DIRECTIONS.UP;
        if (grid[y + 1][x].match(/[LJ|]/)) current.direction = DIRECTIONS.DOWN;
      }
    }
  }

  // Traverse the loop and count the steps until returning to 'S'
  let loop = new Set();
  do {
    loop.add(`${current.x},${[current.y]}`);
    current.x += DIRECTIONS.MOVEMENTS[current.direction].x;
    current.y += DIRECTIONS.MOVEMENTS[current.direction].y;
    current.direction = PIPEMOVEMENT[grid[current.y][current.x]](
      current.direction
    );
  } while (grid[current.y][current.x] != "S");

  // Return half of the loop size
  return loop.size / 2;
}

// == PART 2 ==

// Function to find the area enclosed by the loop starting from 'S'
function part2(input) {
  const grid = input.split(/\n/).map((line) => line.split(""));
  let current = { x: 0, y: 0, direction: 0 };
  let isStartingNorth = false,
    isStartingSouth = false;

  // Find the starting position and direction of 'S', and determine if starting towards North or South
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] == "S") {
        current.x = x;
        current.y = y;
        // Determine the initial direction based on neighboring characters
        if (grid[y][x - 1].match(/[FL-]/)) current.direction = DIRECTIONS.LEFT;
        if (grid[y][x + 1].match(/[7J-]/)) current.direction = DIRECTIONS.RIGHT;
        if (grid[y - 1][x].match(/[F7|]/)) {
          current.direction = DIRECTIONS.UP;
          isStartingNorth = true;
        }
        if (grid[y + 1][x].match(/[LJ|]/)) {
          current.direction = DIRECTIONS.DOWN;
          isStartingSouth = true;
        }
      }
    }
  }

  // Traverse the loop and count the steps until returning to 'S'
  let loop = new Set();
  do {
    loop.add(`${current.x},${[current.y]}`);
    current.x += DIRECTIONS.MOVEMENTS[current.direction].x;
    current.y += DIRECTIONS.MOVEMENTS[current.direction].y;
    current.direction = PIPEMOVEMENT[grid[current.y][current.x]](
      current.direction
    );
  } while (grid[current.y][current.x] != "S");

  // Count the enclosed area within the loop
  let area = 0;
  for (let y = 0; y < grid.length; y++) {
    let northCount = 0,
      southCount = 0;
    for (let x = 0; x < grid[y].length; x++) {
      if (loop.has(`${x},${y}`)) {
        if (grid[y][x].match(/[LJ|]/)) northCount++;
        if (grid[y][x].match(/[F7|]/)) southCount++;

        // Check if the current spot is 'S' and adjust counts accordingly
        if (grid[y][x] == "S") {
          if (isStartingNorth) northCount++;
          if (isStartingSouth) southCount++;
        }
        continue;
      }

      // If the current spot is outside the loop, update the area based on line tests
      if (northCount % 2 == 1 || southCount % 2 == 1) area++;
    }
  }

  // Return the calculated area
  return area;
}

// == ASSERTS ==

console.assert(part1(inputEG1Pt1) === 4);
console.assert(part2(inputEG1Pt2) === 4);
console.assert(part2(inputEG2Pt2) === 8);

const ans1 = part1(input);
const ans2 = part2(input);

console.log({ ans1, ans2 });
