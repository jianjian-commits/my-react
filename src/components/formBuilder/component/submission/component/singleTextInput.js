import React from "react";
import { isValueValid } from "../../../utils/valueUtils";
import { Input, Form, Tooltip, Icon } from "antd";
import LabelUtils from "../../formBuilder/preview/component/formItemDoms/utils/LabelUtils";
import {
  getFormAllSubmission,
  filterSubmissionData,
  compareEqualArray
} from "../utils/dataLinkUtils";

export default class SingleTextInput extends React.Component {

  constructor(props) {
    super(props);
    this.state={
      isValidating: false
    }
  }


  componentDidMount() {
    const { form, item, handleSetComponentEvent } = this.props;
    const { data } = item;
    // 是否为数据联动
    if (data && data.type === "DataLinkage") {
      const {
        conditionId, //联动条件 id(当前表单)
        linkComponentId, //联动条件 id(联动表单)
        linkDataId, //联动数据 id(联动表单)
        linkFormId, //联动表单 id
      } = data.values;
      // 得到id表单的所有提交数据
      getFormAllSubmission(linkFormId).then(submissions => {
        // 根据联动表单的组件id 得到对应所有数据
        let dataArr = filterSubmissionData(submissions, linkComponentId);
        // 为需要联动的表单添加 change事件
        handleSetComponentEvent(conditionId, (value) => {
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
          // 如果存在 获得提交数据中关联字段的数据
          if(index > -1) {
            let data = filterSubmissionData(submissions, linkDataId);
            // 根据查找的idnex取得对应的关联数据
            let res = data[index];
            // 设置当前组件的数据为关联的数据
            form.setFieldsValue({
              [item.key]: res
            });
            // 多级联动 事件派发
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
  }

  // 如果存在回调数组，则遍历里面的函数执行
  handleEmitChange = (value) => {
    const { callEventArr } = this.props.item;
    if (callEventArr) {
      callEventArr.forEach(fnc => {
        fnc && fnc(value, this);
      });
    }
  }

  handleChange = ev => {
    const value = ev.target.value;
    this.handleEmitChange(value)
    this.props.resetErrorMsg(this.props.item.id);
    setTimeout(()=>{
      let key = this.props.item.key;
      let customMessage = this.props.item.validate.customMessage;
      if(!Object.is(document.querySelector(`#${key}Dom`).querySelector(".ant-form-explain"),null)){
        document.querySelector(`#${key}Dom`).querySelector(".ant-form-explain").setAttribute('title',customMessage)
      }
    },300)
  };


  render() {
    const { getFieldDecorator, item, disabled } = this.props;

    let errMsg = this.props.item.validate.customMessage;
    let rules = [];
    let tip = "";
    if (item.validate.isLimitLength && item.validate.maxLength !== Number.MAX_SAFE_INTEGER) {
      rules.push({
        max: item.validate.maxLength,
        message:
          errMsg.trim().length > 0
            ? errMsg
            : `输入字符个数不要超过${item.validate.maxLength}`
      });
      tip = `请最多填${item.validate.maxLength}个字`;
    }
    if (item.validate.isLimitLength && item.validate.minLength !== 0) {
      rules.push({
        min: item.validate.minLength,
        message:
          errMsg.trim().length > 0
            ? errMsg
            : `输入字符个数不要少于${item.validate.minLength}`
      });
      tip = `请最少填${item.validate.minLength}个字`;
    }
    if (item.validate.maxLength !== Number.MAX_SAFE_INTEGER && item.validate.minLength !== 0) {
      tip = `输入字数在${item.validate.minLength}~${item.validate.maxLength}之间`;
    }
    if (item.validate.maxLength === Number.MAX_SAFE_INTEGER && item.validate.minLength === 0) {
      tip = `字数不限`;
    }

    let itemOption = {}
    if(this.props.errorResponseMsg && this.props.errorResponseMsg.length > 0){
      itemOption.validateStatus = "error";
      itemOption.help = this.props.errorResponseMsg.join("")
    }

    return (
      <Form.Item label={<LabelUtils data={item} />} 
        {...itemOption}
        >
        {getFieldDecorator(item.key, {
          initialValue: item.defaultValue,
          rules: [
            ...rules,
            {
              required: isValueValid(item.validate.required)
                ? item.validate.required
                : false,
              message:
                errMsg.trim().length > 0 ? errMsg : `${item.label}不能为空`
            }
          ],
          validateTrigger:["onBlur","onSubmit"]
      })(<Input disabled={disabled} autoComplete="off" onChange={this.handleChange} />)}
      </Form.Item>
    );
  }
}
