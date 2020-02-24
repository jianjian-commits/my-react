import React from "react";

import { isValueValid, isStringValid } from "../../../utils/valueUtils";
import { Input, Form, Tooltip, Icon } from "antd";
import LabelUtils from "../../formBuilder/preview/component/formItemDoms/utils/LabelUtils";
import {
  getFormAllSubmission,
  filterSubmissionData,
  compareEqualArray
} from "../utils/dataLinkUtils";

export default class NumberInput extends React.Component {


  componentDidMount() {
    const { form, item, handleSetComponentEvent } = this.props;
    const { data } = item;
    if (data && data.type === "DataLinkage") {
      const {
        conditionId,
        linkComponentId,
        linkComponentType,
        linkDataId,
        linkFormId
      } = data.values;
      getFormAllSubmission(linkFormId).then(submissions => {
        let dataArr = filterSubmissionData(submissions, linkComponentId);
        handleSetComponentEvent(conditionId, (value) => {
          let index = -1;
          let newData = [...dataArr];
          if (value instanceof Array) {
            index = compareEqualArray(dataArr, value);
          } else if (value instanceof Object) {
            // 争对地址的比较
            let { county, city, province, detail } = value;
            newData = dataArr.map(item => {
              if (item) {
                let { county, city, province, detail } = item;
                return [province, city, county, detail].join("");
              } else {
                return Symbol();
              }
            });
            index = newData.indexOf([province, city, county, detail].join(""));
          } else {
            index = newData.indexOf(value);
          }
          if(index > -1) {
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
            // 多级联动
            this.handleEmitChange(undefined);
          }
        });
      });
    }
  }

  handleEmitChange = (value) => {
    const { callEventArr } = this.props.item;
    if (callEventArr) {
      callEventArr.forEach(fnc => {
        fnc && fnc(value, this);
      });
    }
  }
  // 如果存在回调数组，则遍历里面的函数执行
  handleChange = ev => {
    const value = Number(ev.target.value);
    this.handleEmitChange(value);
    this.props.resetErrorMsg(this.props.item.id);
    setTimeout(()=>{
      let key = this.props.item.key;
      let customMessage = this.props.item.validate.customMessage;
      if(!Object.is(document.querySelector(`#${key}Dom`).querySelector(".ant-form-explain"),null)){
        document.querySelector(`#${key}Dom`).querySelector(".ant-form-explain").setAttribute('title',customMessage)
      }
    },300)
  };

  checkNumber = (rule, value, callback) => {
    const validateMax = this.props.item.validate.max;
    const validateMin = this.props.item.validate.min;
    let defaultErrMsg = '';
    if(this.props.item.validate.isLimitLength){
      if (validateMax !== Number.MAX_VALUE && validateMin !== -Number.MAX_VALUE) {
        defaultErrMsg = `请输入${validateMin} ~ ${validateMax}之间的数字`;
      } else if (validateMax !== Number.MAX_VALUE) {
        defaultErrMsg = `请输入小于或等于${validateMax}的数字`;
      } else {
        defaultErrMsg = `请输入大于或等于${validateMin}的数字`;
      }
    }

    if (value === "") {
      callback();
    } else if (this.props.item.validate.isLimitLength && (validateMax !== null && validateMax < Number(value)) || (validateMin !== null && validateMin > Number(value))) {
      let errMsg = this.props.item.validate.customMessage;
      isStringValid(errMsg) ? callback(errMsg) : callback(defaultErrMsg);
    } else {
      callback();
    }
  };
  
  render() {
    const { getFieldDecorator, item, disabled } = this.props;

    let errMsg = this.props.item.validate.customMessage;
    let itemOption = {}
    if(this.props.errorResponseMsg && this.props.errorResponseMsg.length > 0){
      itemOption.validateStatus = "error";
      itemOption.help = this.props.errorResponseMsg.join("")
    }
    return (
      <Form.Item
        label={
          <LabelUtils data = {item} />
        }
       {...itemOption}>

        {getFieldDecorator(item.key, {
          initialValue: item.defaultValue, 
          rules: [
            {
              validator: this.checkNumber
            },
            {
              required:
                isValueValid(item.validate.required)
                  ? item.validate.required
                  : false,
              message: `${item.label}不能为空`
            }
          ],
          validateTrigger:"onBlur"
        })(<Input type="number" disabled={disabled} autoComplete="off" onChange={this.handleChange} />)}
      </Form.Item>
    );
  }
}
