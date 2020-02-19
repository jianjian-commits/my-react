import TransactList from "../components/transactList/TransactList";

const appDetailMenu = [
  {
    key: 0,
    describe: "我的待办",
    ContentEle: TransactList
  },
  {
    key: 1,
    describe: "我发起的",
    ContentEle: TransactList
  },
  {
    key: 2,
    describe: "我处理的",
    ContentEle: TransactList
  }
];
export default appDetailMenu;
