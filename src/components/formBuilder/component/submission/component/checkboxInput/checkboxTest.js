import React from "react";
import { Form, Icon, Checkbox, Tooltip } from "antd";
import { isValueValid } from "../../../../utils/valueUtils";
import LabelUtils from "../../../formBuilder/preview/component/formItemDoms/utils/LabelUtils";
import {
  getFormAllSubmission,
  filterSubmissionData,
  compareEqualArray
} from "../../utils/dataLinkUtils";
import CheckboxTestItem from "./checkboxTestItem";
export default class CheckboxInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: undefined
    };
  }

  componentDidMount() {
    const { forms, item, handleSetComponentEvent, value } = this.props;
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
            this.setState({
              inputValue: res
            });
          }
        });
      });
    }
  }

  // 如果存在回调数组，则遍历里面的函数执行
  handleChange = value => {
    const { callEventArr } = this.props.item;
    if (callEventArr) {
      callEventArr.forEach(fnc => {
        fnc && fnc(value, this);
      });
    }
    setTimeout(()=>{
      let key = this.props.item.key;
      let customMessage = this.props.item.validate.customMessage;
      if(!Object.is(document.querySelector(`#${key}Dom`).querySelector(".ant-form-explain"),null)){
        document.querySelector(`#${key}Dom`).querySelector(".ant-form-explain").setAttribute('title',customMessage)
      }
    },300)
  };

  checkSelecNumber = (rule, value, callback) => {
    const { item } = this.props;
    const {required} = item.validate;
    const { maxOptionNumber, minOptionNumber } = item.validate;
    let defaultErrMsg = "";

    // if(isValueValid(item.validate.required)&&value.length==0){
    //   callback('此选项为必填');
    // }
    if(value.length!=0){
      if (maxOptionNumber !== Number.MAX_SAFE_INTEGER && minOptionNumber !== 0) {
        defaultErrMsg = `请选择${minOptionNumber} ~ ${maxOptionNumber}项`;
      } else if (maxOptionNumber !== Number.MAX_SAFE_INTEGER) {
        defaultErrMsg = `最多选择${maxOptionNumber}项`;
      } else {
        defaultErrMsg = `最少选择${minOptionNumber}项`;
      }
      if (
        item.validate.isLimitLength &&
        ((item.validate.maxOptionNumber &&
          value.length > item.validate.maxOptionNumber) ||
          (item.validate.minOptionNumber &&
            value.length < item.validate.minOptionNumber))
      ) {
        callback(`${this.props.item.label}${defaultErrMsg}`);
      } else {
        callback();
      }
    }else{
      callback();
    }
    
  };
  render() {
    // const { inputValue } = this.state;
    const { getFieldDecorator, item, initData } = this.props;
    // const { values } = item;
    // let errMsg = this.props.item.validate.customMessage;
    // const layoutClassName = this.props.item.inline ? "row-layout" :"column-layout";
    return (
      <Form.Item label={<LabelUtils data={item} />}>
        {getFieldDecorator(item.key, {
          rules: [
            {
              // required: true,
              required:isValueValid(item.validate.required)
                ? item.validate.required
                : false,
              message: "此字段为必填"
            },
            {
              validator: this.checkSelecNumber
            }
          ],
          initialValue: initData || []
        })(
          <CheckboxTestItem handleChange={this.handleChange} item={item} />
        )}
      </Form.Item>
    );
  }
}
