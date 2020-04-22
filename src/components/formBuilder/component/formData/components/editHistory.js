/*
 * @Author: your name
 * @Date: 2020-04-10 15:15:00
 * @LastEditors: komons
 * @LastEditTime: 2020-04-20 16:08:56
 * @Description:
 * @FilePath: \form-builderc:\Komons\work\all\davinci-paas-frontend\src\components\formBuilder\component\formData\components\editHistory.js
 */
import React, { useEffect, useState } from "react";
import { Table } from "antd";
import axios from "axios";
import { message } from "antd";
import editHistoryUtils from "./utils/filterHistoryUtils";
import config from "../../../config/config";
import moment from "moment";

const columns = [
  {
    title: "编辑人",
    dataIndex: "editor",
    key: "editor",
    className: "editor",
    width: "20%"
  },
  {
    title: "编辑时间",
    dataIndex: "date",
    key: "date",
    align: "left",
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
  hideOnSinglePage: true,
  defaultPageSize: 5,

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
          return (
            <p key={index}>
              修改{item.label}的值 <span className="before-value">{beforeValue}</span> 为 <span className="after-value">{afterValue}</span>
            </p>
          );
        } else if (item.type === "FormChildTest") {
          return <p key={index}>修改 {item.label} 的值</p>;
        } else {
          return (
            <p key={index}>
              修改{item.label}的值 <span className="before-value">{item.beforeValue}</span> 为 <span className="after-value">{item.afterValue}</span>
            </p>
          );
        }
      });
      return <div>{res}</div>;
    } else {
      return <p>创建记录</p>;
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
          date: moment.utc(item.updateTime).local().format("YYYY-MM-DD HH:mm:ss"),
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
