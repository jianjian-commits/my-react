import React from "react";
import { useParams, Link } from "react-router-dom";
import { Table } from "antd";
import classes from "./transactList.module.scss";



const data = [
  {
    key: "1",
    dataId:"data1",
    name: "理财产品合同审批",
    description: "理财产品管理",
    owner: "张三",
    result: "进行中",
    process: "风险较大客户",
    time: "2019/11/12",
    appid: "222"
  },
  {
    key: "2",
    dataId:"data2",
    name: "理财产品合同审批",
    description: "理财产品管理",
    owner: "李四",
    result: "进行中",
    process: "高金额客户",
    time: "2019/11/12",
    appid: "333",
  },
  {
    key: "3",
    dataId:"data3",
    name: "病假审批",
    description: "请假审批",
    owner: "王五",
    result: "进行中",
    process: "部门审批",
    time: "2019/11/12",
    appid: "444",
  }
];


const TransactList = props => {
  // const [currentDetailId, setCurrentDetailId] = React.useState(null);
  const columns = [
    {
      title: "审批流名称",
      dataIndex: "name",
      key: "name"
    },
    {
      title: "描述",
      dataIndex: "description",
      key: "description"
    },
    {
      title: "审批结果",
      dataIndex: "result",
      key: "result"
    },
    {
      title: "当前步骤",
      dataIndex: "process",
      key: "process"
    },
    {
      title: "提交人",
      dataIndex: "owner",
      key: "owner"
    },
    {
      title: "提交日期",
      dataIndex: "time",
      key: "time"
    },
    {
      title: "操作",
      key: "action",
      render: (text, record) => {
        return (
          <span>
            <Link to={`/app/${record.appid}/${record.dataId}`}>查看</Link>
          </span>
        );
      }
    }
  ];
  return (
    <div className={classes.tableBox} style={{  width: "calc(100vw - 500px)", margin:"0 auto"}}>
      <div className={classes.tableTitle}>
      我的待办 <span className={classes.totalNumber}>（共{data.length}条）</span>
      </div>
      <Table columns={columns} dataSource={data} className={classes.tableContent}></Table>
    </div>
  );
};

export default TransactList;
