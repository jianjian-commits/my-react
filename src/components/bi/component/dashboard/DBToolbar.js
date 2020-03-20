import React, {Fragment, useState} from "react";
import { connect } from "react-redux";
import { Button, Icon, Modal, Tooltip, Spin } from "antd";
import "../../scss/dashboard.scss";
import { useParams, useHistory } from "react-router-dom";
import DataListModal from "../elements/modal/dataListModal";
    
const DBToolbar = props => {
  const history = useHistory();
  const { appId } = useParams();

  const newChart = () => {
    history.push(`/app/${appId}/setting/bi/weichuangtong/chart`);
  }

  const [visible, setVisible] = useState(false);
  const modalProps = {
    visible,
    showModal: () => {
      setVisible(true);
    },
    handleCancel: e => {
      setVisible(false);
    },
    handleOK: e => {
      setVisible(false);
    }
  };

  return (
    <div className="db-toolbar">
      <DataListModal key={Math.random()} {...modalProps} url={`/app/${appId}/setting/bi/weichuangtong/chart`}/>
      <Icon
        type="plus-circle"
        className="new-chart-icon"
        onClick={newChart}
      />
      <div className="new-chart" onClick={modalProps.showModal}>新建图表</div>
    </div>
  )
}

export default connect(store => ({}),{})(DBToolbar);
