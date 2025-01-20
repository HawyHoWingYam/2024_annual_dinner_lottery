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
    type: 1,
    count: 5,
    title: "綜合獎項",
    text: "5份",
    img: "../img/gift.jpeg",
    kind: 3,
    prize_list: {
      "小米手環": 3,
      "三星手機": 2,
    }
  },
  {
    type: 2,
    count: 5,
    title: "綜合獎項",
    text: "5份",
    img: "../img/gift.jpeg",
    kind: 3,
    prize_list: {
      "小米手環": 3,
      "三星手機": 2,
    }
  },
  {
    type: 3,
    count: 25,
    title: "綜合獎項",
    text: "10份",
    img: "../img/gift.jpeg",
    kind: 3,
    prize_list: {
      "花膠鮑魚海味套裝": 10,
      "CITYSUPER COUPON $600": 8,
      "DONKI COUPON $500": 7
    }
  }
];

/**
 * 一次抽取的奖品个数与prizes对应
 */
const EACH_COUNT = [5, 5, 25]
/**
 * 卡片公司名称标识
 */
const COMPANY = "Hana";

module.exports = {
  prizes,
  EACH_COUNT,
  COMPANY
};