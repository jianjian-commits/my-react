import React from "react";
import { DatePicker, List  } from "antd-mobile";
import { isValueValid, isStringValid } from "../../../../utils/valueUtils";
import { Form } from "antd";
import locale from 'antd/lib/date-picker/locale/zh_CN';
import LabelUtils from "../../../formBuilder/preview/component/formItemDoms/utils/LabelUtils";
import {
  getFormAllSubmission,
  filterSubmissionData,
  compareEqualArray
} from "../../utils/dataLinkUtils";
import moment from "moment";

export default class DateInput extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      currentDate: undefined
    }
  }
  componentDidMount() {
    const { form, item, handleSetComponentEvent } = this.props;
    const { data } = item;
    if (data && data.type === "DataLinkage") {
      const {
        conditionId,
        linkComponentId,
        linkDataId,
        linkFormId
      } = data.values;
      getFormAllSubmission(linkFormId).then(submissions => {
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
              [item.key]: new Date(res)
            });
            // 多级联动
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
    // this.props.onChange && this.props.onChange(value);
    this.handleEmitChange(value);
  }


  render() {
    const { getFieldDecorator, item, initData } = this.props;
    // console.log(item)

    let errMsg = this.props.item.validate.customMessage;
    let options = {}
    if(initData){
      options.initialValue = new Date(initData)
    }
    return (
      <Form.Item
        label={
          <LabelUtils data={item} />
        }
      >
        {getFieldDecorator(item.key, {
          ...options,
          rules: [
            {
              required: isValueValid(item.validate.required)
                ? item.validate.required
                : false,
              message: isStringValid(errMsg) ? errMsg : "此项不能为空！"
            }
          ]
        })(
          <DatePicker showTime extra={"请选择时间/日期"} onChange={this.handleChange}>
            <List.Item className="mobile-list-default" arrow="down"></List.Item>
          </DatePicker>
        )}
      </Form.Item>
    );
  }
}
