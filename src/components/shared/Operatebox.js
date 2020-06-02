import React from 'react';
import { Dropdown, Input, Form, message, Button, Modal as AntModal } from "antd";
import { Modal } from "../shared/customWidget"
import { Deleteicon } from "./svg";
// import classnames from 'classnames';
const { confirm } = AntModal;
const OperateBox = (props) => {

  // const [value, setValue] = React.useState(props.formname);
  const {canEdit, canDelete } = props;
  const [isVisiable,setIsVisiable] = React.useState(false);
  //isShowing 用来判断是否已经开启一个弹出框
  const [isShowing,setIsShowing] = React.useState( true );

  const showDelConfirm = () => {
    if(canDelete){
      setIsShowing(false);
      confirm({
        icon:
          <div className="modal-title">
            < Deleteicon />
            <span>删除</span>
          </div>,
        content: `确定要删除 ${props.formname}` + (props.type === "FORM" ? "表单" : "仪表盘") + '?',
        cancelText: "取消",
        okText: "确定",
        className: "operate-box-delete-form-modal",
        onOk() {
          handleDelete(props.id, props.type);
        },
        onCancel(){
          setIsShowing(true);
        }
      });
    }
  }

  const showUpdateConfirm = () => {
    if(canEdit){
      setIsVisiable(true);
      setIsShowing(false);
    }
  }

  const handleCancel = () =>{
        props.form.resetFields();
        setIsVisiable(false);
        setIsShowing(true);
  }
  const handleSetValue = () => {
    let inputValue = props.form.getFieldValue("formName");
    props.form.setFieldsValue({
      "formName": inputValue
    })
  }

  const handleDelete = (params, type) => {
    props.handleDelete(params, type).then(res => {
      if (res.status === 200 || res.msg === "success") {
        props.isDeleteOne(true);
        setIsShowing(true);
        message.success('删除成功');
      }else{
        setIsShowing(true);
        message.error('网络错误');
      }
    })
  }

  const handleRename = (id, type) => {
    let { handleRename } = props;
    props.form.validateFields((error,values)=>{
      if(!error){
        // 关闭模态框
        setIsVisiable(false);
        setIsShowing(true);
        // 获取验证通过的值
        let { formName } = values;
        // 发送修改名称的请求
        handleRename(id, type, { name: formName }).then(res => {
          if (res.status === 200 || res.msg === "success") {
            props.isDeleteOne(true);
            message.success('修改成功');
          }
        })
      }else{

      }
    })
  }

  const renameClass = canEdit ? "operate-box-item" : "operate-box-item-disable";
  const deleteClass = canDelete ? "operate-box-item" : "operate-box-item-disable";

  const menu = (
    <div className="draggable-list-operate-container">
      <div className="operate-box" onClick={e => e.stopPropagation()} >
        <div className={renameClass}
          onClick={ isShowing && showUpdateConfirm}
        > 修改名称 </div>
        <div className={deleteClass}
          onClick={ isShowing && showDelConfirm}>
          删除
                </div>
      </div>
    </div>
  );

  const { getFieldDecorator } = props.form
  return (
    <>
      <Dropdown overlay={menu} >
        <span className="draggable-menu-item-operate"
          onClick={e => e.stopPropagation()}>
          <span className="draggable-menu-item-operate-menu">
          </span>
        </span>
      </Dropdown>
      <Modal
          visible={isVisiable}
          className = "operate-box-update-form-modal"
          footer={null}
          closable={false}
        >
        
        <Form className="formRename">
          <Form.Item label="修改名称" className="formRenameInput">
         {
         getFieldDecorator("formName", {
              rules: [{ required: true, message: "修改名称不为空" }],
              validateTrigger: "onBlur",
              initialValue: props.formname
         })(
          <Input 
          placeholder="请输入名称"
          onBlur = { handleSetValue  }
          maxLength={20}
          />)
          }
          </Form.Item>

          <Form.Item className="formRenameBtnGroup">
            <div className = "btnGroup">
              <Button
                className = "btnGroup-cancel"
                onClick = { handleCancel }
              >
                取消
              </Button>
              <Button
               className = "btnGroup-confirm"
               onClick = { () => handleRename(props.id, props.type) }
              >
                确认
              </Button>
            </div>
          </Form.Item>
          </Form>

        </Modal>
    </>
  )
}


export default Form.create()(OperateBox)