function drawWinners({ users, count, drawCount, kind, previousWinners = [], random = Math.random }) {
  const target = Math.max(0, Math.min(drawCount, count - previousWinners.length));
  const existingIds = new Set(previousWinners.map(user => user[0]));
  const pool = users.filter(user => !existingIds.has(user[0]) && !(kind === 3 && user[3] === 2));
  const remainingPool = [...pool];
  const winners = [];

  while (winners.length < target && remainingPool.length > 0) {
    const index = Math.min(remainingPool.length - 1, Math.floor(random() * remainingPool.length));
    winners.push(remainingPool.splice(index, 1)[0]);
  }

  const selectedIds = new Set(winners.map(user => user[0]));
  return { winners, remaining: users.filter(user => !existingIds.has(user[0]) && !selectedIds.has(user[0])) };
}

function assignPrizes(winners, prizeList, random = Math.random) {
  const inventory = { ...prizeList };
  return winners.map(winner => {
    const available = Object.entries(inventory).filter(([, quantity]) => quantity > 0);
    if (!available.length) return { winner, prize: "" };
    const index = Math.min(available.length - 1, Math.floor(random() * available.length));
    const [prize] = available[index];
    inventory[prize] -= 1;
    return { winner, prize };
  });
}

function findNextPrizeIndex(prizes, luckyUsers) {
  for (let index = prizes.length - 1; index >= 0; index -= 1) {
    const prize = prizes[index];
    if ((luckyUsers[prize.type]?.length || 0) < prize.count) return index;
  }
  return -1;
}

module.exports = { drawWinners, assignPrizes, findNextPrizeIndex };
