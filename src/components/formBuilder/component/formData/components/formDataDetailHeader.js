import React from "react";
import { Button, Row, Col, Icon, Modal, Input, message } from "antd";
import { useHistory, useParams } from "react-router-dom";
import request from '../../../../../utils/request';

const StartApprovalButton = (props) =>{
  const [isSubmit ,setIsSubmit] = React.useState(false);
  const startApprovelBtnClick = () =>{
    setIsSubmit(true)
    const { formDetail, currentForm, appId } = props;
    let fieldInfos = currentForm.components.map((component =>{
      if(formDetail[component.key]){
        return ({
          name: component.key,
          value: formDetail[component.key]
        })
      }
    })).filter(item => item !== undefined)
    let data = {
      dataId: props.submissionId,
      fieldInfos: fieldInfos
    }
    props.handleStartFlowDefinition(currentForm.id, appId, data)
    .then(res=>{
      setIsSubmit(false);
      props.resetData();
    }
    ).catch(err=>{
      console.log(err);
    });

  }

  return (
    props.canSubmit ?
      (<Button 
        type="primary"
        className="btn" 
        loading={isSubmit}
        onClick={()=>{
          startApprovelBtnClick();
          setIsSubmit(true)
        }}>提交审批</Button>)
      :(<></>)
  )
}
const WithdrawApprovalButton = (props) =>{
  // 撤回审批按钮
    const { isAllowedWithDraw, appId, processInstanceId } = props;
    const [isSubmit ,setIsSubmit] = React.useState(false);
    async function withdraw() {
      setIsSubmit(true);
      try{
        const res = await request(`/flow/approval/${processInstanceId}/withdraw`,{
          headers:{
            appid: appId
          },
          method: "post",
        });
        if (res && res.status === "SUCCESS") {
          message.success("撤回审批成功");
          setIsSubmit(false);
          props.resetData();
        } else {
          message.error("撤回审批失败");
        }
      } catch (err) {
        message.error("撤回审批失败");
      }
    }
    return (
      isAllowedWithDraw ?
      (<Button 
        type="primary" 
        className="btn"
        loading={isSubmit} 
        onClick={withdraw}>撤回</Button>)
      :<></>
    )
  }
  const ApprovalProcessButtons = (props) =>{
    // 当前节点处理人
    // 特殊情况 多人审批 是否有人审批过？
    // 审批流程中的按钮(通过或者拒绝)
    const { isApprovalProcessor } = props;
    const [isSubmit ,setIsSubmit] = React.useState(false);
  
    const handlePass = () =>{
      postApproveMsg(true);
    }
  
    const handleRefused = (e) =>{
      postApproveMsg(false);
    }
  
    async function postApproveMsg(approveResult){
      setIsSubmit(true);
      try{
        const res = await request(`/flow/approval/${props.taskId}/approve/${approveResult}`,{
          headers:{
            appid: props.appId
          },
          method: "GET"
        });
        if (res && res.status === "SUCCESS") {
          setIsSubmit(false);
          props.resetData();
          message.success("提交审批意见成功")
        } else {
          message.error("提交审批意见失败");
        }
      } catch (err) {
        message.error("提交审批意见失败");
      }
    }

    return (
      isApprovalProcessor ?
      (
        <>
        <Button type="danger" loading={isSubmit} onClick={handleRefused} className="btn" style={{backgroundColor : "#fff",borderColor:"#fff",color:"#E71010"}}>拒绝</Button>
        <Button type="primary" loading={isSubmit} onClick={handlePass} className="btn">通过</Button>
        </>
      ):(<></>)
    )
  }
const ReSubmitApprovalButton = (props) =>{
  const { canResubimit } = props;
  const [isSubmit ,setIsSubmit] = React.useState(false);
  async function postApproveMsg(){
    setIsSubmit(true);
    try{
      const res = await request(`/flow/approval/${props.taskId}/approve/true`,{
        headers:{
          appid: props.appId
        },
        method: "GET"
      });
      if (res && res.status === "SUCCESS") {
        setIsSubmit(false);
        props.resetData();
        message.success("提交审批成功")
      } else {
        message.error("提交审批失败");
      }
    } catch (err) {
      message.error("提交审批失败");
    }
  }
  return (
    canResubimit ?
    (
      <>
      <Button type="primary" loading={isSubmit} onClick={postApproveMsg} className="btn" >重新提交</Button>
      </>
    ):(<></>)
  )
}


const FormDataDetailHeader = (props) =>{
  const appId = useParams().appId;
  const onClickBack = () => {
    if(props.enterPort === "TransctionList"){
      props.fn(props.approvalKey)
    } else{
      props.actionFun(props.submissionId, false, props.currentForm.id)
    }

  };
  const { taskData, currentForm } = props; 
  const { canSubmit, canResubimit, canApprove, canWithdraw, currentProcessInstanceId ,currentTaskId } = taskData; 
  return (
    <div className="FormDataDetailHeader">
      <Row type="flex" justify="space-between">
        <Col>
          <Row type="flex" align="middle" gutter={10}>
            <Col>
              <div className="title">
                <Icon type="arrow-left" onClick={onClickBack}></Icon>
              </div>
            </Col>
            <Col>
              <div className="title">{currentForm.name}</div>
            </Col>
          </Row>
        </Col>
        <Col>
          <div className="title">
            <StartApprovalButton canSubmit={canSubmit} appId={appId} {...props}/>
            <ReSubmitApprovalButton canResubimit={canResubimit} appId={appId} taskId={currentTaskId}{...props}/>
            <WithdrawApprovalButton isAllowedWithDraw={canWithdraw} appId={appId} processInstanceId={currentProcessInstanceId}{...props} />
            <ApprovalProcessButtons taskId={currentTaskId} isApprovalProcessor={canApprove} appId={appId} {...props} />
          </div>
        </Col>
      </Row>
    </div>
  )
}

export default FormDataDetailHeader;