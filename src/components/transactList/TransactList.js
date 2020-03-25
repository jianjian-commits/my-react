import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Table, message } from "antd";
import TransactionDetail from "./TransactionDetail"
import request from '../../utils/request'
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

const data2 = [
  {
    key: "1",
    name: "理财产品合同审批2",
    description: "理财产品管理",
    owner: "张三",
    result: "进行中",
    process: "风险较大客户",
    time: "2019/11/12"
  },
  {
    key: "2",
    name: "理财产品合同审批2",
    description: "理财产品管理",
    owner: "李四",
    result: "进行中",
    process: "高金额客户",
    time: "2019/11/12"
  },
  {
    key: "3",
    name: "病假审批2",
    description: "请假审批",
    owner: "王五",
    result: "进行中",
    process: "部门审批",
    time: "2019/11/12"
  }
];


const TransactList = props => {
  const { appId } = useParams();
  const [transactList, setTransactList] = React.useState([]);
  const [approvalKey, setApprovalKey] = React.useState(null);
  const [currentDetailId, setCurrentDetailId] = React.useState(null);

  useEffect(() => {
    if(props.approvalKey !== approvalKey){
      getTransactList();
    }
  });

  async function getTransactList() {
    let url = "";
    let resData = [];
    switch(props.approvalKey){
      case "myPending": {
        url="/userTask/taskDoing";
        resData=data2;
      };break;
      case "myHandled": {
        url="/userTask/taskDone";
        resData=data;
      };break;
      case "mySubmitted": {
        url="/userTask/taskStart";
        resData=data;
      };break;
      default : break;
    }

    try {
      const res = await request(url,{
        headers:{
          appid: appId
        }
      });
      if (res && res.status === "SUCCESS") {
        if(resData.length !== 0){
          setTransactList(resData)
          setApprovalKey(props.approvalKey)
        }
      } else {
        message.error("获取审批列表失败");
      }
    } catch (err) {
      message.error("获取审批列表失败");
    }
  }
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
          <span style={{cursor:"pointer"}} onClick={(e)=>{props.setEnterApprovalDetail(true); setCurrentDetailId(record.key)}}>查看</span>
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
        {_title} <span className={classes.totalNumber}>（共{transactList.length}条）</span>
      </div>
      <Table columns={columns} dataSource={transactList} className={classes.tableContent}></Table>
    </div>
    ):(
      <TransactionDetail 
        fn = {props.fn} 
        approvalKey={props.approvalKey}
        currentDetailId={currentDetailId}/>
    )
    
  );
};

export default TransactList;
