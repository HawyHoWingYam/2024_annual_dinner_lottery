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
    type: 0,
    count: 1,
    title: "神秘獎項",
    text: "1份",
    img: "../img/gift.jpeg",
    kind: 3,
    prize_list: {
      "神秘獎項": 1
    }
  },
  {
    type: 1,
    count: 1,
    title: "神秘獎項",
    text: "1份",
    img: "../img/gift.jpeg",
    kind: 3,
    prize_list: {
      "神秘獎項": 1
    }
  },
  {
    type: 2,
    count: 1,
    title: "神秘獎項",
    text: "1份",
    img: "../img/gift.jpeg",
    kind: 3,
    prize_list: {
      "神秘獎項": 1
    }
  }, {
    type: 3,
    count: 1,
    title: "神秘獎項",
    text: "1份",
    img: "../img/gift.jpeg",
    kind: 3,
    prize_list: {
      "神秘獎項": 1
    }
  }, {
    type: 4,
    count: 1,
    title: "神秘獎項",
    text: "1份",
    img: "../img/gift.jpeg",
    kind: 3,
    prize_list: {
      "神秘獎項": 1
    }
  }, {
    type: 5,
    count: 1,
    title: "神秘獎項",
    text: "1份",
    img: "../img/gift.jpeg",
    kind: 3,
    prize_list: {
      "神秘獎項": 1
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
    text: "Ally X 手提遊戲機 1份",
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
    text: "運動相機 1份",
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
    text: "OLED手提遊戲機 1份",
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
    text: "HD08風筒 1份",
    img: "../img/gift.jpeg",
    kind: 3,
    prize_list: {
      "Dyson風筒": 1
    }
  },
  {
    type: 13,
    count: 1,
    title: "Prizm",
    text: "iPhone 16 Pro 1份",
    img: "../img/gift.jpeg",
    kind: 3,
    prize_list: {
      "iPhone 16 Pro": 1
    }
  },
  {
    type: 14,
    count: 1,
    title: "Prizm",
    text: "現金$5000 1份",
    img: "../img/gift.jpeg",
    kind: 3,
    prize_list: {
      "現金$5000": 1
    }
  },
  {
    type: 15,
    count: 1,
    title: "明正",
    text: "Dyson風筒 1份",
    img: "../img/gift.jpeg",
    kind: 3,
    prize_list: {
      "Dyson風筒": 1
    }
  },
  {
    type: 16,
    count: 1,
    title: "農林中央金庫",
    text: "Yata禮品卡$3000 1份",
    img: "../img/gift.jpeg",
    kind: 3,
    prize_list: {
      "Yata禮品卡$3000": 1
    }
  },
  {
    type: 17,
    count: 1,
    title: "鉅發源",
    text: "現金$2000 1份",
    img: "../img/gift.jpeg",
    kind: 3,
    prize_list: {
      "現金$2000": 1
    }
  },
  {
    type: 18,
    count: 1,
    title: "宏利人壽",
    text: "現金優惠券$2000 1份",
    img: "../img/gift.jpeg",
    kind: 3,
    prize_list: {
      "現金優惠券$2000": 1
    }
  },
  {
    type: 19,
    count: 3,
    title: "Eggcellent",
    text: "現金$1000 3份",
    img: "../img/gift.jpeg",
    kind: 3,
    prize_list: {
      "現金$1000": 3
    }
  },
  {
    type: 20,
    count: 1,
    title: "久保田",
    text: "現金$1000 1份",
    img: "../img/gift.jpeg",
    kind: 1,
    prize_list: {
      "現金$1000": 1
    }
  },
  {
    type: 21,
    count: 2,
    title: "CS Advertising",
    text: "惠康優惠券$1000 2份",
    img: "../img/gift.jpeg",
    kind: 3,
    prize_list: {
      "惠康優惠券$1000": 2
    }
  },
  {
    type: 22,
    count: 2,
    title: "Pan World",
    text: "百佳優惠券$500 2份",
    img: "../img/gift.jpeg",
    kind: 3,
    prize_list: {
      "百佳優惠券$500": 2
    }
  },
  {
    type: 23,
    count: 1,
    title: "上組",
    text: "清酒3支 1份",
    img: "../img/gift.jpeg",
    kind: 3,
    prize_list: {
      "上組清酒3支": 1
    }
  },
  {
    type: 24,
    count: 1,
    title: "ANA",
    text: "十萬日元旅行支票 1份",
    img: "../img/gift.jpeg",
    kind: 3,
    prize_list: {
      "ANA十萬日元旅行支票": 1
    }
  },
  {
    type: 25,
    count: 3,
    title: "ANA",
    text: "禮品包 3份",
    img: "../img/gift.jpeg",
    kind: 3,
    prize_list: {
      "ANA禮品包": 3
    }
  },
  {
    type: 26,
    count: 23,
    title: "綜合獎項",
    text: "23份",
    img: "../img/gift.jpeg",
    kind: 3,
    prize_list: {
      "熱感頸部按摩儀": 2,
      "單片三文治機": 3,
      "夾公仔卡": 2,
      "瑰麗禮品卡": 2,
      "多功能電熱鍋": 2,
      "四季禮品卡": 2,
      "JRL風筒": 2,
      "AirPods Pro 2": 2,
      "Oral-B 電動牙刷": 2,
      "蝶苑禮品卡": 1,
      "索尼耳機WH-1000XM5": 1,
      "半島禮品卡": 1,
      "面膜儀": 1
    }
  },
  {
    type: 27,
    count: 25,
    title: "花開富貴",
    text: "禮盒 25份",
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
  1, 1, 1, 1, 1, 1,
  1, 1, 1, 1, 1,
  1, 1, 1, 1, 1,
  1, 1, 1, 3, 1,
  2, 2, 1, 1, 3,
  23,25
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