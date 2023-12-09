const path = require("path");
const fs = require("fs");

const input = fs
  .readFileSync(path.join(__dirname, "input.txt"), "utf8")
  .toString()
  .trim();

// == PART 1 ==

// This function takes an input string and performs a series of operations on it.
function part1(input) {
  // Split the input into two parts using the double newline ("\n\n") as a delimiter.
  let [instructions, nodes] = input.split("\n\n");

  // Parse the "nodes" part and create an object mapping node names to their left (L) and right (R) connections.
  nodes = Object.fromEntries(
    nodes.split("\n").map((line) => {
      let [, from, L, R] = line.match(/^(\w+) = \((\w+), (\w+)\)$/);
      return [from, { L, R }];
    })
  );

  // Set the initial node to "AAA".
  let currentNode = "AAA";

  // Perform a loop until currentNode becomes "ZZZ".
  for (let steps = 0; ; steps++) {
    // If currentNode is "ZZZ", return the number of steps taken.
    if (currentNode === "ZZZ") return steps;

    // Update currentNode based on the current instruction (L or R) and move to the corresponding node.
    currentNode = nodes[currentNode][instructions[steps % instructions.length]];
  }
}

// == PART 2 ==

// This function takes an input string and performs a different set of operations on it.
function part2(input) {
  // Split the input into two parts using the double newline ("\n\n") as a delimiter.
  let [instructions, nodes] = input.split("\n\n");

  // Parse the "nodes" part and create an object mapping node names to their left (L) and right (R) connections.
  nodes = Object.fromEntries(
    nodes.split("\n").map((line) => {
      let [, from, L, R] = line.match(/^(\w+) = \((\w+), (\w+)\)$/);
      return [from, { L, R }];
    })
  );

  // Get all nodes that end with "A" as initial current nodes.
  let currentNodes = Object.keys(nodes).filter((e) => e.endsWith("A"));
  let leastSteps = [];

  // Perform a loop until there are no more current nodes.
  for (let steps = 0; ; steps++) {
    // Filter out nodes that have reached the destination ("Z").
    currentNodes = currentNodes.filter((currentNode) => {
      if (currentNode.endsWith("Z")) {
        // If a node ends with "Z", record the number of steps taken in leastSteps array.
        leastSteps.push(steps);
        return false;
      }
      return true;
    });

    // If there are no more current nodes, break out of the loop.
    if (currentNodes.length === 0) break;

    // Update currentNodes based on the current instruction (L or R) for each node.
    currentNodes = currentNodes.map((u) => {
      return nodes[u][instructions[steps % instructions.length]];
    });
  }

  // Define a function to find the greatest common divisor (GCD) using the Euclidean algorithm.
  function greatestCommonDivisor(a, b) {
    while (b !== 0) {
      [a, b] = [b, a % b];
    }
    return a;
  }

  // Define a function to find the least common multiple (LCM) using the GCD formula.
  function leastCommonMultiple(a, b) {
    return (a * b) / greatestCommonDivisor(a, b);
  }

  // Calculate and return the least common multiple of all recorded leastSteps values.
  return leastSteps.reduce(leastCommonMultiple);
}

// == ASSERTS ==

console.assert(
  part1(
    `RL

AAA = (BBB, CCC)
BBB = (DDD, EEE)
CCC = (ZZZ, GGG)
DDD = (DDD, DDD)
EEE = (EEE, EEE)
GGG = (GGG, GGG)
ZZZ = (ZZZ, ZZZ)`
  ) === 2
);
console.assert(
  part1(
    `LLR

AAA = (BBB, BBB)
BBB = (AAA, ZZZ)
ZZZ = (ZZZ, ZZZ)`
  ) === 6
);

console.assert(
  part2(
    `LR

11A = (11B, XXX)
11B = (XXX, 11Z)
11Z = (11B, XXX)
22A = (22B, XXX)
22B = (22C, 22C)
22C = (22Z, 22Z)
22Z = (22B, 22B)
XXX = (XXX, XXX)`
  ) === 6
);

const ans1 = part1(input);
const ans2 = part2(input);

console.log({ ans1, ans2 });
