import React, { PureComponent, Component } from "react";
import { withRouter } from "react-router-dom";
import GridLayout from "react-grid-layout";
import { Button, Form, message, Layout, Spin } from "antd";
import {
  submitSubmission,
  getFormComponent,
  getFormComponentByPath,
  getAllForms
} from "./redux/utils/operateSubmissionUtils";
import { getSubmissionData } from "../formData/redux/utils/getDataUtils";

import { connect } from "react-redux";
import HeaderBar from "../base/NavBar";
import PhoneInput from "./component/phoneInput";
import locationUtils from "../../utils/locationUtils";
import config from "../../config/config";
import Email from "./component/Email";
import Checkbox from "./component/checkboxInput/checkboxTest";
import DropDown from "./component/dropDown/dropDownTest";
import IdCard from "./component/idCard";
import SingleText from "./component/singleTextInput";
import RadioButtons from "./component/radioInput/radioTest";
import NumberInput from "./component/numberInput";
import DateInput from "./component/dateInput";
import TextArea from "./component/textArea";
import MultiDropDown from "./component/multiDropDown/multiDropDown";
import ImageUpload from "./component/imageUpload/imageUpload";
import ImageUploadMobile from "./component/imageUpload/imageUploadMobile";
import FormChildTest from "./component/formChildTest/formChildTest";
import PositionComponentMobile from "./component/getLocalPosition/positionComponentMobile";
import PositionComponentPC from "./component/getLocalPosition/component/positionComponentPC";

// import FileUpload from "./component/fileUpload";
import FileUpload from "./component/fileUpload/fileUpload";
import FileUploadMobile from "./component/fileUpload/fileUploadMobile";
import HandWrittenSignaturePc from "./component/handWrittenSignature/handWrittenSignaturePc";
import HandWrittenSignatureMobile from "./component/handWrittenSignature/handWrittenSignature";
import { initToken } from "../../utils/tokenUtils";
import { checkCustomValidate } from "../formBuilder/utils/customValication";
import { checkValueValidByType } from "../formBuilder/utils/checkComponentDataValidUtils";
import { getDataFromUrl } from "../../utils/locationUtils";
import Address from "./component/address";
/*
 * 手机端组件
 */
