import React, {Fragment, useState} from "react";
import { connect } from "react-redux";
import { Button, Icon, Modal, Tooltip, Spin, message } from "antd";
import { useParams, useHistory } from "react-router-dom";
import request from '../../utils/request';
import { setFormData, setDataSource } from '../../redux/action';
import DataListModal from "../elements/modal/dataListModal";
import "../../scss/dashboard.scss";

const DBToolbar = props => {
  const history = useHistory();
  const { appId, dashboardId } = useParams();
  const { setFormData, setDataSource } = props;
  let form = {};

  const newChart = () => {
    const dataRes = request(`/bi/forms?appId=${appId}`);

    dataRes.then((res) => {
      if(res && res.msg === 'success') {
        const items = res.data.items || [];
        setFormData(items);
        form = items[1];
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
          history.push(`/app/${appId}/setting/bi/${dashboardId}/${elementId}`);
        }
      }, () => {message.error("创建图表失败")})
    })
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
      <DataListModal key={Math.random()} {...modalProps} url={`/app/${appId}/setting/bi/${dashboardId}/chart`}/>
      <Icon
        type="plus-circle"
        className="new-chart-icon"
        onClick={newChart}
      />
      {/* <div className="new-chart" onClick={modalProps.showModal}>新建图表</div> */}
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
