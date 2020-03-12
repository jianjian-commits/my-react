import React from "react";
import { Input, Form } from "antd";
import {
  getFormAllSubmission,
  filterSubmissionData,
  compareEqualArray,
  getResIndexArray
} from "../../utils/dataLinkUtils";
import LabelUtils from "../../../formBuilder/preview/component/formItemDoms/utils/LabelUtils";
import locale from "antd/lib/date-picker/locale/zh_CN";
import Address from "./formChildComponents";
import { checkValueValidByType } from "../../../formBuilder/utils/checkComponentDataValidUtils";
import FileUpload from "./formChildComponents";
import ImageUpload from "./formChildComponents";
import moment from "moment";
// 子组件
import { Button as MobileButton } from "antd";
import { DatePicker, List } from "antd-mobile";
import ChildItemTemplate from "./formChildComponents/ChildItemTemplate";
import ImageUploadMobile from "../imageUpload/imageUploadMobile";
import AddressMobile from "./addressMobile";
import FileUploadMobile from "../fileUpload/fileUploadMobile";
import DropDownMobile from "./dropDownMobile";
import MultiDropDownMobile from "./multiDropDownMobile";
import { getSelection } from "../../utils/filterData";

import CheckboxInput from "../checkboxInput/checkboxTestItem";
import RadioButtons from "../radioInput/radioTestItem";
export default class FormChildTest extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hoverFormChildIndex: -1,
      fileData: {
        name: "",
        url: ""
      },
      refesh: true,
      formChildTitle: []
    };
    this.handleAddRow = this.handleAddRow.bind(this);
    this.renderFormChild = this.renderFormChild.bind(this);
  }

  // 重新计算子字段的数据联动
  _reSetDataLinkFormChildItem = () => {
    let { item, handleSetComponentEvent, submitDataArray } = this.props;
    let values = item.values;
    let newArray = [];

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
              validate: item.validate,
              hasErr: false,
              data: child[item.key].data
            };
            break;
          case "DateInput":
            result[item.key] = {
              type: item.label,
              formType: item.type,
              validate: item.validate,
              hasErr: false,
              data: child[item.key].data
            };
            break;
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
          case "DropDown": {
            let dropDownOptions = [];
            let values = item.data.values;
            if (values.type == "otherFormData") {
              // 子表单关联其他数据
              getSelection(values.formId, values.optionId).then(res => {
                result[item.key].dropDownOptions = res.map(data => data.value);
                this.setState({
                  refesh: !this.state.refesh
                });
              });
            } else if (Array.isArray(child[item.key].data)) {
              dropDownOptions = child[item.key].data;
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
          getFormAllSubmission(linkFormId).then(submissions => {
            // 根据联动表单的组件id 得到对应所有数据
            let dataArr = filterSubmissionData(submissions, linkComponentId);
            if (item.type == "DropDown" || item.type == "MultiDropDown") {
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

  _buildSubmitResultSetState = () => {
    let { item, handleSetComponentEvent } = this.props;
    let values = item.values;
    let result = {};
    let newArray = this.props.submitDataArray;

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
            label: item.label,
            data: item.defaultValue || "",
            validate: item.validate,
            hasErr: false
          };
          break;
        case "DateInput":
          result[item.key] = {
            type: item.label,
            formType: item.type,
            validate: item.validate,
            hasErr: false,
            data: null
          };
          break;
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
          if (values.type == "otherFormData") {
            // 子表单关联其他数据
            getSelection(values.formId, values.optionId).then(res => {
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
            label: item.label,
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

      result.isShow = true;

      // 根据dataLink的数据进行注册监听
      if (item.data && item.data.values && item.data.values.linkFormId) {
        const {
          conditionId, //联动条件 id(当前表单)
          linkComponentId, //联动条件 id(联动表单)
          linkDataId, //联动数据 id(联动表单)
          linkFormId //联动表单 id
        } = item.data.values;
        // 得到id表单的所有提交数据
        getFormAllSubmission(linkFormId).then(submissions => {
          // 根据联动表单的组件id 得到对应所有数据
          let dataArr = filterSubmissionData(submissions, linkComponentId);
          if (item.type == "DropDown" || item.type == "MultiDropDown") {
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
    result.isShow = true;
    newArray.push(result);

    this.props.saveSubmitData(newArray);
  };

  handleAddRow() {
    this.props.submitDataArray.forEach(item => (item.isShow = false));
    this._buildSubmitResultSetState();
  }

  getRightDate = value => {
    if (value && value.getFullYear) {
      let year = value.getFullYear();
      let month = value.getMonth() + 1;
      let day = value.getDate();
      let hours = value.getHours();
      let minutes = value.getMinutes();
      let str = year;
      if (month < 10) {
        str = str + "-0" + month;
      } else {
        str = str + "-" + month;
      }
      if (day < 10) {
        str = str + "-0" + day;
      } else {
        str = str + "-" + day;
      }
      if (hours < 10) {
        str = str + " 0" + hours;
      } else {
        str = str + " " + hours;
      }
      if (minutes < 10) {
        str = str + ":0" + minutes;
      } else {
        str = str + ":" + minutes;
      }
      return str;
    } else {
      return value;
    }
  };

  componentDidMount() {
    this._buildSubmitResultSetState();
    const {
      form,
      item,
      handleSetComponentEvent,
      handleSetFormChildData
    } = this.props;
    const { data } = item;
    // 是否为数据联动
    if (data && data.type == "DataLinkage" && data.values.linkFormId) {
      const {
        conditionId, //联动条件 id(当前表单)
        linkComponentId, //联动条件 id(联动表单)
        linkDataId, //联动数据 id(联动表单)
        linkFormId, //联动表单 id
        formChildData //子表单联动数据
      } = data.values;
      // 得到id表单的所有提交数据
      getFormAllSubmission(linkFormId).then(submissions => {
        // 根据联动表单的组件id 得到对应所有数据
        let dataArr = filterSubmissionData(submissions, linkComponentId);
        // 为需要联动的表单添加 change事件
        handleSetComponentEvent(conditionId, value => {
          let index = -1;
          // 比较dataArr中是否有与value相同的值，有的话返回对应的idnex
          // 如果change数据为数组 则进行深度比较
          if (value instanceof Array) {
            index = compareEqualArray(dataArr, value);
          } else {
            index = dataArr.indexOf(value);
          }

          // console.log(item, data, formChildData);
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
  };

  handleItemChange = (value, formChildObj) => {
    const { callEventArr } = formChildObj;
    if (callEventArr) {
      callEventArr.forEach(fnc => {
        fnc && fnc(value, this);
      });
    }
  };

  renderFormChild(formChildObj) {
    let resultArray = [];
    for (let key in formChildObj) {
      let item = formChildObj[key];

      let className = item.hasErr
        ? "componentContent has-user-error"
        : "componentContent";

      switch (item.formType) {
        case "NumberInput":
        case "PhoneInput":
          resultArray.push(
            <li key={key} className={className}>
              <div
                className={
                  item.validate.required
                    ? "formchild-item-title-required"
                    : "formchild-item-title"
                }
              >
                {item.type}
              </div>
              <Input
                className="form-input"
                type="number"
                onChange={e => {
                  let { value } = e.target;
                  item.data = value;

                  checkValueValidByType(item, value)
                    ? (item.hasErr = false)
                    : (item.hasErr = true);

                  this.setState({
                    refesh: !this.state.refesh
                  });

                  this.handleItemChange(value, item);
                }}
                value={item.data}
              />
              {item.hasErr ? (
                item.data == "" || item.data == void 0 ? (
                  <span className="item-error-info">此项为必填项</span>
                ) : (
                  <span className="item-error-info">此项格式不正确</span>
                )
              ) : (
                <></>
              )}
            </li>
          );
          break;
        case "SingleText":
        case "TextArea":
        case "EmailInput":
        case "IdCardInput":
          resultArray.push(
            <li key={key} className={className}>
              <div
                className={
                  item.validate.required
                    ? "formchild-item-title-required"
                    : "formchild-item-title"
                }
              >
                {item.type}
              </div>
              <Input
                className="form-input"
                onChange={e => {
                  let { value } = e.target;
                  item.data = value;

                  checkValueValidByType(item, value)
                    ? (item.hasErr = false)
                    : (item.hasErr = true);

                  this.setState({
                    refesh: !this.state.refesh
                  });

                  this.handleItemChange(value, item);
                }}
                value={item.data}
              />
              {item.hasErr ? (
                item.data == "" || item.data == void 0 ? (
                  <span className="item-error-info">此项为必填项</span>
                ) : (
                  <span className="item-error-info">此项格式不正确</span>
                )
              ) : (
                <></>
              )}
            </li>
          );
          break;
        case "MultiDropDown": {
          resultArray.push(
            <li key={key} className={className}>
              <div
                className={
                  item.validate.required
                    ? "formchild-item-title-required"
                    : "formchild-item-title"
                }
              >
                {item.type}
              </div>
              <MultiDropDownMobile
                isChild={true}
                isShowTitle={false}
                onChange={value => {
                  item.data = value;

                  checkValueValidByType(item, value)
                    ? (item.hasErr = false)
                    : (item.hasErr = true);

                  this.handleItemChange(value, item);

                  this.setState({
                    refesh: !this.state.refesh
                  });
                }}
                value={item.data || []}
                item={item}
              ></MultiDropDownMobile>
              {item.hasErr ? (
                item.data == void 0 || item.data.length == 0 ? (
                  <span className="item-error-info">此项为必填项</span>
                ) : (
                  <span className="item-error-info">此项格式不正确</span>
                )
              ) : (
                <></>
              )}
            </li>
          );
          break;
        }
        case "CheckboxInput": {
          let dropDownOptions = [];
          let values = item.values;
          if (values.type == "otherFormData") {
            console.warn("暂不支持子表单关联其他数据");
          } else {
            dropDownOptions = Array.isArray(values) ? values : [];
          }
          resultArray.push(
            <li key={key} className={className}>
              <div
                className={
                  item.validate.required
                    ? "formchild-item-title-required"
                    : "formchild-item-title"
                }
              >
                {item.type}
              </div>
              <CheckboxInput
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
                }}
              />
              {item.hasErr ? (
                item.data.length == 0 || item.data == void 0 ? (
                  <span className="item-error-info">此项为必填项</span>
                ) : (
                  <span className="item-error-info">此项格式不正确</span>
                )
              ) : (
                <></>
              )}
              {/* <Checkbox.Group
                onChange={value => {
                  item.data = value;

                  checkValueValidByType(item, value)
                    ? (item.hasErr = false)
                    : (item.hasErr = true);

                  this.setState(state => ({
                    ...state,
                    refesh: !this.state.refesh
                  }));
                }}
              >
                {dropDownOptions.map((item, index) => (
                  <Checkbox
                    key={index}
                    className="formchild-checkbox"
                    value={typeof item == "object" ? item.value : item}
                  >
                    {typeof item == "object" ? item.value : item}
                  </Checkbox>
                ))}
              </Checkbox.Group> */}
            </li>
          );
          break;
        }
        case "RadioButtons": {
          resultArray.push(
            <li key={key} className={className}>
              <div
                className={
                  item.validate.required
                    ? "formchild-item-title-required"
                    : "formchild-item-title"
                }
              >
                {item.type}
              </div>
              <RadioButtons
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
                }}
              />
              {item.hasErr ? (
                <span className="item-error-info">此项为必填项</span>
              ) : (
                <></>
              )}
              {/* <Radio.Group
                onChange={e => {
                  let { value } = e.target;
                  item.data = value;

                  checkValueValidByType(item, value)
                    ? (item.hasErr = false)
                    : (item.hasErr = true);

                  this.setState(state => ({
                    ...state,
                    refesh: !this.state.refesh
                  }));
                }}
              >
                {item.values.map((item, index) => (
                  <Radio
                    className="formchild-radio"
                    key={index}
                    value={item.label}
                  >
                    {item.label}
                  </Radio>
                ))}
              </Radio.Group> */}
            </li>
          );
          break;
        }
        case "DropDown":
          {
            resultArray.push(
              <li key={key} className={className}>
                {/* <div className="formchild-item-title">{item.type}</div> */}
                <div
                  className={
                    item.validate.required
                      ? "formchild-item-title-required"
                      : "formchild-item-title"
                  }
                >
                  {item.type}
                </div>
                <DropDownMobile
                  isChild={true}
                  isShowTitle={false}
                  onChange={value => {
                    item.data = value;

                    checkValueValidByType(item, value)
                      ? (item.hasErr = false)
                      : (item.hasErr = true);

                    this.handleItemChange(value, item);

                    this.setState({
                      refesh: !this.state.refesh
                    });
                  }}
                  item={item}
                  value={item.data}
                ></DropDownMobile>
                {item.hasErr ? (
                  <span className="item-error-info">此项为必填项</span>
                ) : (
                  <></>
                )}
              </li>
            );
          }
          break;
        case "FileUpload":
          resultArray.push(
            <li key={key} className={className}>
              {/* <div className={item.validate.required ? "formchild-item-title-required": "formchild-item-title"}>{item.type}</div> */}
              <div
                className={
                  item.validate.required
                    ? "formchild-item-title-required"
                    : "formchild-item-title"
                }
              >
                {item.type}
              </div>
              <FileUploadMobile
                item={item.component}
                isShowTitle={false}
                isChild={true}
                onChange={data => {
                  item.data = data;
                  checkValueValidByType(item, data)
                    ? (item.hasErr = false)
                    : (item.hasErr = true);
                }}
              />
              {item.hasErr ? (
                <span className="item-error-info">此项为必填项</span>
              ) : (
                <></>
              )}
            </li>
          );
          break;
        case "ImageUpload":
          resultArray.push(
            <li key={key} className={className}>
              <div
                className={
                  item.validate.required
                    ? "formchild-item-title-required"
                    : "formchild-item-title"
                }
              >
                {item.type}
              </div>
              <ImageUploadMobile
                // getFileUrl={this.getFileUrl}
                isShowTitle={false}
                isChild={true}
                item={item.component}
                onChange={uploadImgList => {
                  item.data = uploadImgList;
                }}
              />
              {item.hasErr ? (
                <span className="item-error-info">此项为必填项</span>
              ) : (
                <></>
              )}
            </li>
          );
          break;
        case "DateInput":
          let currentDate = "";
          if (typeof item.data == "string") {
            currentDate = item.data;
          } else if (item.data) {
            currentDate = item.data.time;
          }
          // currentDate = currentDate && new Date(currentDate).toLocaleString();
          item.data = {
            time: currentDate
          };
          resultArray.push(
            <li key={key} className={className}>
              <div
                className={
                  item.validate.required
                    ? "formchild-item-title-required"
                    : "formchild-item-title"
                }
              >
                {item.type}
              </div>
              <DatePicker
                showTime
                extra={item.data.time || "请选择时间/日期"}
                onChange={value => {
                  item.data.time = this.getRightDate(value);
                  checkValueValidByType(item, value)
                    ? (item.hasErr = false)
                    : (item.hasErr = true);
                  this.setState({
                    refesh: !this.state.refesh
                  });
                }}
              >
                <List.Item
                  className="mobile-list-default"
                  arrow="down"
                ></List.Item>
              </DatePicker>
              {item.hasErr ? (
                <span className="item-error-info">此项为必填项</span>
              ) : (
                <></>
              )}
            </li>
          );
          break;
        case "Address":
          resultArray.push(
            <li key={key} className={className}>
              <div
                className={
                  item.validate.required
                    ? "formchild-item-title-required"
                    : "formchild-item-title"
                }
              >
                {item.type}
              </div>
              <AddressMobile
                isShowTitle={false}
                handleSetAddress={addressData => {
                  item.address = {
                    ...item.address,
                    ...addressData
                  };
                  item.data = item.address;
                  this.setState(state => ({
                    refesh: !this.state.refesh
                  }));
                }}
                isChild={true}
                address={item.data}
                item={item}
              />
              {item.hasErr ? (
                <span className="item-error-info">此项为必填项</span>
              ) : (
                <></>
              )}
            </li>
          );
          break;
        case "GetLocalPosition":
        case "HandWrittenSignature":
          resultArray.push(
            <li key={key} className={className}>
              <Input placeholder="请在手机上查看" disabled={true} />
            </li>
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
      result[item.key].data = "";
      result[item.key].dropDownOptions = selections;
      // 解决当newArray为空时 输入内容列表会清空
      // newArray ? this.props.saveSubmitData(newArray) : null;
    } else {
      result[item.key].values = [];
      result[item.key].data = "";
      result[item.key].dropDownOptions = [];
      // newArray ? this.props.saveSubmitData(newArray) : null;
    }
    this.handleItemChange(undefined, result[item.key]);
  }

  render() {
    const {
      getFieldDecorator,
      item,
      showFormChildErr,
      submitDataArray,
      saveSubmitData
    } = this.props;
    let { values } = item;

    return (
      <Form.Item label={<LabelUtils data={item} />}>
        {getFieldDecorator(item.key)(
          <div className="form-child-mobile">
            {submitDataArray.map((formItem, index) => {
              let hasItemErr = false;

              for (let m in formItem) {
                let item = formItem[m];

                if (typeof item == "object") {
                  if (item.hasErr == true) {
                    hasItemErr = true;
                  }
                }
              }

              return (
                <>
                  <ChildItemTemplate
                    key={index}
                    formItem={formItem}
                    submitDataArray={submitDataArray}
                    renderFormChild={this.renderFormChild}
                    saveSubmitData={saveSubmitData}
                    currentIndex={index}
                    hasItemErr={hasItemErr}
                  />

                  {hasItemErr ? (
                    <span className={"form-child-errInfo"}>
                      {" "}
                      存在不符合规范的值{" "}
                    </span>
                  ) : (
                    <></>
                  )}
                </>
              );
            })}

            <MobileButton
              onClick={this.handleAddRow}
              className="add-formchild-btn"
              icon="plus"
              size="small"
            >
              添加记录
            </MobileButton>
          </div>
        )}
      </Form.Item>
    );
  }
}
