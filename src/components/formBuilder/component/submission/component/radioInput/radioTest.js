import React from "react";
import { Form, Icon, Checkbox, Tooltip } from "antd";
import { isValueValid } from "../../../../utils/valueUtils";
import LabelUtils from "../../../formBuilder/preview/component/formItemDoms/utils/LabelUtils";
import { withRouter } from "react-router-dom";
import {
  getFormAllSubmission,
  filterSubmissionData,
  compareEqualArray
} from "../../utils/dataLinkUtils";
import RadioTestItem from "./radioTestItem";
class RadioInput extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      inputValue: undefined,
      item: this.props.item
    };
  }

  componentDidMount() {
    const { forms, item, handleSetComponentEvent } = this.props;
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
  };
  handleInputValue = value => {
      const { setFieldsValue } = this.props.form
      let { values } = this.state.item
      // 设置新的值
      let newObj = {...values[values.length-1], value};
      // 删除values中最后一项
      values.pop();

      let newValues =  [...values,newObj]
      this.setState({
        item:{...this.state.item,values:newValues}
      },()=>{
        setFieldsValue({[this.props.item.key]:value})
      })
    }
  render() {
    const { getFieldDecorator, item, initData } = this.props;
    return (
      <Form.Item label={<LabelUtils data={item} />}>
        {getFieldDecorator(item.key, {
          initialValue: initData || item.defaultValue,
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
        })(<RadioTestItem handleChange={this.handleChange} handleInputValue = {this.handleInputValue} inputValue = { initData } item={this.state.item}/>)}
      </Form.Item>
    );
  }
}
export default withRouter(RadioInput)