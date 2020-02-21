import React from "react";
import { isValueValid, isStringValid } from "../../../utils/valueUtils";
import { Input, Form, Tooltip, Icon } from "antd";
import LabelUtils from "../../formBuilder/preview/component/formItemDoms/utils/LabelUtils";
import {
  getFormAllSubmission,
  filterSubmissionData,
  compareEqualArray
} from "../utils/dataLinkUtils";

export default class PhoneNumber extends React.Component {
  componentDidMount() {
    const { form, item, handleSetComponentEvent } = this.props;
    const { data } = item;
    if (data && data.type == "DataLinkage") {
      const {
        conditionId,
        linkComponentId,
        linkComponentType,
        linkDataId,
        linkFormId
      } = data.values;
      getFormAllSubmission(linkFormId).then(submissions => {
        let dataArr = filterSubmissionData(submissions, linkComponentId);
        handleSetComponentEvent(conditionId, value => {
          let index = -1;
          if (value instanceof Array) {
            index = compareEqualArray(dataArr, value);
          } else if (value instanceof Object) {
            // 争对地址的比较
            let { county, city, province, detail } = value;
            if (dataArr[0] && dataArr[0] instanceof Object) {
              dataArr = dataArr.map(item => {
                let { county, city, province, detail } = item;
                return [province, city, county, detail].join("");
              });
            }
            index = dataArr.indexOf([province, city, county, detail].join(""));
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
            form.setFieldsValue({
              [item.key]: undefined
            });
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
    if (value == "" || value == void 0) {
      return true;
    } else {
      return false;
    }
  };

  emptyValueNotShowMessage = callback => {
    callback();
  };

  checkValueAndThrowMessage = (value, callback) => {
    let reg = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
    if (!reg.test(value)) {
      let errMsg = this.props.item.validate.customMessage;
      isStringValid(errMsg)
        ? callback(errMsg)
        : callback("请输入正确的手机号！");
    } else {
      callback();
    }
  };

  checkPhoneNumber = (rule, value, callback) => {
    this.isValueEqualEmptyAndUndefined(value)
      ? this.emptyValueNotShowMessage(callback)
      : this.checkValueAndThrowMessage(value, callback);
  };

  render() {
    const { getFieldDecorator, item, disabled } = this.props;
    let itemOption = {};
    if (this.props.errorResponseMsg && this.props.errorResponseMsg.length > 0) {
      itemOption.validateStatus = "error";
      itemOption.help = this.props.errorResponseMsg.join("");
    }
    return (
      <Form.Item label={<LabelUtils data={item} />} {...itemOption}>
        {getFieldDecorator(item.key, {
          initialValue: item.defaultValue,
          rules: [
            {
              validator: this.checkPhoneNumber
            },
            {
              required: isValueValid(item.validate.required)
                ? item.validate.required
                : false,
              message: "手机号不能为空!"
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
