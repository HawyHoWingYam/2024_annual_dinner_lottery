import "./index.css";
import { gsap } from "gsap";
import { drawWinners, assignPrizes, findNextPrizeIndex } from "./lotteryEngine.cjs";
const { SLOT_COUNT } = require("./logisticsModel.cjs");
const { roofBurstDuration, fullScreenRainDuration } = require("./animationConfig.cjs");

const app = document.querySelector("#app");
const state = {
  prizes: [], users: [], leftUsers: [], luckyUsers: {}, eachCount: [],
  currentPrizeIndex: -1, busy: false, currentRack: null, rackCount: 0,
  restockTimeline: null, exitTimelines: [], revealTimeline: null, pollTimer: null, toastTimer: null,
  workers: [], restockCycles: 0, rainScene: null
};

app.innerHTML = `
  <div class="app-shell">
    <header class="topbar">
      <div class="brand"><span class="brand-mark">米</span><div><h1>飯糰工坊</h1><p>HANA ANNUAL GATHERING</p></div></div>
      <div class="top-actions"><span class="status-pill"><i class="status-dot"></i><span id="lineStatus">正在準備店鋪</span></span></div>
    </header>
    <main class="main-layout">
      <aside class="prize-panel"><div class="panel-kicker">PRIZE CATALOG</div><h2 class="panel-title">獎項一覽</h2><div id="prizeList" class="prize-list"></div></aside>
      <section class="stage" aria-label="飯糰工坊補貨與抽獎舞台">
        <div class="stage-glow"></div>
        <div class="scene-caption"><strong>HANA ONIGIRI WORKS</strong><span>一顆一顆補滿好運</span></div>
        <div class="shop-scene">
          <img class="shopfront-image" src="img/onigiri-shopfront.svg" alt="">
          <div id="rackBay" class="rack-bay" aria-label="店鋪展示貨架"></div>
          <div class="roof-hatch" id="roofHatch" aria-hidden="true"><span class="hatch-door hatch-door-left"></span><span class="hatch-door hatch-door-right"></span></div>
          <div id="workerLine" class="worker-line" aria-hidden="true"></div>
          <div class="rack-readout"><span class="rack-dot"></span><span>今日補貨</span><strong id="rackCount">0 / 30</strong></div>
        </div>
        <div class="stage-floor-shadow"></div>
      </section>
      <aside class="draw-panel"><div class="panel-kicker">NOW DRAWING</div><h2 id="drawPrize" class="draw-prize">載入獎項中</h2><p id="drawDetail" class="draw-detail">請稍候</p><div class="draw-counter"><strong id="drawRemaining">—</strong><span>名額待揭曉</span></div><button id="drawButton" class="primary-button" disabled>開始抽獎　✦</button><div class="secondary-actions"><button id="skipButton" class="secondary-button">跳過此獎項</button><button id="resetButton" class="secondary-button">重置</button></div><p class="draw-hint">按空白鍵也可以開始抽獎</p></aside>
    </main>
    <footer class="footer"><span>一口飯糰，一份好運。 <b>祝大家滿載而歸。</b></span><span>HANA <b>·</b> GOOD THINGS ARE COOKING</span></footer>
  </div>
  <section id="drawMoment" class="draw-moment" aria-hidden="true" aria-live="assertive">
    <div class="draw-wash"></div>
    <div id="rainField" class="rain-field" aria-hidden="true"></div>
    <div id="winnerReveal" class="winner-reveal">
      <header class="winner-heading"><div class="reveal-eyebrow">HANA LUCKY DRAW</div><h2>好運出爐</h2><p id="revealPrize" class="reveal-prize"></p></header>
      <div id="winnerGrid" class="winner-grid" aria-label="得獎者"></div>
      <p class="reveal-bottom">恭喜得獎者！</p>
    </div>
  </section>
  <div id="toast" class="toast is-hidden" role="status"></div>`;

const dom = {
  prizeList: document.querySelector("#prizeList"), drawPrize: document.querySelector("#drawPrize"),
  drawDetail: document.querySelector("#drawDetail"), remaining: document.querySelector("#drawRemaining"),
  drawButton: document.querySelector("#drawButton"), skipButton: document.querySelector("#skipButton"),
  resetButton: document.querySelector("#resetButton"), rackBay: document.querySelector("#rackBay"),
  rackCount: document.querySelector("#rackCount"), workerLine: document.querySelector("#workerLine"), hatch: document.querySelector("#roofHatch"),
  drawMoment: document.querySelector("#drawMoment"), drawWash: document.querySelector(".draw-wash"), rainField: document.querySelector("#rainField"),
  winnerReveal: document.querySelector("#winnerReveal"), winnerGrid: document.querySelector("#winnerGrid"),
  revealPrize: document.querySelector("#revealPrize"), lineStatus: document.querySelector("#lineStatus"),
  toast: document.querySelector("#toast")
};

