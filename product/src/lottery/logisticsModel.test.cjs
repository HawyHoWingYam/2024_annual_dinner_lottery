const test = require("node:test");
const assert = require("node:assert/strict");
const { createNameTicker, nextSlotIndex, SLOT_COUNT } = require("./logisticsModel.cjs");

test("name ticker cycles over all participants without changing source records", () => {
  const users = [["1", "Ada", "Ops"], ["2", "Lin", "Sales"]];
  const before = structuredClone(users);
  const ticker = createNameTicker(users);
  assert.deepEqual([ticker.next(), ticker.next(), ticker.next()], [users[0], users[1], users[0]]);
  assert.deepEqual(users, before);
});

test("fixed rice slots fill in order and roll over after thirty", () => {
  let filled = [];
  for (let index = 0; index < SLOT_COUNT; index += 1) {
    const slot = nextSlotIndex(filled);
    assert.equal(slot, index);
    filled = [...filled, slot];
  }
  assert.equal(filled.length, SLOT_COUNT);
  assert.equal(nextSlotIndex(filled), 0);
});
