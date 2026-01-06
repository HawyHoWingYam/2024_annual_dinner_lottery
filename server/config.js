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
    count: 1,
    title: "花開富貴1",
    text: "禮盒 1份",
    img: "../img/gift.jpeg",
    kind: 2,
    prize_list: {
      "花開富貴禮盒": 1
    }
  },
  {
    type: 2,
    count: 2,
    title: "花開富貴2",
    text: "禮盒 2份",
    img: "../img/gift.jpeg",
    kind: 2,
    prize_list: {
      "花開富貴禮盒": 2
    }
  },
  {
    type: 3,
    count: 3,
    title: "花開富貴3",
    text: "禮盒 3份",
    img: "../img/gift.jpeg",
    kind: 2,
    prize_list: {
      "花開富貴禮盒": 3
    }
  }
];

/**
 * 一次抽取的奖品个数与prizes对应
 */
const EACH_COUNT = [1, 2, 3]
/**
 * 卡片公司名称标识
 */
const COMPANY = "Hana";

module.exports = {
  prizes,
  EACH_COUNT,
  COMPANY
};