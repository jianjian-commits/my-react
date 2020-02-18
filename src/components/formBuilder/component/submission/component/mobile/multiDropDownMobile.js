import React from "react";
import { isValueValid } from "../../../../utils/valueUtils";
import { Form, Input, Tooltip, Icon, Drawer } from "antd";
import { getSelection } from "../../utils/filterData";
import LabelUtils from "../../../formBuilder/preview/component/formItemDoms/utils/LabelUtils";
import {
  getFormAllSubmission,
  filterSubmissionData,
  getResIndexArray
} from "../../utils/dataLinkUtils";

export default class multiDropDown extends React.Component {
  constructor(props) {
    // selections 是用来存储下来列表的
    super(props);
    this.state = {
      selections: [],
      setValue: [],
      setValueTemp: [],
      setValueTempIndex: [],
      visible: false
    };
  }

  componentDidMount() {
    // 根据 type 决定渲染的数据来源
    const { form, item, handleSetComponentEvent } = this.props;
    const { data } = item;
    // 数据联动请看单行文本组件
    if (data && data.values) {
      let { values, type } = data;
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
                data[i] ? res.push(data[i]) : null; //解决 空选项问题
              });

              selections = [];
              res.forEach(item => {
                if (item instanceof Array) {
                  item.forEach(select => {
                    select && selections.includes(select)
                      ? null
                      : selections.push({ label: select, value: select });
                  });
                } else {
                  selections.push({ label: item, value: item });
                }
              });
              this.setState({
                selections: this.filterUniqueSelections(selections),
                setValue: [],
                setValueTemp: []
              });
              let currentSelectedValue = form.getFieldValue(item.key);
              let hasInput = selections.filter(
                item => item.value === currentSelectedValue
              );
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
                selections: [],
                setValue: [],
                setValueTemp: [],
                setValueTempIndex: [],
              });
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
            selections: this.filterUniqueSelections(res),
            setValue: [],
            setValueTemp: [],
            setValueTempIndex: [],
          });
        });
      } else {
        this.setState({
          selections:
            (Array.isArray(this.props.item.data.values) &&
              this.props.item.data.values) ||
            this.props.item.data ||
            this.props.item.values ||
            this.props.item.dropDownOptions ||
            []
        });
      }
    } else if (this.props.isChild) {
      let dropDownOptions = [];
      let values = item.values;
      if (values.type == "otherFormData") {
        getSelection(values.formId, values.optionId).then(res => {
          this.setState({
            selections: this.filterUniqueSelections(res),
            setValue: [],
            setValueTemp: [],
            setValueTempIndex: [],
          });
        });
      } else {
        dropDownOptions = Array.isArray(values) ? values : [];
      }
      this.setState({
        selections: this.filterUniqueSelections(dropDownOptions),
        setValue: [],
        setValueTemp: [],
        setValueTempIndex: [],
      });
    }
  }

  filterUniqueSelections = selections => {
    let selectionsDot = [];
    let newSelections = selections.filter(selection => {
      if (selection.value) {
        if (!selectionsDot.includes(selection.value)) {
          selectionsDot.push(selection.value);
          return true;
        } else {
          return false;
        }
      } else {
        if (!selectionsDot.includes(selection)) {
          selectionsDot.push(selection);
          return true;
        } else {
          return false;
        }
      }
    });
    // 
    return newSelections;
  };

  componentWillReceiveProps(nextProps) {
    // if (nextProps.value && nextProps.value.length == 0) {
    //   this.setState({
    //     selections: this.filterUniqueSelections(nextProps.item.values),
    //     setValue: [],
    //     setValueTemp: []
    //   });
    // } else if (nextProps.value && Array.isArray(nextProps.value)) {
    //   this.setState({
    //     selections: this.filterUniqueSelections(nextProps.value)
    //   });
    // } else if(nextProps.item.data && nextProps.item.data != "" && nextProps.isChild) {
    //   
    //   this.setState({
    //     selections: [nextProps.item.data],
    //     setValue: [nextProps.item.data],
    //     setValueTemp: [nextProps.item.data],
    //   });
    // }
    if (nextProps.isChild) {
      this.setState({
        selections: nextProps.item.dropDownOptions || [],
        setValue: nextProps.item.data,
      });
    }
  }

  
  checkSelectNumber = (rule, value, callback) => {
    const { item } = this.props;
    const { maxOptionNumber, minOptionNumber } = item.validate;
    let defaultErrMsg = "";
    if (maxOptionNumber !== null && minOptionNumber !== null) {
      defaultErrMsg = `请选择${minOptionNumber} ~ ${maxOptionNumber}项`;
    } else if (maxOptionNumber !== null) {
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
      !this.props.isChild ?document.querySelector(`#${this.props.item.id} .errorMsg`).innerText = '':null;
      callback(`${this.props.item.label}${defaultErrMsg}`);
    } else {
      callback();
    }
  };
  // 如果存在回调数组，则遍历里面的函数执行
  handleChange = value => {
    value = Number(value) || value;
    const { callEventArr } = this.props.item;
    if (callEventArr) {
      callEventArr.forEach(fnc => {
        fnc && fnc(value, this);
      });
    }
  };

  // 校验选中的个数
  checkNumber (value){
    const { item } = this.props;
    const { maxOptionNumber, minOptionNumber } = item.validate;
    let defaultErrMsg = "";
    if (maxOptionNumber !== null && minOptionNumber !== null) {
      defaultErrMsg = `请选择${minOptionNumber} ~ ${maxOptionNumber}项`;
    } else if (maxOptionNumber !== null) {
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
      document.querySelector(`#${this.props.item.id} .errorMsg`).innerText = `${this.props.item.label}${defaultErrMsg}`
    } else {
      document.querySelector(`#${this.props.item.id} .errorMsg`).innerText = ``
    }
  }
  // 展示下拉列表
  showMultiDropDownMobileList = () => {
    this.setState({
      visible: true
    });
  };
  // 隐藏下拉列表
  closemultiDropDownMobileList = () => {
    this.setState({
      visible: false
    });
  };
  // 暂存选中的值
  setValue = e => {
    let dataString = e.target.getAttribute("value");
    let indexNum = parseInt(e.target.getAttribute("index"));
    let arrString = this.state.setValueTemp;
    let arrNum = this.state.setValueTempIndex;
    if (arrNum.indexOf(indexNum) === -1) {
      arrString.push(dataString);
      arrNum.push(indexNum);
    } else {
      arrString.splice(arrString.indexOf(dataString), 1);
      arrNum.splice(arrNum.indexOf(indexNum), 1);
    }
    this.setState({
      setValueTemp: arrString,
      setValueTempIndex: arrNum
    });
  };

  // 改变提交的初始值initalValue
  setSubmissionValue = ( params )=>{
    let { setFieldsValue } = this.props.form
    let key = this.props.item.key
    setFieldsValue({[key]:params})
  }

  onClickOk = () => {
    let setValue = [...this.state.setValueTemp]
    !this.props.isChild ? this.setSubmissionValue( setValue ):null
    this.props.onChange && this.props.onChange(setValue)
    this.setState({
      setValue: setValue,
      visible: false
    },()=>{
      !this.props.isChild ?this.checkNumber(setValue):null
    });
    this.handleChange(setValue);
  };
  onClickCancle = () => {
    this.setState({
      visible: false,
      setValueTemp: [],
      setValueTempIndex: []
    });
  };
  render() {
    const { getFieldDecorator, item, isShowTitle } = this.props;
    const { selections } = this.state;
    let errMsg = this.props.item.validate.customMessage;
    let id = item.id,errorMsgDom = null;
    if(document.querySelector(`#${id}`) !== null){
      errorMsgDom = document.querySelector(`#${id}`).parentNode.parentNode.querySelector('.ant-form-explain')
    }
    return (
      <Form.Item label={isShowTitle === false ? null : <LabelUtils data={item} />}>

        {!this.props.isChild ? (
          getFieldDecorator(item.key, {
            initialValue: this.state.setValue,
            rules: [
              {
                required: isValueValid(item.validate.required)
                  ? item.validate.required
                  : false,
                message: "此字段为必填"
              },
              {
                validator: this.checkSelectNumber
              }
            ]
          })(
            <div className="multiDropDown-Content">
              <div className="Input-content">
                <Input
                  type="text"
                  placeholder="请选择"
                  style={{ width: "100%" }}
                  value={this.state.setValue}
                  onClick={this.showMultiDropDownMobileList}
                  onChange={this.handleChange}
                  readOnly
                />
                {errorMsgDom === null ? <div className = "errorMsg" ></div>:<div style={{display:"none"}} className = "errorMsg" ></div>}
            </div>
              <Drawer
                placement={"bottom"}
                closable={false}
                onClose={() => this.setState({ visible: true })}
                visible={this.state.visible}
                title={
                  <div className="multiDropDown-header">
                    <span
                      className="multiDropDown-header-cancle"
                      onClick={this.onClickCancle}
                    >
                      取消
                    </span>
                    <span
                      className="multiDropDown-header-confirm"
                      onClick={this.onClickOk}
                    >
                      确定
                    </span>
                  </div>
                }
              >
                <ul
                  className="multiDropDown-list"
                  style={{ listStyle: "none" }}
                  onClick={e => this.setValue(e)}
                >
                  {Array.isArray(selections)
                    ? selections.map((item, index) => (
                      <li key={index} value={item.value} index={index}>
                        {item.label}{" "}
                        {this.state.setValueTempIndex.indexOf(index) !==
                          -1 ? (
                            <Icon
                              style={{ color: "#09BB07" }}
                              className="multiDropDown-check-icon"
                              type="check"
                            />
                          ) : null}
                      </li>
                    ))
                    : null}
                </ul>
              </Drawer>
            </div>
          )
        ) : (
            <div className="multiDropDown-Content">
              <div className="Input-content">
                <Input
                  type="text"
                  placeholder="请选择"
                  style={{ width: "100%" }}
                  value={this.state.setValue}
                  onClick={this.showMultiDropDownMobileList}
                  onChange={this.handleChange}
                  readOnly
                />
              </div>
              <Drawer
                placement={"bottom"}
                closable={false}
                onClose={() => this.setState({ visible: true })}
                visible={this.state.visible}
                title={
                  <div className="multiDropDown-header">
                    <span
                      className="multiDropDown-header-cancle"
                      onClick={this.onClickCancle}
                    >
                      取消
                  </span>
                    <span
                      className="multiDropDown-header-confirm"
                      onClick={this.onClickOk}
                    >
                      确定
                  </span>
                  </div>
                }
              >
                <ul
                  className="multiDropDown-list"
                  style={{ listStyle: "none" }}
                  onClick={e => this.setValue(e)}
                >
                  {Array.isArray(selections)
                    ? selections.map((item, index) => (
                      <li
                        key={index}
                        value={item.value ? item.value : item}
                        index={index}
                      >
                        {item.label ? item.label : item}{" "}
                        {this.state.setValueTempIndex.indexOf(index) !== -1 ? (
                          <Icon
                            style={{ color: "#09BB07" }}
                            className="multiDropDown-check-icon"
                            type="check"
                          />
                        ) : null}
                      </li>
                    ))
                    : null}
                </ul>
              </Drawer>
            </div>
          )}
      </Form.Item>
    );
  }
}
