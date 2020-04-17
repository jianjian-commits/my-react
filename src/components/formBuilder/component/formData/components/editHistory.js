/*
 * @Author: your name
 * @Date: 2020-04-10 15:15:00
 * @LastEditors: komons
 * @LastEditTime: 2020-04-17 11:18:07
 * @Description:
 * @FilePath: \form-builderc:\Komons\work\all\davinci-paas-frontend\src\components\formBuilder\component\formData\components\editHistory.js
 */
import React, { useEffect, useState } from "react";
import { Table } from "antd";
import axios from "axios";
import { message } from "antd";
import editHistoryUtils from "./utils/filterHistoryUtils";
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

  const filterHistryDom = arr => {
    if (arr) {
      let res = arr.map((item, index) => {
        if (item.type === "FileUpload" || item.type === "ImageUpload") {
          let res = editHistoryUtils.FileUpload(item);
          return res.map((r, i) => {
            if (i === 0) {
              return <p key={i}>{r.content}</p>;
            } else {
              return (
                <p key={i} className={"file-list file-status_" + r.status}>
                  {" "}
                  {r.content}
                </p>
              );
            }
          });
        } else if (["DateInput", "PureDate", "PureTime"].includes(item.type)) {
          let [beforeValue, afterValue] = editHistoryUtils["DateInput"](item);
          console.log(beforeValue, afterValue);
          return (
            <p key={index}>
              修改{item.label}的值{beforeValue}为{afterValue}
            </p>
          );
        } else if (item.type === "FormChildTest") {
          return "修改子表单";
        } else {
          return (
            <p key={index}>
              修改{item.label}的值{item.beforeValue}为{item.afterValue}
            </p>
          );
        }
      });
      return <div>{res}</div>;
    } else {
      return "创建记录";
    }
  };

  useEffect(() => {
    axios({
      url: config.apiUrl + `/update_records`,
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
          editor:
            item.extraProp.updateUser && item.extraProp.updateUser["name"],
          date: new Date(item.updateTime).toLocaleString(),
          content: filterHistryDom(item.changeFieldUpdateRecords),
          key: item.updateTime
        }))
      );
    });
  }, [submissionId]);
  return (
    <Table
      loading={isLoading}
      columns={columns}
      dataSource={historyData}
      pagination={paginationProps}
      className="edit-history-table"
    ></Table>
  );
};

export default EditHistory;