const holdingFrames = Array.from({ length: 8 }, (_, index) => `anim-walk-${String(index + 1).padStart(2, "0")}`);
const emptyWalkFrames = Array.from({ length: 8 }, (_, index) => `anim-carry-${String(index + 1).padStart(2, "0")}`);
const putFrames = Array.from({ length: 6 }, (_, index) => `anim-put-${String(index + 1).padStart(2, "0")}`);
const WALK_FRAME_RATE = 12;
const rainSprite = new Image();
rainSprite.src = "img/onigiri-rain.svg";
const rackSlots = Array.from({ length: SLOT_COUNT }, (_, index) => {
  const row = Math.floor(index / 10);
  const column = index % 10;
  return { left: (99 + column * 77) / 960 * 100, top: [44, 149, 255][row] / 416 * 100 };
});

function api(url, data = {}) {
  return fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }).then(response => {
    if (!response.ok) throw new Error(`Request failed: ${url}`);
    return response.json();
  });
}

function showToast(message) {
  dom.toast.textContent = message;
  dom.toast.classList.remove("is-hidden");
  clearTimeout(state.toastTimer);
  state.toastTimer = setTimeout(() => dom.toast.classList.add("is-hidden"), 2800);
}

function currentPrize() { return state.prizes[state.currentPrizeIndex] || null; }
function remainingCount(prize) { return Math.max(0, prize.count - (state.luckyUsers[prize.type]?.length || 0)); }

function render() {
  const prize = currentPrize();
  dom.prizeList.replaceChildren(...state.prizes.filter(item => item.type !== 0).map(item => {
    const won = state.luckyUsers[item.type]?.length || 0;
    const remaining = Math.max(0, item.count - won);
    const card = document.createElement("article");
    card.className = `prize-card${prize?.type === item.type ? " is-current" : ""}`;
    const thumb = document.createElement("div"); thumb.className = "prize-thumb";
    if (item.images?.[0]) {
      const image = document.createElement("img"); image.src = `server/data/img/${encodeURIComponent(item.images[0])}`; image.alt = "";
      image.onerror = () => { image.remove(); thumb.innerHTML = '<span class="prize-placeholder">✦</span>'; };
      thumb.append(image);
    } else { thumb.innerHTML = '<span class="prize-placeholder">✦</span>'; }
    const content = document.createElement("div");
    const name = document.createElement("h3"); name.className = "prize-name"; name.textContent = item.text || item.title || "獎項";
    const sponsor = document.createElement("p"); sponsor.className = "prize-sponsor"; sponsor.textContent = item.title && item.title !== item.text ? item.title : `${item.count} 個名額`;
    const track = document.createElement("div"); track.className = "progress-track";
    const fill = document.createElement("div"); fill.className = "progress-fill"; fill.style.width = `${item.count ? won / item.count * 100 : 0}%`; track.append(fill);
    const copy = document.createElement("div"); copy.className = "progress-copy";
    const status = document.createElement("span"); status.textContent = remaining ? `${won}/${item.count} 已抽出` : "已完成"; if (!remaining) status.className = "done-label";
    const amount = document.createElement("span"); amount.textContent = remaining ? `剩 ${remaining}` : "✓";
    copy.append(status, amount); content.append(name, sponsor, track, copy); card.append(thumb, content); return card;
  }));
  if (!prize) {
    dom.drawPrize.textContent = "抽獎圓滿完成"; dom.drawDetail.textContent = "所有獎項都已經找到主人";
    dom.remaining.textContent = "0"; dom.drawButton.disabled = true; dom.drawButton.textContent = "全部抽出 ✦"; return;
  }
  dom.drawPrize.textContent = prize.text || prize.title;
  dom.drawDetail.textContent = prize.title && prize.title !== prize.text ? prize.title : `${prize.count} 位幸運得主`;
  dom.remaining.textContent = String(remainingCount(prize));
  dom.drawButton.disabled = state.busy || remainingCount(prize) === 0;
  dom.drawButton.textContent = state.busy ? "正在揭曉…" : "開始抽獎　✦";
  dom.skipButton.disabled = state.busy || state.currentPrizeIndex <= 0;
}

