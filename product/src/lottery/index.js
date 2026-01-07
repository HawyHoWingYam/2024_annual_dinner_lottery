import "./index.css";
import "../css/animate.min.css";
import "./canvas.js";
import {
  addQipao,
  setPrizes,
  showPrizeList,
  setPrizeData,
  resetPrize
} from "./prizeList";
import { NUMBER_MATRIX } from "./config.js";

const ROTATE_TIME = 1000;
const ROTATE_LOOP = 1000;
const BASE_HEIGHT = 1080;

let TOTAL_CARDS,
  btns = {
    enter: document.querySelector("#enter"),
    lotteryBar: document.querySelector("#lotteryBar"),
    lottery: document.querySelector("#lottery")
  },
  prizes,
  EACH_COUNT,
  ROW_COUNT = 9,
  COLUMN_COUNT = 19,
  COMPANY,
  HIGHLIGHT_CELL = [],
  // 当前的比例
  Resolution = 1;

let camera,
  scene,
  renderer,
  controls,
  threeDCards = [],
  targets = {
    table: [],
    sphere: []
  };

let rotateObj;

let selectedCardIndex = [],
  rotate = false,
  basicData = {
    prizes: [], //奖品信息
    users: [], //所有人员
    luckyUsers: {}, //已中奖人员
    leftUsers: [] //未中奖人员
  },
  interval,
  // 当前抽的奖项，从最低奖开始抽，直到抽到大奖
  currentPrizeIndex,
  currentPrize,
  // 正在抽奖
  isLotting = false,
  currentLuckys = [],
  audio = new Audio("../data/audio.mp3"),
  // 是否显示奖品介绍
  showingPrizeIntro = false;

initAll();

/**
 * 初始化所有DOM
 */
function initAll() {
  window.AJAX({
    url: "/getTempData",
    success(data) {
      // 获取基础数据
      prizes = data.cfgData.prizes;
      console.log("prizes", prizes);
      EACH_COUNT = data.cfgData.EACH_COUNT;
      COMPANY = data.cfgData.COMPANY;
      HIGHLIGHT_CELL = createHighlight();
      basicData.prizes = prizes;
      setPrizes(prizes);

      TOTAL_CARDS = ROW_COUNT * COLUMN_COUNT;
      console.log("TOTAL_CARDS", TOTAL_CARDS);
      // 读取当前已设置的抽奖结果
      basicData.leftUsers = data.leftUsers;
      basicData.luckyUsers = data.luckyData;

      let prizeIndex = basicData.prizes.length - 1;
      for (; prizeIndex > -1; prizeIndex--) {
        if (
          data.luckyData[prizeIndex] &&
          data.luckyData[prizeIndex].length >=
          basicData.prizes[prizeIndex].count
        ) {
          continue;
        }
        currentPrizeIndex = prizeIndex;
        currentPrize = basicData.prizes[currentPrizeIndex];
        break;
      }
      showPrizeList(currentPrizeIndex);
      let curLucks = basicData.luckyUsers[currentPrize.type];
      setPrizeData(currentPrizeIndex, curLucks ? curLucks.length : 0, true);
    }
  });

  window.AJAX({
    url: "/getUsers",
    success(data) {
      basicData.users = data;

      initCards();
      // startMaoPao();
      animate();
      shineCard();
    }
  });
}

