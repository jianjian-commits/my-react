import React from "react";
import { connect } from "react-redux";
import { Modal, Input, Tabs, Collapse } from "antd";
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
      textAreaInput: "",
      cursorIndex: 0,
      dataSource: [], //校验规则的自动补全
      searchFieldArray: [], //搜索字段数组
      searchFormulaArray: [], //搜索公式数组
      fieldInputValue: "",
      formulaInputValue: ""
    };
  }

  componentWillMount() {
    let resultArray = [];

    this.props.data.forEach(item => {
      if (item.type === "FormChildTest") {
        item.values.forEach(childItem => {
          resultArray.push({
            label: item.label + "." + childItem.label,
            id: childItem.id
          });
        });
      } else {
        resultArray.push({
          label: item.label,
          id: item.id
        });
      }
    });

    this.setState({ 
      componentLabelArray: resultArray ,
      verificationStr: this.props.verificationStr
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
    this.setState(state => ({
      ...state,
      verificationStr: newStr
    }));
  }

  addFromData(value) {
    let textAreaInput = this.textAreaInput;
    let cursorIndex = this.getCursortPosition(
      document.querySelector(".custom")
    );
    let newCursor = cursorIndex + value.length;

    this.setState(
      state => {
        let result = "";
        if (cursorIndex === 0) {
          result = value + state.verificationStr;
        } else {
          let start = state.verificationStr.substr(0, cursorIndex);
          let end = state.verificationStr.substr(cursorIndex);

          result = start + value + end;
        }

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

    // console.log(cursorIndex)

    this.setState(
      state => {
        let result = "";
        if (cursorIndex === 0) {
          result = value + state.verificationStr;
        } else {
          let start = state.verificationStr.substr(0, cursorIndex);
          let end = state.verificationStr.substr(cursorIndex);

          result = start + value + end;
        }

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
        title="校验条件"
        visible={this.props.visible}
        onOk={() => {
          this.props.handleOk();
          if (this.state.verificationStr) {
            this.props.index === -1
              ? this.props.addVerification(this.state.verificationStr)
              : this.props.editVerification(
                this.state.verificationStr,
                this.props.index
              );
            this.setState(state => ({
              ...state,
              verificationStr: ""
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
          height: 505
        }}
        bodyStyle={{
          height: 350
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
                        key={item.id}
                        onClick={_e => {
                          this.addFromData(item.label);
                        }}
                      >
                        {item.label}
                      </p>
                    ))
                    : this.state.componentLabelArray.map(item => (
                      <p
                        key={item.id}
                        onClick={_e => {
                          this.addFromData(item.label);
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
