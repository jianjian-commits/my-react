import React, {Fragment} from "react";
import { connect } from "react-redux";
import { Button, Icon, Modal, Tooltip, Spin } from "antd";
import { renameElement } from '../../redux/action';
import "./element.scss";
import { useParams, useHistory } from "react-router-dom";

const EditorHeader = props => {
  const history = useHistory();
  const { appId } = useParams();
  const { elemName, renameElement } = props;

  const handleBack = () => {
    const { dbChanged } = props;

    if (!dbChanged) {
      history.push(`/app/${appId}/setting/bi/weichuangtong`);
    } else {
      // @temp len, show modal dialog
    }
  }

  const handleSave = () => {
    history.push(`/app/${appId}/setting/bi/weichuangtong`);

    // request post.
  }

  const onBlur = (e) => {
    renameElement(e.target.value);
  }

  return (
    <div className="element-header">
      <div className="element-header-back">
        <Button onClick={handleBack} type="link">
          <Icon type="left" />
        </Button>
      </div>
      <input className="rename-element" defaultValue={elemName ? elemName: "新建图表"} onBlur={onBlur}/>
      <Button onClick={handleSave} className="element-header-save" type="link">
        保 存
      </Button>
    </div>
  )
}

export default connect(
  store => ({ elemName: store.bi.elemName }),
  { renameElement }
)(EditorHeader);
