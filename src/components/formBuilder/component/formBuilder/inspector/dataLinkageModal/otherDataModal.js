import React, { Component } from "react";
import { Modal, Select, Icon, Input, message } from "antd";
import { connect } from "react-redux";
import { setErrorComponentIndex } from "../../redux/utils/operateFormComponent";
const Option = Select.Option;

const LinkComponentType = [
  "SingleText",
  "RadioButtons",
  "CheckboxInput",
  "MultiDropDown",
  "number",
  "DateInput",
  "DropDown"
];

class OtherDataModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      formIndex: -1,
      selectedFormId: undefined, //关联表单id
      selectedOptionId: undefined, //关联表单字段id
      linkComponentType: "other", //关联组件类型
      optionLabel: undefined,
      isOpenList: false,
      hasError: false,
      forms: []
    };
  }

  componentDidMount() {
    let { formId, optionId, optionLabel, hasError } = this.props.data;
    // 过滤自身表单
    const forms = this.props.forms.filter(
      form => form._id != this.props.formId
    );
    forms.reverse();
    let hasform = forms.some(form => form._id === formId);
    let formIndex = -1;
    if (hasform && formId) {
      forms.forEach((form, index) => {
        if (form._id === formId) {
          formIndex = index;
        }
      });
    } else if (formId) {
      formId = "关联条件失效，请重新设置";
      optionLabel = "";
      hasError = true;
    }
    this.setState({
      selectedFormId: formId,
      selectedOptionId: optionId,
      hasError,
      optionLabel,
      formIndex,
      forms
    });
  }

  handleFormSelected = (value, option) => {
    this.setState({
      selectedFormId: value,
      formIndex: option.props.index,
      selectedOptionId: undefined,
      optionLabel: undefined,
      hasError: false
    });
  };

  handleOptionSelected = ev => {
    if (ev.target.tagName == "LI") {
      let value = ev.target.getAttribute("data-value");
      let type = ev.target.getAttribute("data-type");
      let label = ev.target.innerText;
      this.setState({
        selectedOptionId: value,
        optionLabel: label,
        linkComponentType: type
      });
    }
  };

  handleShowOrHideList = () => {
    this.setState({
      isOpenList: !this.state.isOpenList
    });
  };

  filterFormComponents = form => {
    let components = (form && form.components) || [];
    if (Array.isArray(components)) {
      return components.filter(component =>
        LinkComponentType.includes(component.type)
      );
    } else {
      return [];
    }
  };

  handleCancel = () => {
    const { showOrHideModal } = this.props;
    // 还原模态框
    // this.setState({
    //   formIndex: -1,
    //   selectedFormId: undefined,
    //   selectedOptionId: undefined,
    //   optionLabel: undefined,
    //   isOpenList: false
    // });
    showOrHideModal(false);
  };

  handleOk = () => {
    const { showOrHideModal, onOk } = this.props;
    const {
      selectedFormId,
      selectedOptionId,
      optionLabel,
      linkComponentType
    } = this.state;
    if (selectedFormId && selectedOptionId) {
      // 条件满足，进行存储
      onOk({
        selectedFormId,
        selectedOptionId,
        optionLabel,
        linkComponentType
      });
      showOrHideModal(false);
      this.props.setErrorComponentIndex(-1);
    } else {
      // 配置条件未完成
      message.warn("请设置完整的关联数据条件", 2);
    }
  };

  render() {
    const { title, visible, className } = this.props;
    const {
      formIndex,
      selectedFormId,
      selectedOptionId,
      optionLabel,
      isOpenList,
      forms,
      hasError
    } = this.state;

    let classess = "option-list more";
    let arrowIconClass = "arrow";
    if (isOpenList) {
      classess += " open";
      arrowIconClass += " open";
    }
    return (
      <Modal
        title={title}
        visible={visible}
        onOk={this.handleOk}
        okText="确定"
        cancelText="取消"
        bodyStyle={{
          top: 200
        }}
        style={{
          top: 200
        }}
        onCancel={this.handleCancel}
        className={className}
      >
        <div className="component-template-modal-container">
          <p className="second-title">来源表单</p>
          <Select
            placeholder="请选择表单"
            className={hasError ? "form-select has-error" : "form-select"}
            dropdownClassName="select-dropdown"
            onSelect={this.handleFormSelected}
            value={selectedFormId}
          >
            {forms.map((form, index) => (
              <Option key={form._id} index={index} value={form._id}>
                {form.title}
              </Option>
            ))}
          </Select>
          <p>关联字段</p>
          <Input
            value={optionLabel}
            placeholder="选择字段"
            className="select-option"
            suffix={
              <Icon
                onClick={this.handleShowOrHideList}
                className={arrowIconClass}
                type="down"
              />
            }
            onClick={this.handleShowOrHideList}
          />
          <ul className={classess} onClick={this.handleOptionSelected}>
            {formIndex > -1
              ? this.filterFormComponents(forms[formIndex]).map(component => (
                  <li
                    key={component.id}
                    data-value={component.key}
                    data-type={component.type}
                    className="select-option-item"
                  >
                    {component.label}
                    {selectedOptionId == component.id ? (
                      <Icon
                        style={{ color: "#09BB07" }}
                        className="dropDown-check-icon"
                        type="check"
                      />
                    ) : null}
                  </li>
                ))
              : null}
          </ul>
        </div>
      </Modal>
    );
  }
}

export default connect(
  store => ({
    formId: store.formBuilder.formId
  }),
  {
    setErrorComponentIndex
  }
)(OtherDataModal);
