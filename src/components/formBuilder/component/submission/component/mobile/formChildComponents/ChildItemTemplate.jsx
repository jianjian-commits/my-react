import React, { useState } from "react";
import { Button as MobileButton } from "antd";

const ChildItemTemplate = props => {
  // const [isShow, setShowStatus] = useState(true);
  // const [titleList, setTitleList] = useState([]);
  const {
    formItem,
    submitDataArray,
    renderFormChild,
    saveSubmitData,
    currentIndex,
    hasItemErr
  } = props;
  const isShow = formItem.isShow;

  // 将地址对象转化为字符串
  const AddressObjToString = address => {
    if (address) {
      let { province, county, city, detail } = address;
      return [province, city, county, detail].filter(item => item).join("");
    } else {
      return "";
    }
  };

  // 是否隐藏
  const handleSetPanelStatus = () => {
    // if (isShow) {
    //   setTitleList(getRightTitle(formItem));
    // }
    // setShowStatus(!isShow);
    if (isShow) {
      submitDataArray.forEach(item => item.isShow = false);
    } else {
      // setTitleList(getRightTitle(formItem));
      submitDataArray.forEach(item => (item.isShow = false));
      formItem.isShow = true;
    }
    saveSubmitData(submitDataArray);
  };

  // 隐藏后显示组件数据
  const getRightTitle = formItem => {
    // console.log(formItem)
    let res = [];
    for (let item in formItem) {
      switch (formItem[item].formType) {
        case "Address": {
          formItem[item].data &&
            res.push(AddressObjToString(formItem[item].data));
          break;
        }
        case "DateInput": {
          formItem[item].data.time && res.push(formItem[item].data.time);
          break;
        }
        case "ImageUpload": {
          formItem[item].type && res.push(formItem[item].type);
          break;
        }
        case "FileUpload": {
          formItem[item].type && res.push(formItem[item].type);
          break;
        }
        default: {
          formItem[item].data && res.push(formItem[item].data);
          break;
        }
      }
      // if(formItem[item].data && typeof formItem[item].data == "object") {
      //     formItem[item].data.time && res.push(formItem[item].data.time)
      // } else {
      //     formItem[item].data && res.push(formItem[item].data);
      // }
    }
    return res;
  };


  // console.log("fck ", hasItemErr)
  let className = hasItemErr ?
    "form-child-block form-child-container form-child-errContent" : "form-child-block form-child-container";

  return (
    <div className="form-child-block form-child-container">
      <ul
        className="list"
        style={isShow ? { display: "block" } : { display: "none" }}
      >
        {renderFormChild(formItem)}
      </ul>
      <ul
        className="list hide-state"
        style={isShow ? { display: "none" } : { display: "block" }}
      >
        <li className="title-list">
          {getRightTitle(formItem).map((item, index) => (
            <span key={index}>{item}</span>
          ))}
        </li>
      </ul>

      <footer className="footer-wrap">
        <MobileButton
          className="btn"
          type="ghost"
          size="small"
          style={{ marginRight: "4px" }}
          onClick={_e => {
            let newArray = submitDataArray;
            newArray.splice(currentIndex, 1);
            saveSubmitData(newArray);
          }}
        >
          删除
        </MobileButton>
        <MobileButton
          className="btn"
          type="ghost"
          size="small"
          style={{ marginRight: "4px" }}
          onClick={handleSetPanelStatus}
        >
          {isShow ? "收起" : "展开"}
        </MobileButton>
      </footer>
    </div>
  );
};

export default ChildItemTemplate;
