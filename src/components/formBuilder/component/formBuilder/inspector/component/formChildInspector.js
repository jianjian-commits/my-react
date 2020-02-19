import React from "react";
import { connect } from "react-redux";
import { Input, Checkbox, Divider } from "antd";
import { setItemAttr, } from "../../redux/utils/operateFormComponent";
import { Select } from 'antd';

class FormChildInspector extends React.Component {
  handleChangeAttr = ev => {
    let { name, value, checked } = ev.target;
    const { validate, unique } = this.props.element;
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
    }
    this.props.setItemAttr(
      this.props.element,
      name,
      value !== undefined ? value : checked
    );
  };

  handleSelectChildForm = (value) => {
    const selectedChildForm = value;

    this.props.setItemAttr(
      this.props.element,
      'childForm',
      selectedChildForm,
    );
  }

  render() {
    const {
      id,
      label,
      tooltip,
      defaultValue,
      validate,
      unique = false,
      childForm
      // forms
    } = this.props.element;
    const { Option } = Select;
    return (
      <div className='single-text-input'>
        <div className="base-form-tool">
          <div className="costom-info-card">
            <p htmlFor="formChild-title">关联表单名字</p>
            <Input
              id="formChild-title"
              name="label"
              placeholder="关联表单名字"
              value={label}
              onChange={this.handleChangeAttr}
              autoComplete="off"
            />
            <p htmlFor="formChild-form">默认值</p>
            <Select 
              value={childForm}
              style={{ width: 260 }} 
              onChange={this.handleSelectChildForm} 
              name = "childComponents">
              {
                this.props.forms ?
                this.props.forms.map( form =>{
                return  <Option value = { form.id } key = {form.id}>{ form.title }</Option>
                }) 
                : <Option value = "" key = "暂无表单"> { '暂无表单可以关联' } </Option>
              }
            </Select>
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
            </div>
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
    total: store.formBuilder.total,
  }),
  {
    setItemAttr,
  }
)(FormChildInspector);

