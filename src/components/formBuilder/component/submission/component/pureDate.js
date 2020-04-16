/*
 * @Author: your name
 * @Date: 2020-04-09 15:48:47
 * @LastEditors: komons
 * @LastEditTime: 2020-04-13 12:25:46
 * @Description: 
 * @FilePath: \form-builderc:\Komons\work\all\davinci-paas-frontend\src\components\formBuilder\component\submission\component\pureDate.js
 */
/*
 * @Author: your name
 * @Date: 2020-04-09 13:51:06
 * @LastEditors: komons
 * @LastEditTime: 2020-04-09 13:55:25
 * @Description: 
 * @FilePath: \form-builderc:\Komons\work\all\davinci-paas-frontend\src\components\formBuilder\component\submission\component\pureTime.js
 */
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

let timer = null;

class PureDate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isAutoInput: false
    };
  }
  componentWillUnmount() {
    clearInterval(timer)
  }

  componentDidMount() {
    const { form, item, handleSetComponentEvent } = this.props;
    const { data, autoInput } = item;
    if (autoInput) {
      timer = setInterval(()=>{
        form.setFieldsValue({
          [item.key]: new moment()
        })
      }, 1000 * 60);
      this.setState({
        isAutoInput: true
      });
      return;
    }

    if (data && data.type === "DataLinkage") {
      const {
        conditionId,
        linkComponentId,
        linkDataId,
        linkFormId
      } = data.values;
      const { appId } = this.props.match.params;
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
            .querySelector(`#Id${key}Dom`)
            .querySelector(".ant-form-explain"),
          null
        )
      ) {
        document
          .querySelector(`#Id${key}Dom`)
          .querySelector(".ant-form-explain")
          .setAttribute("title", customMessage);
      }
    }, 300);
  };

  render() {
    const { getFieldDecorator, item, disabled, initData } = this.props;
    const { isAutoInput } = this.state;

    let errMsg = this.props.item.validate.customMessage;
    let options = {};
    if (initData) {
      options.initialValue = moment(initData + "Z");
    }
    return (
      <Form.Item label={<LabelUtils data={item} />}>
        {getFieldDecorator(item.key, {
          ...options,
          initialValue: isAutoInput ? new moment() : undefined,
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
            disabled={disabled || isAutoInput}
            locale={locale}
            placeholder="请选择日期"
            onChange={this.handleChange}
          />
        )}
      </Form.Item>
    );
  }
}

export default withRouter(PureDate);
