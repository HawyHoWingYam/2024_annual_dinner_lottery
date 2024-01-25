/**
 * 奖品设置
 * type: 唯一标识，0是默认特别奖的占位符，其它奖品不可使用
 * count: 奖品数量
 * title: 奖品描述
 * text: 奖品标题
 * img: 图片地址
 */
const prizes = [
  {
    type: 0,
    count: 1,
    title: "",
    text: "特別獎",
    kind: 0
  },
  {
    type: 1,
    count: 1,
    title: "",
    text: "Apple iPhone 15 Pro",
    img: "../img/gift.jpeg",
    kind: 0
  },
  {
    type: 2,
    count: 1,
    title: "",
    text: "iPad Pro 11''",
    img: "../img/gift.jpeg",
    kind: 0
  },
  {
    type: 3,
    count: 1,
    title: "",
    text: "Apple iPad Air",
    img: "../img/gift.jpeg",
    kind: 0
  },
  {
    type: 4,
    count: 1,
    title: "",
    text: "Apple Watch Series 9",
    img: "../img/gift.jpeg",
    kind: 0
  },
  {
    type: 5,
    count: 1,
    title: "",
    text: "PlayStation 5 Slim 主機",
    img: "../img/gift.jpeg",
    kind: 0
  },
  {
    type: 6,
    count: 1,
    title: "",
    text: "Dyson Supersonic™ 風筒 HD15",
    img: "../img/gift.jpeg",
    kind: 0
  },
  {
    type: 7,
    count: 1,
    title: "",
    text: "半島酒店現金禮品卡",
    img: "../img/gift.jpeg",
    kind: 0
  },
  {
    type: 8,
    count: 3,
    title: "",
    text: "Disney Ticket x 2+2  ANNUAL PASS",
    img: "../img/gift.jpeg",
    kind: 0
  },
  {
    type: 9,
    count: 1,
    title: "",
    text: "PHILIPS 飛利浦AMF220/35 三合一風扇暖風空氣清新機",
    img: "../img/gift.jpeg",
    kind: 0
  },
  {
    type: 10,
    count: 1,
    title: "",
    text: "SONY 索尼WH-1000XM5 耳機",
    img: "../img/gift.jpeg",
    kind: 0
  },
  {
    type: 11,
    count: 1,
    title: "",
    text: "Marshall Kilburn II Portable Bluetooth Speaker",
    img: "../img/gift.jpeg",
    kind: 0
  },
  {
    type: 12,
    count: 1,
    title: "",
    text: "DYSON手提式吸塵機",
    img: "../img/gift.jpeg",
    kind: 0
  },
  {
    type: 13,
    count: 1,
    title: "",
    text: "Oral-BiO Series 9 充電電動牙刷",
    img: "../img/gift.jpeg",
    kind: 0
  },
  {
    type: 14,
    count: 1,
    title: "",
    text: "Nintendo 任天堂 Switch OLED",
    img: "../img/gift.jpeg",
    kind: 0
  },
  {
    type: 15,
    count: 2,
    title: "",
    text: "Apple AirPods Pro",
    img: "../img/gift.jpeg",
    kind: 0
  },
  {
    type: 16,
    count: 2,
    title: "",
    text: "ROSEWOOD 禮品卡",
    img: "../img/gift.jpeg",
    kind: 0
  },
  {
    type: 17,
    count: 2,
    title: "",
    text: "Bruno多功能電熱鍋",
    img: "../img/gift.jpeg",
    kind: 0
  },
  {
    type: 18,
    count: 2,
    title: "",
    text: "TanitaBC-402 智能體組成磅",
    img: "../img/gift.jpeg",
    kind: 0
  },
  {
    type: 19,
    count: 2,
    title: "",
    text: "SONY SoundBar",
    img: "../img/gift.jpeg",
    kind: 0
  },
  {
    type: 20,
    count: 2,
    title: "",
    text: "德國寶 移動浴室寶",
    img: "../img/gift.jpeg",
    kind: 0
  },
  {
    type: 21,
    count: 2,
    title: "",
    text: "Bruno手提蒸氣掛燙機",
    img: "../img/gift.jpeg",
    kind: 0
  },
  //
  {
    type: 22,
    count: 1,
    title: "",
    text: "Apple iPad Air (第5代）10.9”",
    img: "../img/gift.jpeg",
    kind: 1
  },
  {
    type: 23,
    count: 2,
    title: "",
    text: "CASH $5000",
    img: "../img/gift.jpeg",
    kind: 1
  },
  {
    type: 24,
    count: 1,
    title: "",
    text: "CASH $5000",
    img: "../img/gift.jpeg",
    kind: 1
  },
  {
    type: 25,
    count: 1,
    title: "",
    text: "CITYSUPER VOUCHER $1000 * 2",
    img: "../img/gift.jpeg",
    kind: 1
  },
  {
    type: 26,
    count: 1,
    title: "",
    text: "CASH COUPON $2000",
    img: "../img/gift.jpeg",
    kind: 1
  },
  {
    type: 27,
    count: 2,
    title: "",
    text: "LANE CRAWFORD GIFT CARD $1000",
    img: "../img/gift.jpeg",
    kind: 1
  },
  {
    type: 28,
    count: 1,
    title: "",
    text: "GUCCI WALLET",
    img: "../img/gift.jpeg",
    kind: 1
  },
  {
    type: 29,
    count: 5,
    title: "",
    text: "CASH $1000",
    img: "../img/gift.jpeg",
    kind: 1
  },
  {
    type: 30,
    count: 3,
    title: "",
    text: "YATA $1000",
    img: "../img/gift.jpeg",
    kind: 1
  },
  {
    type: 31,
    count: 2,
    title: "",
    text: "CASH $1000",
    img: "../img/gift.jpeg",
    kind: 1
  },
  {
    type: 32,
    count: 2,
    title: "",
    text: "CASH $1000",
    img: "../img/gift.jpeg",
    kind: 1
  },
  {
    type: 33,
    count: 2,
    title: "",
    text: "CASH COUPON $1000",
    img: "../img/gift.jpeg",
    kind: 1
  },
  {
    type: 34,
    count: 1,
    title: "",
    text: "DONKI COUPON $1000",
    img: "../img/gift.jpeg",
    kind: 1
  },
  {
    type: 35,
    count: 1,
    title: "",
    text: "10萬日元旅行支票",
    img: "../img/gift.jpeg",
    kind: 2
  },
  {
    type: 36,
    count: 1,
    title: "",
    text: "BE＠RBRICK 100% & 400%",
    img: "../img/gift.jpeg",
    kind: 2
  },
  {
    type: 37,
    count: 1,
    title: "",
    text: "BE＠RBRICK 制服VER. + 1 TOTE BAG",
    img: "../img/gift.jpeg",
    kind: 2
  },
  {
    type: 38,
    count: 3,
    title: "",
    text: "ANA禮品包 (MINI AIRPLANE + TOWEL)",
    img: "../img/gift.jpeg",
    kind: 2
  },

  {
    type: 39,
    count: 1,
    title: "",
    text: "ANA禮品包 (TOWEL + BAG)",
    img: "../img/gift.jpeg",
    kind: 2
  },
  // cupon
  {
    type: 40,
    count: 10,
    title: "",
    text: "花膠鮑魚海味套裝 ",
    img: "../img/gift.jpeg",
    kind: 3
  },
  {
    type: 41,
    count: 10,
    title: "",
    text: "CITYSUPER COUPON",
    img: "../img/gift.jpeg",
    kind: 3
  },
  {
    type: 42,
    count: 20,
    title: "",
    text: "DONKI COUPON",
    img: "../img/gift.jpeg",
    kind: 3
  },
  {
    type: 43,
    count: 20,
    title: "",
    text: "VENCHI COUPON",
    img: "../img/gift.jpeg",
    kind: 3
  },
  {
    type: 44,
    count: 20,
    title: "",
    text: "百佳 COUPON ",
    img: "../img/gift.jpeg",
    kind: 3
  },
  {
    type: 45,
    count: 20,
    title: "",
    text: "LADY M COUPON",
    img: "../img/gift.jpeg",
    kind: 3
  }
];

/**
 * 一次抽取的奖品个数与prizes对应
 */
const EACH_COUNT = [1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 
  1, 2, 1, 1, 1, 2, 1, 5, 3, 2, 2, 2, 1, 1, 1, 1, 3, 1,
  10, 10, 10, 10, 10, 10]
/**
 * 卡片公司名称标识
 */
const COMPANY = "Hana";

module.exports = {
  prizes,
  EACH_COUNT,
  COMPANY
};