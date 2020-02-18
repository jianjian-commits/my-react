import React from "react";
import { isValueValid, isStringValid } from "../../../utils/valueUtils";
import { Input, Form, Tooltip, Icon } from "antd";
import {
  getFormAllSubmission,
  filterSubmissionData
} from "../utils/dataLinkUtils";

export default class SingleInput extends React.Component {

  componentDidMount() {
    const { form, item, handleSetComponentEvent } = this.props;
    const { data } = item;
    if (data && data.type == "DataLinkage") {
      const {
        conditionId,
        linkComponentId,
        linkDataId,
        linkFormId
      } = data.values;
      getFormAllSubmission(linkFormId).then(submissions => {
        let dataArr = filterSubmissionData(submissions, linkComponentId);
        handleSetComponentEvent(conditionId, (value) => {
          let index = dataArr.indexOf(value);
          if(index > -1) {
            let data = filterSubmissionData(submissions, linkDataId);
            let res = data[index];
            form.setFieldsValue({
              [item.key]: res
            })
          } else {
            this.handleEmitChange(undefined);
          }
        });
      });
    }
  }

  // 如果存在回调数组，则遍历里面的函数执行
  handleChange = (value) => {
    const {callEventArr} = this.props.item;
    if(callEventArr) {
      callEventArr.forEach(fnc => {
        fnc && fnc(value, this);
      })
    }
    setTimeout(()=>{
      let key = this.props.item.key;
      let customMessage = this.props.item.validate.customMessage;
      if(!Object.is(document.querySelector(`#${key}Dom`).querySelector(".ant-form-explain"),null)){
        document.querySelector(`#${key}Dom`).querySelector(".ant-form-explain").setAttribute('title',customMessage)
      }
    },300)
  }

  render() {
    const { getFieldDecorator, item } = this.props;

    let errMsg = this.props.item.validate.customMessage;

    return (
      <Form.Item
        label={
          <span>
            <span className="label-text">{item.label}</span>
            {item.tooltip ? (
              <Tooltip title={item.tooltip}>
                <Icon type="question-circle-o" />
              </Tooltip>
            ) : null}
          </span>
        }
      >
        {getFieldDecorator(item.key, {
          initialValue: item.defaultValue,
          rules: [
            {
              required:
                isValueValid(item.validate.required)
                  ? item.validate.required
                  : false,
              message: isStringValid(errMsg) ? errMsg : "此项不能为空！"
            }
          ],
          validateTrigger:"onBlur"
        })(<Input onChange={this.handleChange} />)}
      </Form.Item>
    );
  }
}
