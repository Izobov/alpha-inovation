const solve = require("../algorithm/solve"); // замените на путь к вашей функции solve
const { expect } = require("chai");

const cases = [
  {
    wordList: ["ab", "bc", "cd"],
    target: "abcd",
    result: ["ab", "cd"],
  },
  {
    wordList: ["ab", "bc", "cd"],
    target: "cdab",
    result: ["ab", "cd"],
  },
  {
    wordList: ["ab", "bc", "cd"],
    target: "abab",
    result: "None",
  },
  {
    wordList: ["ab", "bc", "ab"],
    target: "abab",
    result: ["ab", "ab"],
  },
  {
    wordList: ["Ab", "bc", "ab"],
    target: "abab",
    result: "None",
  },
];
describe("solve function", () => {
  cases.forEach(({ wordList, target, result }) => {
    it(`should return ${result} for List: '${wordList}' and Target: ${target}`, () => {
      expect(solve(wordList, target)).to.eql(result);
    });
  });
});
