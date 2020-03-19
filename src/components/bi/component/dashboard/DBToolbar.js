import React, {Fragment} from "react";
import { connect } from "react-redux";
import { Button, Icon, Modal, Tooltip, Spin, message } from "antd";
import { useParams, useHistory } from "react-router-dom";
import request from '../../utils/request';
import { setFormData, setDataSource } from '../../redux/action';
import { ChartType } from '../elements/Constant';
import "../../scss/dashboard.scss";

    
const DBToolbar = props => {
  const history = useHistory();
  const { appId, dashboardId } = useParams();
  const { setFormData, setDataSource } = props;
  let form = {};

  const newChart = () => {
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
        form = items[1];
        console.log(form);
      }
    }, () => {message.error("获取数据失败")}).then(()=> {
      const res = request(`/bi/charts`, {
        method: "POST",
        data: {
          name: "新建图表",
          dashboardId,
          formId: form.formId
        }
      }).then((res) => {
        if(res && res.msg === 'success') {
          const data = res.data;
          const view = data.view;
          const elementId = view.id;
          setDataSource({id: form.formId, name: form.formName, data: view.formFields});
          history.push(`/app/${form.formId}/setting/bi/${dashboardId}/${elementId}`);
          // console.log("==========setDataSource========", {id: formId, data: view.formFields});
        }
      }, () => {message.error("创建图标失败")})
    })
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

export default connect(store => ({
  formDataArr: store.bi.formDataArr
}), 
{
  setFormData,
  setDataSource
})(DBToolbar);