import { Toast } from "antd-mobile";
import DateInputMobile from "./component/mobile/dateInputMobile";
import AddressMobile from "./component/mobile/addressMobile";
import FormChildMobile from "./component/mobile/formChildMobile";
import CheckboxInput from "./component/checkboxInput";
import RadioButtonsMobile from "./component/radioInput/radioTestMobile";
import MultiDropDownMobile from "./component/mobile/multiDropDownMobile";
import DropDownMobile from "./component/mobile/dropDownMobile";
import mobileAdoptor from "../../utils/mobileAdoptor";

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class Submission extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tipVisibility: false,
      //
      formId: this.props.formId,
      formPath: this.props.formPath,
      formChildDataObj: {},
      currentLayout: null,
      customValicate: {
        // submitBtnObj: null,
        // layoutArray: []
      },
      pureFormComponents: [],
      addressesObj: {}, // 可能有多个地址
      showAddressErr: false,
      showFormChildErr: false,
      isSubmitted: false,
      errorResponseMsg: {}
    };
    this.renderFormComponent = this.renderFormComponent.bind(this);
  }

  componentDidMount() {
    const {
      getFormComponent,
      getFormComponentByPath,
      mountClassNameOnRoot,
      mobile = {}
    } = this.props;
    mobile.is && mountClassNameOnRoot(mobile.className);

    // initToken().then(res => {
    getFormComponent(this.state.formId);
    // getFormComponentByPath(this.state.formPath);
    // });
  }

  componentWillReceiveProps(nextProps) {
    const { formComponent } = nextProps;
    this.setState({ customValicate: this.props.validation });
    if (formComponent.components) {
      const pureFormComponents = formComponent.components.filter(item => {
        return item.type !== "Button";
      });
      this.setState({
        pureFormComponents
      });
      //渲染表单说明
      let formInfo = formComponent.formInfo;
      if (formInfo) {
        document.getElementById("submission-title").innerHTML = formInfo;
      } else {
        document.getElementById("submission-title").style.display = "none";
      }
    }
  }

  getFileUrl(key, fileUrl) {
    var newKey = key;
    let fileUrlItem = {};
    fileUrlItem[newKey] = fileUrl;
    this.setState(state => ({
      ...state,
      fileUrlList: { ...this.fileUrlList, ...fileUrlItem }
    }));
  }


  // 设置地址(解决只能获取单个数据)
  handleSetAddress = address => {
    const { id } = address;
    const newAdressesObj = this.state.addressesObj;
    newAdressesObj[id] = { ...address };
    this.setState({
      addressesObj: newAdressesObj
    });
  };

  _setAddressDataIntoValue(values) {
    const { addressesObj } = this.state;

    for (let addressKey in addressesObj) {
      values[addressKey] = { ...addressesObj[addressKey] };
    }
  }

  _setFileDataIntoValue(values) {
    for (let item in values) {
      for (let itemFile in this.state.fileUrlList) {
        if (itemFile === item) {
          values[item] = {
            name: values[item].file.name,
            originalName: values[item].file.name,
            size: values[item].file.size,
            storage: "base64",
            type: "",
            url: this.state.fileUrlList[item]
          };
        }
      }
    }
  }
  _setNumberValue(values) {
    this.props.formComponent.components.map(component => {
      if (values[component.key] === "") {
        delete values[component.key];
      }
      if (component.type === "NumberInput" && values.hasOwnProperty(component.key)) {
        values[component.key] = Number(values[component.key])
      }
    });
    return values;
  }

  _setDateTimeVaule(values) {
    this.props.formComponent.components.map(component => {
      if (
        component.type === "DateInput" &&
        values.hasOwnProperty(component.id) &&
        values[component.key] != void 0
      ) {
        // 统一将时间的毫秒都抹零 PC端和移动端传过来的时间类型不一样。。。
        if (values[component.key].constructor === Date) {
          values[component.key].setUTCMilliseconds(0);
        } else {
          values[component.key]._d.setUTCMilliseconds(0);
        }
      }
    });
    return values;
  }

  _setAddressValue(values) {
    this.props.formComponent.components.map(component => {
      if (
        component.type === "Address" &&
        values.hasOwnProperty(component.id) &&
        values[component.key] != void 0
      ) {
        // 如果地址字段为空 就不提交地址字段
        let { province, county, city, detail } = values[component.key];
        let address = [province, city, county, detail]
          .filter(item => item)
          .join("");
        if (address.trim() === "") {
          delete values[component.key];
        } else {
          values[component.key].xx = address;
        }
      }
    });
    return values;
  }

  // 是否有移动端的必填组件
  // 未判断子表单，因为组件暂不支持子表单中
  _hasMobileComponentAndRequired(components) {
    const mobileComponents = ["GetLocalPosition", "HandWrittenSignature"];
    let length = components.length;
    for (let i = 0; i < length; i++) {
      if (
        mobileComponents.includes(components[i].type) &&
        components[i].validate &&
        components[i].validate.required
      ) {
        return true;
      }
    }
    return false;
  }

  // 判断必填组件是否有数据
  _judgeRequiredIsEmpty(components, values) {
    let length = components.length;
    for (let i = 0; i < length; i++) {
      let component = components[i];
      if (
        component.type !== "CustomValue" &&
        component.validate &&
        component.validate.required &&
        !values[component.key]
      ) {
        return true;
      }
    }
    return false;
  }

  _iterateAllComponentToSetData(formComponentArray, customDataArray, values) {
    for (let i in values) {
      let currentComponent = formComponentArray.filter(item => {
        return item.id === i;
      })[0];
      currentComponent || (currentComponent = {});

      if (currentComponent.type === "FormChildTest") {
        let formChildDataArray = this.state.formChildDataObj[i];
        let resObj = {};

        values[i] = formChildDataArray;
        formChildDataArray.map(item => {
          for (let m in item) {
            if (resObj[m] == void 0) {
              resObj[m] = {
                type: currentComponent.label + "." + item[m].type,
                value: []
              };
            }
            if (item[m].data != void 0) {
              resObj[m].value.push(item[m].data);
            }
          }
        });

        for (let m in resObj) {
          customDataArray.push(resObj[m]);
        }
      } else {
        customDataArray.push({
          type: currentComponent.label,
          value: values[i]
        });
      }
    }
  }

  _checkComponentValid(err, formComponentArray) {
    const isMobile = this.props.mobile.is;
    if (err) {
      isMobile
        ? Toast.fail("提交失败，请检查表单信息是否填入正确!")
        : message.error("提交失败，请检查表单信息是否填入正确!");
      return false;
    }

    const { addressesObj, formChildDataObj } = this.state;

    let hasAddressErr = false;
    for (let addressKey in addressesObj) {
      if (addressesObj[addressKey].hasErr) {
        hasAddressErr = true;
      }
    }
    if (hasAddressErr) {
      isMobile
        ? Toast.fail("提交失败，请检查表单信息是否填入正确!")
        : message.error("提交失败，请检查表单信息是否填入正确!");
      this.setState({
        showAddressErr: true
      });
      return false;
    }

    let isFormChildErr = false;
    for (let key in formChildDataObj) {
      let currentComponent = formComponentArray.filter(item => {
        return item.key === key;
      })[0];
      let required =
        currentComponent.validate && currentComponent.validate.required;

      formChildDataObj[key].forEach(item => {
        for (let m in item) {
          if (required || (item[m].validate && item[m].validate.required)) {
            let checkData = null;
            switch (item[m].formType) {
              case "DateInput":
                checkData = item[m].data.time;
                break;
              case "HandWrittenSignature":
              case "FileUpload":
              case "ImageUpload":
              case "GetLocalPosition":
                let dataArr = item[m].data;
                checkData = dataArr.length === 0 ? null : "hasData";
                break;
              default:
                checkData = item[m].data;
                break;
            }

            if (checkData == void 0 || checkData === "") {
              isFormChildErr = true;
              item[m].hasErr = true;
            }
          }

          if (!isFormChildErr) {
            if (checkValueValidByType(item[m], item[m].data) === false) {
              isFormChildErr = true;
              item[m].hasErr = true;
            }
          }
        }
      });
    }

    if (isFormChildErr) {
      isMobile
        ? Toast.fail("提交失败，请检查表单信息是否填入正确!")
        : message.error("提交失败，请检查表单信息是否填入正确!");
      this.setState({
        showFormChildErr: true
      });
      return false;
    }
  }

  _changeErrorResponseData = componentId => {
    let errorResponseMsg = { ...this.state.errorResponseMsg };
    delete errorResponseMsg[componentId];
    this.setState(
      {
        errorResponseMsg
      }
    );
  };
  _setErrorResponseData = errorResponseData => {
    let errorResponseMsg = {};
    errorResponseData.infos.map(info => {
      if (errorResponseMsg[info.fieldName] != void 0) {
        errorResponseMsg[info.fieldName].push(info.msg);
      } else {
        errorResponseMsg[info.fieldName] = [info.msg];
      }
    });
    this.setState({
      errorResponseMsg,
      isSubmitted: false
    });
  };


  // 设置正确的子表单数据
  setCorrectFormChildData = (values, formChildDataObj) => {
    for (let key in values) {
      if (formChildDataObj.hasOwnProperty(key)) {
        values[key] = formChildDataObj[key];
      }
    }
  };

  // 设置隐藏组件的默认值(通过组件的API Name)
  setHiddenComponentsValue = (components, values) => {
    // const componentsNeedSplit = ["CheckboxInput", "MultiDropDown"];
    // components.forEach(component => {
    //   if (!component.isShow && component.key) {
    //     let value = getDataFromUrl(component.key);
    //     if (value) {
    //       if (componentsNeedSplit.includes(component.type)) {
    //         values[component.key] = value.split(",");
    //       } else {
    //         values[component.key] = value;
    //       }
    //     }
    //   }
    // });
    // 由于更换key引发未知原因， 需要过滤掉空数据
    // for (let key in values) {
    //   if (Array.isArray(values[key])) {
    //     values[key].length > 0 ? null : delete values[key];
    //   } else if (typeof values[key] === "object") {
    //     Object.keys(values[key]).length > 0 ? null : delete values[key];
    //   } else if (!values[key]) {
    //     delete values[key];
    //   }
    // }
  };

  handleSubmit = e => {
    e.preventDefault();
    const isMobile = this.props.mobile.is;

    if (!this.state.isSubmitted) {
      this.props.form.validateFields((err, values) => {
        let formComponentArray = this.props.formComponent.components;
        let customDataArray = [];


        if (this._checkComponentValid(err, formComponentArray) === false) {
          return;
        }

        this._setAddressDataIntoValue(values);
        this._setFileDataIntoValue(values);
        values = this._setNumberValue(values);
        values = this._setDateTimeVaule(values);
        values = this._setAddressValue(values);
        this.setCorrectFormChildData(values, this.state.formChildDataObj);
        this._iterateAllComponentToSetData(
          formComponentArray,
          customDataArray,
          values
        );

        let customValicate = this.props.formValidation;
        // console.log("values", values);
        // console.log("custom data", customDataArray);
        // console.log("custom valicate", customValicate.validate);

        // let customCheckResult = customValicate.validate.reduce(
        //   (result, validateStr) => {
        //     let res = checkCustomValidate(customDataArray, validateStr.name);
        //     return result === false ? false : res;
        //   },
        //   true
        // );

        //如果含有移动端组件且为必填，则阻止提交并警告
        if (
          this._hasMobileComponentAndRequired(formComponentArray) &&
          !isMobile
        ) {
          message.error("请在移动端进行表单提交!");
          return false;
        }

        // 判断必填项是否为空
        // if (this._judgeRequiredIsEmpty(formComponentArray, values)) {
        //   isMobile
        //     ? Toast.fail("校验不通过，请检查输入!")
        //     : message.error("校验不通过，请检查输入!");
        //     return false;
        // }

            this.setState({ isSubmitted: true,errorResponseMsg:{} });
            this.props
              .submitSubmission(this.state.formId, values,this.props.appid,this.props.extraProp)
              .then(response => {
                if(response.data.id != void 0){
                  isMobile
                    ? Toast.success("提交成功!")
                    : message.success("提交成功!");
                  setTimeout(() => {
                    let skipToSubmissionDataFlag = true;
                    this.props.actionFun(skipToSubmissionDataFlag);
                  }, 1000);
                }
              })
              .catch(error => {
                if (error.response && error.response.data.code === 9998) {
                  this._setErrorResponseData(error.response.data);
                  isMobile ? Toast.fail("提交失败") : message.error("提交失败");
                }else if(error.response && error.response.data.code == 2003){
                  // this.setState({
                  //   isSubmitted: false
                  // })
                  isMobile
                  ? Toast.fail(error.response.data.msg)
                  : message.error(error.response.data.msg);
                }
              });
      
      });
    }
  };

  renderFormComponent = (getFieldDecorator, components, errorResponseMsg) => {
    const { forms } = this.props;
    const { mobile } = this.props;

    return components
      .filter(item => {
        return item.isShow;
      })
      .map((item, i) => {
        switch (item.type) {
          case "EmailInput":
            return (
              <div
                key={item.key}
                style={{ zIndex: 300 - i }}
                id={item.key + "Dom"}
              >
                <Email
                  forms={forms}
                  handleSetComponentEvent={this.handleSetComponentEvent}
                  key={item.key}
                  getFieldDecorator={getFieldDecorator}
                  form={this.props.form}
                  item={item}
                  errorResponseMsg={errorResponseMsg[item.key]}
                  resetErrorMsg={this._changeErrorResponseData}
                />
              </div>
            );
          case "PhoneInput":
            return (
              <div
                key={item.key}
                style={{ zIndex: 300 - i }}
                id={item.key + "Dom"}
              >
                <PhoneInput
                  forms={forms}
                  handleSetComponentEvent={this.handleSetComponentEvent}
                  key={item.key}
                  getFieldDecorator={getFieldDecorator}
                  form={this.props.form}
                  item={item}
                  errorResponseMsg={errorResponseMsg[item.key]}
                  resetErrorMsg={this._changeErrorResponseData}
                />
              </div>
            );
          case "IdCardInput":
            return (
              <div
                key={item.key}
                style={{ zIndex: 300 - i }}
                id={item.key + "Dom"}
              >
                <IdCard
                  forms={forms}
                  handleSetComponentEvent={this.handleSetComponentEvent}
                  key={item.key}
                  getFieldDecorator={getFieldDecorator}
                  form={this.props.form}
                  item={item}
                  errorResponseMsg={errorResponseMsg[item.key]}
                  resetErrorMsg={this._changeErrorResponseData}
                />
              </div>
            );
          case "SingleText":
            return (
              <div
                key={item.key}
                style={{ zIndex: 300 - i }}
                id={item.key + "Dom"}
              >
                <SingleText
                  forms={forms}
                  handleSetComponentEvent={this.handleSetComponentEvent}
                  key={item.key}
                  form={this.props.form}
                  getFieldDecorator={getFieldDecorator}
                  item={item}
                  errorResponseMsg={errorResponseMsg[item.key]}
                  resetErrorMsg={this._changeErrorResponseData}
                />
              </div>
            );
          case "NumberInput":
            return (
              <div
                key={item.key}
                style={{ zIndex: 300 - i }}
                id={item.key + "Dom"}
              >
                <NumberInput
                  forms={forms}
                  handleSetComponentEvent={this.handleSetComponentEvent}
                  key={item.key}
                  getFieldDecorator={getFieldDecorator}
                  form={this.props.form}
                  item={item}
                  errorResponseMsg={errorResponseMsg[item.key]}
                  resetErrorMsg={this._changeErrorResponseData}
                />
              </div>
            );
          case "RadioButtons":
            return (
              <div
                key={item.key}
                style={{ zIndex: 300 - i }}
                id={item.key + "Dom"}
              >
                {mobile.is ? (
                  <RadioButtonsMobile
                    forms={forms}
                    handleSetComponentEvent={this.handleSetComponentEvent}
                    key={item.key}
                    getFieldDecorator={getFieldDecorator}
                    form={this.props.form}
                    item={item}
                  />
                ) : (
                  <RadioButtons
                    forms={forms}
                    handleSetComponentEvent={this.handleSetComponentEvent}
                    key={item.key}
                    getFieldDecorator={getFieldDecorator}
                    form={this.props.form}
                    item={item}
                  />
                )}
              </div>
            );
            break;
          case "CheckboxInput":
            return (
              <div
                key={item.key}
                style={{ zIndex: 300 - i }}
                id={item.key + "Dom"}
              >
                <Checkbox
                  forms={forms}
                  handleSetComponentEvent={this.handleSetComponentEvent}
                  key={item.key}
                  getFieldDecorator={getFieldDecorator}
                  form={this.props.form}
                  item={item}
                />
              </div>
            );
            break;
          case "DropDown":
            return (
              <div
                key={item.key}
                className="single-drop-down"
                style={{ zIndex: 300 - i }}
                id={item.key + "Dom"}
              >
                {mobile.is ? (
                  <DropDownMobile
                    forms={forms}
                    handleSetComponentEvent={this.handleSetComponentEvent}
                    key={item.key}
                    getFieldDecorator={getFieldDecorator}
                    form={this.props.form}
                    item={item}
                  />
                ) : (
                  <DropDown
                    forms={forms}
                    handleSetComponentEvent={this.handleSetComponentEvent}
                    key={item.key}
                    getFieldDecorator={getFieldDecorator}
                    form={this.props.form}
                    item={item}
                  />
                )}
              </div>
            );
          case "DateInput":
            return (
              <div
                key={item.key}
                style={{ zIndex: 300 - i }}
                id={item.key + "Dom"}
              >
                {mobile.is ? (
                  <DateInputMobile
                    forms={forms}
                    handleSetComponentEvent={this.handleSetComponentEvent}
                    getFieldDecorator={getFieldDecorator}
                    form={this.props.form}
                    item={item}
                  />
                ) : (
                  <DateInput
                    forms={forms}
                    handleSetComponentEvent={this.handleSetComponentEvent}
                    getFieldDecorator={getFieldDecorator}
                    form={this.props.form}
                    item={item}
                  />
                )}
              </div>
            );
          case "HandWrittenSignature":
            return (
              <div
                key={item.key}
                style={{ zIndex: 300 - i }}
                id={item.key + "Dom"}
              >
                {this.props.mobile.is ? (
                  <HandWrittenSignatureMobile
                    form={this.props.form}
                    getFileUrl={this.getFileUrl}
                    key={item.key}
                    getFieldDecorator={getFieldDecorator}
                    item={item}
                  />
                ) : (
                  <HandWrittenSignaturePc
                    getFileUrl={this.getFileUrl}
                    key={item.key}
                    getFieldDecorator={getFieldDecorator}
                    item={item}
                  />
                )}
              </div>
            );
          case "FileUpload":
            return (
              <div
                key={item.key}
                style={{ zIndex: 300 - i }}
                id={item.key + "Dom"}
              >
                {this.props.mobile.is ? (
                  <FileUploadMobile
                    forms={forms}
                    type="normal"
                    handleSetComponentEvent={this.handleSetComponentEvent}
                    getFileUrl={this.getFileUrl}
                    key={item.key}
                    getFieldDecorator={getFieldDecorator}
                    form={this.props.form}
                    item={item}
                  />
                ) : (
                  <FileUpload
                    forms={forms}
                    handleSetComponentEvent={this.handleSetComponentEvent}
                    getFileUrl={this.getFileUrl}
                    key={item.key}
                    getFieldDecorator={getFieldDecorator}
                    form={this.props.form}
                    item={item}
                  />
                )}
              </div>
            );
          case "TextArea":
            return (
              <div
                key={item.key}
                style={{ zIndex: 300 - i }}
                id={item.key + "Dom"}
              >
                <TextArea
                  forms={forms}
                  handleSetComponentEvent={this.handleSetComponentEvent}
                  key={item.key}
                  getFieldDecorator={getFieldDecorator}
                  form={this.props.form}
                  item={item}
                />
              </div>
            );
          case "MultiDropDown":
            return (
              <div
                key={item.key}
                style={{ zIndex: 300 - i }}
                className="multiple-drop-down"
                id={item.key + "Dom"}
              >
                {mobile.is ? (
                  <MultiDropDownMobile
                    forms={forms}
                    handleSetComponentEvent={this.handleSetComponentEvent}
                    key={item.key}
                    getFieldDecorator={getFieldDecorator}
                    form={this.props.form}
                    item={item}
                  />
                ) : (
                  <MultiDropDown
                    forms={forms}
                    handleSetComponentEvent={this.handleSetComponentEvent}
                    key={item.key}
                    getFieldDecorator={getFieldDecorator}
                    form={this.props.form}
                    item={item}
                  />
                )}
              </div>
            );
          case "ImageUpload":
            return (
              <div
                key={item.key}
                style={{ zIndex: 300 - i }}
                id={item.key + "Dom"}
              >
                {this.props.mobile.is ? (
                  <ImageUploadMobile
                    forms={forms}
                    handleSetComponentEvent={this.handleSetComponentEvent}
                    getFileUrl={this.getFileUrl}
                    key={item.key}
                    getFieldDecorator={getFieldDecorator}
                    form={this.props.form}
                    item={item}
                  />
                ) : (
                  <ImageUpload
                    forms={forms}
                    handleSetComponentEvent={this.handleSetComponentEvent}
                    getFileUrl={this.getFileUrl}
                    key={item.key}
                    getFieldDecorator={getFieldDecorator}
                    form={this.props.form}
                    item={item}
                  />
                )}
              </div>
            );
          case "GetLocalPosition":
            return (
              <div
                key={item.key}
                style={{ zIndex: 300 - i }}
                id={item.key + "Dom"}
              >
                {this.props.mobile.is ? (
                  <PositionComponentMobile
                    key={item.key}
                    getFieldDecorator={getFieldDecorator}
                    item={item}
                    mobile={this.props.mobile}
                  />
                ) : (
                  <PositionComponentPC
                    item={item}
                    getFieldDecorator={getFieldDecorator}
                  />
                )}
              </div>
            );
          case "FormChildTest":
            if (this.state.formChildDataObj[item.key] == void 0) {
              this.state.formChildDataObj[item.key] = [];
            }

            return (
              <div
                key={item.key}
                style={{ zIndex: 300 - i }}
                className="formChild-container"
                id={item.key + "Dom"}
              >
                {mobile.is ? (
                  <FormChildMobile
                    key={`${item.key}${i}`}
                    getFieldDecorator={getFieldDecorator}
                    item={item}
                    showFormChildErr={this.state.showFormChildErr}
                    forms={forms}
                    form={this.props.form}
                    handleSetComponentEvent={this.handleSetComponentEvent}
                    submitDataArray={this.state.formChildDataObj[item.key]}
                    handleSetFormChildData={this.handleSetFormChildData}
                    saveSubmitData={newArray => {
                      this.state.formChildDataObj[item.key] = newArray;
                      this.setState(state => ({
                        ...state,
                        formChildDataObj: this.state.formChildDataObj
                      }));
                    }}
                  />
                ) : (
                  <FormChildTest
                    key={`${item.key}${i}`}
                    getFieldDecorator={getFieldDecorator}
                    item={item}
                    showFormChildErr={this.state.showFormChildErr}
                    forms={forms}
                    form={this.props.form}
                    closeFormChildErr={() => {
                      this.setState({
                        showFormChildErr: false
                      });
                    }}
                    handleSetComponentEvent={this.handleSetComponentEvent}
                    submitDataArray={this.state.formChildDataObj[item.key]}
                    handleSetFormChildData={this.handleSetFormChildData}
                    saveSubmitData={newArray => {
                      this.state.formChildDataObj[item.key] = newArray;
                      this.setState(state => ({
                        ...state,
                        formChildDataObj: this.state.formChildDataObj
                      }));
                    }}
                  />
                )}
              </div>
            );
          case "Address": {
            return (
              <div
                key={item.key}
                style={{ zIndex: 300 - i }}
                id={item.key + "Dom"}
              >
                {mobile.is ? (
                  <AddressMobile
                    forms={forms}
                    handleSetAddress={this.handleSetAddress}
                    handleSetComponentEvent={this.handleSetComponentEvent}
                    key={item.key}
                    getFieldDecorator={getFieldDecorator}
                    form={this.props.form}
                    showAddressErr={this.state.showAddressErr}
                    address={this.state.addressesObj[item.id]}
                    item={item}
                  />
                ) : (
                  <Address
                    forms={forms}
                    handleSetAddress={this.handleSetAddress}
                    handleSetComponentEvent={this.handleSetComponentEvent}
                    key={item.key}
                    getFieldDecorator={getFieldDecorator}
                    form={this.props.form}
                    showAddressErr={this.state.showAddressErr}
                    address={this.state.addressesObj[item.id]}
                    item={item}
                  />
                )}
              </div>
            );
          }
          default:
            return <></>;
            break;
        }
      });
  };

  handleSetComponentEvent = (
    componentId,
    callback,
    currentIndex,
    currrentKey
  ) => {
    const pureFormComponents = this.state.pureFormComponents.map(component => {
      if (component.id === componentId) {
        if (component.callEventArr) {
          component.callEventArr.push(callback);
        } else {
          component.callEventArr = [callback];
        }
      } else if (component.element === "FormChildTest" && currrentKey) {
        // 如果关联的是子组件则为子组件注册事件
        let temp = this.state.formChildDataObj[currrentKey][currentIndex];
        if (temp[componentId].callEventArr) {
          temp[componentId].callEventArr.push(callback);
        } else {
          temp[componentId].callEventArr = [callback];
        }
        this.setState();
      }
      return component;
    });

    this.setState({
      pureFormComponents
    });
  };

  // 深度克隆（简）
  handleDeepClone = target => {
    return JSON.parse(JSON.stringify(target));
  };

  // 设置子表单联动字段的值
  // id -> 联动子表单id  formchildData -> 联动数据
  handleSetFormChildData = (element, formchildData, linkData, that) => {
    let { formChildDataObj } = this.state;
    const { id, key } = element;
    const { values } = element;
    let rowTemplate = {};
    values.forEach(item => {
      rowTemplate[item.key] = {
        type: item.label,
        formType: item.type,
        data: null,
        values:
          item.data &&
          (Array.isArray(item.data.values) ? item.data.values : []),
        validate: item.validate,
        component: item
      };
      if (!rowTemplate[item.key].values) {
        rowTemplate[item.key].values = Array.isArray(item.values)
          ? item.values
          : [];
      }
      // 添加事件回调
      // if(Array.isArray(formChildDataObj[id]) && formChildDataObj[id].length > 0 && formChildDataObj[id][0][item.key].callEventArr) {
      //   rowTemplate[item.key].callEventArr = formChildDataObj[id][0][item.key].callEventArr;
      // }
    });
    // 如果没找到对应数据 则返回默认值
    if (formchildData === null) {
      formChildDataObj[key] = [rowTemplate]; //清空对应id子表单的数据
      this.setState({
        formChildDataObj
      });
      return;
    }
    formChildDataObj[key] = []; //清空对应id子表单的数据
    // 根据数据显示
    formchildData.forEach((item, index) => {
      // 替换关联数据
      let data = this.handleDeepClone(rowTemplate);
      // 循环取得关联数据的每项数据
      linkData.forEach(link => {
        // 将现有字段对应的关联数据进行替换，data为关联的数据
        data[link.id] = {
          ...data[link.id],
          data: item[link.linkOptionId] ? item[link.linkOptionId].data : null,
          dropDownOptions: item[link.linkOptionId]
            ? item[link.linkOptionId].data
            : null
        };
        rowTemplate[link.id].callEventArr &&
          (data[link.id].callEventArr = rowTemplate[link.id].callEventArr);
      });
      // id子表单的第idnex项数据替换
      formChildDataObj[key][index] = data;
    });

    this.setState(
      {
        formChildDataObj
      },
      () => {
        that._reSetDataLinkFormChildItem();
      }
    );
  };

  render() {
    const { formComponent, form, mobile = {} } = this.props;
    const { getFieldDecorator } = form;
    let { pureFormComponents, currentLayout, errorResponseMsg } = this.state;
    let layout = null;

    if (currentLayout == void 0) {
      layout = pureFormComponents
        .filter(item => {
          return item.isShow !== false;
        })
        .map(item => {
          return {
            ...item.layout,
            isShow: true
          };
        });
    } else {
      layout = currentLayout.map(item => {
        return {
          ...item,
          static: true,
          isShow: item.isShow
        };
      });
    }

    let submitBtnObj = this.props.formComponent.components.filter(
      component => component.type === "Button"
    )[0];
    return (
      <>
        <Spin spinning={this.state.isSubmitted}>
          {mobile.is ? null : (
            <HeaderBar
              backCallback={() => {
                let skipToSubmissionDataFlag = true;
                this.props.actionFun(skipToSubmissionDataFlag);
              }}
              name={formComponent.name}
              isShowBtn={false}
              isShowExtraTitle={false}
            />
          )}
          <div className={"formBuilder-Submission"}>
            <div className="Content">
              <div className="submission-title">{formComponent.name}</div>
              {this.props.formComponent.formInfo != "" ? (
                <div
                  className="submission-formInfo"
                  id="submission-title"
                ></div>
              ) : (
                ""
              )}
              <div className="form-layout">
                <Form onSubmit={this.handleSubmit}>
                  {mobile.is ? (
                    <>
                      {this.renderFormComponent(
                        getFieldDecorator,
                        pureFormComponents,
                        errorResponseMsg
                      )}
                    </>
                  ) : (
                    <GridLayout
                      className="layout"
                      layout={layout}
                      cols={12}
                      rowHeight={22}
                      width={870}
                      onLayoutChange={layout => {
                        this.setState({ currentLayout: layout });
                      }}
                    >
                      {this.renderFormComponent(
                        getFieldDecorator,
                        pureFormComponents,
                        errorResponseMsg
                      )}
                    </GridLayout>
                  )}
                  {submitBtnObj == void 0 ? (
                    <Form.Item
                      style={{
                        width: "100%",
                        textAlign: "center",
                        marginTop: 80
                      }}
                    >
                      <div className="SubmitBtn">
                        <Button
                          block={!!mobile.is}
                          htmlType="submit"
                          type="primary"
                          // size={submitBtnObj.buttonSize}
                        >
                          提交
                        </Button>
                      </div>
                    </Form.Item>
                  ) : (
                    <Form.Item
                      style={{
                        width: "100%",
                        textAlign: "center",
                        marginTop: 80
                      }}
                    >
                      <div className="SubmitBtn">
                        <Button
                          block={!!mobile.is}
                          htmlType="submit"
                          type={submitBtnObj.buttonStyle}
                          size={submitBtnObj.buttonSize}
                        >
                          {submitBtnObj.label}
                        </Button>
                      </div>
                    </Form.Item>
                  )}
                </Form>
              </div>
            </div>
          </div>
        </Spin>
      </>
    );
  }
}

const SubmissionForm = Form.create()(Submission);

export default connect(
  store => ({
    forms: store.survey.forms,
    formComponent: store.survey.formComponent,
    childFormComponent: store.survey.childFormComponent,
    formValidation: store.survey.formValidation
  }),
  {
    getSubmissionData,
    submitSubmission,
    getFormComponent,
    getFormComponentByPath
  }
)(withRouter(mobileAdoptor.data(SubmissionForm)));
