import React from "react";
import { connect } from "react-redux";
import { Modal, Input, Select, Menu, Dropdown, Icon, message } from "antd";
import FormIcon from "../../../base/FormIcon";
import {
  setItemValues,
  setFormChildItemAttr
} from "../../redux/utils/operateFormComponent";
import {
  filterFormExceptSelf,
  filterComponentsExceptSelf,
  filterLinkFormAndGetComponent,
  filterFormChildAllComponent,
  filterLinkedFormChildItem
} from "../utils/filterData";
const { Option } = Select;

const defaultStyle = {
  height: 505,
  bodyHeight: 350
};

const formChildStyle = {
  height: 600,
  bodyHeight: 465
};

class DataLinkageModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      linkFormId: undefined, // 联动表单id
      linkComponentId: undefined, // 联动条件id(联动表单)
      conditionId: undefined, // 联动条件id(当前表单)
      linkDataId: undefined, // 联动数据id(联动表单)
      linkComponentType: "other",
      classess: "input-item",
      isError: false,
      formChildData: [] // 子表单关联对象
    };
  }

  componentDidMount() {
    const values = this.props.element.data.values;
    if (values instanceof Object && !(values instanceof Array)) {
      const {
        linkFormId,
        linkComponentId,
        conditionId,
        linkDataId,
        linkComponentType,
        formChildData
      } = values;
      if (values.linkDataId) {
        this.setState(
          {
            linkFormId,
            linkComponentId,
            conditionId,
            linkDataId,
            linkComponentType,
            formChildData: formChildData || []
          },
          () => {
            let classess, isError;
            if (this.handleMarkingError()) {
              classess = "input-item";
              isError = false;
            } else {
              classess = "input-item has-error";
              isError = true;
            }
            this.setState({
              classess,
              isError
            });
          }
        );
      }
    }
  }

  handleSelectLinkForm = value => {
    this.setState({
      linkFormId: value,
      linkComponentId: undefined,
      linkDataId: undefined
    });
  };

  handleChangeCondition = (value, ev) => {
    let type = ev.props.type;
    this.setState({
      conditionId: value,
      linkComponentType: type,
      linkComponentId: undefined,
      classess: "input-item",
      isError: false
    });
  };

  handleSelectLinkComponent = value => {
    this.setState({
      linkComponentId: value
    });
  };

  handleSelectLinkData = value => {
    this.setState({
      linkDataId: value
    });
  };

  // 检查数据联动是否填入所有条件
  handleIsRightConditions = () => {
    const {
      linkFormId,
      linkComponentId,
      conditionId,
      linkDataId,
      linkComponentType,
      formChildData
    } = this.state;
    const { element } = this.props;
    if (
      (linkFormId &&
        linkComponentId &&
        conditionId &&
        linkDataId &&
        linkComponentType &&
        element.type === "FormChildTest" &&
        formChildData.length > 0) ||
      (linkFormId &&
        linkComponentId &&
        conditionId &&
        linkDataId &&
        element.type !== "FormChildTest" &&
        linkComponentType)
    ) {
      return true;
    } else {
      return false;
    }
  };

  // 确定的回调
  handleOk = () => {
    if (this.handleIsRightConditions()) {
      let values = {
        ...this.state
      };
      const {
        setItemValues,
        showOrHideModal,
        setFormChildItemAttr,
        elementParent
      } = this.props;
      if (elementParent) {
        setFormChildItemAttr(
          this.props.elementParent,
          "data",
          { values },
          this.props.element,
          "DataLinkage"
        );
      } else {
        setItemValues(this.props.element, "data", values, "DataLinkage");
      }
      showOrHideModal(false);
    } else {
      message.warn("请设置完整的数据联动条件", 2);
    }
  };

  /*
   * 检查数据联动是否合理 合理返回true
   * 完成数据联动前驱校验
   */
  handleMarkingError = () => {
    const { data } = this.props;
    let allComponentsId = [];
    console.log("handleMarkingError", data);
    data.forEach(item => {
      allComponentsId.push(item.id);
      if (item.type === "FormChildTest" && Array.isArray(item.values)) {
        item.values.forEach(child => {
          allComponentsId.push(child.id);
        });
      }
    });
    if (this.state.conditionId === undefined) {
      return true;
    }
    if (allComponentsId.includes(this.state.conditionId)) {
      return true;
    } else {
      return false;
    }
  };

  // 子表单数据联动逻辑
  handleAddChildItemLink = childData => {
    this.setState(
      {
        formChildData: [
          ...this.state.formChildData,
          {
            label: childData.label,
            id: childData.id,
            type: childData.element
          }
        ]
      },
      () => {
        console.log(this.state.formChildData);
      }
    );
  };

  // 选择子字段联动
  handleselectChildFormLinkItem = (value, index) => {
    const newFormChildData = [...this.state.formChildData];
    const [id, label] = value.split("|");
    newFormChildData[index]["linkOptionId"] = id;
    newFormChildData[index]["linkOptionLabel"] = label;
    this.setState({
      formChildData: newFormChildData
    });
  };

  // 删除index的子字段联动
  handleRemoveChildFormLinkItem = index => {
    const newFormChildData = [...this.state.formChildData];
    newFormChildData.splice(index, 1);
    this.setState({
      formChildData: newFormChildData
    });
  };

  render() {
    const {
      showOrHideModal,
      forms,
      formId,
      element,
      data,
      elementParent
    } = this.props;
    const {
      linkFormId,
      linkComponentId,
      linkComponentType,
      linkDataId,
      conditionId,
      classess,
      formChildData,
      isError
    } = this.state;

    // 确定模态框的高度
    let currentStyle =
      element.type === "FormChildTest" ? formChildStyle : defaultStyle;
    return (
      <Modal
        title="数据联动设置"
        visible={this.props.visible}
        onOk={this.handleOk}
        onCancel={() => {
          showOrHideModal(false);
        }}
        maskClosable={false}
        okText="保存"
        cancelText="取消"
        centered
        className="dataLinkage"
        width="570"
        style={{
          height: currentStyle.height
        }}
        bodyStyle={{
          height: currentStyle.bodyHeight
        }}
      >
        <div className="data-linkage-wrap">
          <p className="sencond-title">联动表单</p>
          <Select
            className="data-link-form"
            onChange={this.handleSelectLinkForm}
            defaultValue={linkFormId}
          >
            {filterFormExceptSelf(forms, formId).reverse().map(form => (
              <Option value={form.id} key={form.id}>
                {form.name}
              </Option>
            ))}
          </Select>

          <p className="sencond-title">数据联动</p>
          <div className="row">
            <Select
              className={classess}
              onChange={this.handleChangeCondition}
              defaultValue={isError ? "字段失效，请重新选择" : conditionId}
            >
              {filterComponentsExceptSelf(data, element.id, elementParent).map(
                item => (
                  <Option value={item.id} key={item.id} type={item.element}>
                    {item.label}
                  </Option>
                )
              )}
            </Select>
            <p>值等于</p>
            <Select
              className="input-item"
              placeholder="联动表单字段"
              onChange={this.handleSelectLinkComponent}
              value={linkComponentId}
            >
              {filterLinkFormAndGetComponent(
                forms,
                linkFormId,
                linkComponentType
              ).map(item => (
                <Option value={item.id} key={item.id}>
                  {item.label}
                </Option>
              ))}
            </Select>
            <p>的值时</p>
          </div>

          <div className="row">
            <Input
              type="text"
              className="input-item"
              disabled
              value={element.label}
            />
            <p>联动显示</p>
            <Select
              className="input-item"
              placeholder="联动表单字段"
              onChange={this.handleSelectLinkData}
              value={linkDataId}
            >
              {filterLinkFormAndGetComponent(
                forms,
                linkFormId,
                element.element
              ).map(item => (
                <Option value={item.id} key={item.id}>
                  {item.label}
                </Option>
              ))}
            </Select>
            <p>的值</p>
          </div>

          {linkFormId &&
          element.type === "FormChildTest" &&
          element.values instanceof Array ? (
            <>
              <p className="sencond-title">子字段数据联动</p>
              <Dropdown
                trigger={["click"]}
                overlay={
                  <Menu className="form-child-menu">
                    {filterLinkedFormChildItem(
                      element.values,
                      formChildData
                    ).map(item => (
                      <Menu.Item
                        key={item.key}
                        onClick={() => {
                          this.handleAddChildItemLink(item);
                        }}
                      >
                        <p>{item.label}</p>
                      </Menu.Item>
                    ))}
                  </Menu>
                }
              >
                <p className="add-child-item">
                  <Icon type="plus" />
                  添加子字段
                </p>
              </Dropdown>
              <div className="child-link-list">
                {formChildData.map((item, childIndex) => (
                  <div className="row" key={item.id}>
                    <Input
                      type="text"
                      className="input-item"
                      disabled
                      value={item.label}
                    />
                    <p>显示为</p>
                    <Select
                      className="input-item"
                      placeholder="联动表单字段"
                      defaultValue={
                        item.linkOptionId
                          ? item.linkOptionId + "|" + item.linkOptionLabel
                          : undefined
                      }
                      onChange={value => {
                        this.handleselectChildFormLinkItem(value, childIndex);
                      }}
                    >
                      {filterFormChildAllComponent(
                        forms,
                        linkFormId,
                        linkDataId,
                        item.type
                      ).map(item => (
                        <Option
                          value={item.id + "|" + item.label}
                          key={item.id}
                        >
                          {item.label}
                        </Option>
                      ))}
                    </Select>
                    <p>
                      的值
                      <FormIcon
                        className="formchild-link-delete"
                        onClick={this.handleRemoveChildFormLinkItem.bind(
                          this,
                          childIndex
                        )}
                        icon={["delete2", 14]}
                      />
                    </p>
                  </div>
                ))}
              </div>
            </>
          ) : null}
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
    setItemValues,
    setFormChildItemAttr
  }
)(DataLinkageModal);
