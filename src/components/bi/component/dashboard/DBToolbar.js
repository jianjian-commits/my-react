import React, {Fragment} from "react";
import { connect } from "react-redux";
import { Button, Icon, Modal, Tooltip, Spin } from "antd";
import "../../scss/dashboard.scss";
import { useParams, useHistory } from "react-router-dom";

    
const DBToolbar = props => {
  const history = useHistory();
  const { appId } = useParams();

  const newChart = () => {
    history.push(`/app/${appId}/setting/bi/weichuangtong/chart`);
  }

  return (
    <div className="db-toolbar">
      <Icon
        type="plus-circle"
        className="new-chart-icon"
        onClick={newChart}
      />
      <div className="new-chart" onClick={newChart}>新建图表</div>
    </div>
  )
}

export default connect(store => ({}),{})(DBToolbar);