function initCards() {
  let member = basicData.users.slice(),
    showCards = [],
    length = member.length;

  let isBold = false,
    showTable = basicData.leftUsers.length === basicData.users.length,
    index = 0,
    totalMember = member.length,
    position = {
      x: (120 * COLUMN_COUNT - 20) / 2,
      y: (70 * ROW_COUNT - 20) / 2
    };

  camera = new THREE.PerspectiveCamera(
    40,
    window.innerWidth / window.innerHeight,
    1,
    10000
  );
  camera.position.z = 3000;

  scene = new THREE.Scene();

  for (let i = 0; i < ROW_COUNT; i++) {
    for (let j = 0; j < COLUMN_COUNT; j++) {
      isBold = HIGHLIGHT_CELL.includes(j + "-" + i);
      var element = createCard(
        member[index % length],
        isBold,
        index,
        showTable
      );

      var object = new THREE.CSS3DObject(element);
      object.position.x = Math.random() * 4000 - 2000;
      object.position.y = Math.random() * 4000 - 2000;
      object.position.z = Math.random() * 4000 - 2000;
      scene.add(object);
      threeDCards.push(object);

      var object = new THREE.Object3D();
      object.position.x = j * 140 - position.x;
      object.position.y = -(i * 120) + position.y;
      object.position.y = -(i * 80) + position.y;
      targets.table.push(object);
      index++;
    }
  }

  // sphere

  var vector = new THREE.Vector3();

  for (var i = 0, l = threeDCards.length; i < l; i++) {
    var phi = Math.acos(-1 + (2 * i) / l);
    var theta = Math.sqrt(l * Math.PI) * phi;
    var object = new THREE.Object3D();
    object.position.setFromSphericalCoords(800 * Resolution, phi, theta);
    vector.copy(object.position).multiplyScalar(2);
    object.lookAt(vector);
    targets.sphere.push(object);
  }

  renderer = new THREE.CSS3DRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById("container").appendChild(renderer.domElement);

  //

  controls = new THREE.TrackballControls(camera, renderer.domElement);
  controls.rotateSpeed = 0.5;
  controls.minDistance = 500;
  controls.maxDistance = 6000;
  controls.addEventListener("change", render);

  bindEvent();

  // Always go directly to lottery sphere
  switchScreen("lottery");
}

function setLotteryStatus(status = false) {
  isLotting = status;
}

/**
 * 事件绑定
 */
