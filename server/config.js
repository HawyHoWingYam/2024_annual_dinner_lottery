/**
 * 奖品设置
 * type: 唯一标识，0是默认特别奖的占位符，其它奖品不可使用
 * count: 奖品数量
 * title: 奖品描述
 * text: 奖品标题
 * img: 图片地址
 * kind : 3是only hana-musubi，2是hana-musubi+guest
 */
const prizes = [
  {
    type: 1,
    count: 5,
    title: "神秘獎項",
    text: "5份",
    img: "../img/gift.jpeg",
    kind: 3,
    prize_list: {
      "神秘獎項": 5
    }
  },
  {
    type: 2,
    count: 5,
    title: "神秘獎項",
    text: "5份",
    img: "../img/gift.jpeg",
    kind: 3,
    prize_list: {
      "神秘獎項": 5
    }
  },
  {
    type: 3,
    count: 5,
    title: "神秘獎項",
    text: "5份",
    img: "../img/gift.jpeg",
    kind: 3,
    prize_list: {
      "神秘獎項": 5
    }
  },
  {
    type: 4,
    count: 5,
    title: "神秘獎項",
    text: "5份",
    img: "../img/gift.jpeg",
    kind: 3,
    prize_list: {
      "神秘獎項": 5
    }
  },
  {
    type: 5,
    count: 5,
    title: "神秘獎項",
    text: "5份",
    img: "../img/gift.jpeg",
    kind: 3,
    prize_list: {
      "神秘獎項": 5
    }
  },
  {
    type: 6,
    count: 1,
    title: "Apple",
    text: "iPhone 16 Pro 1份",
    img: "../img/gift.jpeg",
    kind: 3,
    prize_list: {
      "iPhone 16 Pro": 1
    }
  },
  {
    type: 7,
    count: 1,
    title: "Apple",
    text: "iPad Pro 11inch 1份",
    img: "../img/gift.jpeg",
    kind: 3,
    prize_list: {
      "iPad Pro 11inch": 1
    }
  },
  {
    type: 8,
    count: 1,
    title: "華碩電競",
    text: "Ally X 手提遊戲機1份",
    img: "../img/gift.jpeg",
    kind: 3,
    prize_list: {
      "Ally X 手提遊戲機": 1
    }
  },
  {
    type: 9,
    count: 1,
    title: "Apple",
    text: "iPad Air 11inch 1份",
    img: "../img/gift.jpeg",
    kind: 3,
    prize_list: {
      "iPad Air 11inch": 1
    }
  },
  {
    type: 10,
    count: 1,
    title: "大疆Osmo Pocket 3",
    text: "運動相機1份",
    img: "../img/gift.jpeg",
    kind: 3,
    prize_list: {
      "運動相機": 1
    }
  },
  {
    type: 11,
    count: 1,
    title: "STEAM Deck 電競",
    text: "OLED手提遊戲機1份",
    img: "../img/gift.jpeg",
    kind: 3,
    prize_list: {
      "OLED手提遊戲機": 1
    }
  },
  {
    type: 12,
    count: 1,
    title: "Dyson Supersonic",
    text: "HD08 風筒1份",
    img: "../img/gift.jpeg",
    kind: 3,
    prize_list: {
      "Dyson 風筒": 1
    }
  },
  {
    type: 13,
    count: 1,
    title: "Foreo 斐珞爾UFO 3",
    text: "彩光水份面膜儀 1份",
    img: "../img/gift.jpeg",
    kind: 3,
    prize_list: {
      "彩光水份面膜儀": 1
    }
  },
  {
    type: 14,
    count: 1,
    title: "半島酒店",
    text: "現金禮品卡1份",
    img: "../img/gift.jpeg",
    kind: 3,
    prize_list: {
      "半島禮品卡": 1
    }
  },
  {
    type: 15,
    count: 1,
    title: "索尼 WH-1000XM5",
    text: "耳機1份",
    img: "../img/gift.jpeg",
    kind: 3,
    prize_list: {
      "索尼耳機": 1
    }
  },
  {
    type: 16,
    count: 1,
    title: "瑰麗禮品卡(蝶苑)",
    text: "禮品卡1份",
    img: "../img/gift.jpeg",
    kind: 3,
    prize_list: {
      "蝶苑禮品卡": 1
    }
  },
  {
    type: 17,
    count: 2,
    title: "Oral-BiO Series 9",
    text: "充電電動牙刷2份",
    img: "../img/gift.jpeg",
    kind: 3,
    prize_list: {
      "充電電動牙刷": 2
    }
  },
  {
    type: 18,
    count: 2,
    title: "Apple",
    text: "AirPods Pro 2 2份",
    img: "../img/gift.jpeg",
    kind: 3,
    prize_list: {
      "AirPods Pro 2": 2
    }
  },
  {
    type: 19,
    count: 2,
    title: "JRL Forte Pro 2020H",
    text: "超輕專業風筒 2份",
    img: "../img/gift.jpeg",
    kind: 3,
    prize_list: {
      "JRL 風筒": 2
    }
  },
  {
    type: 20,
    count: 2,
    title: "四季",
    text: "禮品卡 2份",
    img: "../img/gift.jpeg",
    kind: 3,
    prize_list: {
      "四季禮品卡": 2
    }
  },
  {
    type: 21,
    count: 2,
    title: "Bruno 寶可夢聯動",
    text: "多功能電熱鍋 2份",
    img: "../img/gift.jpeg",
    kind: 3,
    prize_list: {
      "多功能電熱鍋": 2
    }
  },
  {
    type: 22,
    count: 2,
    title: "瑰麗",
    text: "禮品卡 2份",
    img: "../img/gift.jpeg",
    kind: 3,
    prize_list: {
      "瑰麗禮品卡": 2
    }
  },
  {
    type: 23,
    count: 2,
    title: "TAITO STATION",
    text: "夾公仔卡 2份",
    img: "../img/gift.jpeg",
    kind: 3,
    prize_list: {
      "夾公仔卡": 2
    }
  },
  {
    type: 24,
    count: 3,
    title: "BRUNO 寶可夢聯動",
    text: "單片三文治機 3份",
    img: "../img/gift.jpeg",
    kind: 3,
    prize_list: {
      "單片三文治機": 3
    }
  },
  {
    type: 25,
    count: 2,
    title: "Dr Heat Neck 第三代",
    text: "EMS熱感頸部按摩儀 2份",
    img: "../img/gift.jpeg",
    kind: 3,
    prize_list: {
      "EMS熱感頸部按摩儀": 2
    }
  },
  {
    type: 26,
    count: 2,
    title: "RHYTHM Aromafun",
    text: "風扇式香薰機 2份",
    img: "../img/gift.jpeg",
    kind: 3,
    prize_list: {
      "風扇香薰機": 2
    }
  },
  {
    type: 27,
    count: 25,
    title: "LUCKY DRAW PART 3",
    text: "花開富貴禮盒 25份",
    img: "../img/gift.jpeg",
    kind: 3,
    prize_list: {
      "花開富貴禮盒": 25
    }
  },
  {
    type: 28,
    count: 25,
    title: "LUCKY DRAW PART 2",
    text: "花開富貴禮盒 25份",
    img: "../img/gift.jpeg",
    kind: 2,
    prize_list: {
      "花開富貴禮盒": 25
    }
  }
];

/**
 * 一次抽取的奖品个数与prizes对应
 */
const EACH_COUNT = [
  5, 5, 5, 5, 5,
  1, 1, 1, 1, 1,
  1, 1, 1, 1, 1,
  1, 2, 2, 2, 2,
  2, 2, 2, 3, 2,
  2, 25,25
]
/**
 * 卡片公司名称标识
 */
const COMPANY = "Hana";

module.exports = {
  prizes,
  EACH_COUNT,
  COMPANY
};