function setWorkerFrame(worker, frame) {
  const sprite = worker.querySelector(".worker-sprite");
  worker.classList.toggle("is-putting", frame.startsWith("anim-put-"));
  const source = `worker/${frame}.png`;
  if (sprite.getAttribute("src") !== source) sprite.src = source;
}

function frameUpdater(frames, worker) {
  return function() {
    const frameIndex = Math.floor(this.time() * WALK_FRAME_RATE) % frames.length;
    setWorkerFrame(worker, frames[frameIndex]);
  };
}

function pauseRestockAnimations() {
  state.restockTimeline?.pause();
  state.exitTimelines.forEach(timeline => timeline.pause());
}

function resumeRestockAnimations() {
  state.restockTimeline?.resume();
  state.exitTimelines.forEach(timeline => timeline.resume());
}

function createWorkerExit(worker, exitX, duration) {
  const timeline = gsap.to(worker, {
    x: exitX,
    duration,
    ease: "none",
    onUpdate: frameUpdater(emptyWalkFrames, worker),
    onComplete: () => {
      worker.remove();
      state.exitTimelines = state.exitTimelines.filter(activeTimeline => activeTimeline !== timeline);
    }
  });
  state.exitTimelines.push(timeline);
  return timeline;
}

function createRack() {
  const rack = document.createElement("div");
  rack.className = "rack-layer";
  rack.setAttribute("aria-hidden", "true");
  const shelf = document.createElement("img");
  shelf.className = "rack-frame"; shelf.src = "img/onigiri-shelf-empty.svg"; shelf.alt = "";
  const goods = document.createElement("div"); goods.className = "rack-goods";
  rack.append(shelf, goods);
  return rack;
}

function updateRackCount() {
  dom.rackCount.textContent = `${state.rackCount} / ${SLOT_COUNT}`;
  dom.rackCount.setAttribute("aria-label", `貨架已補 ${state.rackCount} 顆，共 ${SLOT_COUNT} 顆`);
}

function placeRiceball() {
  if (!state.currentRack || state.rackCount >= SLOT_COUNT) return;
  const slot = rackSlots[state.rackCount];
  const item = document.createElement("img");
  item.className = "shelf-onigiri"; item.src = "img/onigiri-plain.svg"; item.alt = "";
  item.style.left = `${slot.left}%`; item.style.top = `${slot.top}%`;
  state.currentRack.querySelector(".rack-goods").append(item);
  gsap.fromTo(item, { y: -22, scale: .45, autoAlpha: 0 }, { y: 0, scale: 1, autoAlpha: 1, duration: .42, ease: "back.out(1.9)" });
  state.rackCount += 1;
  updateRackCount();
}

function workerQueueX(index, sceneWidth) { return sceneWidth * (.025 + index * .075); }

function createQueuedWorker(index, sceneWidth) {
  const worker = document.createElement("div");
  worker.className = "restock-worker is-waiting";
  worker.style.animationDelay = `${-index * .24}s`;
  const sprite = document.createElement("img");
  sprite.className = "worker-sprite"; sprite.src = `worker/${holdingFrames[index % holdingFrames.length]}.png`; sprite.alt = "";
  worker.append(sprite); dom.workerLine.append(worker);
  gsap.set(worker, { x: workerQueueX(index, sceneWidth), autoAlpha: 1, scale: .94, y: 2 });
  return worker;
}

function createWorkerLine() {
  dom.workerLine.replaceChildren();
  const sceneWidth = dom.workerLine.closest(".shop-scene").clientWidth;
  state.workers = Array.from({ length: 6 }, (_, index) => createQueuedWorker(index, sceneWidth));
}