function bindEvent() {
  document.querySelector("#menu").addEventListener("click", function (e) {
    e.stopPropagation();
    // 如果正在抽奖，则禁止一切操作
    if (isLotting) {
      if (e.target.id === "lottery") {
        rotateObj.stop();
        e.target.style.display = "";
        // btns.style.display = "none";

        btns.lottery.innerHTML = "開始抽獎";
      } else {
        addQipao("正在抽奖，抽慢一点点～～");
      }
      return false;
    }

    let target = e.target.id;
    switch (target) {
      // 显示数字墙
      case "welcome":
        switchScreen("enter");
        rotate = false;
        break;
      // 进入抽奖
      case "enter":
        removeHighlight();
        // addQipao(`马上抽取[${currentPrize.title}],不要走开。`);
        // rotate = !rotate;
        rotate = true;
        switchScreen("lottery");
        break;
      // 重置
      case "reset":
        let doREset = window.confirm(
          "是否确认重置数据，重置后，当前已抽的奖项全部清空？"
        );
        if (!doREset) {
          return;
        }
        addQipao("重置所有数据，重新抽奖");
        addHighlight();
        resetCard();
        // 重置所有数据
        currentLuckys = [];
        basicData.leftUsers = Object.assign([], basicData.users);
        basicData.luckyUsers = {};
        currentPrizeIndex = basicData.prizes.length - 1;
        currentPrize = basicData.prizes[currentPrizeIndex];

        // Reset prize intro state
        showingPrizeIntro = false;
        const overlay = document.getElementById('prizeIntroOverlay');
        overlay.classList.remove('show', 'shrink-up');
        overlay.classList.add('hidden');

        resetPrize(currentPrizeIndex);
        reset();
        switchScreen("lottery");
        break;
      // 抽奖
      case "lottery":
        setLotteryStatus(true);
        // // 每次抽奖前先保存上一次的抽奖数据
        saveData();
        //更新剩余抽奖数目的数据显示
        changePrize();
        resetCard().then(res => {
          // 抽奖
          lottery();
        });
        audio.play();
        setTimeout(() => {
          e.target.click();
        }, 2000);
        // stoplottery();
        // addQipao(`正在抽取[${currentPrize.title}],调整好姿势`);
        break;
      // 重新抽奖
      case "save":
        saveData().then(res => {
          resetCard().then(res => {
            // 将之前的记录置空
            currentLuckys = [];
          });
          exportData();
          addQipao(`数据已保存到EXCEL中。`);
        });
        break;
      // 跳过奖项
      case "skip":
        skipToNextPrize();
        break;
    }
  });

  // Helper function to show prize intro overlay
  function showPrizeIntro() {
    const overlay = document.getElementById('prizeIntroOverlay');
    const prizeImage = document.getElementById('prizeIntroImage');
    const prizeName = document.getElementById('prizeIntroName');

    if (currentPrize && currentPrize.images && currentPrize.images.length > 0) {
      prizeImage.src = `server/data/img/${currentPrize.images[0]}`;
    }

    prizeName.textContent = currentPrize.title || '';

    overlay.classList.remove('hidden');
    overlay.classList.add('show');
  }

  // Helper function to hide prize intro with animation
  function hidePrizeIntroWithAnimation() {
    const overlay = document.getElementById('prizeIntroOverlay');

    overlay.classList.add('shrink-up');

    return new Promise(resolve => {
      const handleTransitionEnd = () => {
        overlay.removeEventListener('transitionend', handleTransitionEnd);
        overlay.classList.remove('show', 'shrink-up');
        overlay.classList.add('hidden');
        showingPrizeIntro = false;
        resolve();
      };

      overlay.addEventListener('transitionend', handleTransitionEnd);

      // Fallback timeout in case transitionend doesn't fire
      setTimeout(() => {
        if (overlay.classList.contains('shrink-up')) {
          handleTransitionEnd();
        }
      }, 700);
    });
  }

  // press space
  document.addEventListener('keydown', event => {

    if (event.code === 'Space') {
      if (isLotting || btns.lotteryBar.classList.contains("none")) {
        return false;
      };
      event.stopPropagation();

      // Two-step flow: first show prize intro, then start lottery
      if (!showingPrizeIntro) {
        // First press: show prize intro
        showingPrizeIntro = true;
        showPrizeIntro();
        return;
      }

      // Second press: hide prize intro and start lottery
      hidePrizeIntroWithAnimation().then(() => {
        setLotteryStatus(true);
        // // 每次抽奖前先保存上一次的抽奖数据
        saveData();
        //更新剩余抽奖数目的数据显示
        changePrize();
        resetCard().then(res => {
          // 抽奖
          lottery();
        });
        audio.play();
        setTimeout(() => {
          btns.lottery.click();
        }, 2000);
      });
    }
  })

  // press 'S' key to skip prize
  document.addEventListener('keydown', event => {
    if (event.code === 'KeyS') {
      if (btns.lotteryBar.classList.contains("none")) {
        return false;
      }
      event.stopPropagation();
      skipToNextPrize();
    }
  });

  // press 'R' key to reset
  document.addEventListener('keydown', event => {
    if (event.code === 'KeyR') {
      if (btns.lotteryBar.classList.contains("none")) {
        return false;
      }
      event.stopPropagation();

      // Trigger reset logic
      let doREset = window.confirm(
        "是否确认重置数据，重置后，当前已抽的奖项全部清空？"
      );
      if (!doREset) {
        return;
      }
      addQipao("重置所有数据，重新抽奖");
      addHighlight();
      resetCard();
      currentLuckys = [];
      basicData.leftUsers = Object.assign([], basicData.users);
      basicData.luckyUsers = {};
      currentPrizeIndex = basicData.prizes.length - 1;
      currentPrize = basicData.prizes[currentPrizeIndex];
      resetPrize(currentPrizeIndex);
      reset();
      switchScreen("lottery");
    }
  });

  window.addEventListener("resize", onWindowResize, false);
}

function switchScreen(type) {
  // console.log(type);
  switch (type) {
    case "enter":
      btns.enter.classList.remove("none");
      btns.lotteryBar.classList.add("none");
      transform(targets.table, 1000);
      break;
    default:
      btns.enter.classList.add("none");
      btns.lotteryBar.classList.remove("none");
      transform(targets.sphere, 1000);
      break;
  }
}

/**
 * 创建元素
 */
function createElement(css, text) {
  let dom = document.createElement("div");
  dom.className = css || "";
  dom.innerHTML = text || "";
  return dom;
}

/**
 * 创建名牌
 */
function createCard(user, isBold, id, showTable) {
  var element = createElement();
  element.id = "card-" + id;

  if (isBold) {
    element.className = "element lightitem";
    if (showTable) {
      element.classList.add("highlight");
    }
  } else {
    element.className = "element";
    element.style.backgroundColor =
      "rgba(0,127,127," + (Math.random() * 0.7 + 0.25) + ")";
  }
  //添加公司标识
  // element.appendChild(createElement("company", COMPANY));

  // 显示格式: "部门 姓名"
  const displayName = `${user[2]} ${user[1]}`;
  element.appendChild(createElement("name", displayName));

  // element.appendChild(createElement("details", user[0] + "<br/>" + user[2]));
  return element;
}

