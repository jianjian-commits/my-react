import React, { useState,useEffect } from "react";
import { connect } from "react-redux";
import { Button, Icon, message } from "antd";
import { useParams, useHistory } from "react-router-dom";
import request from '../../utils/request';
import { setFormData, setDataSource, setDBMode, setElemName, setOldElement } from '../../redux/action';
import DataListModal from "../elements/modal/dataListModal";
import { DBMode } from "./Constant";
import { ChartType } from '../../component/elements/Constant';
import classes from '../../scss/dashboard/toolbar.module.scss';
import ChartInfo from "../elements/data/ChartInfo";


const DBToolbar = props => {
  const { appId, dashboardId } = useParams();
  const history = useHistory();
  const { setFormData, setElemName, setDataSource, setDBMode, setOldElement } = props;

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
  }

  const createChart = (formId) => {
    request(`/bi/charts`, {
      method: "POST",
      data: {
        name: "新建图表",
        dashboardId,
        formId
      }
    }).then(
      res => {
        if (res && res.msg === "success") {
          const data = res.data;
          const view = data.view;

          request(`/bi/forms/${formId}`).then((res) => {
            if(res && res.msg === "success") {
              const data = res.data;
              setDataSource({id: data.formId, name: data.formName, data: data.items});
              history.push(`/app/${appId}/setting/bi/${dashboardId}/${view.id}`);
              setDBMode(DBMode.Editing);
              setElemName(view.name);
              setOldElement({chartTypeProp: new ChartInfo(), conditions: [], dimensions: [], indexes: [], formId: view.formId,
                name: view.name, type: ChartType.HISTOGRAM, id: view.id})
            }
          })          
        }
      },
      () => {
        message.error("创建图表失败");
      }
    );
  };

  return (
    <div className={classes.dbToolbar}>
      <DataListModal key={Math.random()} {...modalProps} createChart={createChart}/>
      <Icon
        type="plus-circle"
        className={classes.newChartIcon}
        onClick={newChart}
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
  setDBMode,
  setElemName,
  setOldElement
})(DBToolbar);
