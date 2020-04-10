/*
 * @Author: your name
 * @Date: 2020-04-10 15:15:00
 * @LastEditors: komons
 * @LastEditTime: 2020-04-10 15:49:33
 * @Description:
 * @FilePath: \form-builderc:\Komons\work\all\davinci-paas-frontend\src\components\formBuilder\component\formData\components\editHistory.js
 */
import React, { useEffect, useState } from "react";
import { Table } from "antd";
const mock = [
  {
    id: "dhsajs",
    editor: "张三",
    date: "2016-12-12 12:12:12",
    content: "这里的和三开始的就撒开了",
  },
  {
    id: "djsiaio",
    editor: "李四",
    date: "2018-12-12 12:12:11",
    content: "这里的和三开始的就撒开了",
  },
  {
    id: "iouihjk",
    editor: "王五",
    date: "2015-12-12 12:12:12",
    content: "这里的和三开始的就撒开了",
  },
];

const columns = [
  {
    title: "编辑人",
    dataIndex: "editor",
    key: "editor",
    align: "center"
  },
  {
    title: "编辑时间",
    dataIndex: "date",
    key: "date",
    align: "center"
  },
  {
    title: "编辑内容",
    dataIndex: "content",
    key: "content",
  },
];
const paginationProps = {
    defaultCurrent: 1,
    position: "bottom",
  };

const EditHistory = () => {
  const [historyData, setHistoryData] = useState([]);

  useEffect(() => {
    setHistoryData(mock);
  });
  return (
    <Table
      columns={columns}
      dataSource={historyData}
    ></Table>
  );
};

export default EditHistory;
