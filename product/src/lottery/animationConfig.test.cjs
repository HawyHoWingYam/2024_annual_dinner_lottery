const test = require("node:test");
const assert = require("node:assert/strict");
const { roofBurstDuration, fullScreenRainDuration } = require("./animationConfig.cjs");

test("lottery reveal defaults to a sustained two-second burst and rain", () => {
  assert.equal(roofBurstDuration, 2);
  assert.equal(fullScreenRainDuration, 2);
});