function removeHighlight() {
  document.querySelectorAll(".highlight").forEach(node => {
    node.classList.remove("highlight");
  });
}

function addHighlight() {
  document.querySelectorAll(".lightitem").forEach(node => {
    node.classList.add("highlight");
  });
}

/**
 * 渲染地球等
 */
function transform(targets, duration) {
  // TWEEN.removeAll();
  // console.log(threeDCards);
  for (var i = 0; i < threeDCards.length; i++) {
    var object = threeDCards[i];
    var target = targets[i];

    new TWEEN.Tween(object.position)
      .to(
        {
          x: target.position.x,
          y: target.position.y,
          z: target.position.z
        },
        Math.random() * duration + duration
      )
      .easing(TWEEN.Easing.Exponential.InOut)
      .start();

    new TWEEN.Tween(object.rotation)
      .to(
        {
          x: target.rotation.x,
          y: target.rotation.y,
          z: target.rotation.z
        },
        Math.random() * duration + duration
      )
      .easing(TWEEN.Easing.Exponential.InOut)
      .start();
  }

  new TWEEN.Tween(this)
    .to({}, duration * 2)
    .onUpdate(render)
    .start();
}

// function rotateBall() {
//   return new Promise((resolve, reject) => {
//     scene.rotation.y = 0;
//     new TWEEN.Tween(scene.rotation)
//       .to(
//         {
//           y: Math.PI * 8
//         },
//         ROTATE_TIME
//       )
//       .onUpdate(render)
//       .easing(TWEEN.Easing.Exponential.InOut)
//       .start()
//       .onComplete(() => {
//         resolve();
//       });
//   });
// }

function rotateBall() {
  return new Promise((resolve, reject) => {
    scene.rotation.y = 0;
    rotateObj = new TWEEN.Tween(scene.rotation);
    rotateObj
      .to(
        {
          y: Math.PI * 6 * ROTATE_LOOP
        },
        ROTATE_TIME * ROTATE_LOOP
      )
      .onUpdate(render)
      // .easing(TWEEN.Easing.Linear)
      .start()
      .onStop(() => {
        scene.rotation.y = 0;
        resolve();
      })
      .onComplete(() => {
        resolve();
      });
  });
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  render();
}

function animate() {
  // 让场景通过x轴或者y轴旋转
  // rotate && (scene.rotation.y += 0.088);

  requestAnimationFrame(animate);
  TWEEN.update();
  controls.update();

  // 渲染循环
  // render();
}

function render() {
  renderer.render(scene, camera);
}

