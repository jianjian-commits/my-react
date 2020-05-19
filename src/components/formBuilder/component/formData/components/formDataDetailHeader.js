import React,{useEffect} from "react";
import { Button, Row, Col, Icon, Modal, Breadcrumb, message, Input,Select } from "antd";
import HeaderBar from "../../base/NavBar";
import { history } from "../../../../../store";
import { useHistory, useParams } from "react-router-dom";
import { connect } from "react-redux";
import request from "../../../../../utils/request";
import ApproverModal from "./ApproverModal"

const StartApprovalButton = (props) => {
  async function startApprovelBtnClick() {
    try {
      props.setLoading(true);
      const { formDetail, currentForm, appId } = props;
      let fieldInfos = currentForm.components
        .map((component) => {
          if (formDetail[component.key]) {
            return {
              name: component.key,
              value: formDetail[component.key],
            };
          }
        })
        .filter((item) => item !== undefined);
      let data = {
        dataId: props.submissionId,
        fieldInfos: fieldInfos,
      };
      const res = await request(`/flow/approval/start`, {
        headers: {
          appid: appId,
          formid: currentForm.id,
        },
        method: "post",
        data: data,
      });
      if (res && res.status === "SUCCESS") {
        message.success("提交审批成功");
        // 是否允许设置审批人
        props.setTaskId(res.data.taskId);
        props.setApproverModalVisible(res.data.shouldSetApprover);
        if(res.data.shouldSetApprover === false){
          props.resetData();
        }
      } else {
        props.setLoading(false);
        message.error("提交审批失败");
      }
    } catch (err) {
      props.setLoading(false);
      message.error("提交审批失败");
    }
  }

  return props.canSubmit ? (
    <Button
      type="primary"
      className="btn"
      onClick={() => {
        startApprovelBtnClick();
      }}
    >
      提交审批
    </Button>
  ) : (
    <></>
  );
};
const WithdrawApprovalButton = (props) => {
  // 撤回审批按钮
  const { isAllowedWithDraw, appId, processInstanceId } = props;
  async function withdraw() {
    props.setLoading(true);
    try {
      const res = await request(
        `/flow/approval/${processInstanceId}/withdraw`,
        {
          headers: {
            appid: appId,
          },
          method: "post",
        }
      );
      if (res && res.status === "SUCCESS") {
        message.success("撤回审批成功");
        props.resetData();
      } else {
        props.setLoading(false);
        message.error("撤回审批失败");
      }
    } catch (err) {
      props.setLoading(false);
      message.error("撤回审批失败");
    }
    return isAllowedWithDraw ? (
      <Button type="primary" className="btn shortletter" onClick={withdraw}>
        撤回
      </Button>
    ) : (
      <></>
    );
  }
  return isAllowedWithDraw ? (
    <Button type="primary" className="btn" onClick={withdraw}>
      撤回
    </Button>
  ) : (
    <></>
  );
};
const ApprovalProcessButtons = (props) => {
  // 当前节点处理人
  // 特殊情况 多人审批 是否有人审批过？
  // 审批流程中的按钮(通过或者拒绝)
  const { isApprovalProcessor, getTransactList } = props;

  const handlePass = () => {
    postApproveMsg(true);
  };

  const handleRefused = (e) => {
    postApproveMsg(false);
  };

  async function postApproveMsg(approveResult) {
    props.setLoading(true);
    try {
      const res = await request(
        `/flow/approval/${props.taskId}/approve/${approveResult}`,
        {
          headers: {
            appid: props.appId,
          },
          method: "GET",
        }
      );
      if (res && res.status === "SUCCESS") {
        props.setTaskId(res.data.taskId);
        props.setApproverModalVisible(res.data.shouldSetApprover);
        if(res.data.shouldSetApprover === false){
          props.resetData();
        }
        message.success("提交审批意见成功");
      } else {
        props.setLoading(false);
        message.error("提交审批意见失败");
      }
    } catch (err) {
      props.setLoading(false);
      message.error("提交审批意见失败");
    }

    return isApprovalProcessor ? (
      <>
        <Button
          type="danger"
          onClick={handleRefused}
          className="btn redBtn shortletter"
        >
          拒绝
        </Button>
        <Button type="primary" onClick={handlePass} className="btn shortletter">
          通过
        </Button>
      </>
    ) : (
      <></>
    );
  }

  return isApprovalProcessor ? (
    <>
      <Button
        type="danger"
        onClick={handleRefused}
        className="btn"
        style={{
          backgroundColor: "#fff",
          borderColor: "#fff",
          color: "#E71010",
        }}
      >
        拒绝
      </Button>
      <Button type="primary" onClick={handlePass} className="btn">
        通过
      </Button>
    </>
  ) : (
    <></>
  );
};
const ReSubmitApprovalButton = (props) => {
  const { canResubmit } = props;
  async function postApproveMsg() {
    props.setLoading(true);
    try {
      const res = await request(`/flow/approval/${props.taskId}/approve/true`, {
        headers: {
          appid: props.appId,
        },
        method: "GET",
      });
      if (res && res.status === "SUCCESS") {
        props.setTaskId(res.data.taskId);
        props.setApproverModalVisible(res.data.shouldSetApprover);
        if(res.data.shouldSetApprover === false){
          props.resetData();
        }
        message.success("提交审批成功");
      } else {
        props.setLoading(false);
        message.error("提交审批失败");
      }
    } catch (err) {
      props.setLoading(false);
      message.error("提交审批失败");
    }
  }
  return canResubmit ? (
    <>
      <Button type="primary" onClick={postApproveMsg} className="btn">
        重新提交
      </Button>
    </>
  ) : (
    <></>
  );
};

