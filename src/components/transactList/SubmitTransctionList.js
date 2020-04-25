import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { message } from "antd";
import { Table } from "../shared/customWidget";
import request from '../../utils/request'
import classes from "./transactList.module.scss";
import FormDataDetail from "../formBuilder/component/formData/components/formDataDetail"

const SubmitTransactList = props => {
  const { appId } = useParams();
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [total, setTotal] = React.useState(0);
  const [transactList, setTransactList] = React.useState([]);
  const [approvalKey, setApprovalKey] = React.useState(null);
  const [currentDetailId, setCurrentDetailId] = React.useState(null);
  const [tableLoading, setTableLoading] = React.useState(false);

  useEffect(() => {
      getTransactList(currentPage, pageSize);
  },[approvalKey]);

  async function getTransactList(currentPage, pageSize) {
    setTableLoading(true)
    try {
      const res = await request(`/flow/history/approval/submits`,{
        method:"POST",
        headers:{
          appid: appId
        },
        data:{
          page: currentPage, //从1开始
          size: pageSize
        }
      });
      if (res && res.status === "SUCCESS") {
          const { total, currentPage, pageSize, datas } = res.data;
          const list = datas.map(item =>{
            item.key= item.submitDate;
            item.submitDate = new Date(item.submitDate).toLocaleString("chinese", { hour12: false })
            return item;
          });
          setTransactList(list);
          setApprovalKey(approvalKey);
          setTotal(total);
          setPageSize(pageSize);
          setCurrentPage(currentPage);
          setTableLoading(false)
      } else {
        message.error("获取审批列表失败");
        setTableLoading(false)
      }
    } catch (err) {
      message.error("获取审批列表失败");
      setTableLoading(false)
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
      dataIndex: "approveResult",
      key: "approveResult"
    },
    {
      title: "当前步骤",
      dataIndex: "currentNode",
      key: "currentNode"
    },
    {
      title: "提交人",
      dataIndex: "submitter",
      key: "submitter"
    },
    {
      title: "提交日期",
      dataIndex: "submitDate",
      key: "submitDate"
    },
    {
      title: "操作",
      key: "action",
      render: (text, record) => {
        return (
          <span onClick={(e)=>{props.setEnterApprovalDetail(true); setCurrentDetailId(record.dataId)}}>查看</span>
        );
      }
    }
  ];
  const paginationProps = {
    defaultCurrent: 1,
    position: "bottom",
    pageSize: pageSize,
    total: total,
    current: currentPage,
    onChange: (current, pageSize) => {
      onChangePages(current, pageSize);
    },
    onShowSizeChange: (current, pageSize) => {
      onChangePages(current, pageSize);
    }
  };
  function onChangePages(current, pageSize) {
    setCurrentPage(current);
    setPageSize(pageSize);
    getTransactList(current, pageSize);
  };

  return (
    props.enterApprovalDetail === false ?(
      <div className={classes.tableBox}>
      <div className={classes.tableTitle}>
        我发起的 <span className={classes.totalNumber}>（共{total}条）</span>
      </div>
      <Table
        loading={tableLoading} 
        columns={columns} 
        dataSource={transactList} 
        pagination={paginationProps}
        ></Table>
    </div>
    ):(
      <FormDataDetail
        id={currentDetailId.substring(0, currentDetailId.indexOf("-"))}
        dataId={currentDetailId}
        appId={appId}
        actionFun={props.actionFun}
        fn = {props.fn}
        approvalKey={props.approvalKey}
        enterPort={"TransctionList"}
      />
    )
    
  );
};

export default SubmitTransactList;
