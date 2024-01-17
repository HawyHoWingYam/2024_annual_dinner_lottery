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
    text: "特别奖",
    kind: 1
  },
  {
    type: 1,
    count: 2,
    text: "特等奖",
    title: "神秘大礼",
    img: "../img/secrit.jpg",
    kind: 1
  },
  {
    type: 2,
    count: 5,
    text: "一等奖",
    title: "Mac Pro",
    img: "../img/mbp.jpg",
    kind: 1
  },
  {
    type: 3,
    count: 6,
    text: "二等奖",
    title: "华为 Mate30",
    img: "../img/huawei.png",
    kind: 1
  },
  {
    type: 4,
    count: 7,
    text: "三等奖",
    title: "Ipad Mini5",
    img: "../img/ipad.jpg",
    kind: 1
  },
  {
    type: 5,
    count: 8,
    text: "四等奖",
    title: "大疆无人机",
    img: "../img/spark.jpg",
    kind: 2
  },
  {
    type: 6,
    count: 8,
    text: "五等奖",
    title: "Kindle",
    img: "../img/kindle.jpg",
    kind: 2
  },
  {
    type: 7,
    count: 10,
    text: "六等奖",
    title: "漫步者蓝牙耳机",
    img: "../img/edifier.jpg",
    kind: 2
  }
];

/**
 * 一次抽取的奖品个数与prizes对应
 */
const EACH_COUNT = [1, 1, 5, 6, 7, 8, 9, 10];

/**
 * 卡片公司名称标识
 */
const COMPANY = "Hana";

module.exports = {
  prizes,
  EACH_COUNT,
  COMPANY
};