const SetApproverBtn = (props) =>{
  const { canSetApprover, taskId } = props;
  return canSetApprover? (
    <>
    <Button type="primary" onClick={()=>{
       props.setTaskId(taskId);
       props.setApproverModalVisible(canSetApprover)
    }} className="btn">
      选择审批人
    </Button>
    </>
  ) : (
    <></>
  );
}

const FormDataDetailHeader = (props) => {
  const appId = useParams().appId || props.appId;
  const history = useHistory();
  const [isApproverModalVisible, setApproverModalVisible] = React.useState(false);
  const [taskId, setTaskId] = React.useState(false);
  const onClickBack = () => {
    if (props.enterPort === "TransctionList") {
      props.fn(props.approvalKey);
    } else if (props.enterPort === "FormSubmitData") {
      props.actionFun(props.submissionId, false, props.currentForm.id);
    } else if (props.enterPort === "Dispose") {
      history.goBack();
    }
  };
  let backSpanText = "";
  if (props.enterPort === "TransctionList") {
    switch (props.approvalKey) {
      case "myPending":
        backSpanText = "我的待办";
        break;
      case "mySubmitted":
        backSpanText = "我提交的";
        break;
      case "myHandled":
        backSpanText = "我处理的";
        break;
    }
  } else if (props.enterPort === "FormSubmitData") {
    backSpanText = "记录列表";
  } else if (props.enterPort === "Dispose") {
    backSpanText = "我的待办";
  }

  const { taskData } = props;
  const {
    canSubmit,
    canResubmit,
    canApprove,
    canWithdraw,
    currentProcessInstanceId,
    currentTaskId,
    canSetApprover
  } = taskData;
  return (
    <div className="FormDataDetailHeader">
    <HeaderBar
      name={"记录详情"}
      navs={[
        { key: 0, label: "我的应用", onClick: () => history.push("/app/list") },
        { key: 1, label: props.appName || "未知应用名", disabled: true },
        { key: 1, label: "记录列表", onClick: onClickBack }
      ]}
      isShowExtraTitle={false}
      btns={<><StartApprovalButton
        canSubmit={canSubmit}
        appId={appId}
        setTaskId={setTaskId}
        setApproverModalVisible={setApproverModalVisible}
        {...props}
      />
      <ReSubmitApprovalButton
        canResubmit={canResubmit}
        appId={appId}
        taskId={currentTaskId}
        setTaskId={setTaskId}
        setApproverModalVisible={setApproverModalVisible}
        {...props}
      />
      <WithdrawApprovalButton
        isAllowedWithDraw={canWithdraw}
        appId={appId}
        processInstanceId={currentProcessInstanceId}
        {...props}
      />
      <ApprovalProcessButtons
        taskId={currentTaskId}
        isApprovalProcessor={canApprove}
        appId={appId}
        setTaskId={setTaskId}
        setApproverModalVisible={setApproverModalVisible}
        {...props}
      />
      <SetApproverBtn 
        taskId={currentTaskId}
        setTaskId={setTaskId}
        canSetApprover={canSetApprover}
        setApproverModalVisible={setApproverModalVisible}
      />
      <ApproverModal 
        visible={isApproverModalVisible} 
        taskId={taskId || currentTaskId}
        setVisible={setApproverModalVisible} 
        formId={props.currentForm.id}
        appId={appId}
        afterApproverModal={()=>{
          props.resetData();
        }}/></>}
    />
    </div>
  );
};

export default connect(({formSubmitData}) => ({
  // createdTime: formSubmitData.createdTime,
  // updateTime: formSubmitData.updateTime,
  // creator: formSubmitData.creator
}))(FormDataDetailHeader);
