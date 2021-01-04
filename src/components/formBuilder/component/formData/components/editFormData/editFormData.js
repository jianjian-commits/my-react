import React, { Component } from "react";
import GridLayout from "react-grid-layout";
import { Button, Form, message, Spin, Breadcrumb } from "antd";
import axios from 'axios';
import { history } from "../../../../../../store";
import config from '../../../../config/config'
import { modifySubmissionDetail } from "../../redux/utils/getDataUtils";
import moment from "moment";
import { utcDate } from '../../../../utils/coverTimeUtils'

import { connect } from "react-redux";
import HeaderBar from "../../../base/NavBar";
import PhoneInput from "../../../submission/component/phoneInput";
import Email from "../../../submission/component/Email";

import Checkbox from "../../../submission/component/checkboxInput/checkboxTest";
import DropDown from "../../../submission/component/dropDown/dropDownTest";
import IdCard from "../../../submission/component/idCard";
import SingleText from "../../../submission/component/singleTextInput";
import RadioButtons from "../../../submission/component/radioInput/radioTest";
import NumberInput from "../../../submission/component/numberInput";
import DateInput from "../../../submission/component/dateInput";
import TextArea from "../../../submission/component/textArea";
import MultiDropDown from "../../../submission/component/multiDropDown/multiDropDown";
import ImageUpload from "../../../submission/component/imageUpload/imageUpload";
import ImageUploadMobile from "../../../submission/component/imageUpload/imageUploadMobile";
import FormChildTest from "../../../submission/component/formChildTest/formChildTest";
import PositionComponentMobile from "../../../submission/component/getLocalPosition/positionComponentMobile";
import PositionComponentPC from "../../../submission/component/getLocalPosition/component/positionComponentPC";

import Address from "../../../submission/component/address";
import FileUpload from "../../../submission/component/fileUpload/fileUpload";
import FileUploadMobile from "../../../submission/component/fileUpload/fileUploadMobile";
import HandWrittenSignaturePc from "../../../submission/component/handWrittenSignature/handWrittenSignaturePc";
import HandWrittenSignatureMobile from "../../../submission/component/handWrittenSignature/handWrittenSignature";
import { checkCustomValidate } from "../../../formBuilder/utils/customValication";
import { checkValueValidByType } from "../../../formBuilder/utils/checkComponentDataValidUtils";

/*
 * 手机端组件
 */
import { Toast } from "antd-mobile";
import DateInputMobile from "../../../submission/component/mobile/dateInputMobile";
import AddressMobile from "../../../submission/component/mobile/addressMobile";
import FormChildMobile from "../../../submission/component/mobile/formChildMobile";
import RadioButtonsMobile from "../../../submission/component/radioInput/radioTestMobile";
import MultiDropDownMobile from "../../../submission/component/mobile/multiDropDownMobile";
import DropDownMobile from "../../../submission/component/mobile/dropDownMobile";
import PureTime from "../../../submission/component/pureTime";
import PureDate from "../../../submission/component/pureDate";

