const path = require("path");
const fs = require("fs");

const input = fs
  .readFileSync(path.join(__dirname, "input.txt"), "utf8")
  .toString()
  .trim();

// == PART 1 ==

function part1(input) {
  // Define the order of card strength.
  const CARD_STRENGTH = "23456789TJQKA";

  return input
    .split("\n") // Split the input string by newline character.
    .map((line) => line.split(" ")) // Split each line into an array of hand and bid.
    .map(([hand, bid]) => ({
      // Map each line to an object with handStrength, handType, and bid.
      handStrength: [...hand]
        .map((card) =>
          CARD_STRENGTH.indexOf(card).toString(CARD_STRENGTH.length)
        ) // Map each card to its strength index.
        .join(""),
      handType: Object.values(
        [...hand].reduce(
          // Count occurrences of each card in the hand.
          (cardCounts, card) => ({
            ...cardCounts,
            [card]: (cardCounts[card] ?? 0) + 1,
          }),
          {}
        )
      )
        .sort((a, b) => b - a) // Sort card counts in descending order.
        .join(""),
      bid: Number(bid), // Convert bid to a number.
    }))
    .sort(
      // Sort hands based on handType and then handStrength.
      (a, b) =>
        a.handType.localeCompare(b.handType) ||
        a.handStrength.localeCompare(b.handStrength)
    )
    .reduce((sum, { bid }, index) => sum + bid * (index + 1), 0);
  // Calculate the sum of bids multiplied by their rank.
}

// == PART 2 ==

function part2(input) {
  // Define the order of card strength.
  const CARD_STRENGTH = "J23456789TQKA";

  return input
    .split("\n") // Split the input string by newline character.
    .map((line) => line.split(" ")) // Split each line into an array of hand and bid.
    .map(([hand, bid]) => {
      // Map each line to an object with handStrength, handType, and bid.
      let cardCounts = [...hand].reduce(
        // Count occurrences of each card in the hand.
        (cardCounts, card) => ({
          ...cardCounts,
          [card]: (cardCounts[card] ?? 0) + 1,
        }),
        {}
      );
      let jCount = cardCounts.J ?? 0;
      delete cardCounts.J; // Remove the J key from cardCounts.
      let cardTotals = Object.values(cardCounts).sort((a, b) => b - a);
      cardTotals[0] = (cardTotals[0] ?? 0) + jCount;
      let handType = cardTotals.join("");

      return {
        handStrength: [...hand]
          .map((card) =>
            CARD_STRENGTH.indexOf(card).toString(CARD_STRENGTH.length)
          ) // Map each card to its strength index.
          .join(""),
        handType,
        bid: Number(bid), // Convert bid to a number.
      };
    })
    .sort(
      // Sort hands based on handType and then handStrength.
      (a, b) =>
        a.handType.localeCompare(b.handType) ||
        a.handStrength.localeCompare(b.handStrength)
    )
    .reduce((sum, { bid }, index) => sum + bid * (index + 1), 0);
  // Calculate the sum of bids multiplied by their rank.
}

// == ASSERTS ==

const example = `32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483`;

console.assert(part1(example) === 6440);
console.assert(part2(example) === 5905);

const ans1 = part1(input);
const ans2 = part2(input);

console.log({ ans1, ans2 });
