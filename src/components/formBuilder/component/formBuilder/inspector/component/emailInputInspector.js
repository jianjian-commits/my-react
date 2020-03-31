import React from "react";
import { Input, Checkbox, Divider } from "antd";
import { connect } from "react-redux";
import {
  setItemAttr,
  setFormChildItemAttr
} from "../../redux/utils/operateFormComponent";
import isInFormChild from "../utils/isInFormChild";
import locationUtils from "../../../../utils/locationUtils";
import { checkUniqueApi } from "../utils/checkUniqueApiName";

class EmailInputInspector extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      optionType: this.props.element.data.type || "custom",
      formPath: locationUtils.getUrlParamObj().path,
      isShowDataLinkageModal: false,
      apiNameTemp: undefined //api name 临时值
    };
  }

  componentDidMount() {
    const { element } = this.props;
    const { key } = element;
    const isUniqueApi = checkUniqueApi(key, this.props);
    this.setState({
      apiNameTemp: key,
      isUniqueApi: isUniqueApi
    });
  }

  handleChangeAttr = ev => {
    this.props.setItemAttr(this.props.element, ev.target.name, ev.target.value);
  };

  // 选择指定组件渲染
  renderOptionDataFrom = type => {
    const { isShowDataLinkageModal, formId } = this.state;
    const { forms, element } = this.props;
    let isLinkError = false;
    const { data, errorComponentIndex } = this.props;
    if (errorComponentIndex > -1) {
      let currentIndex = data.indexOf(element);
      currentIndex === errorComponentIndex && (isLinkError = true);
    }
    switch (type) {
      // 自定义组件
      case "custom": {
        return (
          <>
            {/* <Input
              id="email-default-value"
              placeholder="请输入默认值"
              autoComplete="off"
            /> */}
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
      case "DataLinkage": {
        return "数据联动";
      }
      default:
        return "";
    }
  };
  // 设置数据联动
  handleSetDataLinkage = isShow => {
    this.setState({
      isShowDataLinkageModal: isShow
    });
  };

  handleSelectChange = value => {
    switch (value) {
      case "custom": {
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
    const { optionType, apiNameTemp, isUniqueApi = true } = this.state;
    return (
      <div className="base-form-tool">
        <div classNam="costom-info-card">
          <p htmlFor="email-title">标题</p>
          <Input
            id="email-title"
            placeholder="Email"
            name="text"
            onChange={this.handleChangeAttr}
            autoComplete="off"
          />
          {isInFormChild(this.props.elementParent) ? null : (
            <>
              <p htmlFor="email-tip">提示信息</p>
              <Input
                id="email-tip"
                placeholder="请输入提示信息"
                autoComplete="off"
              />
              <p htmlFor="email-err-tip">错误提示</p>
              <Input
                id="email-err-tip"
                placeholder="请输入错误提示"
                autoComplete="off"
              />
            </>
          )}
          <p htmlFor="email-default-value">默认值</p>
          <Select
            value={optionType}
            style={{ width: "100%" }}
            onChange={this.handleSelectChange}
            className="data-source-select"
          >
            <Option value="custom">自定义</Option>
            <Option value="DataLinkage">数据联动</Option>
          </Select>
          {this.renderOptionDataFrom(optionType)}
        </div>
        <Divider />
        <div classNam="costom-info-card">
          <p htmlFor="email-tip">校验</p>
          <div className="checkbox-wrapper">
            <Checkbox>必填</Checkbox>
            {isInFormChild(this.props.elementParent) ? null : (
              <Checkbox>不允许重复</Checkbox>
            )}
            <Checkbox>格式校验</Checkbox>
          </div>
        </div>
      </div>
    );
  }
}
export default connect(
  store => ({
    errorComponentIndex: store.formBuilder.errorComponentIndex
  }),
  {
    setItemAttr
  }
)(EmailInputInspector);
