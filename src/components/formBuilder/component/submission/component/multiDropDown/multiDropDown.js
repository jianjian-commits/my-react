import React from "react";
import { isValueValid } from "../../../../utils/valueUtils";
import { Form, Select, Tooltip, Icon } from "antd";
import { getSelection } from "../../utils/filterData";
import MultiDropDownItem from "./multiDropDownItem";
import LabelUtils from "../../../formBuilder/preview/component/formItemDoms/utils/LabelUtils";
import { withRouter } from "react-router-dom";
import {
  getFormAllSubmission,
  filterSubmissionData,
  getResIndexArray
} from "../../utils/dataLinkUtils";

class MultiDropDown extends React.Component {
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
    const {appId} = this.props.match.params;
    if (data && data.type === "DataLinkage") {
      const {
        conditionId,
        linkComponentId,
        linkDataId,
        linkFormId
      } = data.values;
      getFormAllSubmission(appId, linkFormId).then(submissions => {
        let dataArr = filterSubmissionData(submissions, linkComponentId);
        handleSetComponentEvent(conditionId, value => {
          let indexArr = getResIndexArray(value, dataArr);
          let selections = [];
          if (indexArr.length > 0) {
            let data = filterSubmissionData(submissions, linkDataId);
            let res = [];
            indexArr.forEach(i => {
              if (data[i]) {
                res.push(data[i]);
              }
            });
            selections = [];
            res.forEach(item => {
              if (item instanceof Array) {
                item.forEach(select => {
                  if (select && selections.includes(select)) {
                    return null;
                  } else {
                    selections.push({ label: select, value: select });
                  }
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
      getSelection(appId, values.formId, values.optionId).then(res => {
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
    if (value.length != 0) {
      if (
        maxOptionNumber !== Number.MAX_SAFE_INTEGER &&
        minOptionNumber !== 0
      ) {
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
    } else {
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
    const { getFieldDecorator, item, initData, isEditData } = this.props;
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
          initialValue: initData || []
        })(
          <MultiDropDownItem selections={this.state.selections} item={item} isEditData={isEditData || false}/>
        )}
      </Form.Item>
    );
  }
}
export default withRouter(MultiDropDown)