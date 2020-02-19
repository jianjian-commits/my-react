import React from "react";
import { isValueValid } from "../../../../utils/valueUtils";
import { Form, Select, Tooltip, Icon } from "antd";
import { getSelection } from "../../utils/filterData";
import MultiDropDownItem from './multiDropDownItem';
import LabelUtils from "../../../formBuilder/preview/component/formItemDoms/utils/LabelUtils";
import {
  getFormAllSubmission,
  filterSubmissionData,
  getResIndexArray
} from "../../utils/dataLinkUtils";

export default class MultiDropDown extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selections: []
    };
  }

  componentDidMount() {
    // 根据 type 决定渲染的数据来源
    const { form, item, handleSetComponentEvent } = this.props;
    const { data } = item;
    let { values, type } = data;
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
          let indexArr = getResIndexArray(value, dataArr);
          let selections = [];
          if (indexArr.length > 0) {
            let data = filterSubmissionData(submissions, linkDataId);
            let res = [];
            indexArr.forEach(i => {
              data[i] ? res.push(data[i]) : null;
            });
            selections = [];
            res.forEach(item => {
              if (item instanceof Array) {
                item.forEach(select => {
                  select && selections.includes(select)
                    ? null
                    : selections.push({ label: select, value: select });
                });
              } else {
                selections.push({ label: item, value: item });
              }
            });
            this.setState({
              selections
            });
            let currentSelectedValue = form.getFieldValue(item.key);
            // let hasInput = selections.filter(
            //   item => item.value === currentSelectedValue
            // );
            // 是否清空选择的内容
            // if (hasInput.length <= 0) {
            //   form.setFieldsValue({
            //     [item.key]: undefined
            //   });
            // }

            form.setFieldsValue({
              [item.key]: undefined
            });
            // 触发多级联动
          this.handleChange(value);
          } else {
            this.setState({
              selections: []
            });
            form.setFieldsValue({
              [item.key]: undefined
            });
          }
          // 触发多级联动
          this.handleChange(undefined);
        });
      });
    } else if (type === "otherFormData") {
      getSelection(values.formId, values.optionId).then(res => {
        this.setState({
          selections: res
        });
      });
    } else {
      this.setState({
        selections: this.props.item.data.values
      });
    }
  }

  checkSelecNumber = (rule, value, callback) => {
    const { item } = this.props;
    const { maxOptionNumber, minOptionNumber } = item.validate;
    let defaultErrMsg = "";
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

  // 如果存在回调数组，则遍历里面的函数执行
  handleChange = value => {
    const { callEventArr } = this.props.item;
    if (callEventArr) {
      callEventArr.forEach(fnc => {
        fnc(value, this);
      });
    }
  };

  render() {
    const { getFieldDecorator, item, disabled } = this.props;
    const { selections } = this.state;

    let errMsg = this.props.item.validate.customMessage;

    return (
      <Form.Item label={<LabelUtils data={item} />}>
        {getFieldDecorator(item.key, {
          rules: [
            {
              required: isValueValid(item.validate.required)
                ? item.validate.required
                : false,
              message: "此字段为必填"
            },
            {
              validator: this.checkSelecNumber
            }
          ],
          // validateTrigger: 'onSubmit',
          initialValue:[]
        })(
        //   <Select
        //     disabled={disabled}
        //     mode="multiple"
        //     placeholder="请选择"
        //     style={{ width: "100%" }}
        //     showArrow={true}
        //     onChange={this.handleChange}
        //     getPopupContainer = {triggerNode => triggerNode.parentNode}
        //   >
        //     {selections.map((item, index) => (
        //       <Select.Option key={index} value={item.value}>
        //         {item.label}
        //       </Select.Option>
        //     ))}
        //   </Select>
          <MultiDropDownItem selections={this.state.selections} item={item}/>
        )}
      </Form.Item>
    );
  }
}
