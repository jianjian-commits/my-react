import React from "react";
import { Input, Checkbox, Divider} from "antd";
import { connect } from "react-redux";
import { setItemAttr, setFormChildItemAttr } from "../../redux/utils/operateFormComponent";
import isInFormChild from "../utils/isInFormChild"

class EmailInputInspector extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      optionType: this.props.element.data.type || "custom",
      formId: locationUtils.getUrlParamObj().id,
      isShowDataLinkageModal: false
    };
  }

  handleChangeAttr = ev => {
    this.props.setItemAttr(this.props.element, ev.target.name, ev.target.value);
  };

  // 选择指定组件渲染
  renderOptionDataFrom = type => {
    const { isShowDataLinkageModal, formId } = this.state;
    const { forms, element } = this.props;
    switch (type) {
      // 自定义组件
      case "custom": {
        return(
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
              className="data-link-set"
              onClick={() => {
                this.handleSetDataLinkage(true);
              }}
            >
              {element.data.type === "DataLinkage"
                ? "已设置数据联动"
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

  render() {
    const { optionType } = this.state;
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
          {
            isInFormChild(this.props.elementParent)
            ? null 
            :<>
              <p htmlFor="email-tip">提示信息</p>
              <Input id="email-tip" placeholder="请输入提示信息" autoComplete="off" />
              <p htmlFor="email-err-tip">错误提示</p>
              <Input
                id="email-err-tip"
                placeholder="请输入错误提示"
                autoComplete="off"
              />
              </>
          }
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
            {
              isInFormChild(this.props.elementParent) 
              ? null
              : <Checkbox>不允许重复</Checkbox>
            }
            <Checkbox>格式校验</Checkbox>
          </div>
        </div>
      </div>
    );
  }
}
export default connect(store => ({}), {
  setItemAttr
})(EmailInputInspector);
