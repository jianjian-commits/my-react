import React, { Component } from "react";
import { connect } from "react-redux";
import { Modal, Select, Checkbox, Icon } from "antd";
import locationUtils from "../../../../../../utils/locationUtils";
import ID from "../../../../../../utils/UUID";

const { Option } = Select;

const modalStyle = {
  width: "500px"
};
class ComponentTemplate extends Component {
  constructor(props) {
    super(props);
    this.inputField = React.createRef();
    this.state = {
      modalVisible: true,
      formIndex: -1,
      tmpComponents: [],
      selectedComponents: [],
      selectedComponentsId: [],
      isSelectAllTmpComponents: false,
      isOpenList: false,
      forms: []
    };
  }

  componentDidMount() {
    const formId = locationUtils.getUrlParamObj().id;
    // 过滤自身表单
    const forms = this.props.forms.filter(form => form.id !== formId);
    this.setState({
      forms
    });
  }

  showModal = () => {
    this.setState({
      modalVisible: true
    });
  };

  handleOk = e => {
    this.setState({
      modalVisible: false
    });
    this.state.selectedComponents.forEach((component, index) => {
      this.insertTmpComponentToForm(component, index, e);
    });
    this.handleDestoryComponent(e);
  };

  handleDestoryComponent = e => {
    this.props._onDestroy(this.props.data);
    this.props.editModeOn({ element: "clearInspector" }, e);
  };

  insertTmpComponentToForm = (component, indexInArray, e) => {
    const { editModeOn, insertCard, index } = this.props;
    let newData = JSON.parse(JSON.stringify(component));
    let key = ID.uuid();
    newData.id = key;
    newData.key = key;
    newData.layout.i = key;
    newData.layout.y = 0;
    insertCard(newData, index + indexInArray);
    editModeOn(newData, e);
  };
  handleCancel = e => {
    this.setState({
      modalVisible: false
    });
    this.handleDestoryComponent(e);
  };

  selectForm = value => {
    const tmpComponents = this.state.forms[value].components.filter(
      component => {
        return component.type !== "Button";
      }
    );
    this.setState({
      formIndex: value,
      tmpComponents,
      selectedComponents: []
    });
  };

  onSelecComponents = values => {
    const data = this.state.tmpComponents.filter(component => {
      return values.filter(key => {
        return key === component.key;
      })[0];
    });

    this.setState({
      isSelectAllTmpComponents:
        data.length === this.state.tmpComponents.length ? true : false,
      selectedComponents: data
    });
  };

  selectAllTemComponent = event => {
    const { checked } = event.target;
    if (checked) {
      const { tmpComponents } = this.state;
      this.setState({
        isSelectAllTmpComponents: event.target.checked,
        selectedComponents: [...tmpComponents],
        selectedComponentsId: tmpComponents.map(item => item.id)
      });
    } else {
      this.setState({
        isSelectAllTmpComponents: event.target.checked,
        selectedComponents: [],
        selectedComponentsId: []
      });
    }
  };

  handleShowOrHideList = () => {
    this.setState({
      isOpenList: !this.state.isOpenList
    });
  };

  handleOptionSelected = selectedIndex => {
      const {
        selectedComponents,
        selectedComponentsId,
        tmpComponents
      } = this.state;
      let currentIndex = selectedComponentsId.indexOf(
        tmpComponents[selectedIndex].id
      );
      if (currentIndex > -1) {
        // 如果选中了则移除该组件
        selectedComponents.splice(currentIndex, 1);
        selectedComponentsId.splice(currentIndex, 1);
      } else {
        // 如果未选中，则选中
        selectedComponents.push(tmpComponents[selectedIndex]);
        selectedComponentsId.push(tmpComponents[selectedIndex].id);
      }
      this.setState({
        selectedComponents,
        selectedComponentsId
      });
  };

  handleDeleteOne = e => {
    e.stopPropagation();
    let selectedIndex = e.target.dataset.index;
    if (selectedIndex) {
      const {
        selectedComponents,
        selectedComponentsId
      } = this.state;
      // 如果选中了则移除该组件
      selectedComponents.splice(selectedIndex, 1);
      selectedComponentsId.splice(selectedIndex, 1);
      this.setState({
        selectedComponents,
        selectedComponentsId
      });
    }
  };

  render() {
    const { forms } = this.state;
    const {
      formIndex,
      isOpenList,
      selectedComponents,
      selectedComponentsId
    } = this.state;
    const selectedComponentsKey = this.state.selectedComponents.map(
      component => {
        return component.key;
      }
    );

    let classess = "option-list more";
    let arrowIconClass = "arrow";
    if (isOpenList) {
      classess += " open";
      arrowIconClass += " open";
    }

    return (
      <>
        <div className="form-group">
          <div className="component-Modal">
            <Modal
              title="嵌套表单"
              visible={this.state.modalVisible}
              onOk={this.handleOk}
              okText="确定"
              cancelText="取消"
              onCancel={this.handleCancel}
              bodyStyle={modalStyle}
              className="form-change-modal"
            >
              <div className="component-template-modal-container">
                <p className="second-title">嵌套表单</p>
                <Select
                  placeholder="请选择表单"
                  style={{ width: "100%" }}
                  onChange={this.selectForm}
                >
                  {forms.map((form, index) => (
                    <Option key={form.id} value={index}>
                      {form.name}
                    </Option>
                  ))}
                </Select>
                <p className="second-title">显示字段</p>
                {/* <Input
                  value={selectedComponents.map(item => item.label)}
                  placeholder="选择字段"
                  className="select-option"
                  suffix={<Icon onClick={this.handleShowOrHideList} className={arrowIconClass} type="down" />}
                  onClick={this.handleShowOrHideList}
                /> */}
                <div
                  className="select-option2"
                  onClick={this.handleShowOrHideList}
                >
                  <ul className="left">
                    {selectedComponents.length > 0 ? (
                      selectedComponents.map((item, index) => (
                        <li
                          className="selection-bubble"
                          key={item.key}
                          onClick={this.handleDeleteOne}
                        >
                          {item.label}
                          <span className="bubble-close" data-index={index}>
                            x
                          </span>
                        </li>
                      ))
                    ) : (
                      <p style={{ margin: "5px 12px", color: "#bfbfbf" }}>
                        请选择字段
                      </p>
                    )}
                  </ul>
                  <div className="right">
                    <Icon
                      onClick={this.handleShowOrHideList}
                      className={arrowIconClass}
                      type="down"
                    />
                  </div>
                </div>

                <ul className={classess}>
                  <div className="option-checkbox">
                    <Checkbox
                      checked={this.state.isSelectAllTmpComponents}
                      onChange={this.selectAllTemComponent}
                    >
                      全选
                    </Checkbox>
                  </div>
                  {formIndex > -1
                    ? this.state.tmpComponents.map((component, index) => (
                        <li
                          data-index={index}
                          key={component.id}
                          className="select-option-item"
                          onClick={()=>{this.handleOptionSelected(index)}}
                        >
                          {component.label}
                          {selectedComponentsId.includes(component.id) ? (
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
          </div>
        </div>
      </>
    );
  }
}

export default connect(
  store => ({
    forms: store.formBuilder.formArray
  }),
  {}
)(ComponentTemplate);
