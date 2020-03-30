import React from "react";
import { Form, Radio, Tooltip, Icon } from "antd";
import { isValueValid } from "../../../utils/valueUtils";
import LabelUtils from "../../formBuilder/preview/component/formItemDoms/utils/LabelUtils";
import { withRouter } from "react-router-dom";
import {
  getFormAllSubmission,
  filterSubmissionData,
  compareEqualArray
} from "../utils/dataLinkUtils";
class RadioInput extends React.Component {

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
      const {appId} = this.props.match.params;
      getFormAllSubmission(appId, linkFormId).then(submissions => {
        let dataArr = filterSubmissionData(submissions, linkComponentId);
        handleSetComponentEvent(conditionId, (value) => {
          let index = -1;
          if(value instanceof Array) {
            index = compareEqualArray(dataArr, value);
          } else {
            index = dataArr.indexOf(value);
          }
          if(index > -1) {
            let data = filterSubmissionData(submissions, linkDataId);
            let res = data[index];
            form.setFieldsValue({
              [item.key]: res
            });
            this.handleEmitChange(res);
          } else {
            this.handleEmitChange(undefined);
          }
        });
      });
    }
  }

  // 如果存在回调数组，则遍历里面的函数执行
  handleEmitChange = (value) => {
    const { callEventArr } = this.props.item;
    if (callEventArr) {
      callEventArr.forEach(fnc => {
        fnc && fnc(value, this);
      });
    }
  }

  handleChange = (ev) => {
    const value = ev.target.value;
    this.handleEmitChange(value);
    setTimeout(()=>{
      let key = this.props.item.key;
      let customMessage = this.props.item.validate.customMessage;
      if(!Object.is(document.querySelector(`#Id${key}Dom`).querySelector(".ant-form-explain"),null)){
        document.querySelector(`#Id${key}Dom`).querySelector(".ant-form-explain").setAttribute('title',customMessage)
      }
    },300)
  }

  render() {
    const { getFieldDecorator, item, disabled, initData } = this.props;

    let errMsg = this.props.item.validate.customMessage;
    const layoutClassName = this.props.item.inline ? "row-layout" :"column-layout";
    return (
      <Form.Item
        label={
          <LabelUtils data = {item} />
        }
      >
        {getFieldDecorator(item.key, {
          initialValue: initData || item.defaultValue,
          rules: [{
            required: isValueValid(item.validate.required)
              ? item.validate.required
              : false,
            message:
              errMsg.trim().length > 0 ? errMsg : `${item.label}不能为空`
          }]
        })(
          <Radio.Group disabled={disabled} className={layoutClassName} onChange={this.handleChange} >
            {item.values.map((option, index) => (
              <Radio
              className="radiobox-span"
                key={index}
                value={option.value}
              >
                {option.label}
              </Radio>
            ))}
          </Radio.Group>
        )}
      </Form.Item>
    );
  }
}
export default withRouter(RadioInput)