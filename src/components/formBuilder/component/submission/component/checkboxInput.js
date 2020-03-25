import React from "react";
import {
  Form,
  Icon,
  Checkbox,
  Tooltip
} from "antd";
import { isValueValid } from "../../../utils/valueUtils";
import LabelUtils from "../../formBuilder/preview/component/formItemDoms/utils/LabelUtils";
import { withRouter } from "react-router-dom";
import {
  getFormAllSubmission,
  filterSubmissionData,
  compareEqualArray
} from "../utils/dataLinkUtils";

class CheckboxInput extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      inputValue: undefined
    }
  }

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
            this.setState({
              inputValue: res
            });
            this.handleEmitChange(res);
          } else {
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

  checkSelecNumber = (rule ,value ,callback ) =>{
    const {item} = this.props;
    const {maxOptionNumber,minOptionNumber } = item.validate; 
    let defaultErrMsg = '';
    if (maxOptionNumber !== Number.MAX_SAFE_INTEGER && minOptionNumber !== 0) {
      defaultErrMsg = `请选择${minOptionNumber} ~ ${maxOptionNumber}项`;
    } else if (maxOptionNumber !== Number.MAX_SAFE_INTEGER) {
      defaultErrMsg = `最多选择${maxOptionNumber}项`;
    } else {
      defaultErrMsg = `最少选择${minOptionNumber}项`;
    }
    if(item.validate.isLimitLength && (item.validate.maxOptionNumber &&(value.length >  item.validate.maxOptionNumber) || (item.validate.minOptionNumber && value.length < item.validate.minOptionNumber))) {
      callback(`${this.props.item.label}${defaultErrMsg}`);
    }else {
      callback();
    }
  }

  render() {
    const { inputValue } = this.state;
    const { getFieldDecorator, item , isShowTitle } = this.props;
    const { values } = item;
    let errMsg = this.props.item.validate.customMessage;
    const layoutClassName = this.props.item.inline ? "row-layout" :"column-layout";
    return (
      <Form.Item label={isShowTitle === false ? null : <LabelUtils data={item} />}>
        {getFieldDecorator(item.key, {
          initialValue: inputValue || item.defaultValue,
          rules: [
            {
              required: isValueValid(item.validate.required)
              ? item.validate.required
              : false,
              message: "此字段为必填"
            },
            {
              validator: this.checkSelecNumber
            },
          ]
        })(
          <Checkbox.Group disabled={this.props.disabled} className={layoutClassName} onChange={this.handleChange}>
            {values.map((item, index) => (
                <Checkbox 
                 className = 'checkbox-span'       
                 key={index} 
                 value={item.value}
                 >
                   {item.label}
                </Checkbox>
            ))}
          </Checkbox.Group>
        )}
      </Form.Item>
    );
  }
}
export default withRouter(CheckboxInput);
