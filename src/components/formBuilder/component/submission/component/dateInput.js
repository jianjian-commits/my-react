import React from "react";
import { DatePicker } from "antd";
import { isValueValid, isStringValid } from "../../../utils/valueUtils";
import { Form, Tooltip, Icon } from "antd";
import locale from "antd/lib/date-picker/locale/zh_CN";
import LabelUtils from "../../formBuilder/preview/component/formItemDoms/utils/LabelUtils";
import { withRouter } from "react-router-dom";
import {
  getFormAllSubmission,
  filterSubmissionData,
  compareEqualArray
} from "../utils/dataLinkUtils";
import moment from "moment";

class DateInput extends React.Component {
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
      const {appId} = this.props.match.params;
      getFormAllSubmission(appId, linkFormId).then(submissions => {
        let dataArr = filterSubmissionData(submissions, linkComponentId);
        handleSetComponentEvent(conditionId, value => {
          let index = -1;
          let newData = [...dataArr];
          if (value instanceof Array) {
            index = compareEqualArray(dataArr, value);
          } else if (value instanceof Object) {
            // 争对地址的比较
            let { county, city, province, detail } = value;
            newData = dataArr.map(item => {
              if (item) {
                let { county, city, province, detail } = item;
                return [province, city, county, detail].join("");
              } else {
                return Symbol();
              }
            });
            index = newData.indexOf([province, city, county, detail].join(""));
          } else {
            index = newData.indexOf(value);
          }
          if (index > -1) {
            let data = filterSubmissionData(submissions, linkDataId);
            let res = data[index];
            form.setFieldsValue({
              [item.key]: new moment(res)
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

  handleEmitChange = value => {
    const { callEventArr } = this.props.item;
    if (callEventArr) {
      callEventArr.forEach(fnc => {
        fnc && fnc(value, this);
      });
    }
  };

  // 如果存在回调数组，则遍历里面的函数执行
  handleChange = value => {
    this.handleEmitChange(value);
    setTimeout(() => {
      let key = this.props.item.key;
      let customMessage = this.props.item.validate.customMessage;
      if (
        !Object.is(
          document
            .querySelector(`#${key}Dom`)
            .querySelector(".ant-form-explain"),
          null
        )
      ) {
        document
          .querySelector(`#${key}Dom`)
          .querySelector(".ant-form-explain")
          .setAttribute("title", customMessage);
      }
    }, 300);
  };

  render() {
    const { getFieldDecorator, item, disabled, initData } = this.props;

    let errMsg = this.props.item.validate.customMessage;
    let options = {};
    if(initData){
      options.initialValue = moment(initData) 
    }
    return (
      <Form.Item label={<LabelUtils data={item} />}>
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
          <DatePicker
            disabled={disabled}
            showTime
            locale={locale}
            placeholder="请选择时间/日期"
            onChange={this.handleChange}
          />
        )}
      </Form.Item>
    );
  }
}

export default withRouter(DateInput)
