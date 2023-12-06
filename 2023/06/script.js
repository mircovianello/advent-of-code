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
      // Split the input by "/\n\n/" pattern, representing double line breaks
      .split("/\n\n/")
      .flatMap((doubleLine) => {
        // Extract 'times' and 'distances' from the matched pattern in doubleLine
        let [, times, distances] = doubleLine
          .match(/^Time:\s+(.*)\nDistance:\s+(.*)$/)
          // Extract and map numbers, trimming and converting them to numbers
          .map((numbers) => numbers.trim().split(/\s+/g).map(Number));

        const races = [];
        // Create race objects with time, distance, and wayCount properties
        for (let i = 0; i < times.length; i++) {
          races.push({
            time: times[i],
            distance: distances[i],
            wayCount: 0,
          });
        }

        return races; // Return an array of race objects
      })
      .map(({ time, distance }, index, races) => {
        // Calculate wayCount for each race based on the given condition
        for (let i = 1; i <= time; i++) {
          if (i * (time - i) > distance) races[index].wayCount += 1;
        }
        return races[index].wayCount; // Return an array of wayCounts
      })
      .reduce((total, ways) => total * ways) // Multiply all wayCounts to get the final result
  );
}

// == PART 2 ==

function part2(input) {
  return (
    input
      // Split the input by "/\n\n/" pattern, representing double line breaks
      .split("/\n\n/")
      .flatMap((doubleLine) => {
        // Extract 'times' and 'distances' from the matched pattern in doubleLine
        let [, times, distances] = doubleLine
          .match(/^Time:\s+(.*)\nDistance:\s+(.*)$/)
          // Extract, trim, remove whitespaces, and convert numbers to an array
          .map((numbers) =>
            numbers.trim().replace(/\s/g, "").split(/\s+/g).map(Number)
          );

        const races = [];
        // Create race objects with time, distance, and wayCount properties
        for (let i = 0; i < times.length; i++) {
          races.push({
            time: times[i],
            distance: distances[i],
            wayCount: 0,
          });
        }

        return races; // Return an array of race objects
      })
      .map(({ time, distance }, index, races) => {
        // Calculate wayCount for each race based on the given condition
        for (let i = 1; i <= time; i++) {
          if (i * (time - i) > distance) races[index].wayCount += 1;
        }
        return races[index].wayCount; // Return an array of wayCounts
      })
      .reduce((total, ways) => total * ways)
  ); // Multiply all wayCounts to get the final result
}

// == ASSERTS ==

const example = `Time:      7  15   30
Distance:  9  40  200`;

console.assert(part1(example) === 288);
console.assert(part2(example) === 71503);

const ans1 = part1(input);
const ans2 = part2(input);

console.log({ ans1, ans2 });
