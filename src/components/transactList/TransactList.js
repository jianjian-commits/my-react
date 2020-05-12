import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { message } from "antd";
import { Table } from "../shared/customWidget";
import request from "../../utils/request";
import classes from "./transactList.module.scss";
import HomeContent from "../content/HomeContent";

const TransactList = (props) => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [total, setTotal] = React.useState(0);
  const [transactList, setTransactList] = React.useState([]);
  const [tableLoading, setTableLoading] = React.useState(false);

  useEffect(() => {
    getTransactList(currentPage, pageSize);
  }, [currentPage]);

  async function getTransactList(currentPage, pageSize) {
    setTableLoading(true);
    try {
      const res = await request(`/flow/history/approval/todos`, {
        method: "POST",
        data: {
          page: currentPage, //从1开始
          size: pageSize,
        },
      });
      if (res && res.status === "SUCCESS") {
        const { total, currentPage, pageSize, datas } = res.data;
        const list = datas.map((item) => {
          item.key = item.submitDate;
          item.submitDate = new Date(item.submitDate).toLocaleString(
            "chinese",
            { hour12: false }
          );
          return item;
        });
        setTransactList(list);
        setTotal(total);
        setPageSize(pageSize);
        setCurrentPage(currentPage);
        setTableLoading(false);
      } else {
        message.error("获取审批列表失败");
        setTableLoading(false);
      }
    } catch (err) {
      message.error("获取审批列表失败");
      setTableLoading(false);
    }
  }
  const columns = [
    {
      title: "审批流名称",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "描述",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "审批结果",
      dataIndex: "approveResult",
      key: "approveResult",
    },
    {
      title: "当前步骤",
      dataIndex: "currentNode",
      key: "currentNode",
    },
    {
      title: "提交人",
      dataIndex: "submitter",
      key: "submitter",
    },
    {
      title: "提交日期",
      dataIndex: "submitDate",
      key: "submitDate",
    },
    {
      title: "操作",
      key: "action",
      render: (text, record) => {
        return (
          <span>
            <Link to={`/app/${record.appId}/${record.dataId}`}>查看</Link>
          </span>
        );
      },
    },
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
    },
  };
  function onChangePages(current, pageSize) {
    setCurrentPage(current);
    setPageSize(pageSize);
    getTransactList(current, pageSize);
  }

  return (
    <HomeContent
      title={
        <div className={classes.tableTitle}>
          我的待办 <span className={classes.totalNumber}>（共{total}条）</span>
        </div>
      }
    >
      <div className={classes.tableBox}>
        <Table
          loading={tableLoading}
          columns={columns}
          dataSource={transactList}
          rowKey="dataId"
          pagination={paginationProps}
        ></Table>
      </div>
    </HomeContent>
  );
};

export default TransactList;
