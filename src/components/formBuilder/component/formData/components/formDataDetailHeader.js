import React,{useEffect} from "react";
import { Button, Row, Col, Icon, Modal, Breadcrumb, message, Input,Select } from "antd";
import { useHistory, useParams } from "react-router-dom";
import { connect } from "react-redux";
import request from "../../../../../utils/request";
import ApproverModal from "./ApproverModal"

import dateUtils from "../../../utils/coverTimeUtils";

const localDate = dateUtils.localDate;

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
  const { canResubimit } = props;
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
        props.resetData();
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
  return canResubimit ? (
    <>
      <Button type="primary" onClick={postApproveMsg} className="btn">
        重新提交
      </Button>
    </>
  ) : (
    <></>
  );
};

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

  const { taskData, currentForm, creator, createdTime, updateTime, userList } = props;
  const {
    canSubmit,
    canResubimit,
    canApprove,
    canWithdraw,
    currentProcessInstanceId,
    currentTaskId,
  } = taskData;
  return (
    <div className="FormDataDetailHeader">
      <Row type="flex" justify="space-between">
        <Col>
          <Row type="flex" align="middle" gutter={10}>
            <Col>
              <div className="title">
                <Breadcrumb
                  separator={
                    <svg
                      width="7"
                      height="12"
                      viewBox="0 0 7 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5.57603 5.99767L0.142303 0.856381C-0.0474734 0.661494 -0.0474734 0.341052 0.142303 0.146165C0.332079 -0.0487218 0.640298 -0.0487218 0.829185 0.146165L6.61269 5.61745C6.71402 5.72256 6.75735 5.86278 6.75002 5.99767C6.75757 6.13722 6.71402 6.27744 6.61269 6.38233L0.829408 11.8536C0.640521 12.0487 0.332079 12.0487 0.142525 11.8536C-0.0472507 11.6534 -0.0472507 11.3383 0.142525 11.1434L5.57603 5.99767Z"
                        fill="#666666"
                      />
                    </svg>
                  }
                >
                  <Breadcrumb.Item className="recordList" onClick={onClickBack}>
                    {backSpanText}
                  </Breadcrumb.Item>
                  <Breadcrumb.Item className="submitRecord">
                    {currentForm.name}
                  </Breadcrumb.Item>
                </Breadcrumb>
                <div className="created-detail">
                  <span>创建人：{creator}</span>
                  <span>创建时间：{localDate(createdTime)}</span>
                  <span>更新时间：{localDate(updateTime)}</span>
                </div>
              </div>
            </Col>
          </Row>
        </Col>
        <Col>
          <div className="title">
            <StartApprovalButton
              canSubmit={canSubmit}
              appId={appId}
              setTaskId={setTaskId}
              setApproverModalVisible={setApproverModalVisible}
              {...props}
            />
            <ReSubmitApprovalButton
              canResubimit={canResubimit}
              appId={appId}
              taskId={currentTaskId}
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
              {...props}
            />
            <ApproverModal 
              visible={isApproverModalVisible} 
              taskId={taskId || currentTaskId}
              setVisible={setApproverModalVisible} 
              formId={props.currentForm.id}
              appId={appId}
              approverList={userList}
              afterApproverModal={()=>{
                props.resetData();
              }}/>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default connect(({formSubmitData}) => ({
  createdTime: formSubmitData.createdTime,
  updateTime: formSubmitData.updateTime,
  creator: formSubmitData.creator,
  userList: formSubmitData.userList
}))(FormDataDetailHeader);
