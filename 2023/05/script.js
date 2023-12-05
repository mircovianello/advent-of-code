const path = require("path");
const fs = require("fs");

const input = fs
  .readFileSync(path.join(__dirname, "input.txt"), "utf8")
  .toString()
  .trim();

// == PART 1 ==

// Function to process input and calculate the minimum location number
function part1(input) {
  // Split the input into seed numbers and category maps
  let [seedNumbers, ...categoriesMaps] = input.split("\n\n");

  // Extract seed numbers and convert them to an array of numbers
  seedNumbers = seedNumbers.split(" ").slice(1).map(Number);

  // Process each category map block
  categoriesMaps = categoriesMaps.map((block) =>
    block
      .split("\n")
      .slice(1)
      .map((line) => line.split(" ").map(Number))
      .map(([destRangeStart, srcRangeStart, rangeLength]) => ({
        destRangeStart,
        srcRangeStart,
        rangeLength,
      }))
  );
  // Apply category maps to seed numbers to calculate the final location numbers
  return (
    categoriesMaps
      .reduce(
        (itemNumbers, maps) =>
          itemNumbers.map((fromItemNumber) => {
            let map = maps.find(
              ({ srcRangeStart, rangeLength }) =>
                srcRangeStart <= fromItemNumber &&
                srcRangeStart + rangeLength > fromItemNumber
            );
            return map
              ? fromItemNumber - map.srcRangeStart + map.destRangeStart
              : fromItemNumber;
          }),
        seedNumbers
      )
      // Find the minimum location number
      .reduce(
        (minNumber, locationNumber) => Math.min(minNumber, locationNumber),
        Infinity
      )
  );
}

// == PART 2 ==

// Function to process input and calculate the minimum start location number
function part2(input) {
  // Split the input into seed numbers and category maps
  let [seedNumbers, ...categoriesMaps] = input.split("\n\n");

  // Extract seed numbers and convert them to an array of ranges
  seedNumbers = [...seedNumbers.matchAll(/(\d+) (\d+)/g)]
    .map((numbers) => numbers.map(Number))
    .map(([, start, length]) => ({
      start,
      end: start + length,
    }));

  // Process each category map block
  categoriesMaps = categoriesMaps.map((block) =>
    block
      .split("\n")
      .slice(1)
      .map((line) => line.split(" ").map(Number))
      .map(([destStart, srcStart, length]) => ({
        start: srcStart,
        end: srcStart + length,
        diff: destStart - srcStart,
      }))
  );

  // Apply category maps to seed ranges to calculate the final ranges
  return (
    categoriesMaps
      .reduce((numbers, maps) => {
        return numbers.flatMap(({ start, end }) => {
          let nextNumbers = [];

          for (let currentStart = start; currentStart < end; ) {
            let map = maps.find(
              ({ start, end }) => start <= currentStart && end > currentStart
            );

            if (!map) {
              let nextStart = maps
                .map(({ start }) => start)
                .filter((start) => start > currentStart)
                .reduce(
                  (minStart, start) => Math.min(minStart, start),
                  Infinity
                );

              map = {
                start: currentStart,
                end: Math.min(end, nextStart),
                diff: 0,
              };
            }

            let destStart = currentStart + map.diff;
            let destEnd = Math.min(map.end, end) + map.diff;
            nextNumbers.push({ start: destStart, end: destEnd });

            currentStart += destEnd - destStart;
          }

          return nextNumbers;
        });
      }, seedNumbers)
      // Find the minimum start location number
      .reduce((minStart, { start }) => Math.min(minStart, start), Infinity)
  );
}

// == ASSERTS ==

const example = `seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70

light-to-temperature map:
45 77 23
81 45 19
68 64 13

temperature-to-humidity map:
0 69 1
1 0 69

humidity-to-location map:
60 56 37
56 93 4`;

console.assert(part1(example) === 35);
console.assert(part2(example) === 46);

const ans1 = part1(input);
const ans2 = part2(input);

console.log({ ans1, ans2 });
