import React from 'react';
import { Dropdown, Modal, Input, Form, message } from "antd"
const { confirm } = Modal
const OperateBox = (props) => {

  // const [value, setValue] = React.useState(props.formname);
  let formName = ""

  const showDelConfirm = () => {
    confirm({
      icon:
        <div className="modal-title">
          <svg width="17" height="18" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.2543 0.745605C3.66309 0.745605 0 4.40869 0 8.9999C0 13.5911 3.66309 17.2542 8.2543 17.2542C12.8455 17.2542 16.5086 13.5911 16.5086 8.9999C16.5086 4.40869 12.8455 0.745605 8.2543 0.745605ZM7.62695 5.02744C7.79883 4.85557 7.94492 4.7417 8.22207 4.7417C8.53145 4.71807 8.81719 4.86416 8.93106 5.0833C9.06211 5.23799 9.13516 5.58174 9.10293 5.78369C9.10293 5.8417 9.06211 6.22412 9.04492 6.3294L8.81719 9.22549C8.81719 9.51123 8.75918 9.79697 8.64531 10.0161C8.58731 10.188 8.41758 10.3019 8.18769 10.3019C8.01582 10.3019 7.84609 10.188 7.78809 10.0161C7.67422 9.73037 7.61621 9.50264 7.61621 9.22549L7.46152 6.3874C7.40352 5.87393 7.40351 6.0458 7.40351 5.76006C7.40566 5.48506 7.46367 5.25518 7.62695 5.02744ZM8.88164 13.0282C8.70977 13.2001 8.48203 13.256 8.31016 13.256C8.08242 13.256 7.85254 13.1979 7.68281 13.0282C7.51094 12.8563 7.39707 12.6286 7.39707 12.3515C7.39707 12.1237 7.45508 11.8938 7.62481 11.7241C7.79668 11.5522 8.02441 11.4384 8.25215 11.4384C8.47988 11.4384 8.70977 11.5522 8.87949 11.7241C9.05137 11.896 9.10723 12.1237 9.10723 12.3515C9.10293 12.6286 9.04492 12.8563 8.88164 13.0282Z" fill="#EA3434" />
          </svg>
          <span>删除</span>
        </div>,
      content: '确定要删除表单 ?',
      cancelText: "取消",
      okText: "确定",
      className: "operate-box-delete-form-modal",
      onOk() {
        handleDeleteForm(props.formId);
      }
    });
  }

  const showUpdateConfirm = () => {
    confirm({
      title: "修改名称",
      icon: <></>,
      content:
        <Input 
          placeholder="请输入名称"
          defaultValue = { props.formname }
          onChange={ handleSetValue }
          maxLength={20}
        />
        // <Form> 
        //   <Form.Item>
        //     {getFieldDecorator('validator', {
        //       rules: [{
        //         required: true,
        //         message: '请输入内容'
        //       }],
        //       initialValue:value
        //     })
        //     (
        //       < Input
        //       placeholder="请输入名称"
        //       maxLength={20}
        //       />
        //   )}
        //     </Form.Item>
        // </Form>
      ,
      cancelText: "取消",
      okText: "确定",
      className: "operate-box-update-form-modal",
      onOk() {
        handleUpdateFormName(props.formId);
      }
    });
  }

  const handleSetValue = (e) => {
    let value = e.target.value
    formName = value
  }

  const handleDeleteForm = (params) => {
    props.deleteForm(props.appId, params).then(res => {
      if (res.status === 200) {
        props.isDeleteOne(true)
        message.success('删除成功');
      }
    })
  }

  const handleUpdateFormName = (params) => {
    props.updateFormName(props.appId, params, { name: formName }).then(res => {
      if (res.status === 200) {
        props.isDeleteOne(true)
        message.success('修改成功');
      }
    })
  }
  const menu = (
    <div className="draggable-list-operate-container">
      <div className="operate-box" onClick={e => e.stopPropagation()} >
        <div className="operate-box-update-name"
          onClick={showUpdateConfirm}
        > 修改名称 </div>
        <div className="operate-box-delete-form"
          onClick={showDelConfirm}>
          删除
                </div>
      </div>
    </div>
  );
  // const { getFieldDecorator } = props.form
  return (
    <>
      <Dropdown overlay={menu} >
        <span className="draggable-menu-item-operate"
          onClick={e => e.stopPropagation()}>
          <span className="draggable-menu-item-operate-menu">
          </span>
        </span>
      </Dropdown>
    </>
  )
}


export default Form.create()(OperateBox)