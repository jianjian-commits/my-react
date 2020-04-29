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
import coverTimeUtils from "../../../utils/coverTimeUtils";
import { setFormulaEvent } from "../utils/setFormulaUtils";

let timer = null;
class DateInput extends React.Component {
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
    const { form, item, handleSetComponentEvent, isEditData } = this.props;
    const { data, autoInput } = item;
    if (autoInput) {
      this.setState({
        isAutoInput: true
      });
    }
    if (autoInput && !isEditData) {
      timer = setInterval(() => {
        form.setFieldsValue({
          [item.key]: new moment()
        })
      }, 1000);
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
              [item.key]: coverTimeUtils.localDate(res, item.type)
            });
            // 多级联动
            this.handleEmitChange(res);
          } else {
            this.handleEmitChange(undefined);
          }
        });
      });
    }

    if (this.props.isChangeLayout == true) {
      setFormulaEvent(this.props)
    }
  }

  handleEmitFormulaEvent = (value) => {
    const { formulaEvent } = this.props.item;
    if (formulaEvent) {
      formulaEvent.forEach(fnc => {
        fnc(value);
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
    this.handleEmitFormulaEvent(value)

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
      options.initialValue = coverTimeUtils.localDate(initData, item.type, true);
    } else if (isAutoInput) {
      options.initialValue = new moment();
    }
    return (
      <Form.Item label={<LabelUtils data={item} />}>
        {getFieldDecorator(item.key, {
          initialValue: isAutoInput ? new moment() : undefined,
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
            disabled={disabled || isAutoInput}
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

export default withRouter(DateInput);
