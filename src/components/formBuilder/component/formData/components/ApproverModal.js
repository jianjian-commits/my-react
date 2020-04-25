import React from 'react';
import { Modal, Select, message } from "antd";
import request from "../../../../../utils/request";
const { Option } = Select;

const ApproverModal = (props) =>{
  const [userList, setUserList] = React.useState([]);
  function handleChange(value) {
    setUserList(value)
  }

  async function postApprover(){
    try{
      const { formId, appId, taskId } = props; //
      // const currentTaskId = taskId || "410a57a3-82cb-11ea-a696-0242ac130003";
      const res = await request(`/flow/approval/${taskId}/setApprover`,{
        headers:{
          appid: appId,
          formid: formId,
        },
        data:{
          "approveRoles": [],
          "approveUsers": userList
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
        mode="multiple"
        style={{ width: '100%' }}
        placeholder="请选择审批人"
        onChange={handleChange}
      >
        {
          props.approverList.map(approver=>{
          return <Option key={approver.id} value={approver.id}>{approver.name}</Option>
          })
        }
      </Select>
  </Modal>
  )
}

export default ApproverModal;