import React, { useState,useEffect } from "react";
import { connect } from "react-redux";
import { Button, Icon, message } from "antd";
import { useParams, useHistory } from "react-router-dom";
import request from '../../utils/request';
import { setFormData, setDataSource, setDBMode } from '../../redux/action';
import DataListModal from "../elements/modal/dataListModal";
import classes from '../../scss/dashboard/toolbar.module.scss';
import { DBMode } from "./Constant";

const DBToolbar = props => {
  const { appId, dashboardId } = useParams();
  const { setFormData } = props;

  useEffect(() => {
    const dataRes = request(`/bi/forms`, {
      method: "GET",
      headers: {appId, "Content-Type": "application/json"},
    })

    dataRes.then((res) => {
      if(res && res.msg === 'success') {
        setFormData(res.data.items || []);
      }
    }, () => {message.error("获取数据失败")})
  },[]);

  const [visible, setVisible] = useState(false);
  const modalProps = {type:"create", visible, setVisible};

  const newChart = () => {
    setVisible(true);
    // setDBMode(DBMode.Editing);
  }

  return (
    <div className={classes.dbToolbar}>
      <DataListModal key={Math.random()} {...modalProps} url={`/app/${appId}/setting/bi/${dashboardId}/chart`}/>
      <Icon
        type="plus-circle"
        className={classes.newChartIcon}
        onClick={modalProps.showModal}
      />
      <div className={classes.newChart} onClick={newChart}>新建图表</div>
      <div className={classes.newChartButton}>
        {/* <Button className={classes.newChartPreview} type="link">
          预 览
        </Button> */}
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
  setDataSource,
  setDBMode
})(DBToolbar);
