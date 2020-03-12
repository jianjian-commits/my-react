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
      verificationValue: "",
      textAreaInput: "",
      cursorIndex: 0,
      valueCursorIndex: 0, // value的索引位置
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
    if(newStr === ""){
      this.setState({
        verificationValue : ""
      })
    }
    let cursorIndex = this.getCursortPosition(
      document.querySelector(".custom")
    );
    this.setState(state => {
      let resultValue = "";
      if(newStr.length >= state.verificationStr.length){
        // 增加文字的时候
        if(newStr.length > cursorIndex){
          // 光标不在最末尾的位置
          let valueCursorIndex = this.calculateKeyCursor(state.verificationStr, cursorIndex, 26);
          console.log("valueCursorIndex",valueCursorIndex)
            resultValue = this.insertStr(state.verificationValue, newStr[cursorIndex-1], valueCursorIndex-1)
        }else if(newStr !==""){
           // 光标在最末尾的位置
          resultValue = state.verificationValue + newStr[cursorIndex-1];
        }
      } else {
        // 删除文字的时候。。先考虑
        let valueCursorIndex = this.calculateKeyCursor(state.verificationStr, cursorIndex, 26);
        resultValue = state.verificationValue.substring(0,valueCursorIndex) + state.verificationValue.substring(valueCursorIndex+1,state.verificationValue.length);
                                            
      }
      return ({
        ...state,
        verificationStr: newStr,
        verificationValue: resultValue
      })
    });
  }


  insertStr(oldstr, newStr ,cursorIndex) {
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

  // 计算value的cursor 
  /**
   * 计算当前光标之前有几个字段  -->只能使用字符串的匹配。。
   * 字段*id.length+光标的当前位置等于value的cursor值
   */
  calculateKeyCursor(verificationStr, cursorIndex, idLength) {
    // this.state.componentLabelArray 代表所有的组件 (label,value)
    let {componentLabelArray} = this.state;
    let LabelArray = componentLabelArray.map( item => item.label);
    // label去重，方便计算有几个字符
    LabelArray = [...new Set(LabelArray)];
    // 当前光标前的字符串
    let suffixStr = verificationStr.substring(0,cursorIndex);
    let count = LabelArray.reduce( (total, lable, currentIndex, arr) => {
      return total + suffixStr.split(lable).length -1
    },0);

    let FieldStrLength = LabelArray.reduce( (total, lable, currentIndex, arr) => {
      return total + (suffixStr.split(lable).length -1) * lable.length
    },0);
    return suffixStr.length - FieldStrLength + count * idLength ;
  }

  addFromData(filed) {
    let value = filed.label;
    let id = filed.id;
    let textAreaInput = this.textAreaInput;
    let cursorIndex = this.getCursortPosition(
      document.querySelector(".custom")
    );
    let newCursor = cursorIndex + value.length;

    this.setState(
      state => {
        let result = this.insertStr(state.verificationStr, value, cursorIndex);
        let valueCursorIndex = this.calculateKeyCursor(result, cursorIndex,id.length);
        let resultValue = this.insertStr(state.verificationValue,id, valueCursorIndex);
        return {
          ...state,
          verificationStr: result,
          verificationValue: resultValue,
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
        let result = this.insertStr(state.verificationStr, value, cursorIndex);
        let valueCursorIndex = this.calculateKeyCursor(result, cursorIndex, 26);

        let resultValue = this.insertStr(state.verificationValue,value, valueCursorIndex);

        return {
          ...state,
          verificationStr: result,
          cursorIndex: newCursor,
          verificationValue: resultValue
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
              ? this.props.addVerification(this.state.verificationStr,this.state.verificationValue)
              : this.props.editVerification(
                this.state.verificationStr,
                this.state.verificationValue,
                this.props.index
              );
            this.setState(state => ({
              ...state,
              verificationStr: "",
              verificationValue: ""
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
                          this.addFromData(item);
                        }}
                      >
                        {item.label}
                      </p>
                    ))
                    : this.state.componentLabelArray.map(item => (
                      <p
                        key={item.id}
                        onClick={_e => {
                          this.addFromData(item);
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