function exchangeRack(onComplete) {
  if (!state.currentRack) return null;
  const oldRack = state.currentRack;
  const freshRack = createRack();
  dom.rackBay.append(freshRack);
  gsap.set(oldRack, { yPercent: 0, autoAlpha: 1 });
  gsap.set(freshRack, { yPercent: 112, autoAlpha: 1 });
  dom.workerLine.classList.add("is-paused");
  pauseRestockAnimations();
  dom.lineStatus.textContent = "滿架退出中，店員稍候";

  const timeline = gsap.timeline({ onComplete: () => {
    oldRack.remove();
    freshRack.classList.add("is-current-rack");
    state.currentRack = freshRack;
    state.rackCount = 0;
    updateRackCount();
    state.restockTimeline = null;
    dom.workerLine.classList.remove("is-paused");
    dom.lineStatus.textContent = "空架到位，店員接續補貨";
    if (!state.busy) {
      resumeRestockAnimations();
      if (onComplete) onComplete();
    }
  }});
  timeline.to(oldRack, { yPercent: 118, autoAlpha: 0, duration: .86, ease: "power2.in" }, 0)
    .call(() => oldRack.remove(), [], .9)
    .set(freshRack, { yPercent: 112, autoAlpha: 1 }, .92)
    .to(freshRack, { yPercent: 0, duration: 1.12, ease: "back.out(1.2)" }, .92)
    .to(dom.rackBay, { x: 3, repeat: 5, yoyo: true, duration: .055, ease: "none" }, 2.02)
    .to(dom.rackBay, { x: 0, duration: .1, ease: "power1.out" }, 2.68);
  state.restockTimeline = timeline;
  return timeline;
}

function runRestockCycle() {
  if (state.busy || !state.currentRack || state.workers.length < 2) return;
  const worker = state.workers[state.workers.length - 1];
  const waiting = state.workers.slice(0, -1);
  const sceneWidth = dom.workerLine.closest(".shop-scene").clientWidth;
  const workerWidth = worker.getBoundingClientRect().width || sceneWidth * .1;
  const shelfX = sceneWidth * .46;
  const exitX = sceneWidth + workerWidth;
  const approachDuration = .86;
  const placeAt = .88;
  const putFrameInterval = 1 / WALK_FRAME_RATE;
  const putCompleteAt = placeAt + (putFrames.length - 1) * putFrameInterval;
  const exitStartAt = putCompleteAt + putFrameInterval + .08;
  const nextCycleDelay = .12;
  const cycleInterval = exitStartAt + nextCycleDelay;
  const queueSpacing = workerQueueX(1, sceneWidth) - workerQueueX(0, sceneWidth);
  const exitDuration = (exitX - shelfX) / queueSpacing * cycleInterval;
  worker.classList.remove("is-waiting"); worker.classList.add("is-serving");
  setWorkerFrame(worker, holdingFrames[0]);
  dom.lineStatus.textContent = "店員排隊補貨中";

  const nextWorker = createQueuedWorker(0, sceneWidth);
  const nextWorkerWidth = nextWorker.getBoundingClientRect().width || sceneWidth * .1;
  gsap.set(nextWorker, { x: -nextWorkerWidth * 1.1, autoAlpha: 0, scale: .94, y: 2 });
  setWorkerFrame(nextWorker, holdingFrames[state.restockCycles % holdingFrames.length]);
  const timeline = gsap.timeline({ onComplete: () => {
    state.workers = [nextWorker, ...waiting];
    state.restockCycles += 1;
    state.restockTimeline = null;
    if (state.busy) return;
    if (state.rackCount >= SLOT_COUNT) {
      exchangeRack(() => { if (!state.busy) state.restockTimeline = gsap.delayedCall(nextCycleDelay, runRestockCycle); });
    } else {
      state.restockTimeline = gsap.delayedCall(nextCycleDelay, runRestockCycle);
    }
  }});
  timeline.to(worker, { x: shelfX, duration: approachDuration, ease: "power2.out", onUpdate: frameUpdater(holdingFrames, worker) }, 0);
  putFrames.forEach((frame, index) => {
    const frameAt = placeAt + index * putFrameInterval;
    timeline.call(() => setWorkerFrame(worker, frame), [], frameAt);
    if (index === 4) timeline.call(placeRiceball, [], frameAt);
  });
  timeline.call(() => setWorkerFrame(worker, emptyWalkFrames[0]), [], exitStartAt - .01)
    .call(() => createWorkerExit(worker, exitX, exitDuration), [], exitStartAt);
  waiting.forEach((waitingWorker, index) => {
    timeline.to(waitingWorker, { x: workerQueueX(index + 1, sceneWidth), duration: exitStartAt, ease: "none", onUpdate: frameUpdater(holdingFrames, waitingWorker) }, 0);
  });
  timeline.to(nextWorker, { x: workerQueueX(0, sceneWidth), autoAlpha: 1, duration: exitStartAt, ease: "none", onUpdate: frameUpdater(holdingFrames, nextWorker) }, 0);
  state.restockTimeline = timeline;
}

