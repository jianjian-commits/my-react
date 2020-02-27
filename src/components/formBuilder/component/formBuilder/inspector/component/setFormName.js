import React from 'react';
import { connect } from 'react-redux';
import { Input } from 'antd';
import { setFormName } from '../../redux/utils/operateForm';

class FormName extends React.PureComponent {
  handleChangeName = ev => {
    let { value } = ev.target;
    this.props.setFormName(value);
  };

  render() {
    const { name } = this.props;
    return (
      <div className="base-form-tool">
        <div className="costom-info-card">
          <p htmlFor="email-title">标题</p>
          <Input
            name="formName"
            placeholder="请输入表单名"
            value={name}
            onChange={this.handleChangeName}
            autoComplete="off"
          />
        </div>
      </div>
    );
  }
}

export default connect(
  store => ({
    name: store.formBuilder.name
  }),
  {
    setFormName
  }
)(FormName);
