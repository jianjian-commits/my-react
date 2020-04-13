import React from "react";
import { isValueValid } from "../../../utils/valueUtils";
import { Input, Form, Tooltip, Icon } from "antd";
import LabelUtils from "../../formBuilder/preview/component/formItemDoms/utils/LabelUtils";
import { withRouter } from "react-router-dom";
import {
  getFormAllSubmission,
  filterSubmissionData,
  compareEqualArray
} from "../utils/dataLinkUtils";

class SingleTextInput extends React.Component {

  constructor(props) {
    super(props);
    this.state={
      isValidating: false
    }
  }


  componentDidMount() {
    const { form, item, handleSetComponentEvent } = this.props;
    const { data } = item;
    // 是否为数据联动
    if (data && data.type === "DataLinkage") {
      const {
        conditionId, 
        linkComponentId,
        linkDataId,
        linkFormId,
      } = data.values;
      const {appId} = this.props.match.params;
      getFormAllSubmission(appId, linkFormId).then(submissions => {
        let dataArr = filterSubmissionData(submissions, linkComponentId);
        handleSetComponentEvent(conditionId, (value) => {
          let index = -1;
          let newData = [...dataArr];
          if (value instanceof Array) {
            index = compareEqualArray(dataArr, value);
          } else if (value instanceof Object) {
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

  handleEmitChange = (value) => {
    const { callEventArr } = this.props.item;
    if (callEventArr) {
      callEventArr.forEach(fnc => {
        fnc && fnc(value, this);
      });
    }
  }

  handleChange = ev => {
    const value = ev.target.value;
    this.handleEmitChange(value)
    this.props.resetErrorMsg(this.props.item.key);
    setTimeout(()=>{
      let key = this.props.item.key;
      let customMessage = this.props.item.validate.customMessage;
      if(!Object.is(document.querySelector(`#Id${key}Dom`).querySelector(".ant-form-explain"),null)){
        document.querySelector(`#Id${key}Dom`).querySelector(".ant-form-explain").setAttribute('title',customMessage)
      }
    },300)
  };


  render() {
    const { getFieldDecorator, item, disabled, initData } = this.props;

    let errMsg = this.props.item.validate.customMessage;
    let rules = [];
    let tip = "";
    if (item.validate.isLimitLength && item.validate.maxLength !== Number.MAX_SAFE_INTEGER) {
      rules.push({
        max: item.validate.maxLength,
        message:
          errMsg.trim().length > 0
            ? errMsg
            : `输入字符个数不要超过${item.validate.maxLength}`
      });
      tip = `请最多填${item.validate.maxLength}个字`;
    }
    if (item.validate.isLimitLength && item.validate.minLength !== 0) {
      rules.push({
        min: item.validate.minLength,
        message:
          errMsg.trim().length > 0
            ? errMsg
            : `输入字符个数不要少于${item.validate.minLength}`
      });
      tip = `请最少填${item.validate.minLength}个字`;
    }
    if (item.validate.isLimitLength && item.validate.maxLength !== Number.MAX_SAFE_INTEGER && item.validate.minLength !== 0) {
      tip = `输入字数在${item.validate.minLength}~${item.validate.maxLength}之间`;
    }
    if (item.validate.isLimitLength && item.validate.maxLength === Number.MAX_SAFE_INTEGER && item.validate.minLength === 0) {
      tip = `字数不限`;
    }

    let itemOption = {}
    if(this.props.errorResponseMsg && this.props.errorResponseMsg.length > 0){
      itemOption.validateStatus = "error";
      itemOption.help = this.props.errorResponseMsg.join("")
    }

    return (
      <Form.Item label={<LabelUtils data={item} />} 
        {...itemOption}
        >
        {getFieldDecorator(item.key, {
          initialValue: initData || item.defaultValue,
          rules: [
            ...rules,
            {
              required: isValueValid(item.validate.required)
                ? item.validate.required
                : false,
              message:
                errMsg.trim().length > 0 ? errMsg : `${item.label}不能为空`
            }
          ],
          validateTrigger:["onBlur","onSubmit"]
      })(<Input disabled={disabled} autoComplete="off" onChange={this.handleChange} />)}
      </Form.Item>
    );
  }
}

export default withRouter(SingleTextInput);