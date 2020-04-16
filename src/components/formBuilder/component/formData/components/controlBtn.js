import React, {useEffect } from "react";
import { connect } from "react-redux";
import { withRouter, useParams } from "react-router-dom";
import { Button, Popconfirm } from "antd";
import { editFormDataAuth, deleteFormDataAuth } from "../../../utils/permissionUtils";
function ControlBtn(props) {

  const handleConfirmDelete = () => {
    props.handleDeleteSubmisson(props.submissionId);
  };

  const handleSetDataId = () => {
    props.showformDataDetail(props.submissionId);
  };
  const { appId } = useParams();
  const { userId, permissions, teamId, formId } = props;

  // 权限相关
  const idEditAuth = editFormDataAuth(permissions, teamId, appId, formId, userId);
  const isDeleteAuth = deleteFormDataAuth(permissions, teamId, appId, formId, userId);

  return (
    <Button.Group>
      <Button type="link" onClick={handleSetDataId}>
        查看
      </Button>
      {idEditAuth ? <Button type="link" onClick={() => {
          props.setSubmissionId(props.submissionId, true)
        }
      }>编辑</Button> : null}
      {isDeleteAuth ? <Popconfirm
        placement="bottom"
        title="确定要删除该记录吗"
        onConfirm={handleConfirmDelete}
        okText="确定"
        cancelText="取消"
      >
        <Button type="link">删除</Button>
      </Popconfirm> : null}
    </Button.Group>
  );
}

export default connect(({login})=>({
  permissions: (login.userDetail && login.userDetail.permissions) || [],
  teamId: login.currentCompany && login.currentCompany.id,
  permissions: (login.userDetail && login.userDetail.permissions) || []
}))(withRouter(ControlBtn));
