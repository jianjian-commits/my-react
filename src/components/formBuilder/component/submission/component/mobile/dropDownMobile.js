import React from "react";
import { isValueValid } from "../../../../utils/valueUtils";
import { Form, Input, Tooltip, Icon, Drawer } from "antd";
import { getSelection } from "../../utils/filterData";
import LabelUtils from "../../../formBuilder/preview/component/formItemDoms/utils/LabelUtils";
import { withRouter } from "react-router-dom";
import {
  getFormAllSubmission,
  filterSubmissionData,
  getResIndexArray
} from "../../utils/dataLinkUtils";

class DropDown extends React.Component {
  constructor(props) {
    // selections 是用来存储下来列表的
    super(props);
    this.state = {
      selections: [],
      setValue: "",
      setValueTemp: "",
      setValueTempIndex: -1,
      visible: false
    };
  }

  componentDidMount() {
    // 根据 type 决定渲染的数据来源
    const { form, item, handleSetComponentEvent, initData,value } = this.props;
    const { data } = item;
    // 数据联动请看单行文本组件
    if (data && data.values) {
      let { values, type } = data;
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
            let indexArr = getResIndexArray(value, dataArr);
            let selections = [];
            if (indexArr.length > 0) {
              let data = filterSubmissionData(submissions, linkDataId);
              let res = [];
              indexArr.forEach(i => {
                if (data[i]) {
                  res.push(data[i]);
                }
              });

              selections = [];
              res.forEach(item => {
                if (item instanceof Array) {
                  item.forEach(select => {
                    if (select && selections.includes(select)) {
                      return null;
                    } else {
                      selections.push({ label: select, value: select });
                    }
                  });
                } else {
                  selections.push({ label: item, value: item });
                }
              });
              const newSelections = this.filterUniqueSelections(selections);
              this.setState({
                selections: newSelections,
                setValue: "",
                setValueTemp: "",
                setValueTempIndex: -1
              });
              this.handleChange(value);
            } else {
              this.setState({
                selections: [],
                setValue: "",
                setValueTemp: "",
                setValueTempIndex: -1
              });
              this.handleChange(undefined);
            }
          });
        });
      } else if (type === "otherFormData") {
        // 关联其他数据
        // 通过表单id和字段id过滤对应的提交数据
        // 将过滤的数据作为该表单的选项
        getSelection(values.formId, values.optionId).then(res => {
          this.setState({
            selections: this.filterUniqueSelections(res),
            setValue: "",
            setValueTemp: "",
            setValueTempIndex: -1
          });
        });
      } else {
        let selectIndex = -1;
        selectIndex = item.data.values.map(item =>item.value).indexOf(initData)
        this.setState({
          selections:
            (Array.isArray(this.props.item.data.values) &&
              this.props.item.data.values) ||
            this.props.item.data ||
            this.props.item.values ||
            this.props.item.dropDownOptions ||
            [],
            setValue: initData || "",
            setValueTemp: initData || "",
            setValueTempIndex:  selectIndex
        });
      }
    } else if (this.props.isChild) {
      let dropDownOptions = [];
      let values = item.values;
      if (values.type === "otherFormData") {
        getSelection(values.formId, values.optionId).then(res => {
          this.setState({
            selections: this.filterUniqueSelections(res),
            setValue: "",
            setValueTemp: "",
            setValueTempIndex: -1
          });
        });
      } else {
        dropDownOptions = Array.isArray(values) ? values : [];
        let selectIndex = -1;
      selectIndex = item.values.map(item =>item.value).indexOf(value)
      this.setState({
        selections: this.filterUniqueSelections(dropDownOptions),
        setValue: item.data || "",
        setValueTemp: item.data || "",
        setValueTempIndex:  selectIndex
      });

      }
    }
  }

  filterUniqueSelections = selections => {
    let selectionsDot = [];
    if (Array.isArray(selections)) {
      return selections.filter(selection => {
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
    } else {
      return [];
    }
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.isChild) {
      this.setState({
        selections: nextProps.item.dropDownOptions || [],
        setValue: nextProps.item.data
      });
    }
  }

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
  // 展示下拉列表
  showDropDownMobileList = () => {
    this.setState({
      visible: true
    });
  };
  // 隐藏下拉列表

  closeDropDownMobileList = () => {
    this.setState({
      visible: false
    });
  };
  // 暂存选中的值
  setValue = e => {
    let index = parseInt(e.target.getAttribute("index"));
    let data = e.target.getAttribute("value");
    this.setState({
      setValueTemp: data,
      setValueTempIndex: index
    });
  };

  // 改变提交的初始值initalValue
  setSubmissionValue = params => {
    let { setFieldsValue } = this.props.form;
    let key = this.props.item.key;
    setFieldsValue({ [key]: params });
  };

  onClickOk = () => {
    let setValue = this.state.setValueTemp;
    if (!this.props.isChild) {
      this.setSubmissionValue(setValue);
    }
    this.props.onChange && this.props.onChange(setValue);
    this.setState({
      setValue: setValue,
      visible: false
    });
    this.handleChange(setValue);
  };
  onClickCancle = () => {
    this.setState({
      visible: false,
      setValueTemp: "",
      setValueTempIndex: -1
    });
  };
  render() {
    const { item, getFieldDecorator, isShowTitle } = this.props;
    const { selections } = this.state;
    let errMsg = this.props.item.validate.customMessage;
    return (
      <Form.Item
        label={isShowTitle === false ? null : <LabelUtils data={item} />}
      >
        {this.props.isChild ? (
          <div className="dropDown-Content">
            <div className="Input-content">
              <Input
                type="text"
                placeholder="请选择"
                style={{ width: "100%" }}
                value={this.state.setValue}
                onClick={this.showDropDownMobileList}
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
                <div className="dropDown-header">
                  <span
                    className="dropDown-header-cancle"
                    onClick={this.onClickCancle}
                  >
                    取消
                  </span>
                  <span
                    className="dropDown-header-confirm"
                    onClick={this.onClickOk}
                  >
                    确定
                  </span>
                </div>
              }
            >
              <ul
                className="dropDown-list"
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
                        {this.state.setValueTempIndex === index ? (
                          <Icon
                            style={{ color: "#09BB07" }}
                            className="dropDown-check-icon"
                            type="check"
                          />
                        ) : null}
                      </li>
                    ))
                  : null}
              </ul>
            </Drawer>
          </div>
        ) : (
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
                validator: this.checkSelecNumber
              }
            ]
          })(
            <div className="dropDown-Content">
              <div className="Input-content">
                <Input
                  type="text"
                  placeholder="请选择"
                  style={{ width: "100%" }}
                  value={this.state.setValue}
                  onClick={this.showDropDownMobileList}
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
                  <div className="dropDown-header">
                    <span
                      className="dropDown-header-cancle"
                      onClick={this.onClickCancle}
                    >
                      取消
                    </span>
                    <span
                      className="dropDown-header-confirm"
                      onClick={this.onClickOk}
                    >
                      确定
                    </span>
                  </div>
                }
              >
                <ul
                  className="dropDown-list"
                  style={{ listStyle: "none" }}
                  onClick={e => this.setValue(e)}
                >
                  {selections.map((item, index) => (
                    <li key={index} value={item.value} index={index}>
                      {item.label}{" "}
                      {this.state.setValueTempIndex === index ? (
                        <Icon
                          style={{ color: "#09BB07" }}
                          className="dropDown-check-icon"
                          type="check"
                        />
                      ) : null}
                    </li>
                  ))}
                </ul>
              </Drawer>
            </div>
          )
        )}
      </Form.Item>
    );
  }
}
export default withRouter(DropDown)