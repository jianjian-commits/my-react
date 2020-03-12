import React from "react";
import { withRouter } from "react-router-dom";
import { Button, Popconfirm } from "antd";
function ControlBtn(props) {
  const handleSeeDetail = () => {
    props.showModal(props.submissionId);
    props.getSubmissionDetail(props.formId, props.submissionId);
  };

  const handleConfirmDelete = () => {
    props.handleDeleteSubmisson(props.submissionId);
  };

  const handleSetDataId = () => {
    props.showformDataDetail(props.submissionId);
  };

  return (
    <Button.Group>
      <Button type="link" onClick={handleSetDataId}>
        查看
      </Button>
      <Popconfirm
        placement="bottom"
        title="确定要删除该记录吗"
        onConfirm={handleConfirmDelete}
        okText="确定"
        cancelText="取消"
      >
        <Button type="link">删除</Button>
      </Popconfirm>
    </Button.Group>
  );
}

export default withRouter(ControlBtn);