function createRainfall(reducedMotion, burstDuration, rainDuration) {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const hatchBounds = dom.hatch.getBoundingClientRect();
  const originX = hatchBounds.left + hatchBounds.width / 2;
  const originY = hatchBounds.top + hatchBounds.height / 2;
  const burstColumns = reducedMotion ? 12 : Math.min(32, Math.max(1, Math.ceil(width / 52)));
  const burstRows = reducedMotion ? 1 : 8;
  const burstCount = reducedMotion ? 12 : burstColumns * burstRows;
  const lastBurstDelay = burstDuration * .38;
  const firstWaveEnd = Math.min(.14, lastBurstDelay * .12);
  const burst = [];

  for (let index = 0; index < burstCount; index += 1) {
    const size = 68 + Math.random() * (reducedMotion ? 24 : 44);
    const row = Math.floor(index / burstColumns);
    const column = index % burstColumns;
    const progress = reducedMotion ? .55 : (row + .5) / burstRows;
    const rowOffset = row % 2 ? .5 : 0;
    const across = ((column + .5 + rowOffset + (Math.random() - .5) * .2) / burstColumns) * 2 - 1;
    const targetCenterX = Math.min(width - size / 2, Math.max(size / 2, originX + across * width * .5));
    const targetCenterY = reducedMotion
      ? -Math.max(size * .8, height * .12)
      : -height * (.12 + .88 * progress);
    const delay = Math.random() < .62
      ? Math.random() * firstWaveEnd
      : firstWaveEnd + Math.random() * Math.max(0, lastBurstDelay - firstWaveEnd);
    burst.push({
      x: originX - size / 2,
      y: originY - size / 2,
      size,
      targetX: targetCenterX - size / 2,
      targetY: targetCenterY - size / 2,
      delay,
      duration: Math.max(.22, burstDuration - delay),
      scale: .92 + Math.random() * .24,
      rotation: (-18 + Math.random() * 36) * Math.PI / 180,
      turn: (-85 + Math.random() * 170) * Math.PI / 180
    });
  }

  const columns = Math.max(1, Math.ceil(width / 62));
  const rowsPerScreen = Math.max(1, Math.ceil(height / 64));
  const particleBudget = Math.min(900, Math.max(650, Math.round(width * height / 1750)));
  const maxRainRows = Math.max(1, Math.floor(particleBudget / columns));
  const rainRows = Math.min(reducedMotion ? 4 : rowsPerScreen * 2, maxRainRows);
  const rainCount = columns * rainRows;
  const cellWidth = width / columns;
  const cellHeight = height * 2 / rainRows;
  const fallers = [];

  for (let index = 0; index < rainCount; index += 1) {
    const size = 68 + Math.random() * 42;
    const row = Math.floor(index / columns);
    const column = index % columns;
    const stagger = row % 2 ? .5 : 0;
    const centerX = ((column + stagger + .5) % columns) * cellWidth
      + (Math.random() - .5) * cellWidth * .14;
    const centerY = -height + (row + .5) * cellHeight
      + (Math.random() - .5) * cellHeight * .12;
    const delay = Math.random() * Math.min(reducedMotion ? .08 : .18, rainDuration * .1);
    fallers.push({
      x: Math.min(width - size * .45, Math.max(-size * .55, centerX - size / 2)),
      y: centerY - size / 2,
      endY: centerY - size / 2 + height * (.92 + Math.random() * .16),
      size,
      delay,
      duration: Math.max(.2, rainDuration - delay),
      rotation: (-18 + Math.random() * 36) * Math.PI / 180,
      turn: (-70 + Math.random() * 140) * Math.PI / 180,
      drift: -width * .025 + Math.random() * width * .05,
      scale: .82 + Math.random() * .36
    });
  }

  const canvas = document.createElement("canvas");
  canvas.className = "rain-canvas";
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
  canvas.width = Math.round(width * pixelRatio);
  canvas.height = Math.round(height * pixelRatio);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  const context = canvas.getContext("2d", { alpha: true, desynchronized: true });
  if (context) context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  dom.rainField.replaceChildren(canvas);

  return { canvas, context, pixelRatio, width, height, originX, originY, burst, fallers, burstDuration, rainDuration };
}

