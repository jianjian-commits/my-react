import React, {Fragment, useState,useEffect} from "react";
import { connect } from "react-redux";
import { Button, Icon, Modal, Tooltip, Spin, message } from "antd";
import { useParams, useHistory } from "react-router-dom";
import DataListModal from "../elements/modal/dataListModal";
    
import request from '../../utils/request';
import { setFormData, setDataSource } from '../../redux/action';
import { ChartType } from '../elements/Constant';
import "../../scss/dashboard.scss";

const DBToolbar = props => {
  const history = useHistory();
  const { appId, dashboardId } = useParams();
  const { setFormData, setDataSource } = props;

  useEffect(() => {
    const dataRes = request(`/bi/forms?appId=`, {
      method: "GET",
      data: {
        appId
      }
    })
    dataRes.then((res) => {
      if(res && res.msg === 'success') {
        const items = res.data.items || [];
        setFormData(items);
      }
    }, () => {message.error("获取数据失败")})
  },[]);

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
        onClick={modalProps.showModal}
      />
      <div className="new-chart" onClick={modalProps.showModal}>新建图表</div>
    </div>
  )
}

export default connect(store => ({
  formDataArr: store.bi.formDataArr
}), 
{
  setFormData,
  setDataSource
})(DBToolbar);
