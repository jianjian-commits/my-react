import React from "react";
import {
  Input,
  Form,
  Radio,
  Select,
  Tooltip,
  Icon,
  Checkbox,
  Popover,
  Button,
  DatePicker,
  TimePicker
} from "antd";
import { withRouter } from "react-router-dom";
import {
  getFormAllSubmission,
  filterSubmissionData,
  compareEqualArray,
  getResIndexArray
} from "../../utils/dataLinkUtils";
import { getSelection } from "../../utils/filterData";
import LabelUtils from "../../../formBuilder/preview/component/formItemDoms/utils/LabelUtils";
import locale from "antd/lib/date-picker/locale/zh_CN";
import { checkValueValidByType } from "../../../formBuilder/utils/checkComponentDataValidUtils";

import Address from "./components/address";
import FileUpload from "./components/fileUpload";
import ImageUpload from "./components/imageUpload";
import CheckboxInput from "../checkboxInput/checkboxTestItem";
import RadioButtons from "../radioInput/radioTestItem";
import DropDown from "./components/dropDown";
import MultiDropDown from "./components/multiDropDown";
import DateInput from "./components/dateInput";
import moment from "moment";
import coverTimeUtils from '../../../../utils/coverTimeUtils'
import ID from "../../../../utils/UUID";