function drawRainSprite(context, x, y, size, scale, rotation, alpha, width, height, pixelRatio) {
  if (alpha <= 0) return;
  const spriteHeight = size * 112 / 120;
  const reach = size * scale * .8;
  if (x + size / 2 + reach < 0 || x + size / 2 - reach > width
    || y + spriteHeight / 2 + reach < 0 || y + spriteHeight / 2 - reach > height) return;
  const cosine = Math.cos(rotation) * scale * pixelRatio;
  const sine = Math.sin(rotation) * scale * pixelRatio;
  context.setTransform(cosine, sine, -sine, cosine, (x + size / 2) * pixelRatio, (y + spriteHeight / 2) * pixelRatio);
  context.globalAlpha = alpha;
  context.drawImage(rainSprite, -size / 2, -spriteHeight / 2, size, spriteHeight);
}

function renderRainfall(scene, timelineTime, sprayStart, rainStart) {
  const { context, pixelRatio, width, height, burst, fallers } = scene;
  if (!context || !rainSprite.complete || !rainSprite.naturalWidth || scene.finished) return;
  context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  context.globalAlpha = 1;
  context.clearRect(0, 0, width, height);
  if (timelineTime >= rainStart + scene.rainDuration) {
    scene.finished = true;
    return;
  }

  const burstElapsed = timelineTime - sprayStart;
  if (burstElapsed >= 0 && burstElapsed < scene.burstDuration) {
    for (let index = 0; index < burst.length; index += 1) {
      const particle = burst[index];
      const progress = (burstElapsed - particle.delay) / particle.duration;
      if (progress < 0 || progress >= 1) continue;
      const eased = progress * progress;
      const x = particle.x + (particle.targetX - particle.x) * eased;
      const y = particle.y + (particle.targetY - particle.y) * eased;
      const scale = .2 + (particle.scale - .2) * Math.min(1, progress * 1.8);
      const rotation = particle.rotation + (particle.turn - particle.rotation) * eased;
      const alpha = .96 * Math.min(1, progress * 8);
      drawRainSprite(context, x, y, particle.size, scale, rotation, alpha, width, height, pixelRatio);
    }
  }

  const rainElapsed = timelineTime - rainStart;
  if (rainElapsed >= 0) {
    for (let index = 0; index < fallers.length; index += 1) {
      const particle = fallers[index];
      const progress = (rainElapsed - particle.delay) / particle.duration;
      if (progress < 0 || progress >= 1) continue;
      const eased = progress * progress;
      const x = particle.x + particle.drift * eased;
      const y = particle.y + (particle.endY - particle.y) * eased;
      const rotation = particle.rotation + (particle.turn - particle.rotation) * eased;
      drawRainSprite(context, x, y, particle.size, particle.scale, rotation, .96, width, height, pixelRatio);
    }
  }
}


function buildWinnerCards(winners, assignments) {
  dom.winnerGrid.replaceChildren(...winners.map((winner, index) => {
    const card = document.createElement("article"); card.className = "winner-card";
    const ball = document.createElement("div"); ball.className = "winner-ball";
    const image = document.createElement("img"); image.src = "img/onigiri-plain.svg"; image.alt = "";
    const name = document.createElement("span"); name.className = "winner-name"; name.textContent = winner[1] || "幸運得主";
    ball.append(image, name);
    const item = document.createElement("span"); item.className = "winner-prize"; item.textContent = assignments[index]?.prize || "恭喜得獎";
    card.append(ball, item); return card;
  }));
}

