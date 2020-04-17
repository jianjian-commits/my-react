import React from "react";
import { Input, Checkbox, Button, Tooltip, Select, Divider, Modal } from "antd";
import { connect } from "react-redux";
import locationUtils from "../../../../utils/locationUtils";
import DataLinkageModal from "../dataLinkageModal/dataLinkageModel";
import OtherDataModal from "../dataLinkageModal/otherDataModal";
import {
  setItemAttr,
  setItemValues,
  setFormChildItemAttr,
  setFormChildItemValues
} from "../../redux/utils/operateFormComponent";
import { instanceAxios } from "../../../../utils/tokenUtils";
import { filterFormsForRelation } from "../utils/filterData";
import config from "../../../../config/config";
import { checkFormChildItemIsLinked } from "../utils/filterData";
import isInFormChild from "../utils/isInFormChild";
import { checkUniqueApi } from "../utils/checkUniqueApiName";
const { Option } = Select;
const { TextArea } = Input;
class DropdownInspector extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      optionType:
        props.element.data.type ||
        (props.element.data.values && props.element.data.values.type) ||
        "custom",
      formPath: locationUtils.getUrlParamObj().path,
      isShowDataLinkageModal: false,
      isShowOtherDataModal: false,
      visible: false,
      tempOptions: props.element.data.values,
      tempContent: "",
    };
    this.addChooseItem = this.addChooseItem.bind(this);
    this.addExtraChooseItem = this.addExtraChooseItem.bind(this);
    this.handleChangeAttr = this.handleChangeAttr.bind(this);
  }

  componentDidMount() {
    const { elementParent, element } = this.props;
    // 检查是否已经在子表单关联该字段
    if (elementParent && checkFormChildItemIsLinked(elementParent, element)) {
      this.setState({
        isLinked: true
      });
    }

    const { key } = element;
    const {err, msg:APIMessage} = checkUniqueApi(key, this.props);
    const isUnique = !err;
    let isUniqueApi = true;
    if (!isUnique) {
      isUniqueApi = false;
    }
    this.setState({
      apiNameTemp: key,
      isUniqueApi: isUniqueApi,
      APIMessage
    });
  }

  handleChangeAttr(ev) {
    let { name, value, checked } = ev.target;
    let { validate } = this.props.element;
    validate = { ...validate };
    switch (name) {
      case "customMessage": {
        validate.customMessage = value;
        value = validate;
        break;
      }
      case "required": {
        validate.required = checked;
        value = validate;
        break;
      }
      case "inputMask": {
        checked = checked ? "true" : "";
        break;
      }
    }
    if (this.props.elementParent) {
      this.props.setFormChildItemAttr(
        this.props.elementParent,
        name,
        value !== undefined ? value : checked,
        this.props.element
      );
    } else {
      this.props.setItemAttr(
        this.props.element,
        name,
        value !== undefined ? value : checked
      );
    }
  }
  addChooseItem = () => {
    const newItem = {
      label: `选项`,
      value: `选项`
    };
    const newValuesList = [...this.props.element.data.values, newItem];
    if (this.props.elementParent) {
      this.props.setFormChildItemValues(
        this.props.elementParent,
        "data",
        newValuesList,
        this.props.element
      );
    } else {
      this.props.setItemValues(this.props.element, "data", newValuesList);
    }
  };

  addExtraChooseItem() {
    if(this.props.element.data.values.some(item => item.isExtra)){

    }else{
      const newItem = {
        label: `其它`,
        value: `其它`,
        isExtra:true,
        shortcut: ""
      };
     const newValuesList = [...this.props.element.data.values, newItem];
     if (this.props.elementParent) {
      this.props.setFormChildItemValues(
        this.props.elementParent,
        "data",
        newValuesList,
        this.props.element
      );
    } else {
      this.props.setItemValues(this.props.element, "data", newValuesList);
    }
  }
}
  addChooseItems = () => {
    const tempOptions = this.state.tempOptions;
    const newItem = {
      label: `选项`,
      value: `选项`,
      shortcut: ""
    };
    let newValuesList;
    if(tempOptions.length > 0){
      newValuesList = [...tempOptions];
    } else {
      // 如果编辑框里的内容没有生成选项,那就只有一个选项
      newValuesList = [newItem];
    }
    if (this.props.elementParent) {
      this.props.setFormChildItemValues(
        this.props.elementParent,
        "data",
        newValuesList,
        this.props.element
      );
    } else {
      this.props.setItemValues(this.props.element, "data", newValuesList);
    }
  }
 
  deleteChooseItem(item, index) {
    if (this.props.element.data.values.length === 1) return null;
    let newValuesList = this.props.element.data.values.filter(
      (item, i) => i !== index
    );
    if (this.props.elementParent) {
      this.props.setFormChildItemValues(
        this.props.elementParent,
        "data",
        newValuesList,
        this.props.element
      );
    } else {
      this.props.setItemValues(this.props.element, "data", newValuesList);
    }
  }
  changeChooseItem(item, ev) {
    const { value } = ev.target;
    const newItem = {
      value: value,
      label: value,
      shortcut: ""
    };
    let newValuesList = [...this.props.element.data.values];
    let index = newValuesList.indexOf(item);
    newValuesList[index] = newItem;
    if (this.props.elementParent) {
      this.props.setFormChildItemValues(
        this.props.elementParent,
        "data",
        newValuesList,
        this.props.element
      );
    } else {
      this.props.setItemValues(this.props.element, "data", newValuesList);
    }
  }

  showModal = () => {
    const tempContent = this.props.element.data.values.map(item => item.value).join("\n") + "\n";
    this.setState({
      visible: true,
      tempContent: tempContent
    });
  };

  handleOk = e => {
    this.setState({
      visible: false,
    });
    this.addChooseItems();
  };

  handleCancel = e => {
    this.setState({
      visible: false,
    });
  };

  handleContent = (e) =>{
    const newArray = this.handleArray(e.target.value.split("\n"));
    this.setState({
      tempOptions: newArray,
      tempContent: e.target.value
    })
  }

  handleArray(arr){
    // 处理掉额外的空格 和换行符
    return arr.map(item =>
      item.trim())
      .filter(item =>item !== "")
      .map(item=>({
        value: item,
        label: item,
        shortcut: ""
      }))
  }

  handleSelectChange = value => {
    switch (value) {
      case "custom": {
        if (this.props.elementParent) {
          this.props.setFormChildItemValues(
            this.props.elementParent,
            "data",
            [{ label: "选项", value: "选项" }],
            this.props.element
          );
        } else {
          this.props.setItemValues(this.props.element, "data", [
            { label: "选项", value: "选项" }
          ]);
        }
        this.setState({
          optionType: "custom"
        });
        break;
      }
      case "otherFormData": {
        this.setState({
          optionType: "otherFormData"
        });
        break;
      }
      case "DataLinkage": {
        this.setState({
          optionType: "DataLinkage"
        });
        break;
      }
      default: {
        return;
      }
    }
  };

  handleOtherFormDataChange = data => {
    const {
      selectedFormId,
      selectedOptionId,
      optionLabel,
      linkComponentType
    } = data;
    let values = {
      formId: selectedFormId,
      optionId: selectedOptionId,
      optionLabel,
      linkComponentType
    };
    if (this.props.elementParent) {
      values.type = this.state.optionType;
      this.props.setFormChildItemValues(
        this.props.elementParent,
        "data",
        values,
        this.props.element
      );
    } else {
      this.props.setItemValues(
        this.props.element,
        "data",
        values,
        this.state.optionType
      );
    }
  };

  // 设置数据联动
  handleSetDataLinkage = isShow => {
    this.setState({
      isShowDataLinkageModal: isShow
    });
  };

  handleSetOtherDataModal = isShow => {
    this.setState({
      isShowOtherDataModal: isShow
    });
  };

  // 选择指定组件渲染
  renderOptionDataFrom = type => {
    const { isShowDataLinkageModal, isShowOtherDataModal, formId } = this.state;
    const { forms, element, elementParent } = this.props;
    let isLinkError = false;
    const { data, errorComponentIndex } = this.props;
    if (errorComponentIndex > -1) {
      let currentIndex = data.indexOf(element);
      currentIndex === errorComponentIndex && (isLinkError = true);
    }
    switch (type) {
      // 自定义组件
      case "custom": {
        const { values } = element.data;
        const { tempContent } = this.state;
        return (
          <div className="chooseitems">
            {values.map((item, index) => (
             <div key={index}>
               {item.isExtra ?
                  <Input
                  key={`chooseItem${index}`}
                  type="text"
                  value="其他"
                  placeholder="其他"
                  autoComplete="off"
                  disabled={true}
                />
                  :
                <div className="ChooseItemWarp">
                <img src="/image/dragIcon.png" />
                <Input
                  type="text"
                  onChange={ev => {
                    this.changeChooseItem(item, ev);
                  }}
                  placeholder="选项"
                  value={item.value}
                  autoComplete="off"
                />
                <Tooltip title="删除">
                  <img
                    src="/image/deleteIcon.png"
                    onClick={() => {
                      this.deleteChooseItem(item, index);
                    }}
                  />
                </Tooltip>
              </div>
              }
             </div>
            ))}
            <Button onClick={this.addChooseItem} name="chooseItems" icon="plus">
              增加选项
            </Button>
            <Button onClick={this.addExtraChooseItem} name="chooseItems" icon="plus">
              增加其他选项
            </Button>
            <Button onClick={this.showModal}>批量编辑</Button>
            <Modal
              title="批量编辑"
              visible={this.state.visible}
              onOk={this.handleOk}
              onCancel={this.handleCancel}
            >
              <TextArea
                autoSize={{ minRows: 8, maxRows: 8 }}
                onChange={this.handleContent}
                value={tempContent}>
              </TextArea>
            </Modal>
          </div>
        );
      }
      // 关联数据组件
      case "otherFormData": {
        return (
          <>
            <Button
              className={
                isLinkError ? "data-link-set has-error" : "data-link-set"
              }
              onClick={() => {
                this.handleSetOtherDataModal(true);
              }}
            >
              {element.data.type == "otherFormData"
                ? isLinkError
                  ? "数据关联失效"
                  : "已设置数据关联"
                : "关联表单数据设置"}
            </Button>
            <OtherDataModal
              title="关联其他表单数据设置"
              visible={isShowOtherDataModal}
              showOrHideModal={this.handleSetOtherDataModal}
              onOk={this.handleOtherFormDataChange}
              data={{ ...element.data.values }}
              formId={formId}
              forms={forms}
              className="form-change-modal"
            />
          </>
        );
      }
      // 数据联动组件
      case "DataLinkage": {
        return (
          <>
            <Button
              className={
                isLinkError ? "data-link-set has-error" : "data-link-set"
              }
              onClick={() => {
                this.handleSetDataLinkage(true);
              }}
            >
              {element.data.type == "DataLinkage"
                ? isLinkError
                  ? "数据联动设置失效"
                  : "已设置数据联动"
                : "数据联动设置"}
            </Button>
            <DataLinkageModal
              visible={isShowDataLinkageModal}
              showOrHideModal={this.handleSetDataLinkage}
              forms={forms}
              element={element}
              elementParent={elementParent}
              formId={formId}
            />
          </>
        );
      }
      default: {
        return;
      }
    }
  };

  handleGetOptionStr = type => {
    switch (type) {
      case "custom": {
        return "自定义";
      }
      case "otherFormData": {
        return "关联其他表单数据";
      }
      case "DataLinkage": {
        return "数据联动";
      }
      default:
        return "";
    }
  };

  // API change
   handleChangeAPI = ev => {
    const { value } = ev.target;
    const {err, msg:APIMessage} = checkUniqueApi(value, this.props);
    const isUnique = !err;
    let isUniqueApi = true;
    if (!isUnique) {
      isUniqueApi = false;
    }
    this.handleChangeAttr(ev);
    this.setState({
      apiNameTemp: value,
      isUniqueApi,
      APIMessage
    });
  };

  render() {
    const {
      optionType,
      isLinked,
      apiNameTemp,
      APIMessage,
      isUniqueApi = true
    } = this.state;
    const { elementParent, element, data, errorComponentIndex } = this.props;
    const { label, validate, tooltip, isSetAPIName } = this.props.element;

    return (
      <div className="multidropdown-inspector">
        <div className="costom-info-card">
          <p htmlFor="checkbox-title">标题</p>
          <Input
            id="checkbox-title"
            name="label"
            placeholder="多选框"
            value={label}
            onChange={this.handleChangeAttr}
            autoComplete="off"
          />

          <p htmlFor="url-name">API Name</p>
          <Input
            id="single-text-title"
            className={isUniqueApi ? "" : "err-input"}
            disabled={isSetAPIName ? true : false}
            name="key"
            placeholder="API Name"
            value={apiNameTemp}
            onChange={this.handleChangeAPI}
            autoComplete="off"
          />
          {isUniqueApi ? null : <p className="api-err">{APIMessage}</p>}

          {isInFormChild(this.props.elementParent) ? null : (
            <>
              <p htmlFor="email-tip">提示信息</p>
              <Input
                id="email-tip"
                name="tooltip"
                placeholder="请输入提示信息"
                value={tooltip}
                onChange={this.handleChangeAttr}
                autoComplete="off"
              />
            </>
          )}
          <p>选项</p>
          {isLinked ? (
            <Input defaultValue="以子表单联动为准，不支持设置默认值" disabled />
          ) : (
            <>
              <Select
                value={optionType}
                style={{ width: "100%" }}
                onChange={this.handleSelectChange}
                className="data-source-select"
              >
                <Option value="custom">自定义</Option>
                <Option value="otherFormData">关联其他表单数据</Option>
                <Option value="DataLinkage">数据联动</Option>
              </Select>
              {this.renderOptionDataFrom(optionType)}
            </>
          )}
        </div>
        <Divider />
        <div className="costom-info-card">
          <p htmlFor="email-tip">校验</p>
          <div className="checkbox-wrapper">
            <Checkbox
              name="required"
              checked={validate.required}
              onChange={this.handleChangeAttr}
            >
              必选
            </Checkbox>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  store => ({
    data: store.formBuilder.data,
    forms: store.formBuilder.formArray,
    errorComponentIndex: store.formBuilder.errorComponentIndex
  }),
  {
    setItemAttr,
    setItemValues,
    setFormChildItemAttr,
    setFormChildItemValues
  }
)(DropdownInspector);
