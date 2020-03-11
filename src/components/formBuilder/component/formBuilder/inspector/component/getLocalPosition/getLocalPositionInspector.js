import React from "react";
import { Checkbox, Input, Select, Divider } from "antd";
import { connect } from "react-redux";
import {
  setItemAttr,
  setItemValues
} from "../../../redux/utils/operateFormComponent";
import PositionCenterList from "./component/positionCenterList";
import isInFormChild from "../../utils/isInFormChild";
import locationUtils from "../../../../../utils/locationUtils";
import { checkUniqueApi } from "../../utils/checkUniqueApiName";
class GetLocalPositionInspector extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      apiNameTemp: undefined, //api name 临时值
      formPath: locationUtils.getUrlParamObj().path
    };
  }

  deleteCenterPosition = index => {
    const { validate } = this.props.element;
    let newValuesList = [...this.props.element.validate.centerList];
    newValuesList.splice(index, 1);
    var newValidate = {
      ...validate,
      centerList: newValuesList
    };
    this.props.setItemAttr(this.props.element, "validate", newValidate);
  };

  addCenterPosition = centerPosition => {
    const { validate } = this.props.element;
    const newValuesList = [
      ...this.props.element.validate.centerList,
      centerPosition
    ];
    var newValidate = {
      ...validate,
      centerList: newValuesList
    };
    this.props.setItemAttr(this.props.element, "validate", newValidate);
  };

  changeCenterPosition = (item, index) => {
    const { validate } = this.props.element;
    const newItem = {
      center: item.center,
      latitude: item.latitude,
      longitude: item.longitude,
      orientationRange: item.orientationRange
    };
    let newValuesList = [...this.props.element.validate.centerList];
    newValuesList[index] = newItem;
    var newValidate = {
      ...validate,
      centerList: newValuesList
    };
    this.props.setItemAttr(this.props.element, "validate", newValidate);
  };

  handleChangeAttr = ev => {
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
      case "isAdjustmentRange": {
        checked = checked ? "true" : "";
        break;
      }
      case "isLimitOrientationRange": {
        validate.isLimitOrientationRange = checked;
        value = validate;
        break;
      }
      default:
        break;
    }
    this.props.setItemAttr(
      this.props.element,
      name,
      value !== undefined ? value : checked
    );
  };

  handleChangeSelect = value => {
    const { validate } = this.props.element;
    var newValidate = {
      ...validate,
      adjustmentRange: Number(value)
    };
    this.props.setItemAttr(this.props.element, "validate", newValidate);
  };

  handleChangeIsAdjustmentRange = event => {
    const { validate } = this.props.element;
    var newValidate = {
      ...validate,
      isAdjustmentRange: event.target.checked
    };
    this.props.setItemAttr(this.props.element, "validate", newValidate);
  };

  componentDidMount() {
    const { element } = this.props;
    const { key } = element;
    const isUniqueApi = checkUniqueApi(key, this.props);
    this.setState({
      apiNameTemp: key,
      isUniqueApi: isUniqueApi
    });
  }

  // API change
  handleChangeAPI = ev => {
    console.log(this.props);
    const { value } = ev.target;
    const isUnique = checkUniqueApi(value, this.props);
    let isUniqueApi = true;
    if (!isUnique) {
      isUniqueApi = false;
    }
    this.handleChangeAttr(ev);
    this.setState({
      apiNameTemp: value,
      isUniqueApi
    });
  };

  render() {
    const {
      label,
      tooltip,
      defaultValue,
      validate,
      data,
      isSetAPIName
    } = this.props.element;
    const { apiNameTemp, isUniqueApi = true } = this.state;
    const { adjustmentRange, isAdjustmentRange } = validate;
    // const formatChecks = inputMask ? true : false;
    return (
      <div className="position-inspector">
        <div className="costom-info-card">
          <p htmlFor="email-title">标题</p>
          <Input
            id="email-title"
            name="label"
            placeholder="定位"
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
              必填
            </Checkbox>
            <Checkbox
              name="isLimitOrientationRange"
              checked={validate.isLimitOrientationRange}
              onChange={this.handleChangeAttr}
            >
              设定定位范围
            </Checkbox>
            <PositionCenterList
              className="position-center-list"
              isActive={validate.isLimitOrientationRange}
              centerList={validate.centerList}
              addCenterPosition={this.addCenterPosition}
              changeCenterPosition={this.changeCenterPosition}
              deleteCenterPosition={this.deleteCenterPosition}
            />
          </div>
          <p htmlFor="email-tip">定位设置</p>
          <div className="checkbox-wrapper">
            <Checkbox
              name="isAdjustmentRange"
              checked={isAdjustmentRange}
              onChange={this.handleChangeIsAdjustmentRange}
            >
              允许微调
            </Checkbox>
            <Select
              value={`${adjustmentRange}米`}
              onChange={this.handleChangeSelect}
              disabled={!isAdjustmentRange}
            >
              <Select.Option value="100米">100米</Select.Option>
              <Select.Option value="200米">200米</Select.Option>
              <Select.Option value="5000">5000米</Select.Option>
            </Select>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  store => ({
    data: store.formBuilder.data
  }),
  {
    setItemAttr,
    setItemValues
  }
)(GetLocalPositionInspector);
