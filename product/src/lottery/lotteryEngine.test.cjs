const test = require("node:test");
const assert = require("node:assert/strict");
const { drawWinners, assignPrizes, findNextPrizeIndex } = require("./lotteryEngine.cjs");

test("draw respects draw count, prize capacity, and unique participant IDs", () => {
  const users = [["1", "Ada", "Ops", 1], ["2", "Lin", "Sales", 1], ["3", "Jo", "HR", 1]];
  const result = drawWinners({ users, count: 2, drawCount: 3, kind: 1, random: () => 0 });
  assert.equal(result.winners.length, 2);
  assert.equal(new Set(result.winners.map(user => user[0])).size, 2);
  assert.deepEqual(result.remaining.map(user => user[0]), ["3"]);
});

test("third-prize draws exclude VIPs while keeping them in the remaining pool", () => {
  const vip = ["vip", "VIP", "Ops", 2];
  const staff = ["staff", "Staff", "Sales", 1];
  const result = drawWinners({ users: [vip, staff], count: 1, drawCount: 1, kind: 3, random: () => 0 });
  assert.deepEqual(result.winners, [staff]);
  assert.deepEqual(result.remaining, [vip]);
});

test("assignPrizes allocates only configured prize quantities", () => {
  const winners = [["1", "Ada"], ["2", "Lin"], ["3", "Jo"]];
  const assignments = assignPrizes(winners, { Coffee: 1, Movie: 2 }, () => 0);
  assert.deepEqual(assignments.map(item => item.prize), ["Coffee", "Movie", "Movie"]);
});

test("next prize selection starts with the lowest prize and moves upward only when needed", () => {
  const prizes = [{ type: 6, count: 1 }, { type: 5, count: 2 }, { type: 4, count: 5 }];
  assert.equal(findNextPrizeIndex(prizes, {}), 2);
  assert.equal(findNextPrizeIndex(prizes, { 4: [["1"], ["2"], ["3"], ["4"], ["5"]] }), 1);
  assert.equal(findNextPrizeIndex(prizes, { 6: [["1"]], 5: [["2"], ["3"]] }), 2);
  assert.equal(findNextPrizeIndex(prizes, { 6: [["1"]], 5: [["2"], ["3"]], 4: [["4"], ["5"], ["6"], ["7"], ["8"]] }), -1);
});
