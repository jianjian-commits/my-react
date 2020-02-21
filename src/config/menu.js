import TransactList from "../components/transactList/TransactList";
import TeamDetail from "../components/team/TeamInfo";
import TeamMember from "../components/team/TeamMember";

export const appDetailMenu = [
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
export const teamMenu = [
  {
    key: 0,
    describe: "团队信息",
    ContentEle: TeamDetail
  },
  {
    key: 1,
    describe: "团队成员",
    ContentEle: TeamMember
  },
  {
    key: 2,
    describe: "分组",
    ContentEle: TeamDetail
  }
];
