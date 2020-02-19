import React from "react";
import { Form, Icon, Checkbox, Tooltip } from "antd";
import { isValueValid } from "../../../../utils/valueUtils";
import LabelUtils from "../../../formBuilder/preview/component/formItemDoms/utils/LabelUtils";
import {
  getFormAllSubmission,
  filterSubmissionData,
  compareEqualArray
} from "../../utils/dataLinkUtils";
import RadioTestItem from "./radioTestItem";
export default class RadioInput extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      inputValue: undefined
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
        fnc(value, this);
      });
    }
  };
  checkIsSelect = (rule, value, callback) => {
    if(isValueValid(item.validate.required)&&value==""){
      callback('此选项为必填');
    }else {
      callback();
    }
  };
  render() {
    // const { inputValue } = this.state;
    const { getFieldDecorator, item } = this.props;
    // const { values } = item;
    // let errMsg = this.props.item.validate.customMessage;
    // const layoutClassName = this.props.item.inline ? "row-layout" :"column-layout";
    return (
      <Form.Item label={<LabelUtils data={item} />}>
        {getFieldDecorator(item.key, {
          // initialValue: inputValue || item.defaultValue,
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
          initialValue:""
          // validateTrigger: 'onSubmit',
        })(
          <RadioTestItem handleChange={this.handleChange} item={item} />
        )}
      </Form.Item>
    );
  }
}