class EditFormData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tipVisibility: false,
      formId: props.formId,
      submissionId: props.submissionId,
      formChildDataObj: {},
      currentLayout: null,
      customValicate: {
        submitBtnObj: null,
        layoutArray: []
      },
      pureFormComponents: [],
      addressesObj: {}, // 可能有多个地址
      showAddressErr: false,
      showFormChildErr: false,
      currentPage: 1,
      pageSize: 10,
      isSubmitted: false,
      initflag : true,
      initPureFormComponents: true,
      errorResponseMsg: {},
      currentForm: { components: [], name: "" },
      formDetail: [],
      oldExtraProp: {},
      isChangeLayout: false
    };
    this.renderFormComponent = this.renderFormComponent.bind(this);
  }

  componentDidMount() {

    const {
      mountClassNameOnRoot,
      mobile = {}
    } = this.props;
    mobile.is && mountClassNameOnRoot(mobile.className);
          const { formId, submissionId } = this.state;
          axios.get(config.apiUrl + `/form/${formId}`,
          {
            headers: {
              "isDataPage": true,
            }
          }).then(res => {
            let currentForm = res.data;
            const pureFormComponents = currentForm.components.filter(item => {
              return item.type !== "Button";
            });
            let formulaArray = currentForm.components.reduce((resultArray, item) => {
              if (item.type == "Button") {
                return resultArray
              }
      
              if (item.type == "FormChildTest") {
                item.values.forEach((childItem) => {
                  if (childItem.data && childItem.data.type == "EditFormula") {
                    childItem.parentKey = item.key;
                    resultArray.push(childItem)
                  }
                })
              } else {
                if (item.data && item.data.type == "EditFormula") {
                  resultArray.push(item)
                }
              }
      
              return resultArray
            }, []);
            axios
              .get(
                config.apiUrl + `/submission/${submissionId}`,
              )
              .then(res => {
                let oldExtraProp = res.data.extraProp;
                let formDetail = res.data.data;
                let formChildDataObj = {};
                pureFormComponents.filter(item => {
                  if (item.type == "FormChildTest" && formDetail[item.key]) {
                    formChildDataObj[item.key] = formDetail[item.key].map(item =>{
                      item.isShow = false;
                      return item
                    });
                  }
                });
                this.setState({
                  currentForm,
                  formDetail,
                  pureFormComponents,
                  formChildDataObj,
                  oldExtraProp,
                  initflag: false,
                  isSubmitted: false,
                  formulaArray: formulaArray,
                  isSetFormulaData: true
                })
              });
          }).catch((error) => {
            console.log(error);
            this.setState({
              isSubmitted: false
            })
            message.error("获取数据失败")
          });
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

  _checkoutFormChildData() { }

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
    this.state.pureFormComponents.map(component => {
      if (values[component.key] === "") {
        delete values[component.key];
      }
      if (component.type === "NumberInput" && values.hasOwnProperty(component.key)) {
        values[component.key] = Number(values[component.key])
      }
      if(Number.isNaN(values[component.key])){
        delete values[component.key];
      }
    });
    return values;
  }

  _setDateTimeVaule(values, components = this.state.pureFormComponents) {
    components.map(component => {
      let type = component.type;
      if (
        values.hasOwnProperty(component.key) &&
        values[component.key] != void 0
      ) {
        if (
          type === "DateInput" ||
          type === "PureDate" ||
          type === "PureTime"
        ) {
          // 统一将时间的毫秒都抹零 PC端和移动端传过来的时间类型不一样。。。
          if (values[component.key].constructor === Date) {
            values[component.key] = utcDate(new Date(values[component.key]), type);
          } else {
            values[component.key] = utcDate(values[component.key], type);
          }
        }

      }
    });
    return values;
  }

  _setAddressValue(values) {
    this.state.pureFormComponents.map(component => {
      if (
        component.type === "Address" &&
        values.hasOwnProperty(component.key) &&
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
          values[component.key].completeAddress = address;
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


  _iterateAllComponentToSetData(formComponentArray, customDataArray, values) {
    for (let i in values) {
      let currentComponent = formComponentArray.filter(item => {
        return item.key == i;
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

  _resetFormChildErrorMsg(errorMsg){
    const { formChildDataObj } = this.state;
    const {formChildkey, fieldKey, value, msg} = errorMsg;
    formChildDataObj[formChildkey].map(item => {
        if (value === String(item[fieldKey].data)) {
          item[fieldKey].hasErr = true;
        }
      });
    this.setState({
      showFormChildErr: true
    });
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
        return item.key == key;
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
              case "FileUpload":
              case "ImageUpload":
                let dataArr = item[m].data;
                checkData = dataArr.length == 0 ? null : "hasData";
                break;
              default:
                checkData = item[m].data;
                break;
            }

            if (checkData == void 0 || checkData == "") {
              isFormChildErr = true;
              item[m].hasErr = true;
            }
          }

          if (!isFormChildErr) {
            if (checkValueValidByType(item[m], item[m].data) == false) {
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
  _isFormChildComponent(key){
    return  this.state.pureFormComponents.filter(component =>component.type === "FormChildTest")
    .map(component => component.key)
    .some(componentKey => componentKey === key)
    
  }
    // 设置正确的子表单数据
  setCorrectFormChildData = (values, formChildDataObj) => {
    let date = new Date((new Date()).setUTCMilliseconds(0));
    let currentTimeZoneOffsetInHours = date.getTimezoneOffset() / 60;
    date.setHours(date.getHours() + currentTimeZoneOffsetInHours);

    for (let key in values) {
      if (formChildDataObj.hasOwnProperty(key)) {
        values[key] = formChildDataObj[key];
      }
      if (this._isFormChildComponent(key)) {
        values[key].forEach((data, index) => {
          for (let k in data) {
            let type = data[k].formType;
            if (data[k].autoInput) {
              if (type === "PureDate") {
                data[k].data = moment(date).format("YYYY-MM-DD")
              }
              if (type === "PureTime") {
                data[k].data = moment(date).format("HH:mm:ss.SSS")
              }
              if (type === "DateInput") {
                let dateString = moment(date).format();
                data[k].data = dateString.substring(dateString.indexOf("+"), -1);
              }
            }
          }
        });
      }
    }
  };

  handleSubmit = e => {
    e.preventDefault();
    const isMobile = this.props.mobile.is;

    if (!this.state.isSubmitted) {

      this.props.form.validateFields((err, values) => {
        let formComponentArray = this.state.currentForm.components;
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
        if (
          this._hasMobileComponentAndRequired(formComponentArray) &&
          !isMobile
        ) {
          message.error("请在移动端进行表单提交!");
          return false;
        }
        this.setState({ isSubmitted: true,errorResponseMsg:{} });
        this.props
          .modifySubmissionDetail(this.state.currentForm.id, this.state.submissionId, values, this.props.appId, this.state.oldExtraProp, this.props.extraProp)
          .then(response => {
           isMobile
          ? Toast.success("提交成功!")
          : message.success("提交成功!");
          setTimeout(() => {
            //
            let submissionId = null;
            let submitFlag = false;
            this.props.actionFun(submissionId, submitFlag);
            }, 1000);
          })
          .catch(error => {
             console.log(error);
             if (error.response && error.response.data.code === 9998) {
             this._setErrorResponseData(error.response.data);
            }
            isMobile ? Toast.fail(`${error.response.data.msg}`) : message.error(`${error.response.data.msg}`);
            this.setState({
              isSubmitted: false
            })
          });
      });
    }
  };

  handleSetFormula = (
    componentKey,
    callback,
    childParentKey,
    insertFromChildIndex
  ) => {
    const pureFormComponents = this.state.pureFormComponents.map(component => {
      if (component.key == componentKey) {
        if (component.formulaEvent != void 0) {
          component.formulaEvent.push(callback);
        } else {
          component.formulaEvent = [callback];
        }
      } else if (component.element == "FormChildTest" && childParentKey) {
        // 如果关联的是子组件则为子组件注册事件
        let { formChildDataObj } = this.state;
        let formChildSubmitDataObj = formChildDataObj[childParentKey][insertFromChildIndex];

        let operateObj = formChildSubmitDataObj[componentKey];

        if (operateObj.formulaEvent != void 0) {
          operateObj.formulaEvent.push(callback);
        } else {
          operateObj.formulaEvent = [callback];
        }
        this.setState({ formChildDataObj: formChildDataObj });
      }
      return component;
    });

    console.log(pureFormComponents);

    this.setState({
      pureFormComponents
    });
  };

  renderFormComponent = (getFieldDecorator, components, errorResponseMsg) => {
    const { currentForm, formDetail } = this.state;
    const { mobile } = this.props;

    return components
      .filter(item => {
        return item.isShow;
      })
      .map((item, i) => {
        let componentDIVOptions = {
          key: item.key,
          style: { zIndex: 300 - i },
          id: "Id" + item.key + "Dom"
        }
        let componentCommonOptions = {
          forms: currentForm,
          handleSetComponentEvent: this.handleSetComponentEvent,
          key: item.key,
          getFieldDecorator: getFieldDecorator,
          item: item,
          form: this.props.form,
          initData: formDetail[item.key],
          errorResponseMsg: errorResponseMsg[item.key],
          isEditData: true,
          resetErrorMsg: this._changeErrorResponseData,
          formulaArray: this.state.formulaArray,
          formComponent: {components:this.state.pureFormComponents, id: this.state.formId},
          handleSetFormula:this.handleSetFormula,
          isChangeLayout: this.state.isChangeLayout
        }
        switch (item.type) {
          case "EmailInput":
            return (
              <div
                {...componentDIVOptions}
              >
                <Email
                  {...componentCommonOptions}
                />
              </div>
            );
          case "PhoneInput":
            return (
              <div id="aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
                {...componentDIVOptions}
              >
                <PhoneInput
                  {...componentCommonOptions}
                />
              </div>
            );
          case "IdCardInput":
            return (
              <div
                {...componentDIVOptions}
              >
                <IdCard
                  {...componentCommonOptions}
                />
              </div>
            );
          case "SingleText":
            return (
              <div
                {...componentDIVOptions}
              >
                <SingleText
                  {...componentCommonOptions}
                />
              </div>
            );
          case "NumberInput":
            return (
              <div
                {...componentDIVOptions}
              >
                <NumberInput
                  {...componentCommonOptions}
                />
              </div>
            );
          case "RadioButtons":
            return (
              <div
                {...componentDIVOptions}
              >
                {mobile.is ? (
                  <RadioButtonsMobile
                    {...componentCommonOptions}
                  />
                ) : (
                    <RadioButtons
                      {...componentCommonOptions}
                    />
                  )}
              </div>
            );
            break;
          case "CheckboxInput":
            return (
              <div
               {...componentDIVOptions}
              >
                <Checkbox
                  {...componentCommonOptions}
                />
              </div>
            );
            break;
          case "DropDown":
            return (
              <div
                {...componentDIVOptions}
                className='single-drop-down'
              >
                {mobile.is ? (
                  <DropDownMobile
                    {...componentCommonOptions}
                  />
                ) : (
                    <DropDown
                      {...componentCommonOptions}
                    />
                  )}
              </div>
            );
          case "DateInput":
            return (
              <div
                {...componentDIVOptions}
              >
                {mobile.is ? (
                  <DateInputMobile
                    {...componentCommonOptions}
                  />
                ) : (
                    <DateInput
                      {...componentCommonOptions}
                    />
                  )}
              </div>
            );
            case "PureTime":
              return (
                <div
                {...componentDIVOptions}
                >
                  {mobile.is ? (
                    <DateInputMobile
                    {...componentCommonOptions}
                    />
                  ) : (
                    <PureTime
                    {...componentCommonOptions}
                    />
                  )}
                </div>
              );
            case "PureDate":
              return (
                <div
                {...componentDIVOptions}
                >
                  {mobile.is ? (
                    <DateInputMobile
                    {...componentCommonOptions}
                    />
                  ) : (
                    <PureDate
                    {...componentCommonOptions}
                    />
                  )}
                </div>
              );
          case "HandWrittenSignature":
            return (
              <div
                {...componentDIVOptions}
              >
                {mobile.is ? (
                  <HandWrittenSignatureMobile
                    {...componentCommonOptions}
                    getFileUrl={this.getFileUrl}
                  />
                ) : (
                    <HandWrittenSignaturePc
                      {...componentCommonOptions}
                      getFileUrl={this.getFileUrl}
                    />
                  )}
              </div>
            );
          case "FileUpload":
            return (
              <div
                {...componentDIVOptions}
              >
                {mobile.is ? (
                  <FileUploadMobile
                    type="normal"
                    getFileUrl={this.getFileUrl}
                    {...componentCommonOptions}
                  />
                ) : (
                    <FileUpload
                      {...componentCommonOptions}
                      getFileUrl={this.getFileUrl}
                    />
                  )}
              </div>
            );
          case "TextArea":
            return (
              <div
                {...componentDIVOptions}
              >
                <TextArea
                  {...componentCommonOptions}
                />
              </div>
            );
          case "MultiDropDown":
            return (
              <div
                {...componentDIVOptions}
                className="multiple-drop-down"
              >
                {mobile.is ? (
                  <MultiDropDownMobile
                    {...componentCommonOptions}
                  />
                ) : (
                    <MultiDropDown
                      {...componentCommonOptions}
                    />
                  )}
              </div>
            );
          case "ImageUpload":
            return (
              <div
                {...componentDIVOptions}
              >
                {mobile.is ? (
                  <ImageUploadMobile
                    getFileUrl={this.getFileUrl}
                    {...componentCommonOptions}
                  />
                ) : (
                    <ImageUpload
                      getFileUrl={this.getFileUrl}
                      {...componentCommonOptions}
                    />
                  )}
              </div>
            );
          case "GetLocalPosition":
            return (
              <div
                {...componentDIVOptions}
              >
                {mobile.is ? (
                  <PositionComponentMobile
                    {...componentCommonOptions}
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
                id={"Id" + item.key + "Dom"}
              >
                {mobile.is ? (
                  <FormChildMobile
                    key={`${item.key}${i}`}
                    getFieldDecorator={getFieldDecorator}
                    errorResponseMsg={errorResponseMsg[item.key]}
                    resetErrorMsg={this._changeErrorResponseData}
                    item={item}
                    showFormChildErr={this.state.showFormChildErr}
                    forms={currentForm}
                    form={this.props.form}
                    handleSetComponentEvent={this.handleSetComponentEvent}
                    initData = {formDetail[item.key]}
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
                      errorResponseMsg={errorResponseMsg[item.key]}
                      resetErrorMsg={this._changeErrorResponseData}
                      isEditData={true}
                      item={item}
                      initData = {formDetail[item.key]}
                      showFormChildErr={this.state.showFormChildErr}
                      forms={currentForm}
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
                {...componentDIVOptions}
              >
                {mobile.is ? (
                  <AddressMobile
                    {...componentCommonOptions}
                    handleSetAddress={this.handleSetAddress}
                    showAddressErr={this.state.showAddressErr}
                    address={this.state.addressesObj[item.key]}
                  />
                ) : (
                    <Address
                      {...componentCommonOptions}
                      handleSetAddress={this.handleSetAddress}
                      showAddressErr={this.state.showAddressErr}
                      address={this.state.addressesObj[item.key]}
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
      if (component.id == componentId) {
        if (component.callEventArr) {
          component.callEventArr.push(callback);
        } else {
          component.callEventArr = [callback];
        }
      } else if (component.element == "FormChildTest" && currrentKey) {
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
  handleSetFormChildData = (element, formchildData, linkData, that, initData) => {
    let { formChildDataObj } = this.state;
    const { id } = element;
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
    });
    // 如果没找到对应数据 则返回默认值
    if (formchildData == null) {
      formChildDataObj[id] = [rowTemplate]; //清空对应id子表单的数据
      this.setState({
        formChildDataObj
      });
      return;
    }
    formChildDataObj[id] = []; //清空对应id子表单的数据
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
      formChildDataObj[id][index] = data;
    });

    if(initData != void 0){
      formChildDataObj = initData
    }
    this.setState(
      {
        formChildDataObj
      },
      () => {
        that._reSetDataLinkFormChildItem();
      }
    );
  };
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
      if(info.fieldName.indexOf(".") !== -1){
        // 子表单
        // 子表单id.组件id.组件的值
        // arr[0]表示子表单id,arr[1]表示组件id,arr[2]表示组件的值
        const arr = info.fieldName.split(".");
        var value = info.fieldName.substring(arr[0].length+arr[1].length+2); 
        //  这里有问题最后的值不能用.分割
        const infoMsg = {formChildkey:arr[0], fieldKey: arr[1], value: value, msg: info.msg};
        this._resetFormChildErrorMsg(infoMsg);
        if(errorResponseMsg[infoMsg.formChildkey] != void 0 && errorResponseMsg[infoMsg.formChildkey][infoMsg.fieldKey] != void 0){
          errorResponseMsg[infoMsg.formChildkey][infoMsg.fieldKey].push(infoMsg);
        } else if(errorResponseMsg[infoMsg.formChildkey] == void 0){
          errorResponseMsg[infoMsg.formChildkey]={};
          errorResponseMsg[infoMsg.formChildkey][infoMsg.fieldKey] = [infoMsg];
        } else {
          errorResponseMsg[infoMsg.formChildkey][infoMsg.fieldKey] = [infoMsg];
        }
      } else {
        // 普通组件
        if (errorResponseMsg[info.fieldName] != void 0) {
          errorResponseMsg[info.fieldName].push(info.msg);
        } else{
          errorResponseMsg[info.fieldName] = [info.msg];
        }
      }
    });
    this.setState({
      errorResponseMsg,
      isSubmitted: false
    });
  };

  render() {
    const { form, mobile = {} } = this.props;
    const { getFieldDecorator } = form;
    let { pureFormComponents, currentLayout, errorResponseMsg, currentForm } = this.state;
    let layout = null;

    if (currentLayout == void 0) {
      layout = pureFormComponents
        .filter(item => {
          return item.isShow != false;
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

    // 将存储在layout中的isShow信息置入component
    // const layoutIdList = layout.map(item => item.i);
    pureFormComponents = pureFormComponents.map(component => {
      // component.isShow = layout[layoutIdList.indexOf(component.id)].isShow;
      return component;
    });


    let submitBtnObj = currentForm.components.filter(
      component => component.type === "Button"
    )[0];
    return (
      <>
        <Spin spinning={this.state.isSubmitted}>
          {mobile.is ? null : (
            <HeaderBar
              name={"编辑记录"}
              navs={[
                { key: 0, label: "我的应用", onClick: () => history.push("/app/list") },
                { key: 1, label: this.props.appName || "未知应用名", disabled: true },
                { key: 1, label: "记录列表", onClick: () => {
                  let skipToSubmissionDataFlag = false;
                  this.props.actionFun(skipToSubmissionDataFlag);
                }}
              ]}
              isShowExtraTitle={false}
            />
          )}
          <div className={"formBuilder-Submission"}>
            <div className="Content">
              <div className="submission-title">{currentForm.name}</div>
              {currentForm.formInfo != void 0 && currentForm.formInfo !== "" ? (
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
                      width={570}
                      onLayoutChange={layout => {
                        this.setState({ currentLayout: layout, isChangeLayout: true });
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

const EditFormDataForm = Form.create()(EditFormData);

export default connect(
  store => ({
    formData: store.formSubmitData.formData,
  }),
  {
    modifySubmissionDetail
  }
)(EditFormDataForm);
