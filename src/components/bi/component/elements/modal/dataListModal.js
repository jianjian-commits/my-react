import React from "react";
import { Modal, Button, Collapse, Icon , message } from "antd";
import { useState ,useEffect} from "react";
import classNames from "classnames";
import "./modal.scss";
import { push } from "connected-react-router";
import {connect} from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import request from '../../../utils/request';
import { setFormData, setDataSource, clearBind } from '../../../redux/action';

const { Panel } = Collapse;

function ModalTitle() {
  return (
    <div className="formchoiceModalTitle">
      <span>添加数据源</span>
      <span>选择图表数据源</span>
    </div>
  );
}

function DataListModal(props) {

  const [choiceFormId,setChoiceFormId] = useState("");
  const [choiceFormName,setChoiceFormName] = useState("");
  const history = useHistory();
  const { appId, dashboardId } = useParams();

  const _getFormChoice = (id,name) => {
    setChoiceFormId(id);
    setChoiceFormName(name);
  };

  const newChart = () => {
    const res = request(`/bi/charts`, {
      method: "POST",
      data: {
        name: "新建图表",
        dashboardId,
        formId:choiceFormId
      }
    }).then((res) => {

      if(res && res.msg === 'success') {
        const data = res.data;
        const view = data.view;
        const elementId = view.id;
        props.setDataSource({id:choiceFormId,name:choiceFormName,data:view.formFields});
        history.push(`/app/${appId}/setting/bi/${dashboardId}/${elementId}`);
      }
    }, () => {message.error("创建图标失败")})
  }

  const onConfirm = () => {
    newChart();
    props.handleOK()
    props.clearBind();
  }

  return (
    <Modal
      title={<ModalTitle />}
      visible={props.visible}
      footer={null}
      closable={false}
      centered
      width={500}
      bodyStyle={{padding:0}}
      wrapClassName="BImodal"
      handleCancel={props.handleCancel}
      handleOK={props.handleOK}
    >
      <div className="formChoiceModalContainer">
        <div className="formGroups">
          <Collapse
            bordered={false}
            activeKey={"formList"}
            expandIcon={({ isActive }) =>
              isActive ? <Icon type="folder-open" /> : <Icon type="folder" />
            }
          >
            <Panel header={"表单列表"} key={"formList"}>
              {props.formDataArr.map(form => (
                <span
                  onClick={() => {
                    _getFormChoice(form.formId,form.formName);
                  }}
                  key={form.formId}
                  className={classNames({activeSpan:form.id==choiceFormId})}
                >
                  <Icon type="file-text" />
                  {form.formName}
                  {form.formId==choiceFormId?<Icon type="check-circle" theme="filled" />:""}
                </span>
              ))}
            </Panel>
          </Collapse>
        </div>
        <div className="footBtnGroups">
          <Button onClick={props.handleCancel}>取消</Button>
          <Button onClick={onConfirm}>确定</Button>
        </div>
      </div>
    </Modal>
  );
}

export default connect(store => ({
  formDataArr: store.bi.formDataArr
}),{
  push,
  setFormData,
  setDataSource,
  clearBind
})(DataListModal);