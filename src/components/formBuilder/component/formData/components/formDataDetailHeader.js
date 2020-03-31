import React from "react";
import { Button, Row, Col, Icon, Modal, Input, message } from "antd";
import { useHistory, useParams } from "react-router-dom";
import request from '../../../../../utils/request';

const StartApprovalButton = (props) =>{
  async function startApprovelBtnClick(){
    try{
      props.setLoading(true)
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
      const res = await request(`/flow/approval/start`,{
        headers:{
          appid: appId,
          formid: currentForm.id,
        },
        method: "post",
        data: data
      });
      if (res && res.status === "SUCCESS") {
        message.success("提交审批成功");
        props.resetData();
        props.getApproveCount(appId);
      } else {
        props.setLoading(false)
        message.error("提交审批失败");
      }
    } catch (err) {
      props.setLoading(false)
      message.error("提交审批失败");
    }

  }

  return (
    props.canSubmit ?
      (<Button 
        type="primary"
        className="btn" 
        onClick={()=>{
          startApprovelBtnClick();
        }}>提交审批</Button>)
      :(<></>)
  )
}
const WithdrawApprovalButton = (props) =>{
  // 撤回审批按钮
    const { isAllowedWithDraw, appId, processInstanceId } = props;
    async function withdraw() {
      props.setLoading(true)
      try{
        const res = await request(`/flow/approval/${processInstanceId}/withdraw`,{
          headers:{
            appid: appId
          },
          method: "post",
        });
        if (res && res.status === "SUCCESS") {
          message.success("撤回审批成功");
          props.resetData();
        } else {
          props.setLoading(false)
          message.error("撤回审批失败");
        }
      } catch (err) {
        props.setLoading(false)
        message.error("撤回审批失败");
      }
    }
    return (
      isAllowedWithDraw ?
      (<Button 
        type="primary" 
        className="btn shortletter"
        onClick={withdraw}>撤回</Button>)
      :<></>
    )
  }
  const ApprovalProcessButtons = (props) =>{
    // 当前节点处理人
    // 特殊情况 多人审批 是否有人审批过？
    // 审批流程中的按钮(通过或者拒绝)
    const { isApprovalProcessor } = props;
  
    const handlePass = () =>{
      postApproveMsg(true);
    }
  
    const handleRefused = (e) =>{
      postApproveMsg(false);
    }
  
    async function postApproveMsg(approveResult){
      props.setLoading(true)
      try{
        const res = await request(`/flow/approval/${props.taskId}/approve/${approveResult}`,{
          headers:{
            appid: props.appId
          },
          method: "GET"
        });
        if (res && res.status === "SUCCESS") {
          props.resetData();
          props.getApproveCount(props.appId);
          message.success("提交审批意见成功")
        } else {
          props.setLoading(false)
          message.error("提交审批意见失败");
        }
      } catch (err) {
        props.setLoading(false)
        message.error("提交审批意见失败");
      }
    }

    return (
      // isApprovalProcessor ?
      (
        <>
        <Button type="danger"  onClick={handleRefused} className="btn redBtn shortletter" >拒绝</Button>
        <Button type="primary"  onClick={handlePass} className="btn shortletter">通过</Button>
        </>
      )
      // :(<></>)
    )
  }
const ReSubmitApprovalButton = (props) =>{
  const { canResubimit } = props;
  async function postApproveMsg(){
    props.setLoading(true)
    try{
      const res = await request(`/flow/approval/${props.taskId}/approve/true`,{
        headers:{
          appid: props.appId
        },
        method: "GET"
      });
      if (res && res.status === "SUCCESS") {
        props.resetData();
        props.getApproveCount(props.appId);
        message.success("提交审批成功")
      } else {
        props.setLoading(false)
        message.error("提交审批失败");
      }
    } catch (err) {
      props.setLoading(false)
      message.error("提交审批失败");
    }
  }
  return (
    canResubimit ?
    (
      <>
      <Button type="primary"  onClick={postApproveMsg} className="btn" >重新提交</Button>
      </>
    ):(<></>)
  )
}


const FormDataDetailHeader = (props) =>{
  const appId = useParams().appId || props.appId;
  const history = useHistory();
  const onClickBack = () => {
    if(props.enterPort === "TransctionList"){
      props.fn(props.approvalKey)
    } else if(props.enterPort === "FormSubmitData"){
      props.actionFun(props.submissionId, false, props.currentForm.id)
    } else if(props.enterPort ==="Dispose") {
      history.goBack();
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