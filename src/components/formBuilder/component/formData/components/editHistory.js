/*
 * @Author: your name
 * @Date: 2020-04-10 15:15:00
 * @LastEditors: komons
 * @LastEditTime: 2020-04-15 09:36:26
 * @Description:
 * @FilePath: \form-builderc:\Komons\work\all\davinci-paas-frontend\src\components\formBuilder\component\formData\components\editHistory.js
 */
import React, { useEffect, useState } from "react";
import { Table } from "antd";
import axios from "axios";
import { message } from "antd";
import moment from "moment";
import config from "../../../config/config";

const columns = [
  {
    title: "编辑人",
    dataIndex: "editor",
    key: "editor",
    align: "center",
    width: "20%"
  },
  {
    title: "编辑时间",
    dataIndex: "date",
    key: "date",
    align: "center",
    width: "20%"
  },
  {
    title: "编辑内容",
    dataIndex: "content",
    key: "content"
  }
];
const paginationProps = {
  defaultCurrent: 1,
  position: "center",
  hideOnSinglePage: true
};

const EditHistory = ({ submissionId }) => {
  const [historyData, setHistoryData] = useState([]);
  const [isLoading, setLoadingStatus] = useState(true);

  useEffect(() => {
    axios({
      url: config.apiUrl + `/submission/update/record`,
      method: "get",
      params: {
        submissionId
      }
    }).then(res => {
      setLoadingStatus(false);
      if (res.status !== 200) {
        message.error("获取编辑数据记录失败！");
      }
      setHistoryData(
        res.data.map(item => ({
          editor: item.extraProp.updateUser,
          date: (new Date(item.updateTime)).toLocaleString(),
        content: <div>{item.updateDescription && item.updateDescription.split("\n").map(item => (<>{item}<br /></>))}</div>,
          key: item.updateTime
        }))
      );
    });
  }, [submissionId]);
  return <Table loading={isLoading} columns={columns} dataSource={historyData} pagination={paginationProps}></Table>;
};

export default EditHistory;
