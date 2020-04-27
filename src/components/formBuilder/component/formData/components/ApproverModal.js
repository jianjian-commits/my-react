import React, { useEffect } from 'react';
import { Modal, Select, message } from "antd";
import request from "../../../../../utils/request";
const { Option } = Select;

const ApproverModal = (props) =>{
  const [userList, setUserList] = React.useState([]);
  const [approveList, setApproverList] = React.useState([]);

  useEffect(()=>{
    getUserList();
  },[props.appId,props.formId])
  
  function handleChange(value) {
    setApproverList([value])
  }

  async function postApprover(){
    try{
      const { formId, appId, taskId } = props; 
      const res = await request(`/flow/approval/${taskId}/setApprover`,{
        headers:{
          appid: appId,
          formid: formId,
        },
        data:{
          "approveRoles": [],
          "approveUsers": approveList
        },
        method: "PUT"
      });
      if (res && res.status === "SUCCESS") {

        message.success("修改审批人成功");
        if(props.afterApproverModal){
          props.afterApproverModal();
        }
      } 

    }catch(err){
      message.error("修改审批人失败")
    }
  }

  async function getUserList() {
    const { formId, appId } = props;
    try{
      const res = await request(`/user/list`,{
        headers:{
          appid: appId,
          formid: formId,
        },
        method: "GET"
      });
      if (res && res.status === "SUCCESS") {
        setUserList(res.data)
      } 
    }catch(err){
      message.error("获取用户列表失败");
    }
  }
  return (
    <Modal
    title="选择审批人"
    maskClosable={false}
    closable={false}
    visible={props.visible}
    onOk={()=>{props.setVisible(false);postApprover()}}
    onCancel={()=>{
      props.setVisible(false);        
      if(props.afterApproverModal){
        props.afterApproverModal();
      }}}
  >
      <Select
        // mode="multiple"
        style={{ width: '100%' }}
        placeholder="请选择审批人"
        onChange={handleChange}
      >
        {
          userList.map(user=>{
          return <Option key={user.id} value={user.id}>{user.name}</Option>
          })
        }
      </Select>
  </Modal>
  )
}

export default ApproverModal;