import React from "react";
import { Link } from "react-router-dom";
import { Table } from "antd";
import TransactionDetail from "./TransactionDetail"
import classes from "./transactList.module.scss";



const data = [
  {
    key: "1",
    name: "理财产品合同审批",
    description: "理财产品管理",
    owner: "张三",
    result: "进行中",
    process: "风险较大客户",
    time: "2019/11/12"
  },
  {
    key: "2",
    name: "理财产品合同审批",
    description: "理财产品管理",
    owner: "李四",
    result: "进行中",
    process: "高金额客户",
    time: "2019/11/12"
  },
  {
    key: "3",
    name: "病假审批",
    description: "请假审批",
    owner: "王五",
    result: "进行中",
    process: "部门审批",
    time: "2019/11/12"
  }
];


const TransactList = props => {
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
          <span style={{cursor:"pointer"}} onClick={(e)=>{props.setEnterApprovalDetail(true);}}>查看</span>
        );
      }
    }
  ];
  const _title = (() => {
    switch (props.approvalKey) {
      case "myPending":
        return "我的待办";
      case "mySubmitted":
        return "我发起的";
      case "myHandled":
        return "我处理的";
      default:
        return "我的待办";
    }
  })();

  return (
    props.enterApprovalDetail === false ?(
      <div className={classes.tableBox}>
      <div className={classes.tableTitle}>
        {_title} <span className={classes.totalNumber}>（共{data.length}条）</span>
      </div>
      <Table columns={columns} dataSource={data} className={classes.tableContent}></Table>
    </div>
    ):(
      <TransactionDetail fn = {props.fn} approvalKey={props.approvalKey}/>
    )
    
  );
};

export default TransactList;