function selectCard(currentPrizeData) {
  rotate = false;
  var duration = 500;
  let width = 140,
    tag = -(currentLuckys.length - 1) / 2,
    locates = [];

  // 计算位置信息, 大于10个分三排,大于5个分两排显示
  // 计算位置信息
  if (currentLuckys.length > 20) {
    // Five rows
    let yPosition = [-248, -124, 0, 124, 248],
      l = selectedCardIndex.length,
      row1 = Math.ceil(l / 5),
      row2 = Math.ceil((l - row1) / 4),
      row3 = Math.ceil((l - row1 - row2) / 3),
      row4 = Math.ceil((l - row1 - row2 - row3) / 2);

    // First row
    tag = -(row1 - 1) / 2;
    for (let i = 0; i < row1; i++) {
      locates.push({ x: tag * width * Resolution, y: yPosition[0] * Resolution });
      tag++;
    }

    // Second row
    tag = -(row2 - 1) / 2;
    for (let i = row1; i < row1 + row2; i++) {
      locates.push({ x: tag * width * Resolution, y: yPosition[1] * Resolution });
      tag++;
    }

    // Third row  
    tag = -(row3 - 1) / 2;
    for (let i = row1 + row2; i < row1 + row2 + row3; i++) {
      locates.push({ x: tag * width * Resolution, y: yPosition[2] * Resolution });
      tag++;
    }

    // Fourth row
    tag = -(row4 - 1) / 2;
    for (let i = row1 + row2 + row3; i < row1 + row2 + row3 + row4; i++) {
      locates.push({ x: tag * width * Resolution, y: yPosition[3] * Resolution });
      tag++;
    }

    // Fifth row
    tag = -(l - row1 - row2 - row3 - row4 - 1) / 2;
    for (let i = row1 + row2 + row3 + row4; i < l; i++) {
      locates.push({ x: tag * width * Resolution, y: yPosition[4] * Resolution });
      tag++;
    }

  } else if (currentLuckys.length > 15) {
    // Four rows
    let yPosition = [-174, -58, 58, 174],
      l = selectedCardIndex.length,
      row1 = Math.ceil(l / 4),
      row2 = Math.ceil((l - row1) / 3),
      row3 = Math.ceil((l - row1 - row2) / 2);

    // First row
    tag = -(row1 - 1) / 2;
    for (let i = 0; i < row1; i++) {
      locates.push({ x: tag * width * Resolution, y: yPosition[0] * Resolution });
      tag++;
    }

    // Second row
    tag = -(row2 - 1) / 2;
    for (let i = row1; i < row1 + row2; i++) {
      locates.push({ x: tag * width * Resolution, y: yPosition[1] * Resolution });
      tag++;
    }

    // Third row
    tag = -(row3 - 1) / 2;
    for (let i = row1 + row2; i < row1 + row2 + row3; i++) {
      locates.push({ x: tag * width * Resolution, y: yPosition[2] * Resolution });
      tag++;
    }

    // Fourth row
    tag = -(l - row1 - row2 - row3 - 1) / 2;
    for (let i = row1 + row2 + row3; i < l; i++) {
      locates.push({ x: tag * width * Resolution, y: yPosition[3] * Resolution });
      tag++;
    }

  } else if (currentLuckys.length > 10) {
    let yPosition = [-174, 0, 174], // Three row positions
      l = selectedCardIndex.length,
      row1 = Math.ceil(l / 3),
      row2 = Math.ceil((l - row1) / 2);

    // First row
    tag = -(row1 - 1) / 2;
    for (let i = 0; i < row1; i++) {
      locates.push({
        x: tag * width * Resolution,
        y: yPosition[0] * Resolution
      });
      tag++;
    }

    // Second row
    tag = -(row2 - 1) / 2;
    for (let i = row1; i < row1 + row2; i++) {
      locates.push({
        x: tag * width * Resolution,
        y: yPosition[1] * Resolution
      });
      tag++;
    }

    // Third row
    tag = -(l - row1 - row2 - 1) / 2;
    for (let i = row1 + row2; i < l; i++) {
      locates.push({
        x: tag * width * Resolution,
        y: yPosition[2] * Resolution
      });
      tag++;
    }
  } else if (currentLuckys.length > 5) {
    let yPosition = [-87, 87],
      l = selectedCardIndex.length,
      mid = Math.ceil(l / 2);
    tag = -(mid - 1) / 2;
    for (let i = 0; i < mid; i++) {
      locates.push({
        x: tag * width * Resolution,
        y: yPosition[0] * Resolution
      });
      tag++;
    }

    tag = -(l - mid - 1) / 2;
    for (let i = mid; i < l; i++) {
      locates.push({
        x: tag * width * Resolution,
        y: yPosition[1] * Resolution
      });
      tag++;
    }
  } else {
    for (let i = selectedCardIndex.length; i > 0; i--) {
      locates.push({
        x: tag * width * Resolution,
        y: 0 * Resolution
      });
      tag++;
    }
  }

  // Create prize inventory tracker
  let prizeInventory = {};
  Object.entries(currentPrizeData.prize_list).forEach(([prize, quantity]) => {
    prizeInventory[prize] = quantity;
  });

  // Track assigned prizes
  let assignedPrizes = [];
  let current_count = 0;

  let text = currentLuckys.map(function (item) {
    // Find available prize
    let availablePrizes = Object.entries(prizeInventory).filter(([_, qty]) => qty > 0);
    if (availablePrizes.length > 0) {
      // Select random prize from available ones
      let prizeIndex = Math.floor(Math.random() * availablePrizes.length);
      let [prizeName, _] = availablePrizes[prizeIndex];

      // Decrease quantity
      prizeInventory[prizeName]--;

      // Track assignment
      assignedPrizes.push({
        winner: item[1],
        prize: prizeName
      });

      return `${item[1]} : ${prizeName}`;
    }
    return item[1];
  });
  // addQipao(
  //   `恭喜${text.join("、")}获得${currentPrize.title}, 新的一年必定旺旺旺。`
  // );

  // 创建详细的中奖记录用于 CSV 导出
  let detailedResults = [];
  selectedCardIndex.forEach((cardIndex, index) => {
    const user = currentLuckys[index];
    const prizeName = text[index].split(' :')[1] || text[index];

    console.log(`[CSV] Index ${index}: User=${user ? user[1] : 'undefined'}, Prize=${prizeName}`);

    detailedResults.push({
      id: user[0],           // 工号
      name: user[1],         // 姓名
      department: user[2],   // 部门
      prizeLevel: currentPrize.text,  // 奖项等级
      prizeItem: prizeName,  // 具体奖品
      timestamp: new Date().toISOString()
    });
  });

  selectedCardIndex.forEach((cardIndex, index) => {
    const user = currentLuckys[index];
    console.log(`[UI] Index ${index}: CardIndex=${cardIndex}, User=${user ? user[1] : 'undefined'}, Department=${user ? user[2] : 'undefined'}`);
    changeCard(cardIndex, currentLuckys[index], text);
    var object = threeDCards[cardIndex];
    new TWEEN.Tween(object.position)
      .to(
        {
          x: locates[index].x,
          y: locates[index].y * Resolution,
          z: 2200
        },
        Math.random() * duration + duration
      )
      .easing(TWEEN.Easing.Exponential.InOut)
      .start();

    new TWEEN.Tween(object.rotation)
      .to(
        {
          x: 0,
          y: 0,
          z: 0
        },
        Math.random() * duration + duration
      )
      .easing(TWEEN.Easing.Exponential.InOut)
      .start();

    object.element.classList.add("prize");
    tag++;
  });

  new TWEEN.Tween(this)
    .to({}, duration * 2)
    .onUpdate(render)
    .start()
    .onComplete(() => {
      // 动画结束后可以操作
      setLotteryStatus();

      // 保存详细结果到 CSV
      if (detailedResults.length > 0) {
        window.AJAX({
          url: "/saveLotteryResults",
          data: { results: detailedResults },
          success() {
            console.log("CSV保存成功");
          },
          error() {
            console.error("CSV保存失败");
          }
        });
      }
    });
}