function openReveal(prize, winners, assignments) {
  pauseRestockAnimations();
  dom.hatch.classList.add("is-open");
  dom.revealPrize.textContent = prize.text || prize.title;
  buildWinnerCards(winners, assignments);
  dom.drawMoment.classList.add("is-active");
  dom.drawMoment.setAttribute("aria-hidden", "false");
  gsap.set(dom.drawWash, { autoAlpha: 0 });
  gsap.set(dom.rainField, { autoAlpha: 0 });
  gsap.set(dom.winnerReveal, { autoAlpha: 0 });
  gsap.set(dom.winnerGrid.children, { y: 56, scale: .62, autoAlpha: 0 });
  gsap.set(dom.winnerGrid.querySelectorAll(".winner-name"), { y: 10, autoAlpha: 0, scale: .85 });

  const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches || false;
  const burstDuration = reducedMotion ? .35 : Math.max(.1, roofBurstDuration);
  const rainDuration = reducedMotion ? .7 : Math.max(.1, fullScreenRainDuration);
  const rainScene = createRainfall(reducedMotion, burstDuration, rainDuration);
  state.rainScene = rainScene;
  const sprayStart = reducedMotion ? .1 : .2;
  const rainStart = sprayStart + burstDuration;
  const rainEnd = rainStart + rainDuration;
  const cardsStart = rainEnd + (reducedMotion ? .12 : .5);
  const settleDuration = reducedMotion ? .24 : .72;
  const settleStagger = reducedMotion ? .015 : .1;
  const settleEnd = cardsStart + settleDuration + Math.max(0, winners.length - 1) * settleStagger;
  const namesDuration = reducedMotion ? .18 : .4;
  const namesStagger = reducedMotion ? .015 : .08;
  const namesStart = settleEnd + (reducedMotion ? .04 : .16);
  const namesEnd = namesStart + namesDuration + Math.max(0, winners.length - 1) * namesStagger;
  const fadeAt = namesEnd + (reducedMotion ? .55 : 2.05);
  let timeline;
  timeline = gsap.timeline({
    onUpdate: () => renderRainfall(rainScene, timeline.time(), sprayStart, rainStart),
    onComplete: () => {
      state.rainScene = null;
      dom.drawMoment.classList.remove("is-active");
      dom.drawMoment.setAttribute("aria-hidden", "true");
      dom.rainField.replaceChildren();
      dom.winnerGrid.replaceChildren();
      dom.hatch.classList.remove("is-open");
      state.busy = false;
      state.revealTimeline = null;
      dom.lineStatus.textContent = "店員繼續補貨中";
      render();
      resumeRestockAnimations();
      if (!state.restockTimeline) state.restockTimeline = gsap.delayedCall(.2, runRestockCycle);
    }
  });

  timeline.to(dom.drawWash, { autoAlpha: reducedMotion ? .94 : .28, duration: reducedMotion ? .12 : .3, ease: "power1.out" }, 0)
    .to(dom.rainField, { autoAlpha: 1, duration: reducedMotion ? .08 : .22, ease: "power1.out" }, sprayStart);

  timeline.to(dom.drawWash, { autoAlpha: reducedMotion ? .97 : .96, duration: reducedMotion ? .12 : .48, ease: "power1.out" }, rainStart);
  timeline.to(dom.rainField, { autoAlpha: 0, duration: reducedMotion ? .12 : .46, ease: "power2.out" }, rainEnd)
    .to(dom.winnerReveal, { autoAlpha: 1, duration: reducedMotion ? .12 : .28, ease: "power1.out" }, cardsStart)
    .to(dom.winnerGrid.children, { y: 0, scale: 1, autoAlpha: 1, duration: settleDuration, stagger: settleStagger, ease: reducedMotion ? "power1.out" : "back.out(1.65)" }, cardsStart)
    .to(dom.winnerGrid.querySelectorAll(".winner-name"), { y: 0, scale: 1, autoAlpha: 1, duration: namesDuration, stagger: namesStagger, ease: reducedMotion ? "power1.out" : "back.out(1.7)" }, namesStart);
  if (!reducedMotion) {
    timeline.to(dom.winnerGrid.children, { scale: 1.035, duration: .3, stagger: .035, yoyo: true, repeat: 1, ease: "sine.inOut" }, namesEnd + .08);
  }
  timeline.to(dom.winnerReveal, { autoAlpha: 0, duration: reducedMotion ? .2 : .45, ease: "power1.in" }, fadeAt);
  state.revealTimeline = timeline;
}

function updatePrizeCompletion(prize) {
  if (remainingCount(prize) !== 0) return;
  state.currentPrizeIndex = findNextPrizeIndex(state.prizes, state.luckyUsers);
}

