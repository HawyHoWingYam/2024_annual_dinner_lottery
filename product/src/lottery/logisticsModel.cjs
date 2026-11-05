const SLOT_COUNT = 30;

function createNameTicker(users) {
  const participants = users.slice();
  let cursor = 0;
  return {
    next() {
      if (participants.length === 0) return null;
      const user = participants[cursor];
      cursor = (cursor + 1) % participants.length;
      return user;
    }
  };
}

function nextSlotIndex(filledSlots) {
  return filledSlots.length >= SLOT_COUNT ? 0 : filledSlots.length;
}

module.exports = { SLOT_COUNT, createNameTicker, nextSlotIndex };
