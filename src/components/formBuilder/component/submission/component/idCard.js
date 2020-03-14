import React from "react";
import { isValueValid, isStringValid } from "../../../utils/valueUtils";
import { Input, Form, Tooltip, Icon } from "antd";
import LabelUtils from "../../formBuilder/preview/component/formItemDoms/utils/LabelUtils";
import {
  getFormAllSubmission,
  filterSubmissionData,
  compareEqualArray
} from "../utils/dataLinkUtils";

export default class IdCard extends React.Component {
  componentDidMount() {
    const { form, item, handleSetComponentEvent } = this.props;
    const { data } = item;
    if (data && data.type === "DataLinkage") {
      const {
        conditionId,
        linkComponentId,
        linkDataId,
        linkFormId
      } = data.values;
      getFormAllSubmission(linkFormId).then(submissions => {
        let dataArr = filterSubmissionData(submissions, linkComponentId);
        handleSetComponentEvent(conditionId, value => {
          let index = -1;
          if (value instanceof Array) {
            index = compareEqualArray(dataArr, value);
          } else {
            index = dataArr.indexOf(value);
          }
          if (index > -1) {
            let data = filterSubmissionData(submissions, linkDataId);
            let res = data[index];
            form.setFieldsValue({
              [item.key]: res
            });
            // 多级联动
            this.handleEmitChange(res);
          } else {
            this.handleEmitChange(undefined);
          }
        });
      });
    }
  }

  handleEmitChange = value => {
    const { callEventArr } = this.props.item;
    if (callEventArr) {
      callEventArr.forEach(fnc => {
        fnc && fnc(value, this);
      });
    }
  };
  // 如果存在回调数组，则遍历里面的函数执行
  handleChange = ev => {
    const value = ev.target.value;
    this.handleEmitChange(value);
    this.props.resetErrorMsg(this.props.item.id);
    setTimeout(() => {
      let key = this.props.item.key;
      let customMessage = this.props.item.validate.customMessage;
      if (
        !Object.is(
          document
            .querySelector(`#${key}Dom`)
            .querySelector(".ant-form-explain"),
          null
        )
      ) {
        document
          .querySelector(`#${key}Dom`)
          .querySelector(".ant-form-explain")
          .setAttribute("title", customMessage);
      }
    }, 300);
  };

  isValueEqualEmptyAndUndefined = value => {
    if (value === "" || value == void 0) {
      return true;
    } else {
      return false;
    }
  };

  emptyValueNotShowMessage = callback => {
    callback();
  };

  _checkIdcardValid(idStr) {
    let wf = ["1", "0", "x", "9", "8", "7", "6", "5", "4", "3", "2"];
    let checkCode = [
      "7",
      "9",
      "10",
      "5",
      "8",
      "4",
      "2",
      "1",
      "6",
      "3",
      "7",
      "9",
      "10",
      "5",
      "8",
      "4",
      "2"
    ];
    let addressNoArray = [
      "11",
      "12",
      "13",
      "14",
      "15",
      "21",
      "22",
      "23",
      "31",
      "32",
      "33",
      "34",
      "35",
      "36",
      "37",
      "41",
      "42",
      "43",
      "44",
      "45",
      "46",
      "50",
      "51",
      "52",
      "53",
      "54",
      "61",
      "62",
      "63",
      "64",
      "65",
      "71",
      "81",
      "82",
      "91"
    ];
    let idCardNo = "";

    if (idStr.length !== 15 && idStr.length !== 18) {
      return false;
    }

    if (idStr.length === 18) {
      idCardNo = idStr.substring(0, 17);
    } else if (idStr.length === 15) {
      idCardNo = idStr.substring(0, 6) + "19" + idStr.substring(6, 15);
    }

    if (Number.isNaN(Number(idCardNo))) {
      console.error("身份证必须前17位必须为number");
      return false;
    }

    let strYear = idCardNo.substring(6, 10); // 年份
    let strMonth = idCardNo.substring(10, 12); // 月份
    let strDay = idCardNo.substring(12, 14); // 月份
    let date = new Date(strYear + "/" + strMonth + "/" + strDay);

    if (date === "Invalid Date") {
      console.error("身份证时间错误");
      return false;
    } else if (Date.now() - date < 0) {
      console.error("身份证时间错误");
      return false;
    }

    if (addressNoArray.includes(idCardNo.substring(0, 2)) === false) {
      console.error("身份证地址错误");
      return false;
    }

    let lastOne = 0;
    for (let i = 0; i < 17; i++) {
      lastOne =
        lastOne + Number.parseInt(idCardNo[i]) * Number.parseInt(checkCode[i]);
    }
    let modValue = lastOne % 11;
    idCardNo = idCardNo + wf[modValue];

    return idCardNo === idStr.toLowerCase();
  }

  checkValueAndThrowMessage = (value, callback) => {
    if (this._checkIdcardValid(value) === false) {
      let errMsg = this.props.item.validate.customMessage;
      isStringValid(errMsg)
        ? callback(errMsg)
        : callback("请输入正确的身份证号码！");
    } else {
      callback();
    }
  };

  checkIdCardNumber = (rule, value, callback) => {
    this.isValueEqualEmptyAndUndefined(value)
      ? this.emptyValueNotShowMessage(callback)
      : this.checkValueAndThrowMessage(value, callback);
  };

  render() {
    const { getFieldDecorator, item, disabled, initData } = this.props;
    let itemOption = {};
    if (this.props.errorResponseMsg && this.props.errorResponseMsg.length > 0) {
      itemOption.validateStatus = "error";
      itemOption.help = this.props.errorResponseMsg.join("");
    }
    return (
      <Form.Item label={<LabelUtils data={item} />} {...itemOption}>
        {getFieldDecorator(item.key, {
          initialValue: initData || item.defaultValue,
          rules: [
            {
              validator: this.checkIdCardNumber
            },
            {
              required: isValueValid(item.validate.required)
                ? item.validate.required
                : false,
              message: "身份证号不能为空!"
            }
          ],
          validateTrigger: "onBlur"
        })(
          <Input
            disabled={disabled}
            autoComplete="off"
            onChange={this.handleChange}
          />
        )}
      </Form.Item>
    );
  }
}