async function runDraw() {
  if (state.busy) return;
  const prize = currentPrize();
  if (!prize) { showToast("所有獎項都已抽出"); return; }
  state.busy = true;
  pauseRestockAnimations();
  render(); dom.lineStatus.textContent = "好運準備起飛";
  try {
    const { winners, remaining } = drawWinners({ users: state.leftUsers, previousWinners: state.luckyUsers[prize.type] || [], count: prize.count, drawCount: state.eachCount[state.currentPrizeIndex] || prize.draw_count || 1, kind: prize.kind });
    if (!winners.length) throw new Error("沒有可抽出的參加者，請檢查剩餘名單或獎項設定");
    const assignments = assignPrizes(winners, prize.prize_list || {});
    const results = assignments.map(({ winner, prize: prizeItem }) => ({ id: winner[0], name: winner[1], department: winner[2], prizeLevel: prize.text, prizeItem, timestamp: new Date().toISOString() }));
    state.leftUsers = remaining;
    state.luckyUsers = { ...state.luckyUsers, [prize.type]: [...(state.luckyUsers[prize.type] || []), ...winners] };
    updatePrizeCompletion(prize);
    render();
    const saves = [api("/saveData", { type: prize.type, data: winners }), api("/saveLotteryResults", { results })];
    const outcomes = await Promise.allSettled(saves);
    if (outcomes.some(result => result.status === "rejected" || result.value?.type === "error" || (typeof result.value?.type === "string" && result.value.type.includes("失敗")))) showToast("結果已揭曉，但部分資料儲存失敗，請通知管理員");
    dom.lineStatus.textContent = "飯糰雨來了！";
    openReveal(prize, winners, assignments);
  } catch (error) {
    state.busy = false; dom.lineStatus.textContent = "店員繼續補貨中"; render();
    resumeRestockAnimations();
    if (!state.restockTimeline) state.restockTimeline = gsap.delayedCall(.2, runRestockCycle);
    showToast(error.message || "抽獎失敗，請重試");
  }
}

async function resetAll() {
  if (state.busy || !window.confirm("確定清空所有已抽獎紀錄並重新開始嗎？")) return;
  try {
    const result = await api("/reset");
    if (result.type !== "success") throw new Error("重置失敗");
    state.luckyUsers = {}; state.leftUsers = [...state.users];
    state.currentPrizeIndex = findNextPrizeIndex(state.prizes, state.luckyUsers);
    render(); showToast("抽獎紀錄已重置");
  } catch (error) { showToast(error.message || "重置失敗"); }
}

function skipPrize() {
  if (state.busy || !currentPrize()) return;
  let next = -1;
  for (let index = state.currentPrizeIndex - 1; index >= 0; index -= 1) {
    if (remainingCount(state.prizes[index]) > 0) { next = index; break; }
  }
  if (next < 0) { showToast("已經是最高獎項了"); return; }
  state.currentPrizeIndex = next; render(); showToast(`已切換至${currentPrize().text || currentPrize().title}`);
}

function bindEvents() {
  dom.drawButton.addEventListener("click", runDraw);
  dom.skipButton.addEventListener("click", skipPrize);
  dom.resetButton.addEventListener("click", resetAll);
  document.addEventListener("keydown", event => {
    if (event.code === "Space" && !["BUTTON", "INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) { event.preventDefault(); runDraw(); }
    if (event.code === "KeyS") skipPrize();
    if (event.code === "KeyR") resetAll();
  });
}

async function initialize() {
  try {
    const [temp, users] = await Promise.all([api("/getTempData"), api("/getUsers")]);
    state.prizes = temp.cfgData.prizes || [];
    state.eachCount = temp.cfgData.EACH_COUNT || state.prizes.map(prize => prize.draw_count);
    state.users = users;
    state.luckyUsers = temp.luckyData || {};
    state.leftUsers = temp.leftUsers || users;
    state.currentPrizeIndex = findNextPrizeIndex(state.prizes, state.luckyUsers);
    createWorkerLine();
    state.currentRack = createRack(); state.currentRack.classList.add("is-current-rack");
    dom.rackBay.append(state.currentRack); updateRackCount();
    render(); runRestockCycle();
    state.pollTimer = setInterval(async () => {
      if (state.busy) return;
      try {
        const latest = await api("/getPrizes");
        if (latest.prizes && JSON.stringify(latest.prizes) !== JSON.stringify(state.prizes)) {
          state.prizes = latest.prizes; state.eachCount = latest.prizes.map(prize => prize.draw_count);
          state.currentPrizeIndex = findNextPrizeIndex(state.prizes, state.luckyUsers); render();
        }
      } catch (error) { console.warn("Prize refresh failed", error); }
    }, 4000);
  } catch (error) {
    document.querySelector(".app-shell").innerHTML = `<main class="prize-panel connection-error"><div class="panel-kicker">CONNECTION ERROR</div><h1 class="panel-title">無法載入抽獎資料</h1><p>${error.message}</p><button class="primary-button" onclick="location.reload()">重新載入</button></main>`;
  }
}

bindEvents();
initialize();