/**
 * 重置抽奖牌内容
 */
function resetCard(duration = 500) {
  if (currentLuckys.length === 0) {
    return Promise.resolve();
  }

  selectedCardIndex.forEach(index => {
    let object = threeDCards[index],
      target = targets.sphere[index];

    new TWEEN.Tween(object.position)
      .to(
        {
          x: target.position.x,
          y: target.position.y,
          z: target.position.z
        },
        Math.random() * duration + duration
      )
      .easing(TWEEN.Easing.Exponential.InOut)
      .start();

    new TWEEN.Tween(object.rotation)
      .to(
        {
          x: target.rotation.x,
          y: target.rotation.y,
          z: target.rotation.z
        },
        Math.random() * duration + duration
      )
      .easing(TWEEN.Easing.Exponential.InOut)
      .start();
  });

  return new Promise((resolve, reject) => {
    new TWEEN.Tween(this)
      .to({}, duration * 2)
      .onUpdate(render)
      .start()
      .onComplete(() => {
        selectedCardIndex.forEach(index => {
          let object = threeDCards[index];
          object.element.classList.remove("prize");
        });
        resolve();
      });
  });
}

/**
 * 抽奖
 */
function lottery() {
  // if (isLotting) {
  //   rotateObj.stop();
  //   btns.lottery.innerHTML = "开始抽奖";
  //   return;
  // }
  // btns.lottery.innerHTML = "結束抽獎";
  btns.lottery.style.display = "none";
  rotateBall().then(() => {
    console.log('[LOTTERY] 开始抽奖');
    // 将之前的记录置空
    currentLuckys = [];
    selectedCardIndex = [];
    // 当前同时抽取的数目,当前奖品抽完还可以继续抽，但是不记录数据
    let perCount = EACH_COUNT[currentPrizeIndex],
      luckyData = basicData.luckyUsers[currentPrize.type],
      leftCount = basicData.leftUsers.length,
      leftPrizeCount = currentPrize.count - (luckyData ? luckyData.length : 0),
      prizeKind = currentPrize.kind;

    console.log('[LOTTERY] currentPrizeIndex:', currentPrizeIndex, 'perCount:', perCount, 'leftCount:', leftCount, 'leftPrizeCount:', leftPrizeCount);

    // 检查奖品是否已满
    if (leftPrizeCount <= 0) {
      console.log('[LOTTERY] 奖品已满，提前返回');
      addQipao(`${currentPrize.text}已经抽完，请切换到下一个奖项`);
      setLotteryStatus(false);
      btns.lottery.style.display = "";
      return;
    }

    if (leftCount < perCount) {
      // 重置时，排除已中奖的人
      let allLuckyUsers = {};
      Object.values(basicData.luckyUsers).forEach(users => {
        if (Array.isArray(users)) {
          users.forEach(user => {
            allLuckyUsers[user[0]] = true; // 用工号作为 key
          });
        }
      });

      basicData.leftUsers = basicData.users.filter(user => !allLuckyUsers[user[0]]);
      leftCount = basicData.leftUsers.length;

      if (leftCount === 0) {
        console.log('[LOTTERY] 所有人都已中奖，提前返回');
        addQipao("所有人都已中奖，无法继续抽奖");
        setLotteryStatus(false);
        btns.lottery.style.display = "";
        return;
      }
    }
    console.log('[LOTTERY] 开始 for 循环，perCount:', perCount);
    for (let i = 0; i < perCount; i++) {
      let luckyId = random(basicData.leftUsers.length);
      let luckyUser = basicData.leftUsers.splice(luckyId, 1)[0]

      //如果是客人又是3等奖，则重新抽取
      while (luckyUser === undefined || (luckyUser[3] == 2 && prizeKind == 3)) {
        // 检查是否还有可用用户
        if (basicData.leftUsers.length === 0) {
          console.error("No more users available for lottery");
          break;
        }
        // 重新生成随机 ID
        luckyId = random(basicData.leftUsers.length);
        luckyUser = basicData.leftUsers.splice(luckyId, 1)[0]
        console.log("prizeKind", prizeKind);
        console.log("luckyUser", luckyUser);
      }

      // 添加安全检查
      if (luckyUser) {
        currentLuckys.push(luckyUser);
        leftCount--;
        leftPrizeCount--;

        let cardIndex = random(TOTAL_CARDS);
        while (selectedCardIndex.includes(cardIndex)) {
          cardIndex = random(TOTAL_CARDS);
        }
        selectedCardIndex.push(cardIndex);
      }

      if (leftPrizeCount === 0) {
        break;
      }
    }
    console.log('[LOTTERY] for 循环完成，currentLuckys.length:', currentLuckys.length);
    console.log('[LOTTERY] 调用 selectCard()');
    selectCard(currentPrize);
    // 每次抽奖前先保存上一次的抽奖数据
    // saveData();


  });
}

