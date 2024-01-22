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
    img: "../img/1.jpg",
    kind: 0
  },
  {
    type: 2,
    count: 1,
    title: "",
    text: "iPad Pro 11''",
    img: "../img/2.jpg",
    kind: 0
  },
  {
    type: 3,
    count: 1,
    title: "",
    text: "Apple iPad Air",
    img: "../img/3.jpg",
    kind: 0
  },
  {
    type: 4,
    count: 1,
    title: "",
    text: "Apple Watch Series 9",
    img: "../img/4.jpg",
    kind: 0
  },
  {
    type: 5,
    count: 1,
    title: "",
    text: "PlayStation 5 Slim 主機",
    img: "../img/5.jpg",
    kind: 0
  },
  {
    type: 6,
    count: 1,
    title: "",
    text: "Dyson Supersonic™ 風筒 HD15",
    img: "../img/6.jpg",
    kind: 0
  },
  {
    type: 7,
    count: 1,
    title: "",
    text: "半島酒店現金禮品卡",
    img: "../img/7.jpg",
    kind: 0
  },
  {
    type: 8,
    count: 3,
    title: "",
    text: "Disney Ticket x 2+2  ANNUAL PASS",
    img: "../img/8.jpg",
    kind: 0
  },
  {
    type: 9,
    count: 1,
    title: "",
    text: "PHILIPS 飛利浦AMF220/35 三合一風扇暖風空氣清新機",
    img: "../img/9.jpg",
    kind: 0
  },
  {
    type: 10,
    count: 1,
    title: "",
    text: "SONY 索尼WH-1000XM5 耳機",
    img: "../img/10.jpg",
    kind: 0
  },
  {
    type: 11,
    count: 1,
    title: "",
    text: "Marshall Kilburn II Portable Bluetooth Speaker",
    img: "../img/11.jpg",
    kind: 0
  },
  {
    type: 12,
    count: 1,
    title: "",
    text: "DYSON手提式吸塵機",
    img: "../img/12.jpg",
    kind: 0
  },
  {
    type: 13,
    count: 1,
    title: "",
    text: "Oral-BiO Series 9 充電電動牙刷",
    img: "../img/13.jpg",
    kind: 0
  },
  {
    type: 14,
    count: 1,
    title: "",
    text: "Nintendo 任天堂Switch",
    img: "../img/14.jpg",
    kind: 0
  },
  {
    type: 15,
    count: 2,
    title: "",
    text: "Apple AirPods Pro",
    img: "../img/15.jpg",
    kind: 0
  },
  {
    type: 16,
    count: 2,
    title: "",
    text: "ROSEWOOD 禮品卡",
    img: "../img/16.jpg",
    kind: 0
  },
  {
    type: 17,
    count: 2,
    title: "",
    text: "Bruno多功能電熱鍋",
    img: "../img/17.jpg",
    kind: 0
  },
  {
    type: 18,
    count: 2,
    title: "",
    text: "TanitaBC-402 智能體組成磅",
    img: "../img/18.jpg",
    kind: 0
  },
  {
    type: 19,
    count: 2,
    title: "",
    text: "SONY SoundBar",
    img: "../img/19.jpg",
    kind: 0
  },
  {
    type: 20,
    count: 2,
    title: "",
    text: "德國寶 移動浴室寶",
    img: "../img/20.jpg",
    kind: 0
  },
  {
    type: 21,
    count: 2,
    title: "",
    text: "Bruno手提蒸氣掛燙機",
    img: "../img/21.jpg",
    kind: 0
  },
  // backup
  {
    type: 22,
    count: 2,
    title: "",
    text: " 01 ",
    img: "../img/22.jpg",
    kind: 0
  },
  {
    type: 23,
    count: 2,
    title: "",
    text: "02",
    img: "../img/23.jpg",
    kind: 0
  },
  {
    type: 24,
    count: 1,
    title: "",
    text: "03",
    img: "../img/24.jpg",
    kind: 0
  },
  {
    type: 25,
    count: 1,
    title: "",
    text: "04",
    img: "../img/25.jpg",
    kind: 0
  },
  {
    type: 26,
    count: 1,
    title: "",
    text: "05",
    img: "../img/26.jpg",
    kind: 0
  },
  // cupon
  {
    type: 27,
    count: 10,
    title: "",
    text: "花膠鮑魚海味套裝 ",
    img: "../img/26.jpg",
    kind: 2
  },
  {
    type: 28,
    count: 10,
    title: "",
    text: "Citysuper coupon",
    img: "../img/27.jpg",
    kind: 2
  },
  {
    type: 29,
    count: 20,
    title: "",
    text: "DONKI coupon",
    img: "../img/28.jpg",
    kind: 2
  },
  {
    type: 30,
    count: 20,
    title: "",
    text: "Venchi Coupon",
    img: "../img/29.jpg",
    kind: 2
  },
  {
    type: 31,
    count: 20,
    title: "",
    text: "百佳coupon ",
    img: "../img/30.jpg",
    kind: 2
  },
  {
    type: 32,
    count: 20,
    title: "",
    text: "Lady M coupon",
    img: "../img/31.jpg",
    kind: 2
  }
];

/**
 * 一次抽取的奖品个数与prizes对应
 */
const EACH_COUNT = [1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 
  1, 1, 1, 1, 1, 
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