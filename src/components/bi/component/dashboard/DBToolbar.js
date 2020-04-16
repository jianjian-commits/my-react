import React, { useState,useEffect } from "react";
import { connect } from "react-redux";
import { Button, Icon, message } from "antd";
import { useParams, useHistory } from "react-router-dom";
import request from '../../utils/request';
import { setFormData, setDataSource } from '../../redux/action';
import DataListModal from "../elements/modal/dataListModal";
import classes from '../../scss/dashboard/toolbar.module.scss';

const DBToolbar = props => {
  const history = useHistory();
  const { appId, dashboardId } = useParams();
  const { setFormData } = props;
  let form = {};

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
    type:"create",
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
    <div className={classes.dbToolbar}>
      <DataListModal key={Math.random()} {...modalProps} url={`/app/${appId}/setting/bi/${dashboardId}/chart`}/>
      <Icon
        type="plus-circle"
        className={classes.newChartIcon}
        onClick={modalProps.showModal}
      />
      <div className={classes.newChart} onClick={modalProps.showModal}>新建图表</div>
      <div className={classes.newChartButton}>
        <Button className={classes.newChartPreview} type="link">
          预 览
        </Button>
        <Button className={classes.newChartSave} type="link">
          保 存
        </Button>
      </div>
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