/**
 * 保存上一次的抽奖结果
 */
function saveData() {
  if (!currentPrize) {
    //若奖品抽完，则不再记录数据，但是还是可以进行抽奖
    return;
  }

  let type = currentPrize.type,
    curLucky = basicData.luckyUsers[type] || [];

  curLucky = curLucky.concat(currentLuckys);

  basicData.luckyUsers[type] = curLucky;

  if (currentPrize.count <= curLucky.length) {
    currentPrizeIndex--;
    if (currentPrizeIndex <= -1) {
      currentPrizeIndex = 0;
    }
    currentPrize = basicData.prizes[currentPrizeIndex];
    // console.log(currentPrize);
  }

  if (currentLuckys.length > 0) {
    // todo by xc 添加数据保存机制，以免服务器挂掉数据丢失
    return setData(type, currentLuckys);
  }
  return Promise.resolve();
}

function changePrize() {
  console.log(currentPrizeIndex);
  let luckys = basicData.luckyUsers[currentPrize.type];
  let luckyCount = (luckys ? luckys.length : 0) + EACH_COUNT[currentPrizeIndex];
  // 修改左侧prize的数目和百分比
  setPrizeData(currentPrizeIndex, luckyCount);
}

function triggerSkipDimEffect() {
  const overlay = document.getElementById('skipOverlay');
  overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.4)';
  setTimeout(() => {
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0)';
  }, 300);
}

