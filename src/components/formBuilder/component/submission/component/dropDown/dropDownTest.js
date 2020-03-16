import React from "react";
import { isValueValid } from "../../../../utils/valueUtils";
import { Form, Select, Tooltip, Icon } from "antd";
import { getSelection } from "../../utils/filterData";
import DropDownTestItem from "./dropDownTestItem";
import LabelUtils from "../../../formBuilder/preview/component/formItemDoms/utils/LabelUtils";
import {
  getFormAllSubmission,
  filterSubmissionData,
  getResIndexArray
} from "../../utils/dataLinkUtils";

export default class DropDown extends React.Component {
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
    // 数据联动请看单行文本组件
    if (data && data.type == "DataLinkage") {
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
              if(data[i]) {
                res.push(data[i])
              }
            });

            selections = [];
            let selectionsDot = []; // 判断数组项唯一
            res.forEach(item => {
              if (item instanceof Array) {
                item.forEach(select => {
                  if (select && !selectionsDot.includes(select)) {
                    selections.push({ label: select, value: select });
                    selectionsDot.push(select);
                  }
                });
              } else {
                if (item && !selectionsDot.includes(item)) {
                  selections.push({ label: item, value: item });
                  selectionsDot.push(item);
                }
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
            // 触发多级联动
            this.handleChange(undefined);
          }
        });
      });
    } else if (type == "otherFormData") {
      // 关联其他数据
      // 通过表单id和字段id过滤对应的提交数据
      // 将过滤的数据作为该表单的选项
      getSelection(values.formId, values.optionId).then(res => {
        this.setState({
          selections: res
        })
      }).catch(err => {
        console.error(err);
      });;
    } else {
      this.setState({
        selections: this.props.item.data.values
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

  render() {
    const { getFieldDecorator, item, disabled, initData } = this.props;
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
            }
          ],
          initialValue: initData ||""
        })(
          <DropDownTestItem selections={selections} item={item} />
        )}
      </Form.Item>
    );
  }
}
