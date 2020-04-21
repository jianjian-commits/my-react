import React from "react";
import { Modal, Button, Collapse, Icon, message } from "antd";
import { useState } from "react";
import classNames from "classnames";
import { push } from "connected-react-router";
import { connect } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import request from "../../../utils/request";
import { DBMode } from "../../dashboard/Constant";
import classes from "../../../scss/modal/dataModal.module.scss";
import {
  setFormData,
  setDataSource,
  clearBind,
  setDBMode
} from "../../../redux/action";
import ChangeTipModal from "./changeTipModal";
const { Panel } = Collapse;

function ModalTitle() {
  return (
    <div className={classes.formchoiceModalTitle}>
      <span>添加数据源</span>
      <span>选择图表数据源</span>
    </div>
  );
}

function DataListModal(props) {
  const [choiceFormId, setChoiceFormId] = useState("");
  const [choiceFormName, setChoiceFormName] = useState("");
  const { setVisible } = props;
  const history = useHistory();
  const { appId, dashboardId, elementId } = useParams();

  const _getFormChoice = (id, name) => {
    setChoiceFormId(id);
    setChoiceFormName(name);
  };

  const handleCancel = e => {
    setVisible(false);
  }

  const handleOK = e => {
    setVisible(false);
  }

  const newChart = () => {
    const res = request(`/bi/charts`, {
      method: "POST",
      data: {
        name: "新建图表",
        dashboardId,
        formId: choiceFormId
      }
    }).then(
      res => {
        if (res && res.msg === "success") {
          const data = res.data;
          const view = data.view;
          const elementId = view.id;

          props.setDataSource({
            id: choiceFormId,
            name: choiceFormName,
            data: view.formFields
          });
          history.push(`/app/${appId}/setting/bi/${dashboardId}/${elementId}`);
          props.setDBMode(DBMode.Editing);
        }
      },
      () => {
        message.error("创建图表失败");
      }
    );
  };

  const onConfirm = () => {
    if (props.type == "create") {
      newChart();
      handleOK();
      props.clearBind();
    } else {
      setChangeVisible(true);
    }
  };

  const [changeVisible, setChangeVisible] = useState(false);
  const changeModalProps = {
    visible: changeVisible,
    showModal: () => {
      setChangeVisible(true);
    },
    handleCancel: e => {
      handleOK();
      setChangeVisible(false);
    },
    handleOK: e => {
      // newChart();
      handleOK();
      props.clearBind();
      setChangeVisible(false);

      request(`/bi/forms/${choiceFormId}`).then((res) => {
        if(res && res.msg === "success") {
          const data = res.data;
          props.setDataSource({id: data.formId, name: data.formName, data: data.items});
          // history.push(`/app/${appId}/setting/bi/${dashboardId}/${elementId}`);
          props.setDBMode(DBMode.Editing);
        }
      })
    }
  };

  return changeVisible ? (
    <ChangeTipModal {...changeModalProps}/>
  ) : (
    <Modal
      title={<ModalTitle />}
      visible={props.visible}
      footer={null}
      closable={false}
      centered
      width={500}
      bodyStyle={{ padding: 0 }}
      wrapClassName={classes.BIDataModal}
      handleCancel={handleCancel}
      handleOK={handleOK}
    >
      <div className={classes.formChoiceModalContainer}>
        <div className={classes.formGroups}>
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
                    _getFormChoice(form.formId, form.formName);
                  }}
                  key={form.formId}
                  className={form.id == choiceFormId ? {backgroundColor: 'rgba(43, 129, 255, 0.1)'} : {}
                  }
                >
                  <Icon type="profile" style={{ color: "orange" }} />
                  {form.formName}
                  {form.formId == choiceFormId ? (
                    <Icon type="check-circle" theme="filled" />
                  ) : (
                    ""
                  )}
                </span>
              ))}
            </Panel>
          </Collapse>
        </div>
        <div className={classes.footBtnGroups}>
          <Button onClick={handleCancel}>取消</Button>
          <Button onClick={onConfirm}>确定</Button>
        </div>
      </div>
    </Modal>
  );
}

export default connect(
  store => ({
    formDataArr: store.bi.formDataArr
  }),
  {
    push,
    setFormData,
    setDataSource,
    clearBind,
    setDBMode
  }
)(DataListModal);
