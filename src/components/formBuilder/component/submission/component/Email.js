import React from "react";
import { isValueValid } from "../../../utils/valueUtils";
import { Input, Form, Tooltip, Icon } from "antd";
import LabelUtils from "../../formBuilder/preview/component/formItemDoms/utils/LabelUtils";
import { withRouter } from "react-router-dom";
import {
  getFormAllSubmission,
  filterSubmissionData,
  compareEqualArray
} from "../utils/dataLinkUtils";
import { setFormulaEvent } from "../utils/setFormulaUtils";

class Email extends React.Component {
  checkUnique = (rule, value, callback) => {
    if (value === "") {
      callback();
    } else {
      callback();
    }
  };

  componentDidMount() {
    const { form, item, handleSetComponentEvent } = this.props;
    const { data } = item;
    if (data && data.type === "DataLinkage") {
      const {
        conditionId,
        linkComponentId,
        linkComponentType,
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
              [item.key]: res
            });
            // 多级联动
            this.handleEmitChange(res);
          } else {
            form.setFieldsValue({
              [item.key]: undefined
            });
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
  handleChange = ev => {
    const value = ev.target.value;
    this.handleEmitChange(value);
    this.props.resetErrorMsg(this.props.item.key);
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

    let errMsg = item.validate.customMessage || "";
    let itemOption = {}
    if (this.props.errorResponseMsg && this.props.errorResponseMsg.length > 0) {
      itemOption.validateStatus = "error";
      itemOption.help = this.props.errorResponseMsg.join("")
    }

    return (
      <Form.Item label={<LabelUtils data={item} />}
        {...itemOption}>
        {getFieldDecorator(item.key, {
          initialValue: initData || item.defaultValue,
          rules: [
            {
              validator: this.checkUnique
            },
            {
              type: "email",
              message: errMsg || "请输入正确的邮箱！"
            },
            {
              required: isValueValid(item.validate.required)
                ? item.validate.required
                : false,
              message: "邮箱不能为空!"
            }
          ],
          validateTrigger: "onBlur"
        })(
          <Input
            disabled={disabled}
            autoComplete="off"
            onChange={this.handleChange}
            onBlur={(ev) => {
              const value = ev.target.value;
              this.handleEmitFormulaEvent(value)
            }}
          />
        )}
      </Form.Item>
    );
  }
}
export default withRouter(Email)