function skipToNextPrize() {
  // 防止在抽奖过程中跳过
  if (isLotting) {
    addQipao("正在抽獎中，無法跳過");
    return;
  }

  // 检查是否还有更多奖项可以跳过
  if (currentPrizeIndex <= 0) {
    addQipao("已經是最後一個獎項了");
    return;
  }

  // 移动到下一个奖项
  currentPrizeIndex--;
  currentPrize = basicData.prizes[currentPrizeIndex];

  // Reset prize intro state when changing prize
  showingPrizeIntro = false;
  const overlay = document.getElementById('prizeIntroOverlay');
  overlay.classList.remove('show', 'shrink-up');
  overlay.classList.add('hidden');

  // 更新UI
  showPrizeList(currentPrizeIndex);
  let luckys = basicData.luckyUsers[currentPrize.type];
  setPrizeData(currentPrizeIndex, luckys ? luckys.length : 0, true);

  addQipao(`已跳過至: ${currentPrize.text}`);

  triggerSkipDimEffect();
}

/**
 * 随机抽奖
 */
function random(num) {
  // Math.floor取到0-num-1之间数字的概率是相等的
  return Math.floor(Math.random() * num);
}

/**
 * 切换名牌人员信息
 */
function changeCard(cardIndex, user, text = null) {
  let card = threeDCards[cardIndex].element;
  const displayName = `${user[2]} ${user[1]}`;

  if (text) {
    text.forEach(item => {
      var temp_item = item.split(" :");
      if (temp_item[0] == displayName) {
        card.innerHTML = `<div class="name">${displayName} <span class="prize-text">${temp_item[1]}</span></div>`;
      }
    });
  } else {
    card.innerHTML = `<div class="name">${displayName}`;
  }
}

/**
 * 切换名牌背景
 */
function shine(cardIndex, color) {
  let card = threeDCards[cardIndex].element;
  card.style.backgroundColor =
    color || "rgba(0,127,127," + (Math.random() * 0.7 + 0.25) + ")";
}

/**
 * 随机切换背景和人员信息
 */
function shineCard() {
  let maxCard = 10,
    maxUser;
  let shineCard = 10 + random(maxCard);

  setInterval(() => {
    // 正在抽奖停止闪烁
    if (isLotting) {
      return;
    }
    maxUser = basicData.leftUsers.length;
    // 如果没有剩余用户，跳过
    if (maxUser === 0) {
      return;
    }
    for (let i = 0; i < shineCard; i++) {
      let index = random(maxUser),
        cardIndex = random(TOTAL_CARDS);
      // 当前显示的已抽中名单不进行随机切换
      if (selectedCardIndex.includes(cardIndex)) {
        continue;
      }
      // 安全检查
      const user = basicData.leftUsers[index];
      if (!user) continue;

      shine(cardIndex);
      changeCard(cardIndex, user);
    }
  }, 1000);
}

function setData(type, data) {
  return new Promise((resolve, reject) => {
    window.AJAX({
      url: "/saveData",
      data: {
        type,
        data
      },
      success() {
        resolve();
      },
      error() {
        reject();
      }
    });
  });
}

function setErrorData(data) {
  return new Promise((resolve, reject) => {
    window.AJAX({
      url: "/errorData",
      data: {
        data
      },
      success() {
        resolve();
      },
      error() {
        reject();
      }
    });
  });
}

function exportData() {
  window.AJAX({
    url: "/export",
    success(data) {
      if (data.type === "success") {
        location.href = data.url;
      }
    }
  });
}

function reset() {
  window.AJAX({
    url: "/reset",
    success(data) {
      console.log("重置成功");
    }
  });
}

// 2025
function createHighlight() {
  // let year = new Date().getFullYear() + "";
  let year = "2025";
  let step = 4,
    xoffset = 2,
    yoffset = 2,
    highlight = [];

  year.split("").forEach(n => {
    highlight = highlight.concat(
      NUMBER_MATRIX[n].map(item => {
        return `${item[0] + xoffset}-${item[1] + yoffset}`;
      })
    );
    xoffset += step;
  });

  return highlight;
}
