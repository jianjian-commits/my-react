import React from "react";
import { connect } from "react-redux";
import { Input, Tabs, Collapse } from "antd";
import { Modal } from "../../../../../shared/customWidget"
import {
  addVerification,
  editVerification
} from "../../redux/utils/operateVerification";
import { ruleList } from "./verificationRule";
const { Panel } = Collapse;
const { TextArea } = Input;
const { TabPane } = Tabs;
class ConditionModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      componentLabelArray: [],
      showFormualContent: "",
      verificationStr: "",
      verificationValue: "",
      textAreaInput: "",
      cursorIndex: 0,
      valueCursorIndex: 0, // value的索引位置
      dataSource: [], //校验规则的自动补全
      searchFieldArray: [], //搜索字段数组
      searchFormulaArray: [], //搜索公式数组
      fieldInputValue: "",
      formulaInputValue: "",
      selectedComponent: []
    };
  }

  componentWillMount() {
    let resultArray = [];
    let excludeComponentType = ["RadioButtons", "CheckboxInput", "DropDown", "MultiDropDown", "GetLocalPosition", "ImageUpload", "FileUpload", "HandWrittenSignature", "Address", "ComponentTemplate", "Button"]

    this.props.data.forEach(item => {
      if (item.type == "FormChildTest") {
        item.values.forEach(childItem => {
          if (excludeComponentType.indexOf(childItem.type) === -1) {
            resultArray.push({
              label: item.label + "." + childItem.label,
              key: item.key + "_" + childItem.key
            });
          }
        });
      } else if (excludeComponentType.indexOf(item.type) === -1) {
        resultArray.push({
          label: item.label,
          key: item.key
        });
      }
    });


    this.setState({
      componentLabelArray: resultArray.filter((item) => {
        return item.key != this.props.currentItem.key
      }),
      verificationStr: this.props.verificationStr,
      verificationValue: this.props.verificationValue
    });
  }

  componentWillReceiveProps(newPorps) {
    this.setState(state => ({
      ...state,
      verificationStr: newPorps.verificationStr
    }));
  }

  handleShowFormual(formual) {
    this.setState(state => ({
      ...state,
      showFormualContent: formual.describe
    }));
  }
  handleOnchange(e) {
    var newStr = e.target.value;
    if (newStr === "") {
      this.setState({
        verificationValue: "",
        selectedComponent: []
      })
    }
    this.setState(state => {
      return ({
        ...state,
        verificationStr: newStr,
      })
    });
  }


  insertStr(oldstr, newStr, cursorIndex) {
    let result = "";
    if (cursorIndex === 0) {
      result = newStr + oldstr;
    } else {
      let start = oldstr.substr(0, cursorIndex);
      let end = oldstr.substr(cursorIndex);
      result = start + newStr + end;
    }
    return result;
  }


  buildVerificationValue() {
    let { verificationStr, selectedComponent } = this.state;
    let valueStr = "";
    let startIndex = 0;
    let endIndex = 0;
    selectedComponent.map(field => {
      endIndex = verificationStr.indexOf(field.label, startIndex);
      if (endIndex !== -1) {
        if (startIndex < endIndex) {
          valueStr += verificationStr.substring(startIndex, endIndex)
        }
        valueStr += field.key;
        verificationStr = verificationStr.slice(endIndex + field.label.length)
      }
    })
    if (verificationStr.length !== 0) {
      valueStr += verificationStr
    }
    return valueStr
  }

  addFormData(field) {
    let value = field.label;
    let key = field.key;
    let textAreaInput = this.textAreaInput;
    let cursorIndex = this.getCursortPosition(
      document.querySelector(".custom")
    );
    let newCursor = cursorIndex + value.length;

    this.setState(
      state => {
        let result = this.insertStr(state.verificationStr, value, cursorIndex);
        let selectedComponent = [...state.selectedComponent, field]
        return {
          ...state,
          verificationStr: result,
          cursorIndex: newCursor,
          selectedComponent
        };
      },
      () => {
        textAreaInput.focus();
        const dom = document.querySelector(".custom");
        dom.selectionStart = dom.selectionEnd = newCursor;
      }
    );
  }
  // 获取光标位置
  getCursortPosition(textDom) {
    var cursorPos = 0;
    if (document.selection) {
      // IE Support
      textDom.focus();
      var selectRange = document.selection.createRange();
      selectRange.moveStart("character", -textDom.value.length);
      cursorPos = selectRange.text.length;
    } else if (textDom.selectionStart || textDom.selectionStart === "0") {
      // Firefox support
      cursorPos = textDom.selectionStart;
    }
    return cursorPos;
  }

  addCheckFunc(value) {
    let textAreaInput = this.textAreaInput;
    let cursorIndex = this.getCursortPosition(
      document.querySelector(".custom")
    );
    value = `${value}()`;
    let newCursor = cursorIndex + value.length - 1;

    this.setState(
      state => {
        let result = this.insertStr(state.verificationStr, value, cursorIndex);

        return {
          ...state,
          verificationStr: result,
          cursorIndex: newCursor
        };
      },
      () => {
        textAreaInput.focus();

        const dom = document.querySelector(".custom");
        dom.selectionStart = dom.selectionEnd = newCursor;
      }
    );
  }

  // 得到以value开头的正则
  regExpForValue = value => {
    let filterReg = /[`~!@#$%^&*()_+<>?:"{},.\/\\;'[\]]/gi;
    let newValue = value.replace(filterReg, "");
    let reg = new RegExp("^" + newValue, "i");
    return { newValue, reg };
  };

  // 搜索字段
  handleSearchField = e => {
    const value = e.target.value;
    let { reg } = this.regExpForValue(value);
    const { componentLabelArray } = this.state;
    const searchFieldArray = componentLabelArray.filter(item =>
      reg.test(item.label)
    );
    this.setState({
      searchFieldArray,
      fieldInputValue: value
    });
  };

  // 搜索检验规则
  handleSearchFormual = e => {
    let searchFormulaArray = [];
    const value = e.target.value;
    let { reg } = this.regExpForValue(value);
    ruleList.forEach(rules =>
      rules.ruleTypeList.forEach(
        rule => reg.test(rule.type) && searchFormulaArray.push(rule)
      )
    );
    this.setState({
      searchFormulaArray,
      formulaInputValue: value
    });
  };

  handleFormulaAutoComplete = (value, e) => {
    let dataSource = [];
    let { reg, newValue } = this.regExpForValue(value);
    newValue.length > 0 &&
      ruleList.forEach(rules =>
        rules.ruleTypeList.forEach(
          rule => reg.test(rule.type) && dataSource.push(rule.type)
        )
      );
    this.setState({
      dataSource,
      verificationStr: value
    });
  };

  render() {
    const {
      dataSource,
      fieldInputValue,
      searchFieldArray,
      formulaInputValue,
      searchFormulaArray
    } = this.state;

    return (
      <Modal
        title="公式编辑"
        visible={this.props.visible}
        onOk={() => {
          console.log("haha", this.state.selectedComponent);

          let verificationValue = this.buildVerificationValue();
          this.props.handleOk(this.state.selectedComponent, this.state.verificationStr, verificationValue);

          if (this.state.verificationStr) {
            this.setState(state => ({
              ...state,
              verificationStr: "",
              verificationValue: "",
              selectedComponent: []
            }));
          }
        }}
        onCancel={() => {
          this.props.handleCancel();
          this.setState(state => ({
            ...state,
            verificationStr: ""
          }));
        }}
        okText="保存"
        cancelText="取消"
        centered
        width="570"
        style={{
          height: 505,
          width: 570
        }}
        bodyStyle={{
          height: 400
        }}
      >
        <div className="conditionModalContent">
          <div className="ModalContentInput">
            <TextArea
              className={"custom"}
              ref={text => {
                this.textAreaInput = text;
              }}
              placeholder="点此输入公式"
              value={this.state.verificationStr}
              onChange={e => this.handleOnchange(e)}
            />
          </div>
          <div className="ModalContentVerification">
            <Tabs defaultActiveKey="1">
              <TabPane tab="可用字段" key="1">
                <div className="ItemList">
                  <Input
                    placeholder="搜索字段"
                    onChange={this.handleSearchField}
                  />
                  {fieldInputValue
                    ? searchFieldArray.map(item => (
                      <p
                        key={item.key}
                        onClick={_e => {
                          this.addFormData(item);
                        }}
                      >
                        {item.label}
                      </p>
                    ))
                    : this.state.componentLabelArray.map(item => (
                      <p
                        key={item.key}
                        onClick={_e => {
                          this.addFormData(item);
                        }}
                      >
                        {item.label}
                      </p>
                    ))}
                </div>
              </TabPane>
              <TabPane tab="公式选择" key="2">
                <div className="formulaChoose">
                  <div className="formulaList">
                    <Input
                      placeholder="搜索公式"
                      onChange={this.handleSearchFormual}
                    />
                    <Collapse accordion>
                      {formulaInputValue
                        ? searchFormulaArray.map((formual, i) => (
                          <div className="formulaListItem search" key={i}>
                            <p
                              onMouseEnter={() => {
                                this.handleShowFormual(formual);
                              }}
                              onClick={() => {
                                this.addCheckFunc(formual.type);
                              }}
                            >
                              {formual.type}
                            </p>
                          </div>
                        ))
                        : ruleList.map((item, index) => (
                          <Panel header={item.ruleType} key={index}>
                            {item.ruleTypeList.map((formual, i) => (
                              <div className="formulaListItem" key={i}>
                                <p
                                  onMouseEnter={() => {
                                    this.handleShowFormual(formual);
                                  }}
                                  onClick={() => {
                                    this.addCheckFunc(formual.type);
                                  }}
                                >
                                  {formual.type}
                                </p>
                              </div>
                            ))}
                          </Panel>
                        ))}
                    </Collapse>
                  </div>
                  <div className="formulaDiscribe">
                    <div className="formulaDiscribeContent">
                      {this.state.showFormualContent === "" ? (
                        <></>
                      ) : (
                          <div>
                            <p>用法</p>
                            <p>{this.state.showFormualContent}</p>
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              </TabPane>
            </Tabs>
          </div>
        </div>
      </Modal>
    );
  }
}

export default connect(
  store => ({
    data: store.formBuilder.data
  }),
  {
    addVerification,
    editVerification
  }
)(ConditionModal);