class FormChildTest extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hoverFormChildIndex: -1,
      fileData: {
        name: "",
        url: ""
      },
      nowDate: new moment(),
      refesh: true,
      hasFormChildError: false,
      initFlag: true,
      errorMsg: "存在不符合规范的值"
    };
    this.handleAddRow = this.handleAddRow.bind(this);
    this.renderFormChild = this.renderFormChild.bind(this);
  }
  _initSubmitData = (item, submitDataArray) => {
    // 初始化子表单的数据，补齐或者填充数据
    let childComponent = item.values;
    let newSubmitDataArray = [];
    newSubmitDataArray = submitDataArray.map(submission => {
      let result = {};
      childComponent.map(component => {
        result[component.key] = this._buildDefaultValueByType(
          component,
          submission
        );
      });
      if(submission.childFormDataId){
         result["childFormDataId"] = submission.childFormDataId;
      }
     
      return result;
    });
    return newSubmitDataArray;
  };

  _buildDefaultValueByType = (item, submission) => {
    let result = {};
    let newArray = [...this.props.submitDataArray];
    let { handleSetComponentEvent } = this.props;
    const { appId } = this.props.match.params;
    let data =
      submission[item.key] != void 0 ? submission[item.key].data : null;
    switch (item.type) {
      case "SingleText":
      case "TextArea":
      case "NumberInput":
      case "PhoneInput":
      case "IdCardInput":
      case "EmailInput":
      case "Address":
        result = {
          key: item.key,
          type: item.label,
          formType: item.type,
          data: data || item.defaultValue || null,
          validate: {unique: item.unique, ...item.validate},
          hasErr: false
        };
        break;
      case "DateInput":
      case "PureDate":
      case "PureTime":
        result = {
          type: item.label,
          formType: item.type,
          validate: item.validate,
          hasErr: false,
          autoInput: item.autoInput,
          data: data || null
        };
        break;
      case "RadioButtons": {
        result = {
          type: item.label,
          formType: item.type,
          data: data || null,
          hasErr: false,
          validate: item.validate,
          values: item.values
        };
      }
      case "CheckboxInput": {
        result = {
          type: item.label,
          formType: item.type,
          data: data,
          hasErr: false,
          validate: item.validate,
          values: item.values
        };
        break;
      }
      case "MultiDropDown":
      case "DropDown": {
        let dropDownOptions = [];
        let values = item.data.values;
        if (values.type == "otherFormData") {
          // 子表单关联其他数据
          getSelection(appId, values.formId, values.optionId).then(res => {
            result[item.key].dropDownOptions = res.map(data => data.value);
            this.setState({
              refesh: !this.state.refesh
            });
          });
        } else {
          dropDownOptions = Array.isArray(values) ? values : [];
        }
        result = {
          type: item.label,
          formType: item.type,
          data: data || null,
          hasErr: false,
          validate: item.validate,
          values,
          dropDownOptions
        };
        break;
      }
      case "HandWrittenSignature":
      case "FileUpload":
      case "ImageUpload":
      case "GetLocalPosition":
        result = {
          component: item,
          type: item.label,
          formType: item.type,
          validate: item.validate,
          hasErr: false,
          data: data || []
        };
        break;
      default:
        break;
    }
    // result.isShow = true;
    // 根据dataLink的数据进行注册监听
    if (item.data && item.data.values && item.data.values.linkFormId) {
      const {
        conditionId, //联动条件 id(当前表单)
        linkComponentId, //联动条件 id(联动表单)
        linkDataId, //联动数据 id(联动表单)
        linkFormId //联动表单 id
      } = item.data.values;
      // 得到id表单的所有提交数据
      const { appId } = this.props.match.params;
      getFormAllSubmission(appId, linkFormId).then(submissions => {
        // 根据联动表单的组件id 得到对应所有数据
        let dataArr = filterSubmissionData(submissions, linkComponentId);
        if (item.type === "DropDown" || item.type === "MultiDropDown") {
          handleSetComponentEvent(
            conditionId,
            value =>
              this.dataLinkCallEventForSelection({
                value,
                dataArr,
                submissions,
                linkDataId,
                result,
                item,
                newArray
              }),
            newArray.length - 1,
            this.props.item.key
          );
        } else {
          // 为需要联动的表单添加 change事件
          handleSetComponentEvent(
            conditionId,
            value => {
              let index = -1;
              // 比较dataArr中是否有与value相同的值，有的话返回对应的idnex
              // 如果change数据为数组 则进行深度比较
              if (value instanceof Array) {
                index = compareEqualArray(dataArr, value);
              } else {
                index = dataArr.indexOf(value);
              }
              // 如果存在 获得提交数据中关联字段的数据
              if (index > -1) {
                let data = filterSubmissionData(submissions, linkDataId);
                // 根据查找的idnex取得对应的关联数据
                const res = data[index];
                // 更新对应字段的值
                result[item.key].data = res;
                this.props.saveSubmitData(newArray);
              } else {
                result[item.key].data = null;
              }
            },
            newArray.length - 1,
            this.props.item.key
          );
        }
      });
    }
    return result;
  };
  // 重新计算子字段的数据联动
  _reSetDataLinkFormChildItem = () => {
    let { item, handleSetComponentEvent, submitDataArray } = this.props;
    let values = item.values;
    let newArray = [];
    const { appId } = this.props.match.params;

    submitDataArray.forEach((child, index) => {
      let result = {};
      values.forEach(item => {
        switch (item.type) {
          case "SingleText":
          case "TextArea":
          case "NumberInput":
          case "PhoneInput":
          case "IdCardInput":
          case "EmailInput":
          case "Address":
            result[item.key] = {
              type: item.label,
              formType: item.type,
              validate: {unique: item.unique, ...item.validate},
              hasErr: false,
              data: child[item.key].data
            };
            break;
          case "DateInput":
          case "PureDate":
          case "PureTime": {
            result[item.key] = {
              type: item.label,
              formType: item.type,
              validate: item.validate,
              hasErr: false,
              data: child[item.key].data
            };
            break;
          }
          case "RadioButtons":
          case "CheckboxInput":
            result[item.key] = {
              type: item.label,
              formType: item.type,
              validate: item.validate,
              hasErr: false,
              data: child[item.key].data,
              values: item.values
            };
            break;
          case "MultiDropDown":
          case "DropDown":
            result[item.key] = {
              type: item.label,
              formType: item.type,
              validate: item.validate,
              hasErr: false,
              data: child[item.key].data,
              dropDownOptions: item.data.values
            };
            break;
          case "HandWrittenSignature":
          case "FileUpload":
          case "ImageUpload":
          case "GetLocalPosition":
            result[item.key] = {
              type: item.label,
              formType: item.type,
              validate: item.validate,
              component: child[item.key].component,
              hasErr: false,
              data: {
                name: "",
                url: ""
              }
            };
            break;
          default:
            break;
        }
        result[item.key].validate = item.validate;

        // 根据dataLink的数据进行注册监听
        if (item.data && item.data.values && item.data.values.linkFormId) {
          const {
            conditionId, //联动条件 id(当前表单)
            linkComponentId, //联动条件 id(联动表单)
            linkDataId, //联动数据 id(联动表单)
            linkFormId //联动表单 id
          } = item.data.values;
          // 得到id表单的所有提交数据
          getFormAllSubmission(appId, linkFormId).then(submissions => {
            // 根据联动表单的组件id 得到对应所有数据
            let dataArr = filterSubmissionData(submissions, linkComponentId);
            if (item.type === "DropDown" || item.type === "MultiDropDown") {
              handleSetComponentEvent(
                conditionId,
                value =>
                  this.dataLinkCallEventForSelection({
                    value,
                    dataArr,
                    submissions,
                    linkDataId,
                    result,
                    item,
                    newArray
                  }),
                index,
                this.props.item.key
              );
            } else {
              // 为需要联动的表单添加 change事件
              handleSetComponentEvent(
                conditionId,
                value => {
                  let index = -1;
                  // 比较dataArr中是否有与value相同的值，有的话返回对应的idnex
                  // 如果change数据为数组 则进行深度比较
                  if (value instanceof Array) {
                    index = compareEqualArray(dataArr, value);
                  } else {
                    index = dataArr.indexOf(value);
                  }
                  // 如果存在 获得提交数据中关联字段的数据
                  if (index > -1) {
                    let data = filterSubmissionData(submissions, linkDataId);
                    // 根据查找的idnex取得对应的关联数据
                    const res = data[index];
                    // 更新对应字段的值
                    result[item.key].data = res;
                    this.props.saveSubmitData(newArray);
                  } else {
                    result[item.key].data = null;
                  }
                },
                index,
                this.props.item.key
              );
            }
          });
        }
        // submitDataArray[index][item.key].callEventArr && (result[item.key].callEventArr = submitDataArray[index][item.key].callEventArr);
        // submitDataArray[index][item.key].validate && (result[item.key].validate = submitDataArray[index][item.key].validate);
      });
      newArray.push(result);
    });
    this.props.saveSubmitData(newArray);
  };

  _buildSubmitResultSetState = isDidMountAddRow => {
    let newArray = [...this.props.submitDataArray];

    if (newArray.length !== 0 && isDidMountAddRow) {
      return;
    }

    let { item, handleSetComponentEvent } = this.props;
    let values = item.values;
    let result = {};
    const { appId } = this.props.match.params;

    values.forEach(item => {
      switch (item.type) {
        case "SingleText":
        case "TextArea":
        case "NumberInput":
        case "PhoneInput":
        case "IdCardInput":
        case "EmailInput":
        case "Address":
          result[item.key] = {
            type: item.label,
            formType: item.type,
            data: item.defaultValue || "",
            validate: {unique: item.unique, ...item.validate},
            hasErr: false
          };
          break;
        case "DateInput":
        case "PureDate":
        case "PureTime": {
          result[item.key] = {
            type: item.label,
            formType: item.type,
            validate: item.validate,
            autoInput: item.autoInput,
            hasErr: false,
            data: null
          };
          break;
        }
        case "RadioButtons":
        case "CheckboxInput":
          result[item.key] = {
            type: item.label,
            formType: item.type,
            data: null,
            hasErr: false,
            validate: item.validate,
            values: item.values
          };
          break;
        case "MultiDropDown":
        case "DropDown": {
          let dropDownOptions = [];
          let values = item.data.values;
          if (values.type === "otherFormData") {
            // 子表单关联其他数据
            getSelection(appId, values.formId, values.optionId).then(res => {
              result[item.key].dropDownOptions = res.map(data => data.value);
              this.setState({
                refesh: !this.state.refesh
              });
            });
          } else {
            dropDownOptions = Array.isArray(values) ? values : [];
          }
          result[item.key] = {
            type: item.label,
            formType: item.type,
            data: null,
            hasErr: false,
            validate: item.validate,
            values,
            dropDownOptions
          };
          break;
        }
        case "HandWrittenSignature":
        case "FileUpload":
        case "ImageUpload":
        case "GetLocalPosition":
          result[item.key] = {
            component: item,
            type: item.label,
            formType: item.type,
            validate: item.validate,
            hasErr: false,
            data: []
          };
          break;
        default:
          break;
      }

      // 根据dataLink的数据进行注册监听
      if (item.data && item.data.values && item.data.values.linkFormId) {
        const {
          conditionId, //联动条件 id(当前表单)
          linkComponentId, //联动条件 id(联动表单)
          linkDataId, //联动数据 id(联动表单)
          linkFormId //联动表单 id
        } = item.data.values;
        // 得到id表单的所有提交数据
        getFormAllSubmission(appId, linkFormId).then(submissions => {
          // 根据联动表单的组件id 得到对应所有数据
          let dataArr = filterSubmissionData(submissions, linkComponentId);
          if (item.type === "DropDown" || item.type === "MultiDropDown") {
            handleSetComponentEvent(
              conditionId,
              value =>
                this.dataLinkCallEventForSelection({
                  value,
                  dataArr,
                  submissions,
                  linkDataId,
                  result,
                  item,
                  newArray
                }),
              newArray.length - 1,
              this.props.item.key
            );
          } else {
            // 为需要联动的表单添加 change事件
            handleSetComponentEvent(
              conditionId,
              value => {
                let index = -1;
                // 比较dataArr中是否有与value相同的值，有的话返回对应的idnex
                // 如果change数据为数组 则进行深度比较
                if (value instanceof Array) {
                  index = compareEqualArray(dataArr, value);
                } else {
                  index = dataArr.indexOf(value);
                }
                // 如果存在 获得提交数据中关联字段的数据
                if (index > -1) {
                  let data = filterSubmissionData(submissions, linkDataId);
                  // 根据查找的idnex取得对应的关联数据
                  const res = data[index];
                  // 更新对应字段的值
                  result[item.key].data = res;
                  this.props.saveSubmitData(newArray);
                } else {
                  result[item.key].data = null;
                }
              },
              newArray.length - 1,
              this.props.item.key
            );
          }
        });
      }
    });
    result["childFormDataId"] = ID.oldUuid();
    newArray.push(result);

    this.props.saveSubmitData(newArray);
  };

  handleAddRow() {
    this._buildSubmitResultSetState(false);
  }

  componentWillReceiveProps(nextProps) {
    const { initData, item, errorResponseMsg } = nextProps;
    if (initData && this.state.initFlag) {
      this.props.saveSubmitData(this._initSubmitData(item, initData));
      this.setState({
        initFlag: false
      });
    }

    if(errorResponseMsg !=void 0){
      let errorArr = [];
      for(let key in errorResponseMsg){
        errorResponseMsg[key].map(errorMsg => errorArr.push(errorMsg.msg))
      }
      this.setState({
        hasFormChildError: true,
        // errorMsg: errorArr.join(";")
      })
    }
  }

  _getErrorMsgValue(componentKey){
    const errorResponseMsg = this.props.errorResponseMsg;
    if(errorResponseMsg && errorResponseMsg.hasOwnProperty(componentKey)){
      return errorResponseMsg[componentKey].map( errorMsg => errorMsg.value);
    }
      return []
  }

  componentDidMount() {
    this._buildSubmitResultSetState(true);
    const {
      form,
      item,
      handleSetComponentEvent,
      handleSetFormChildData
    } = this.props;
    const { data } = item;
    // 是否为数据联动
    if (data && data.type === "DataLinkage" && data.values.linkFormId) {
      const {
        conditionId, //联动条件 id(当前表单)
        linkComponentId, //联动条件 id(联动表单)
        linkDataId, //联动数据 id(联动表单)
        linkFormId, //联动表单 id
        formChildData //子表单联动数据
      } = data.values;
      // 得到id表单的所有提交数据
      const { appId } = this.props.match.params;
      getFormAllSubmission(appId, linkFormId).then(submissions => {
        // 根据联动表单的组件id 得到对应所有数据
        let dataArr = filterSubmissionData(submissions, linkComponentId);
        // 为需要联动的表单添加 change事件
        handleSetComponentEvent(conditionId, value => {
          let index = -1;
          let newData = [...dataArr];
          // 比较dataArr中是否有与value相同的值，有的话返回对应的idnex
          // 如果change数据为数组 则进行深度比较
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
          if (index > -1) {
            let data = filterSubmissionData(submissions, linkDataId);
            // 根据查找的idnex取得对应的关联数据
            handleSetFormChildData(item, data[index], formChildData, this);
          } else {
            handleSetFormChildData(item, null, null, this);
          }
        });
      });
    }
  }

  // 如果存在回调数组，则遍历里面的函数执行
  handleEmitChange = value => {
    const { callEventArr } = this.props.item;
    if (callEventArr) {
      callEventArr.forEach(fnc => {
        fnc && fnc(value, this);
      });
    }
  };

  handleChange = ev => {
    const value = ev.target.value;
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

  handleItemChange = (value, formChildObj) => {
    const { callEventArr } = formChildObj;
    if (callEventArr) {
      callEventArr.forEach(fnc => {
        fnc && fnc(value, this);
      });
    }
  };

  _truncateValue(value) {
    if (value == void 0) {
      return "";
    } else if (value.length >= 6) {
      return value.substr(0, 6) + "...";
    } else {
      return value;
    }
  }

  // 将地址对象转化为字符串
  AddressObjToString = address => {
    if (address) {
      let { province, county, city, detail } = address;
      return [province, city, county, detail].filter(item => item).join("");
    } else {
      return "";
    }
  };

  renderFormChild(formChildObj, rowIndex, submitDataArray) {
    let resultArray = [];
    for (let key in formChildObj) {
      let item = formChildObj[key];
      // const errorValues = this._getErrorMsgValue(key); // 重复的值
      let className = item.hasErr
        ? "componentContent has-value-error"
        : "componentContent";
      switch (item.formType) {
        case "NumberInput":
          resultArray.push(
            <div key={key} className={className}>
              <div
                className="inputContainer"
                onClick={e => {
                  document.getElementById(key + rowIndex).focus();
                  document.querySelectorAll(".componentContent").forEach(el => {
                    el.classList.remove("activecontent");
                  });
                  e.target.parentNode.parentNode.classList.add("activecontent");
                }}
                onBlur={e => {
                  document.querySelectorAll(".componentContent").forEach(el => {
                    el.classList.remove("activecontent");
                  });
                }}
              >
                <Input
                  id={key + rowIndex}
                  type="number"
                  onChange={e => {
                    let { value } = e.target;
                    item.data = value;
                  }}
                  onBlur={e => {
                    let { value } = e.target;
                    checkValueValidByType(item, value)
                      ? (item.hasErr = false)
                      : (item.hasErr = true);
                    if(typeof value =="string" && value!==""){
                      item.data = Number(value);
                    }
                    this.setState({
                      refesh: !this.state.refesh
                    });
                    this._checkFormChildHasError(submitDataArray);
                    this.handleItemChange(value, item);
                  }}
                  value={item.data}
                />
                <img src="/image/icons/edit.png" alt="图片加载出错" />
              </div>
            </div>
          );
          break;
        case "SingleText":
        case "TextArea":
        case "EmailInput":
        case "IdCardInput":
        case "PhoneInput":
          resultArray.push(
            <div key={key} className={className}>
              <div
                className="inputContainer"
                onClick={e => {
                  // document.getElementById(key + rowIndex).focus();
                  // document.querySelectorAll(".componentContent").forEach(el => {
                  //   el.classList.remove("activecontent");
                  // });
                  // e.target.parentNode.parentNode.classList.add("activecontent");
                }}
                onBlur={e => {
                  document.querySelectorAll(".componentContent").forEach(el => {
                    el.classList.remove("activecontent");
                  });
                }}
              >
                <Input
                  id={key + rowIndex}
                  onChange={e => {
                    let { value } = e.target;
                    item.data = value;
                  }}
                  onBlur={e => {
                    let { value } = e.target;
                    checkValueValidByType(item, value)
                      ? (item.hasErr = false)
                      : (item.hasErr = true);
                    this.setState({
                      refesh: !this.state.refesh
                    });
                    this._checkFormChildHasError(submitDataArray);
                    this.handleItemChange(value, item);
                  }}
                  value={item.data}
                />
                <img src="/image/icons/edit.png" alt="图片加载出错" />
              </div>
            </div>
          );
          break;
        case "CheckboxInput": {
          resultArray.push(
            <div key={key} className={className}>
              <Popover
                overlayClassName="checkboxProver"
                content={
                  <>
                    <CheckboxInput
                      value={item.data || []}
                      item={item}
                      onChange={value => {
                        item.data = value;

                        checkValueValidByType(item, value)
                          ? (item.hasErr = false)
                          : (item.hasErr = true);
                        this.setState(state => ({
                          ...state,
                          refesh: !this.state.refesh
                        }));
                        this._checkFormChildHasError(submitDataArray);
                      }}
                    />
                  </>
                }
                title=""
                placement="bottom"
                trigger="click"
              >
                <div className="checkboxComponent">
                  {/* {this._truncateValue(item.data)} */}
                  <span className="dataSpan">
                    {item.data ? item.data.join(",") : ""}
                  </span>
                  <img src="/image/icons/edit.png" alt="图片加载出错" />
                </div>
              </Popover>
            </div>
          );
          break;
        }
        case "MultiDropDown": {
          const dropDownOptions = Array.isArray(item.values)
            ? item.values
            : item.dropDownOptions;
          resultArray.push(
            <div key={key} className={className}>
              <Popover
                overlayClassName="formChild-multiDropDownProver"
                content={
                  <>
                    <MultiDropDown
                      item={item}
                      value={item.data || []}
                      onChange={value => {
                        item.data = value;
                        checkValueValidByType(item, value)
                          ? (item.hasErr = false)
                          : (item.hasErr = true);
                        this.setState(state => ({
                          ...state,
                          refesh: !this.state.refesh
                        }));
                        this._checkFormChildHasError(submitDataArray);
                      }}
                    />
                  </>
                }
                title=""
                placement="bottom"
                trigger="click"
              >
                <div className="checkboxComponent">
                  <span className="dataSpan">
                    {item.data ? item.data.join(",") : ""}
                  </span>
                  <img src="/image/icons/edit.png" alt="图片加载出错" />
                </div>
              </Popover>
            </div>
          );
          break;
        }
        case "RadioButtons": {
          resultArray.push(
            <div key={key} className={className}>
              <Popover
                overlayClassName="radioButtonsProver"
                content={
                  <RadioButtons
                    item={item}
                    // ? 待解决,异步更新问题
                    onChange={value => {
                      item.data = value;
                      checkValueValidByType(item, value)
                        ? (item.hasErr = false)
                        : (item.hasErr = true);
                      this.setState(state => ({
                        ...state,
                        refesh: !this.state.refesh
                      }));
                      this._checkFormChildHasError(submitDataArray);
                    }}
                  />
                }
                title=""
                placement="bottom"
                trigger="click"
              >
                <div className="checkboxComponent">
                  {/* {this._truncateValue(item.data)} */}
                  <span className="dataSpan">{item.data}</span>
                  <img src="/image/icons/edit.png" alt="图片加载出错" />
                </div>
              </Popover>
            </div>
          );
          break;
        }
        case "DropDown": {
          resultArray.push(
            <div key={key} className={className}>
              <Popover
                overlayClassName="formChild-DropDownProver"
                content={
                  <DropDown
                    item={item}
                    onChange={value => {
                      item.data = value;
                      checkValueValidByType(item, value)
                        ? (item.hasErr = false)
                        : (item.hasErr = true);
                      this.setState(state => ({
                        ...state,
                        refesh: !this.state.refesh
                      }));
                      this._checkFormChildHasError(submitDataArray);
                    }}
                  />
                }
                title=""
                placement="bottom"
                trigger="click"
              >
                <div className="checkboxComponent">
                  <span className="dataSpan">{item.data}</span>
                  <img src="/image/icons/edit.png" alt="图片加载出错" />
                </div>
              </Popover>
            </div>
          );
          break;
        }
        case "FileUpload":
          resultArray.push(
            <div key={key} className={className}>
              <Popover
                overlayClassName="normalProver"
                content={
                  <FileUpload
                    value={item.data || []}
                    item={item.component}
                    onChange={value => {
                      item.data = value;

                      checkValueValidByType(item, value)
                        ? (item.hasErr = false)
                        : (item.hasErr = true);

                      this.setState(state => ({
                        ...state,
                        refesh: !this.state.refesh
                      }));
                      this._checkFormChildHasError(submitDataArray);
                    }}
                  />
                }
                title=""
                placement="bottom"
                trigger="click"
              >
                <div className="checkboxComponent">
                  {item.data.length !== 0 ? (
                    <span className="dataSpan">{item.data[0].name}</span>
                  ) : (
                    ""
                  )}
                  <img src="/image/icons/edit.png" alt="图片加载出错" />
                </div>
              </Popover>
            </div>
          );
          break;
        case "ImageUpload":
          resultArray.push(
            <div key={key} className={className}>
              <Popover
                overlayClassName="normalProver"
                content={
                  <ImageUpload
                    value={item.data || []}
                    item={item.component}
                    onChange={value => {
                      item.data = value;
                      checkValueValidByType(item, value)
                        ? (item.hasErr = false)
                        : (item.hasErr = true);
                      this.setState(state => ({
                        ...state,
                        refesh: !this.state.refesh
                      }));
                      this._checkFormChildHasError(submitDataArray);
                    }}
                  />
                }
                title=""
                placement="bottom"
                trigger="click"
              >
                <div className="checkboxComponent">
                  {item.data.length !== 0 ? (
                    <span className="dataSpan">{item.data[0].name}</span>
                  ) : (
                    ""
                  )}
                  <img src="/image/icons/edit.png" alt="图片加载出错" />
                </div>
              </Popover>
            </div>
          );
          break;
        case "DateInput":
          {
            let valueOption = {};
            if(item.data) {
              const tempDate = coverTimeUtils.localDate(item.data, item.formType, true);
              valueOption.value = tempDate;
            }
            resultArray.push(
              <div key={key} style={{ width: 200 }} className={className}>
                <DateInput
                  data={item}
                  showTime
                  locale={locale}
                  {...valueOption}
                  placeholder="请选择时间/日期"
                  onChange={(value, dataString) => {
                    item.data = value;

                    checkValueValidByType(item, value)
                      ? (item.hasErr = false)
                      : (item.hasErr = true);
                    this.setState(state => ({
                      ...state,
                      refesh: !this.state.refesh
                    }));
                    this._checkFormChildHasError(submitDataArray);
                  }}
                />
              </div>
            );
          }
          break;
        case "PureDate":
          {
            let valueOption = {};
            if(item.data) {
              valueOption.value = moment(coverTimeUtils.localDate(item.data, item.formType, true));
            }
            resultArray.push(
              <div key={key} className={className}>
                <DateInput
                  data={item}
                  disabled={item.autoInput}
                  locale={locale}
                  {...valueOption}
                  placeholder="请选择日期"
                  onChange={(value, dataString) => {
                    item.data = value;

                    checkValueValidByType(item, value)
                      ? (item.hasErr = false)
                      : (item.hasErr = true);
                    this.setState(state => ({
                      ...state,
                      refesh: !this.state.refesh
                    }));
                    this._checkFormChildHasError(submitDataArray);
                  }}
                />
              </div>
            );
          }
          break;
        case "PureTime":
          {
            let valueOption = {};
            if(item.data) {
              const tmpMoment = coverTimeUtils.localDate(item.data, item.formType, true);
              valueOption.value = tmpMoment;
            }
            resultArray.push(
              <div key={key} className={className}>
                <DateInput
                  data={item}
                  locale={locale}
                  {...valueOption}
                  placeholder="请选择时间"
                  onChange={(value, dataString) => {
                    item.data = value;

                    checkValueValidByType(item, value)
                      ? (item.hasErr = false)
                      : (item.hasErr = true);
                    this.setState(state => ({
                      ...state,
                      refesh: !this.state.refesh
                    }));
                    this._checkFormChildHasError(submitDataArray);
                  }}
                />
              </div>
            );
          }
          break;
        case "Address":
          resultArray.push(
            <div key={key} className={className}>
              <Popover
                overlayClassName="addressProver"
                content={
                  <Address
                    item={item}
                    setAddress={value => {
                      item.data = value;
                      checkValueValidByType(item, value)
                        ? (item.hasErr = false)
                        : (item.hasErr = true);

                      this.setState(state => ({
                        refesh: !this.state.refesh
                      }));
                      this._checkFormChildHasError(submitDataArray);
                    }}
                  />
                }
                title=""
                placement="bottom"
                trigger="click"
              >
                <div className="checkboxComponent">
                  {/* {this._truncateValue(item.data)} */}
                  <span className="dataSpan">
                    {this.AddressObjToString(item.data)}
                  </span>
                  <img src="/image/icons/edit.png" alt="图片加载出错" />
                </div>
              </Popover>
            </div>
          );
          break;
        case "GetLocalPosition":
        case "HandWrittenSignature":
          resultArray.push(
            <div key={key} className={className}>
              <Input placeholder="请在手机上查看" disabled={true} />
            </div>
          );
        default:
          break;
      }
    }
    return resultArray;
  }

  // 争对下拉框的 回调函数
  dataLinkCallEventForSelection(args) {
    const {
      value,
      dataArr,
      submissions,
      linkDataId,
      result,
      item,
      newArray
    } = args;

    let indexArr = getResIndexArray(value, dataArr);
    if (indexArr.length > 0) {
      let data = filterSubmissionData(submissions, linkDataId);
      let res = [];
      indexArr.forEach(i => {
        if (data[i]) {
          res.push(data[i]);
        }
      });
      // 去重
      const selections = [];
      res.forEach(item => {
        if (Array.isArray(item)) {
          item.forEach(data => {
            if (data) {
              if (selections.includes(data)) {
                return null;
              } else {
                selections.push(data);
              }
            }
          });
        } else {
          if (item) {
            if (selections.includes(item)) {
              return null;
            } else {
              selections.push(item);
            }
          }
        }
      });
      // 赋值
      result[item.key].values = selections;
      // 解决当newArray为空时 输入内容列表会清空
      // newArray ? this.props.saveSubmitData(newArray) : null;
    } else {
      result[item.key].values = [];
      // newArray ? this.props.saveSubmitData(newArray) : null;
    }
  }

  componentDidUpdate() {
    const { showFormChildErr, submitDataArray, closeFormChildErr } = this.props;
    if (showFormChildErr === true) {
      // this._checkFormChildHasError(submitDataArray);
      // closeFormChildErr();
    }
  }

  _checkFormChildHasError(submitDataArray) {
    const errorResponseMsg = this.props.errorResponseMsg;
    const parentItem = this.props.item;
    let isFormChildErr = false;
    submitDataArray.forEach(item => {
      for (let m in item) {
        if (item[m].hasErr === true) {
          isFormChildErr = true;
        }
      }
    });

    if(isFormChildErr === false){
      this.props.resetErrorMsg(parentItem.key)
    }
    this.setState({ hasFormChildError: isFormChildErr });
  }

  render() {
    const { getFieldDecorator, item, submitDataArray } = this.props;
    let { values } = item;
    let { hasFormChildError } = this.state;

    let formChildKey = item.key;

    return (
      <Form.Item label={<LabelUtils data={item} />}>
        {item.values.length === 0 ? (
          <div>
            <div className="app-formChild">
              <div className="formChildContainer">
                <div className="TitleContainer">
                  <div className="componentTitle" />
                </div>
              </div>
              <div className="formChildAddBtn">
                <Button type="link" onClick={this.handleAddRow}>
                  <Icon type="plus" /> 添加 
                </Button>
              </div>
            </div>
          </div>
        ) : (
          getFieldDecorator(item.key)(
            <div className="app-formChild">
              <div className="formChildContainer">
                <div className="TitleContainer">
                  <div className="componentTitle" />
                  {values.map((item, index) => (
                    <div
                      key={index}
                      style={
                        item.label === "时间/日期"
                          ? { width: 200, flex: "0 0 200px" }
                          : { width: 140 }
                      }
                      className={
                        item.validate.required
                          ? "componentTitle-required"
                          : "componentTitle"
                      }
                      title={item.label}
                    >
                      {item.label}
                    </div>
                  ))}
                </div>
                {submitDataArray.map((item, index) => (
                  <div className="contentContainer" key={"formChild" + index}>
                    <div className="componentContent">
                      <span
                        key={Math.random()}
                        id={formChildKey + "Number" + index}
                        style={{
                          display: "inline-block",
                          width: "25px",
                          height: "25px",
                          lineHeight: "25px"
                        }}
                        onMouseEnter={() => {
                          submitDataArray.forEach((item, i) => {
                            if (
                              document.getElementById(
                                formChildKey + "Number" + i
                              ) != void 0
                            ) {
                              document.getElementById(
                                formChildKey + "Number" + i
                              ).style.display = "inline-block";
                            }
                            if (
                              document.getElementById(
                                formChildKey + "Btn" + i
                              ) != void 0
                            ) {
                              document.getElementById(
                                formChildKey + "Btn" + i
                              ).style.display = "none";
                            }
                          });

                          if (
                            document.getElementById(
                              formChildKey + "Number" + index
                            ) != void 0
                          ) {
                            document.getElementById(
                              formChildKey + "Number" + index
                            ).style.display = "none";
                          }
                          if (
                            document.getElementById(
                              formChildKey + "Btn" + index
                            ) != void 0
                          ) {
                            document.getElementById(
                              formChildKey + "Btn" + index
                            ).style.display = "inline-block";
                          }
                        }}
                      >
                        {index + 1}
                      </span>
                      {submitDataArray.length > 0 ? (
                        <img
                          key={Math.random()}
                          src="/image/icons/delete.png"
                          style={{
                            width: "25px",
                            height: "25px"
                          }}
                          id={formChildKey + "Btn" + index}
                          onMouseOut={() => {
                            submitDataArray.forEach((item, i) => {
                              if (
                                document.getElementById(
                                  formChildKey + "Number" + i
                                ) != void 0
                              ) {
                                document.getElementById(
                                  formChildKey + "Number" + i
                                ).style.display = "inline-block";
                              }
                              if (
                                document.getElementById(
                                  formChildKey + "Btn" + i
                                ) != void 0
                              ) {
                                document.getElementById(
                                  formChildKey + "Btn" + i
                                ).style.display = "none";
                              }
                            });

                            if (
                              document.getElementById(
                                formChildKey + "Number" + index
                              ) != void 0
                            ) {
                              document.getElementById(
                                formChildKey + "Number" + index
                              ).style.display = "inline-block";
                            }
                          }}
                          onClick={_e => {
                            let newArray = this.props.submitDataArray;
                            newArray.splice(index, 1);
                            this.props.saveSubmitData(newArray);

                            this.setState(state => ({
                              ...state,
                              refesh: !this.state.refesh
                            }));
                          }}
                        />
                      ) : null}
                    </div>
                    {this.renderFormChild(item, index, submitDataArray)}
                  </div>
                ))}
              </div>
              {hasFormChildError ? (
                <div className="ant-form-explain" style={{ color: "red" }}>
                  <p>{this.state.errorMsg}</p>
                </div>
              ) : (
                <></>
              )}
              <div className="formChildAddBtn">
                <Button type="link" onClick={this.handleAddRow}>
                  <Icon type="plus" />
                  添加
                </Button>
              </div>
            </div>
          )
        )}
      </Form.Item>
    );
  }
}
export default withRouter(FormChildTest);
