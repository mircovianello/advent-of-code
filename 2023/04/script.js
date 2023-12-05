const path = require("path");
const fs = require("fs");

const input = fs
  .readFileSync(path.join(__dirname, "input.txt"), "utf8")
  .toString()
  .trim();

// == PART 1 ==

// Function to calculate points based on matching numbers in a bingo-style game
function part1(input) {
  return (
    input
      // Split the input into lines and process each line
      .split("\n")
      .map((line) => {
        // Use regular expression to match lines with card numbers and extract winningNumbers and myNumbers
        let [, winningNumbers, myNumbers] = line
          .match(/^Card +\d+:\s+((?:\d+\s+)+)\|((?:\s+\d+)+)$/)
          .map((numbers) => numbers.trim().split(/\s+/g).map(Number));
        return { winningNumbers, myNumbers };
      })
      // Calculate points for each card based on matching numbers
      .map(({ winningNumbers, myNumbers }) => {
        // Count the number of matching numbers between myNumbers and winningNumbers
        let matchCount = myNumbers.filter((f) =>
          winningNumbers.includes(f)
        ).length;
        // Calculate points based on the number of matches
        return matchCount > 0 ? 2 ** (matchCount - 1) : 0;
      })
      // Sum up the total points across all cards
      .reduce((total, points) => total + points, 0)
  );
}

// == PART 2 ==

// Function to calculate the total number of cards with matching numbers in a bingo-style game
function part2(input) {
  return (
    input
      // Split the input into lines and process each line
      .split("\n")
      .map((line) => {
        // Use regular expression to match lines with card numbers and extract winningNumbers and myNumbers
        let [, winningNumbers, myNumbers] = line
          .match(/^Card +\d+:\s+((?:\d+\s+)+)\|((?:\s+\d+)+)$/)
          .map((numbers) => numbers.trim().split(/\s+/g).map(Number));
        return { winningNumbers, myNumbers, cardCount: 1 };
      })
      // Update the cardCount for cards that have matching numbers
      .map(({ winningNumbers, myNumbers, cardCount }, index, cards) => {
        // Count the number of matching numbers between myNumbers and winningNumbers
        let matchCount = myNumbers.filter((f) =>
          winningNumbers.includes(f)
        ).length;
        // Update the cardCount for subsequent cards with matching numbers
        for (let i = 1; i <= matchCount && index + i < cards.length; i++) {
          cards[index + i].cardCount += cardCount;
        }
        // Return the original cardCount for the current card
        return cardCount;
      })
      // Sum up the total number of cards with matching numbers
      .reduce((total, count) => total + count, 0)
  );
}

// == ASSERTS ==

console.assert(
  part1(
    `Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11`
  ) === 13
);

console.assert(
  part2(
    `Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11`
  ) === 30
);

const ans1 = part1(input);
const ans2 = part2(input);

console.log({ ans1, ans2 });
